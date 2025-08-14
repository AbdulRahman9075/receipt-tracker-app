import { useEffect, useState } from 'react';
import { StyleSheet, Text, View,FlatList,ActivityIndicator,Pressable } from 'react-native'
import { globalStyles,colors } from '../../assets/styles';
import {loadAccounts,deleteAccount} from '../../utils/manageDatabase';
import { FAB,Surface,IconButton } from 'react-native-paper';
import ErrorDialog from '../../components/errorDialog';
import { useAccount } from '../../accountContext';

import { useSearchStore,useCurrencyStore} from '../../stores/Store'
import AccountModal from '../../components/accounts/accountModal';

const Settings = () => {
    const { accountId, setAccountId } = useAccount(); 
    const [Accounts, setAccounts] = useState<any>([]);  
    const [loading, setLoading] = useState(false);

    const [accountModalVisible, setVisible] = useState(false);
    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const [showError,setError] = useState(false);
    const [message,setMessage] = useState('');

    const setGlobalCurrency = useCurrencyStore((state) => state.setCurrency);


    useEffect(() => {
        const fetchItems = async () => {
          setLoading(true);
          const result = await loadAccounts();
          if('error' in result){
            setMessage(result.error);
            setError(true);
          }
          else{
            setAccounts(result);
            }
          setLoading(false);
        };
        fetchItems();
      }, []);
    
    const reloadAccounts = async () => {
        setLoading(true);
        setAccounts([]);
        const result = await loadAccounts();
        if('error' in result){
            setMessage(result.error);
            setError(true);
        }
        else{
        setAccounts(result);
        }
        setLoading(false);
      };

    const dismissError = () => {
        setError(false);
    }
    if (loading) {
        return <ActivityIndicator />;
    }


  return (
    <View style={globalStyles.screen}>
        <Text style={styles.title}>Manage Accounts</Text>
        {/* <Text>{accountId}</Text> */}
        <FlatList
            data={Accounts}
            keyExtractor={(account) => account.id.toString()}
            renderItem={({item}) => (
                <Pressable
                style = {{
                    borderRadius: 8,
                }}
                onLongPress={()=> {
                    setAccountId(item.id);
                    setGlobalCurrency(item.currency);
                }}
                >
                <Surface style={[styles.surface,accountId === item.id && styles.selectedAccountButton]} elevation={2}>
                    {/* <Text>{item.id}</Text> */}
                    <View style={styles.accountbox}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.currency}>{item.currency}</Text>
                    </View>
                    <View style= {styles.deletebutton}>
                    <IconButton
                        icon="trash-can"
                        iconColor= 'white'
                        size={20}
                        onPress={async () =>{
                            await deleteAccount(item.id)
                            reloadAccounts();
                        }}
                        containerColor='black'
                    />
                    </View>
                </Surface>
                </Pressable>
            )}
        />
        <FAB
            icon="plus"
            style={styles.addaccount}
            color='black'
            onPress={openModal}
        />
        <AccountModal visible={accountModalVisible} onDismiss={closeModal} reload={reloadAccounts} setglobalcurrency={setGlobalCurrency}/>
        <ErrorDialog visible={showError} onDismiss={dismissError} message={message}/>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
    surface: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: colors.surfaceColor,
  },
    title: {
        marginTop: 10,
        width: '100%',
        fontSize: 30,
        padding: 10,
        fontWeight: 'bold'
    },
    addaccount: {
        position: 'absolute',
        bottom: 50,  
        right: 40,   
    },
    name: {
        fontWeight: 'bold',
        fontSize:30
    },
    currency: {
        fontWeight: 'bold',
        fontSize:20
    },
    accountbox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    deletebutton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        
    },
    selectedAccountButton: {
        backgroundColor: '#3aee64ff'
    }
})