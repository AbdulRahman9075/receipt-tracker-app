import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { IconButton } from 'react-native-paper';
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { globalStyles } from '../../assets/styles';
import ImageProcesser from './imageprocesser';


export default function PickImage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentImage, setCurrentImage] = useState<string>("");
  const router = useRouter();
  const imagePicker = async () => {
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      orderedSelection: true,
      selectionLimit: 4,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      setImages(uris);
      const lastIndex = uris.length - 1;
      setCurrentIndex(lastIndex);
      setCurrentImage(uris[lastIndex]);
    }
    else {
      router.back();
    }
    setLoading(false);
  };

  // run when triggered again
  useFocusEffect(
    useCallback(() => {
      if (images.length === 0) {
        imagePicker();
      }
    }, [images])
  );

  const CenterButton = (
    <IconButton
      icon="image-multiple"
      style={[globalStyles.iconButtonStyles]}
      size={30}
      accessibilityLabel="modify selection"
      onPress={imagePicker}
    />
  );

  return (
    <View style={styles.container}>
      {loading || images.length === 0 ? (
        <ActivityIndicator size="large" color="#0f0f14ff" />
      ) : (
        <ImageProcesser
          centerButton={CenterButton}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          imageStack={images}
          setStack={setImages}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
