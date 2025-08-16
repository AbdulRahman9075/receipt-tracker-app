import { useState,useEffect } from 'react'
import { StyleSheet, Text, View,Button,ScrollView} from 'react-native'
import { monthlySum } from '../../utils/manageDatabase'
import { useAccount } from '../../accountContext'
import { PointsChart } from '../../components/LineChart'
import { Surface,Icon } from 'react-native-paper'
import { colors, globalStyles } from '../../assets/styles'
import { useSearchStore,useCurrencyStore,useItemsStore} from '../../stores/Store'
import { storeDefaultAccount,getDefaultAccount } from '../../stores/asyncstorage';

//known error
//  ERROR  ERROR loading accounts: [Error: Call to function 'NativeDatabase.prepareAsync' has been rejected.
// → Caused by: java.lang.NullPointerException: java.lang.NullPointerException]
const Home = () => {
  const { accountId, setAccountId } = useAccount();
  // const [monthlySums, setMonthlySums] = useState<{sum: number, month: string, year: string}[]>([]);
  const [currentMonthSum, setCurrentMonthSum] = useState<number|null>(null);
  const [changeFromPrev, setchangeFromPrev] = useState<number|null>(null);

  const [monthlySums, setMonthlySums] = useState<number[]>([]);
  const [sumsXLabels, setsumsXLabels] = useState<string[]>([]);

  const [searchUnitPrices, setSearchUnitPrices] = useState<number[]>([]);
  const [searchQuantities, setSearchQuantities] = useState<number[]>([]);
  const [searchXLabels, setSearchXLabels] = useState<string[]>([]);

  const searchResults = useSearchStore((state) => state.results);
  const Currency = useCurrencyStore((state) => state.currency);
  const Items = useItemsStore((state) => state.items);

  const [defaultAccount,setDefault] = useState(false);

//   [{"month": "Aug", "sum": 50, "year": "2025"},
//    {"month": "Jul", "sum": 5000, "year": "2025"},
//    {"month": "Apr", "sum": 3417.58, "year": "2025"}]
//   search result raw
// [{"account_id": 8,
//    "date": "2025-04-13T13:25:00",
//     "id": 44, "itemname": "Fresh Capsicum (Shimla Mirch)", 
//     "location": "GULSHAN", "quantity": 0.42, "totalprice": 22.88, "unitprice": 55},
//   {"account_id": 8, "date": "2025-04-13T13:25:00",
//      "id": 45, "itemname": "Fresh Lemon (Des1)", 
//      "location": "GULSHAN", "quantity": 0.45, "totalprice": 294.65, "unitprice": 649}, 
// {"account_id": 8, "date": "2025-04-13T13:25:00",
//    "id": 47, "itemname": "Fresh Apple (White Kulu)",
//     "location": "GULSHAN", "quantity": 0.95, "totalprice": 360.05, "unitprice": 379}]


  // [{"account_id": 8, "date": "Sun Aug 10 2025 21:06:18 GMT+0500",
  //    "id": 38, "itemname": "Potatos", "location": "Itwar bazar", 
  //    "quantity": 0.5, "totalprice": 50, "unitprice": 100}]
  const setSearchGraphData = () => {
    console.log('setting search graph data---');
    const quantities: number[] = [];
    const unitprices: number[] = [];
    const dates: string[] = [];
    const sortedResults = searchResults.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const entry of sortedResults) {
      quantities.push(entry.quantity);
      unitprices.push(entry.unitprice);
      const dateObj = new Date(entry.date);
      const formatted = dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      dates.push(formatted);

    }
    // console.log(quantities);
    // console.log(unitprices);
    // console.log(dates);

    setSearchUnitPrices(unitprices);
    setSearchQuantities(quantities);
    setSearchXLabels(dates);

    console.log('SUCCESS: set search graph data');

  }
  const setSumsGraphData = (sums: any) => {
    if(!sums || !sums.length || sums.length < 1) {
      setMonthlySums([]);
      setsumsXLabels([]);
      console.log('SUCCESS: database empty, set to null');
      return;
    }
    console.log('setting graph data---');
    const sumsList: number[] = [];
    const labelsList: string[] = [];

    for (const entry of sums) {
      sumsList.push(entry.sum);
      labelsList.push(`${entry.month} ${entry.year}`);
    }
    
    setMonthlySums(sumsList.reverse());
    setsumsXLabels(labelsList.reverse());
    console.log('SUCCESS: set graph data');
  };

  const setCurrentTotals = (sums: any)=> {
    if(sums === null || sums === undefined || !sums.length || sums.length < 1) {
      setCurrentMonthSum(null);
      setchangeFromPrev(null);
      console.log('SUCCESS: set current totals');
      return;
    }
    console.log('setting current totals');

    const today = new Date();
    const thismonth = today.toLocaleString('en-US', { month: 'short' });
    const thisyear = today.getFullYear();
    const prevMonth = (new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())).toLocaleString('en-US', { month: 'short' });
    console.log(`thismonth=${thismonth} thisyear=${thisyear} prevmonth=${prevMonth}`);
    console.log(sums);
    if (sums[0] && sums[0].month == thismonth && sums[0].year == thisyear){
      setCurrentMonthSum(sums[0].sum);
    }
    else{
      setCurrentMonthSum(0);
    }
    if(sums.length < 2) {
      setchangeFromPrev(null);
      console.log('SUCCESS: set current totals');
      return;
    }
    if (sums[1] && sums[1].month == prevMonth && sums[1].year == thisyear) {
        const prevSum = sums[1].sum;
        const currSum = sums[0].sum;

        if (prevSum === 0) {
            // Avoid division by zero
            setchangeFromPrev(currSum === 0 ? 0 : 100); 
        } else {
            const percentChange = ((currSum - prevSum) / prevSum) * 100;
            setchangeFromPrev(Math.round(percentChange));
        }
    }
    else{
      setchangeFromPrev(null);
    }
    console.log('SUCCESS: set current totals');
  }


  useEffect(() => {
  let isMounted = true;

  //test
    const applydefaultaccount = async () => {
      const def_id = await getDefaultAccount();
      console.log(def_id);
      if(!def_id){
        console.log("NO DEFAULT ACCOUNT FOUND");
        setDefault(false);
      }
      else{
        console.log("def_id=",Number(def_id));
        setAccountId(Number(def_id));
        setDefault(true);
      } 
    }
    applydefaultaccount();
  //


  if (accountId) {
    if (!isMounted) return;   
    (async () => {
      const sums = await monthlySum(accountId);
      setCurrentTotals(sums);
      setSumsGraphData(sums);
    })();
  }
  return () => {
    isMounted = false;
  };
}, [accountId,Items]);


  useEffect(() => {
    let isMounted = true;
    if (searchResults.length > 0) {
      if (!isMounted) return;
      setSearchGraphData();
    }

    return () => {
      isMounted = false;
    };
  }, [searchResults]);

  return (
    <ScrollView style={globalStyles.screen}
    contentContainerStyle={{ paddingBottom: 20 }} 
    >
      <View style={styles.dataBox}>
        <Surface  style={styles.surface} elevation={2}>
          <Text style={styles.title}>Total Expenses this Month</Text>
          <View style={styles.totalbox}>
          <Text style={styles.monthlytotal}>{currentMonthSum?`${Currency}${currentMonthSum}`:'-'}</Text>
          <Text style={[styles.percentchange, { color: changeFromPrev < 0 ? 'red' : 'green' }]}>
            {changeFromPrev? `${changeFromPrev > 0 ? '+' : ''}${changeFromPrev}%`: '-'}
          </Text>
          </View>
        </Surface>
      </View>
      {/* {(defaultAccount===false || (Items && Items.length < 1)) && <Text style={[globalStyles.placeholder]}>No Data</Text>}
       */}
      {monthlySums.length > 0 && sumsXLabels.length > 0 && (
      <>
      <Text style={styles.graphtitle}>Total Expenses Over Time</Text>
      <PointsChart  labels={sumsXLabels} data={monthlySums} currency={Currency}/>
      </>
      )}

      {searchUnitPrices.length > 0 && searchXLabels.length> 0 && (
        <>
        <Text style={styles.graphtitle}>Unit Price Over Time</Text>
        <PointsChart labels={searchXLabels} data={searchUnitPrices} currency={Currency}/>
        </>
      )}

      {searchQuantities.length > 0 && searchXLabels.length> 0 && (
        <>
        <Text style={styles.graphtitle}>Quantity Consumed Over Time</Text>
        <PointsChart labels={searchXLabels} data={searchQuantities}/>
        </>
      )}
    
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  surface: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    borderRadius: 8,
    padding: 10,
    paddingTop: 20,
    backgroundColor: colors.surfaceColor
  },
  title: {
    width: '100%',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    },
  totalbox:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  monthlytotal: {
    fontSize: 50,
    fontWeight: '500',
    color: 'red',
  },
  percentchange: {
    fontSize: 20,
    fontWeight: '500',
  },
  spacing: {
    padding: 25,
    marginBottom: 40,
  },
  dataBox: {
    
 },
 graphtitle: {
  width: '100%',
  fontSize: 25,
  fontWeight: 'bold',
  marginTop: 40,
 },

})