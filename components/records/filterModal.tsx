import {useState} from 'react';
import {
  Modal,
  Portal,
  Button,
  Text,
  TextInput,
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../assets/styles';
import ErrorDialog from '../errorDialog';
import { parseNumber } from '../../utils/utilities';


type FilterValues = {
  startDate?: Date;
  endDate?: Date;
  min: number;
  max: number;
  constant: number;
};


type FilterModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onApplyFilters: (filters: FilterValues) => void;
};


export default function FilterModal({
    visible,
    onDismiss,
    onApplyFilters,
}: FilterModalProps) {

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const [showError,setError] = useState(false);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleApply = () => {
    let constant = NaN;
    let min = parseNumber(minPrice);
    let max = parseNumber(maxPrice);
    if(isNaN(min) || isNaN(max)) {
      setError(true);
      clearForm();
      onDismiss();
      return;
    
    }
    else if(max !== Infinity && min !== Infinity && max < min ){
      [min, max] = [max, min];
    }
    else if( max === min ){
      constant = min;
      min = NaN;
      max = NaN;
    }
    onApplyFilters({ startDate, endDate, min, max,constant});
    clearForm();
    onDismiss();
  };

  const clearForm = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setMinPrice('');
    setMaxPrice('');
    onDismiss();
    };


  const dismissError = () => {
    setError(false);
  }
  return (
    <Portal>
      <Modal visible={visible} onDismiss={clearForm} contentContainerStyle={styles.modal}>
        <Text style={styles.heading}>Date Range: </Text>
        <View style={styles.dateSelector}>
        <Button style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
          {startDate ? startDate.toDateString() : 'Pick Start Date'}
        </Button>
        
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            maximumDate={endDate || new Date()}
            onChange={(e, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}
        <Text style={styles.heading}>----</Text>
        <Button style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
          {endDate ? endDate.toDateString() : 'Pick End Date'}
        </Button>
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            minimumDate={startDate || new Date()}
            onChange={(e, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}
        </View>
        <Text style={styles.heading}>Price Range: </Text>
        <View style={styles.priceselector}>
            <TextInput
            label="Min Price"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric"
            style={styles.input}
            />
            <TextInput
            label="Max Price"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
            style={styles.input}
            />
        </View>
        <Button mode="contained" onPress={handleApply} style={{ marginTop: 20 }}>
          Apply Filters
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
