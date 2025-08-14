import {
  Modal,
  Portal,
  Button,
  Text,
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import {colors, globalStyles  } from '../assets/styles'


type ConfirmationModalProps = {
  visible: boolean;
  yesButtonText: string,
  message: string;
  onDismiss: () => void;
  onConfirm: () => void;
};


export default function ConfirmationModal(
{
    visible,
    yesButtonText,
    message,
    onDismiss,
    onConfirm,
}: ConfirmationModalProps

) {

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.confirmmodal}>
        <Text style={styles.message}>{message} </Text>
        <View style={styles.optionsBox}>
            <Button textColor='black' style={styles.modalbutton} onPress={onDismiss}>Cancel</Button>
            <Button textColor='black' style={[styles.modalbutton,styles.red]} onPress={onConfirm}>{yesButtonText}</Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  confirmmodal: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionsBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 30,
  },
  modalbutton: {
    backgroundColor: colors.buttonBgColor,
    padding: 5
    
  },
  red: {
    backgroundColor: colors.redButtonColor,
  }

});
