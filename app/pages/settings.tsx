import { useEffect, useState } from 'react';
import { StyleSheet, Text, View,FlatList,ActivityIndicator,Pressable } from 'react-native'
import { globalStyles,colors } from '../../assets/styles';
import {loadAccounts,deleteAccount} from '../../utils/manageDatabase';
import { FAB,Surface,IconButton,Switch } from 'react-native-paper';
import ErrorDialog from '../../components/errorDialog';
import { useAccount } from '../../accountContext';
import { useSearchStore,useCurrencyStore} from '../../stores/Store'
import AccountModal from '../../components/accounts/accountModal';
import { storeDefaultAccount,getDefaultAccount } from '../../stores/asyncstorage';


const Settings = () => {
    const { accountId, setAccountId } = useAccount(); 
    const [Accounts, setAccounts] = useState<any>([]);  
    const [loading, setLoading] = useState(false);

    const [accountModalVisible, setVisible] = useState(false);
    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const [showError,setError] = useState(false);
    const [message,setMessage] = useState('');



    // const [defaultAccount,setDefault] = useState(false);



    const setGlobalCurrency = useCurrencyStore((state) => state.setCurrency);


    useEffect(() => {
        const fetchItems = async () => {
          setLoading(true);

        //   //test
        //   const def_id = await getDefaultAccount();
        //   console.log(def_id);
        //   if(!def_id){
        //     setDefault(false);
        //   }
        //   else{
        //     setDefault(true);
        //     console.log(Number(def_id));
        //     setAccountId(Number(def_id));
        //   } 
        //   //

          const result = await loadAccounts();
          if(result && 'error' in result){
            setMessage("Error Loading Accounts");
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

        if(result && 'error' in result){
            setMessage("Error Loading Accounts");
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

    return (
        <View style={globalStyles.screen}>
            <Text style={styles.title}>Manage Accounts</Text>
            {loading && <ActivityIndicator />}

             {!loading && (!Accounts || (Accounts && Accounts.length < 1)) && ( 
                <Text style={styles.placeholder}>Create an Account</Text>
            )}
            {/* <Text>{accountId}</Text> */}
            {!loading && Accounts &&  Accounts.length > 0 && (
            <FlatList
                data={Accounts}
                keyExtractor={(account) => account.id.toString()}
                renderItem={({item}) => (
                    <Pressable
                    style = {{
                        borderRadius: 8,
                    }}
                    onLongPress={async ()=> {
                        setAccountId(item.id);
                        await storeDefaultAccount(item.id.toString());
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
        )}

            <FAB
                icon="plus"
                style={styles.addaccount}
                color='black'
                onPress={openModal}
            />
            <AccountModal visible={accountModalVisible} onDismiss={closeModal} reload={reloadAccounts} setglobalcurrency={setGlobalCurrency}/>
            <ErrorDialog visible={showError} onDismiss={dismissError} message={message}/>
        </View>
    );
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
  placeholder: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: '90%',
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.placeholderColor,
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