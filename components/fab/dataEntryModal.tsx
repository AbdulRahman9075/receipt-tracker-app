import {useState} from 'react';
import {
  Modal,
  Portal,
  Button,
  Text,
  TextInput,
  IconButton
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles,colors } from '../../assets/styles';
import { parseNumber,Item } from '../../utils/utilities';
import ErrorDialog from '../errorDialog';
import { addEntry } from '../../utils/manageDatabase';
import { useAccount } from '../../accountContext';


// itemname: string;
// unitprice: number;
// totalprice: number;
// location: string;
// date: string; // ISO format
// quantity: number;

type dataModalProps = {
  visible: boolean;
  onDismiss: () => void;
};


export default function AddEntryModal({
    visible,
    onDismiss,
}: dataModalProps) {
  const { accountId, setAccountId } = useAccount();
  const [theDate, setDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showError,setError] = useState(false);

  const [itemName, setItemName] = useState('');
  const [Location, setLocation] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState('');

  const handleApply = async () => {
    let totalprice = parseNumber(totalPrice);
    let quantity = parseNumber(Quantity);
    const date= (theDate===undefined)?new Date():theDate;
    if(isNaN(totalprice) || isNaN(quantity) || totalprice === Infinity || quantity === Infinity ) {
      setError(true);
      clearForm();
      onDismiss();
      return;
    
    }
    let unitprice = totalprice/quantity;
    let itemname = itemName;
    let location = Location;
    const item:Item = {itemname,unitprice,totalprice,quantity,location,date}
    await addEntry(item,accountId)
    clearForm();
    onDismiss();
  };

  const clearForm = () => {
    setDate(undefined);
    setItemName('');
    setLocation('');
    setQuantity('');
    setTotalPrice('');
    onDismiss();
    };


  const dismissError = () => {
    setError(false);
  }
  return (
    <Portal>
      <Modal visible={visible} onDismiss={clearForm} contentContainerStyle={styles.modal}>
        <View style={styles.dateSelector}>

            <IconButton
                icon="calendar"
                size={30}
                style = {globalStyles.iconButtonStyles}
                accessibilityLabel= "select Date"
                onPress={() => { setShowDatePicker(true)
                }} 
            />
            {showDatePicker && (
            <DateTimePicker
                value={theDate || new Date()}
                mode="date"
                display="default"
                onChange={(e, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
                }}
            />
            )}

        </View>
        <View style={styles.priceselector}>
            <TextInput
            label="Item Name"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
            />
            <TextInput
            label="Total Price"
            value={totalPrice}
            onChangeText={setTotalPrice}
            keyboardType="numeric"
            style={styles.input}
            />
            <TextInput
            label="Quantity"
            value={Quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
            />
            <TextInput
            label="Location"
            value={Location}
            onChangeText={setLocation}
            style={styles.input}
            />
        </View>
        <Button mode="contained" onPress={handleApply} style={{ marginTop: 20 }}>
          Add Entry
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
  dateSelector: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
  },
  dateButton: {
    backgroundColor: colors.buttonBgColor,
    
  },
  priceselector: {
    paddingVertical: 10
  }
});
