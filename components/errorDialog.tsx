import {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';


type ErrorDialogProps = {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  // onApplyFilters: (filters: FilterValues) => void;
};
const ErrorDialog = ({
    visible,
    message,
    onDismiss,
}: ErrorDialogProps) => {
  // const [visible, setVisible] = useState(false);

  // const onToggleSnackBar = () => setVisible(!visible);

  // const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={styles.container}>
      {/* <Button onPress={onToggleSnackBar}>{visible ? 'Hide' : 'Show'}</Button> */}
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