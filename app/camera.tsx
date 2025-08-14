import { View, StyleSheet } from 'react-native';
import Camera from '../components/fab/Camera';

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <Camera />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
