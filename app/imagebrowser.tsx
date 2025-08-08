import { View, StyleSheet } from 'react-native';
import PickImage from '../components/browseImage'; 

export default function imageBrowser() {
  return (
    <View style={styles.container}>
      <PickImage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
