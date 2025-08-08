import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator,StyleSheet,Button} from 'react-native';
import {loadfromDatabase,applyFilters,searchDB } from '../../utils/manageDatabase';
import { globalStyles } from '../../assets/styles';
import RecordsMenu from '../../components/RecordsMenu';
import { Surface } from 'react-native-paper';



const Records = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      {'itemname': 'Mtton Shoulder', 'unitprice': 2089.0, 'totalprice': 3263.02}, 
      {'itemname': 'Pnam Tez Patta', 'unitprice': 999.0, 'totalprice': 49.95}, 
      {'itemname': 'Fresh Green Chiili', 'unitprice': 89.0, 'totalprice': 22.78},
      {'itemname': 'Pnam Dhania Whole 100g', 'unitprice': 65.0, 'totalprice': 65.0},
      {'itemname': 'Fresh Musk MeTon (Garma)', 'unitprice': 119.0, 'totalprice': 111.38}, 
      {'itemname': "Bking's Cake Plain 250g", 'unitprice': 275.0, 'totalprice': 275.0}, 
      {'itemname': 'Rafhan Jy Pwdr Strwbry 80G', 'unitprice': 149.0, 'totalprice': 149.0}, 
      {'itemname': "Rse Petal Party Pack 300's White", 'unitprice': 235.0, 'totalprice': 235.0}, 
      {'itemname': "LIWheatable T/P 15's Bx", 'unitprice': 265.0, 'totalprice': 265.0}, 
      {'itemname': "LIWheatble Carcmom 15's Rs.20 Bx", 'unitprice': 269.0, 'totalprice': 269.0}, 
      {'itemname': 'Cipri Sop Vitalizing Wtr Lily 3X120G', 'unitprice': 349.0, 'totalprice': 349.0}, 
      {'itemname': 'Sigar 1kg (Loose)', 'unitprice': 173.0, 'totalprice': 173.0}, 
      {'itemname': 'Ponan Dal Masoor 500g', 'unitprice': 145.0, 'totalprice': 145.0}, 
      {'itemname': 'Nationa1 Salt Ldzed800G', 'unitprice': 59.0, 'totalprice': 59.0}, 
      {'itemname': "Hckey Mtch Bx Rs7/-10'S", 'unitprice': 49.0, 'totalprice': 49.0}
    ]
  }

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const result = await loadfromDatabase();
      setItems(result);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const reloadData = async () => {
    setLoading(true);
    setItems([]);
    const result = await loadfromDatabase();
    setItems(result);
    setLoading(false);
  };
  const reloadWithFilters = async (filterValues: any) => {
    setLoading(true);
    setItems([]);
    const result = await applyFilters(filterValues);
    setItems(result);
    setLoading(false);
  };
  const handleSearch = async (query: string) => {
    setLoading(true);
    setItems([]);
    if (query.trim() === '') {
        reloadData();
        return;
    }
    const results = await searchDB(query);
    setItems(results);
    setLoading(false);
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
          await saveToDatabase(receiptdata);
          reloadData();
          
        }}
      /> */}
      <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Surface style={styles.surface} elevation={2}>
          <Text>{item.date} — {item.location}</Text>
          <Text>{item.itemname}</Text> 
          <Text>Quantity: {item.quantity}</Text>
          <Text>Unit: Rs.{item.unitprice}</Text>
          <Text>Total: Rs.{item.totalprice}</Text>
        </Surface>
        // <View style={{ padding: 10, borderBottomWidth: 1 }}>
        //   {/* <Text>{item.id}</Text> */}
        //   <Text>{item.date} — {item.location}</Text>
        //   <Text>{item.itemname} | Quantity: {item.quantity} | Unit: Rs.{item.unitprice} | Total: Rs.{item.totalprice}</Text>
        // </View>
      )}
    />
    </View>
  )
}

export default Records

const styles = StyleSheet.create({
  //test styles
  centeredtop: {
    width: '100%',
    height: '20%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 50,
    fontWeight: 900,
  },
  centered: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    borderRadius: 8,


    // alignItems: 'center',
    // justifyContent: 'center',
  },

})