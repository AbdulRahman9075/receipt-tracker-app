import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator,StyleSheet,Button} from 'react-native';
import {loadfromDatabase,applyFilters,searchDB,saveToDatabase,deleteSingleItem } from '../../utils/manageDatabase';
import { globalStyles,colors } from '../../assets/styles';
import RecordsMenu from '../../components/records/RecordsMenu';
import { Surface,IconButton } from 'react-native-paper';
import { useAccount } from '../../accountContext';
import { useSearchStore,useCurrencyStore } from '../../stores/Store'



const Records = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { accountId, setAccountId } = useAccount();
  const setResults = useSearchStore((state) => state.setResults);
  const Currency = useCurrencyStore((state) => state.currency);

  const receiptdata= {
   'location': 'GULSHAN',
   'date': 'Apr 13, 2025 1:25 PM', 
   'items': [
      {
        'itemname': 'Fresh Capsicum (Shimla Mirch)', 
        'unitprice': 55.0, 
        'totalprice': 22.88
      }, 
      {'itemname': 'Fresh Lemon (Des1)', 'unitprice': 649.0, 'totalprice': 294.65},
      {'itemname': 'Soya Supreme Cokng Oil Poly Bag 1ltr', 'unitprice': 2740.0, 'totalprice': 2740.0},
      {'itemname': 'Fresh Apple (White Kulu)', 'unitprice': 379.0, 'totalprice': 360.05}, 
      // {'itemname': 'Mtton Shoulder', 'unitprice': 2089.0, 'totalprice': 3263.02}, 
      // {'itemname': 'Pnam Tez Patta', 'unitprice': 999.0, 'totalprice': 49.95}, 
      // {'itemname': 'Fresh Green Chiili', 'unitprice': 89.0, 'totalprice': 22.78},
      // {'itemname': 'Pnam Dhania Whole 100g', 'unitprice': 65.0, 'totalprice': 65.0},
      // {'itemname': 'Fresh Musk MeTon (Garma)', 'unitprice': 119.0, 'totalprice': 111.38}, 
      // {'itemname': "Bking's Cake Plain 250g", 'unitprice': 275.0, 'totalprice': 275.0}, 
      // {'itemname': 'Rafhan Jy Pwdr Strwbry 80G', 'unitprice': 149.0, 'totalprice': 149.0}, 
      // {'itemname': "Rse Petal Party Pack 300's White", 'unitprice': 235.0, 'totalprice': 235.0}, 
      // {'itemname': "LIWheatable T/P 15's Bx", 'unitprice': 265.0, 'totalprice': 265.0}, 
      // {'itemname': "LIWheatble Carcmom 15's Rs.20 Bx", 'unitprice': 269.0, 'totalprice': 269.0}, 
      // {'itemname': 'Cipri Sop Vitalizing Wtr Lily 3X120G', 'unitprice': 349.0, 'totalprice': 349.0}, 
      // {'itemname': 'Sigar 1kg (Loose)', 'unitprice': 173.0, 'totalprice': 173.0}, 
      // {'itemname': 'Ponan Dal Masoor 500g', 'unitprice': 145.0, 'totalprice': 145.0}, 
      // {'itemname': 'Nationa1 Salt Ldzed800G', 'unitprice': 59.0, 'totalprice': 59.0}, 
      // {'itemname': "Hckey Mtch Bx Rs7/-10'S", 'unitprice': 49.0, 'totalprice': 49.0}
    ]
  }

  useEffect(() => {
    let isMounted = true;
    if(accountId){
      const fetchItems = async () => {
        setLoading(true);
        const result = await loadfromDatabase(accountId);
        setItems(result);
        setLoading(false);
      };
      fetchItems();
    }
    return () => {
      isMounted = false;
    };
  }, [accountId]);

  const reloadData = async () => {
    setLoading(true);
    setItems([]);
    const result = await loadfromDatabase(accountId);
    setItems(result);
    setLoading(false);
  };
  const reloadWithFilters = async (filterValues: any) => {
    setLoading(true);
    setItems([]);
    if(!accountId){console.log("no default account set")}
    else{
      const result = await applyFilters(filterValues,accountId);
      setItems(result);
      setLoading(false);
    }
  };
  const handleSearch = async (query: string) => {
    setLoading(true);
    setItems([]);
    if (query.trim() === '') {
        reloadData();
        return;
    }
    if(!accountId){console.log("no default account set")}
    else{
      const results = await searchDB(query,accountId);
      console.log("setting global results---");
      console.log(results);
      setResults(results);
      console.log("setting items---");
      setItems(results);
      setLoading(false);}
  };
  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={globalStyles.screen}>
      <RecordsMenu  reload={reloadData} filter={reloadWithFilters} search={handleSearch}/>

      
      
      {/* <Button
        title="Insert Receipt Data"
        onPress={async () => {
          await saveToDatabase(receiptdata,accountId);
          reloadData();
          
        }}
      /> 
       */}
      <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Surface style={styles.surface} elevation={2}>
          <View style={[styles.border,styles.first]}>
            <Text style={[styles.quantity]}>{item.quantity}</Text>
          </View>
          <View style={[styles.notquantity]}>
            <Text style={[styles.border,styles.toprow,styles.itemname]}>{item.itemname}</Text>
            <View style={[styles.border,styles.bottomrow]}>
              <View style = {styles.details}>
              <Text style={[styles.location]}><Text style={{fontWeight: 'bold'}}>Location:</Text> {item.location}</Text>
              <Text style={[styles.date]}>{item.date}</Text>
              </View>
              <Text 
              style={styles.totalprice}
              >{`${Currency}${item.totalprice}`}</Text>
            </View>
          </View>
          <View style={styles.deletebutton}>
            <IconButton
                icon="trash-can"
                iconColor= 'black'
                size={20}
                onPress={async () =>{
                    await deleteSingleItem(accountId,item.id);
                    reloadData();
                    console.log("Deleted item",item.itemname)
                }}
                // containerColor='black'
                
            />
          </View>
        </Surface>
        
      )}
    />
    </View>
  )
}

export default Records

const styles = StyleSheet.create({
  surface: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceColor,
  },
  border: {
    borderWidth: 1,
    borderColor: 'black'
  },
  quantity: {
    width: '100%',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',

  },
  notquantity: {
    width: '80%',
  },
  toprow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0,
  },
  bottomrow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80
  },
  itemname: {
    padding: 5,
    fontSize: 20,
    fontWeight: '500',
    color: 'black'
  },
  totalprice: {
    fontSize: 20,
    fontWeight: '500',
    color: 'red',
    padding: 5,
  },
  location: {
  },
  date: {
  },
  details: {
    padding: 5,
  },
  first: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '10%',
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  deletebutton: {
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: 'black',
    width: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  }

})