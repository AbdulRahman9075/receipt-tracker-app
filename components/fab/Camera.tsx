import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { globalStyles } from "../../assets/styles";
import ImageProcesser from "./imageprocesser";

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setCameraActive] = useState(true);
  const ref = useRef<CameraView>(null);
  const [loading, setLoading] = useState(false);
  const [imageStack, setStack] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);
  useEffect(() => {
    if (isFocused) {
      // Reset state every time the camera screen is re-focused
      setCameraActive(true);
      setCurrentImage("");
      setStack([]);
      setCurrentIndex(-1);
    }
}, [isFocused]);
  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync();
      if (!photo?.uri) return;

      const newStack = [...imageStack, photo.uri];
      setStack(newStack);
      setCurrentImage(photo.uri);
      setCurrentIndex(newStack.length - 1);
      setCameraActive(false); 
    } catch (e) {
      console.warn("Camera error:", e);
    }
  };

  const CenterButton = (
    <IconButton
      icon="plus"
      style={[globalStyles.iconButtonStyles]}
      size={30}
      accessibilityLabel="Take another picture"
      onPress={() => {
        setCameraActive(true); 
      }}
    />
  );

  if (loading || permission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0f0f14ff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20 }}>Camera access denied.</Text>
        <IconButton icon="camera" onPress={() => requestPermission()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && isCameraActive ? (
        <CameraView
          style={styles.camera}
          ref={ref}
          mode="picture"
          facing="back"
          mute={false}
          responsiveOrientationWhenOrientationLocked
        >
          <View style={styles.shutterContainer}>
            <Pressable onPress={takePicture}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.shutterBtn,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                >
                  <View style={styles.shutterBtnInner} />
                </View>
              )}
            </Pressable>
          </View>
        </CameraView>
      ) : (
        <ImageProcesser
          centerButton={CenterButton}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          imageStack={imageStack}
          setStack={setStack}
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
  camera: {
    flex: 1,
    width: '100%',
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
