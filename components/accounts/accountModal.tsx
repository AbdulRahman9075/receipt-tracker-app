import {useState} from 'react';
import {
  Modal,
  Portal,
  Button,
  TextInput,
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import ErrorDialog from '../errorDialog';
import { addAccount } from '../../utils/manageDatabase';
import { useCurrencyStore } from '../../stores/Store';
// import { useAccounts } from '../context/accountsContext';

type AccountModalProps = {
  visible: boolean;
  onDismiss: () => void;
  reload: () => void;
  setglobalcurrency: (text: string)=> void;
};


export default function AccountModal({
    visible,
    onDismiss,
    reload,
    setglobalcurrency
}: AccountModalProps) {


  // const { accounts, addAccount, error } = useAccounts();
  const [showError,setError] = useState(false);

  const [AccountName, setAccountName] = useState('');
  const [Currency, setCurrency] = useState('');

  const handleApply = async  () => {
    if( AccountName.trim() === '' || Currency.trim() === '') {
      setError(true);
      clearForm();
      onDismiss();
      return;
    
    }

    const account = {AccountName,Currency}
    console.log(account);
    await addAccount({name: AccountName,currency: Currency});
    reload();
    onDismiss();
  };

  const clearForm = () => {
    setAccountName('');
    setCurrency('');
    onDismiss();
    };


  const dismissError = () => {
    setError(false);
  }
  return (
    <Portal>
      <Modal visible={visible} onDismiss={clearForm} contentContainerStyle={styles.modal}>
        <View style={styles.accountinputbox}>
            <TextInput
            label="Account Name"
            value={AccountName}
            onChangeText={setAccountName}
            style={styles.input}
            />
            <TextInput
            label="Currency"
            value={Currency}
            onChangeText={(text)=>{
              setglobalcurrency(text);
              setCurrency(text);
            }}
            style={styles.input}
            />
        </View>
        <Button mode="contained" onPress={handleApply} style={{ marginTop: 20 }}>
          Create Account
        </Button>
      </Modal>

      <ErrorDialog visible={showError} onDismiss={dismissError} message='Invalid Input'/>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  heading: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    marginTop: 10,
  },
  accountinputbox: {
    paddingVertical: 10
  }
});
