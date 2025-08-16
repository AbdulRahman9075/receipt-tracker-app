import { View, StyleSheet } from 'react-native';
import {Snackbar } from 'react-native-paper';


type ErrorDialogProps = {
  visible: boolean;
  message: string;
  onDismiss: () => void;
};
const ErrorDialog = ({
    visible,
    message,
    onDismiss,
}: ErrorDialogProps) => {

  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        // action={{
        //   label: '',
        //   onPress: () => {
        //     // Do something
        //   },
        // }}
        >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default ErrorDialog;