import {useState} from "react";
import {Pressable, StyleSheet, Text,
  View,ImageBackground,ScrollView  } from "react-native";
import { ActivityIndicator, IconButton} from 'react-native-paper';
import { Image } from "expo-image";
import {SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import { ImageEditor } from "expo-dynamic-image-crop";


import { globalStyles,colors } from '../../assets/styles';
import { useRouter } from "expo-router";
import { saveToDatabase } from '../../utils/manageDatabase';
import { useAccount } from '../../accountContext';
import { sendImagesToServer } from "../../utils/sendImageToServer";
import ErrorDialog from "../errorDialog";

type ImageProcesserProps = {
  centerButton: React.ReactNode;  //component
  currentImage: string;
  setCurrentImage: React.Dispatch<React.SetStateAction<string>>; //set function
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  imageStack:string[];
  setStack: React.Dispatch<React.SetStateAction<string[]>>;  
  
};

export default function ImageProcesser({centerButton,currentImage, setCurrentImage,currentIndex,setCurrentIndex,imageStack,setStack }: ImageProcesserProps) {
  const { accountId, setAccountId } = useAccount();
  const [loading, setLoading] = useState(false);
  const context = useImageManipulator(currentImage);
  const [isEditing, setIsEditing] = useState(false);

  const [isError,setError] = useState(false);
  const [errorMessage,setErrorMessage] = useState('')
  
  let response: any = null
  const router = useRouter();



  const abortProcess =  () => {
      setStack([]);
      setCurrentImage("");
      setCurrentIndex(-1);
      router.replace('/pages/');
    }
  
  const uploadImage = async () => {
    setLoading(true);
    response = await sendImagesToServer(imageStack);
    
    if('error' in response){
      console.log("error message=",response.error);
      setLoading(false);
      setErrorMessage(response.error);
      setError(true);
    }
    else{
      console.log("SUCCESS: fetched response saving-----");
      await saveToDatabase(response,accountId);
      console.log("SUCCESS: redirecting to /records");
      setStack([]);
      router.replace('/pages/records')
      setLoading(false);
    }
  };

  const rotateImage = async () => {
    context.rotate(90);
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.JPEG,
    });
    setCurrentImage(result.uri);
    setStack(prev => 
      prev.map((item, i) => i === currentIndex ? result.uri : item)
    );

  };
  
  const handleCropComplete = (croppedImageData: any) => {
    setCurrentImage(croppedImageData.uri);
    setStack(prev => 
      prev.map((item, i) => i === currentIndex ? croppedImageData.uri : item)
    );
    setIsEditing(false);
  };
      
  if(loading){
    return (
    <View style={[globalStyles.screen,styles.center]}>
      <View>
        <ActivityIndicator size="large" color={loadingColor} style={{marginBottom: 25}}/>
        <Text style={styles.loadingtext}>Processing Images</Text>
      </View>
    </View>
    );
  }
  return (
    (imageStack.length !== 0) && (
    
    <View style={styles.imagesender}>
      <View style={[styles.buttoncontainer,styles.topbuttoncontainer]}>
        <IconButton
          icon="delete"
          size={30}
          style = {globalStyles.iconButtonStyles}
          accessibilityLabel= "delete picture"
          onPress={() => {
            setStack(prev => prev.filter((_, i) => i !== currentIndex));
            setCurrentImage(imageStack[imageStack.length-1]);
            setCurrentIndex(imageStack.length-1);
          }} 
        />
        <IconButton
          icon="crop"
          size={30}
          style = {globalStyles.iconButtonStyles}
          accessibilityLabel= "crop picture"
          onPress={() => {
            setIsEditing(true);
          }} 
        />
        <IconButton
          icon="rotate-right"
          size={30}
          style = {globalStyles.iconButtonStyles}
          accessibilityLabel= "rotate picture"
          onPress={() => {
            rotateImage();
          }}
        />
      </View>

      <View style={styles.imagecontainer}>
        
          <Image
            source={currentImage}
            contentFit='contain'
            style={styles.mainimage}
          />s
        <ImageEditor
          isVisible={isEditing}
          imageUri={currentImage}
          onEditingComplete={handleCropComplete}
          onEditingCancel={() => setIsEditing(false)}
          fixedAspectRatio={1} 
          dynamicCrop={true} 
        />
      </View>
      <View style={styles.reelcontainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {imageStack.map((image, index) => (
            <Pressable 
            key={index}
            onPress={()=>{
              setCurrentImage(image)
              setCurrentIndex(index)
            }}
            >
            <ImageBackground
              source={{ uri: image }}
              style={styles.thumbnail}
              imageStyle={{ borderRadius: 8 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{index + 1}</Text>
              </View>
            </ImageBackground>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.buttoncontainer,styles.bottombuttoncontainer]}>
        <IconButton
          icon="close"
          size={30}
          
          style = {[globalStyles.iconButtonStyles,{backgroundColor:colors.redButtonColor}]}
          accessibilityLabel= "abort process"
          onPress={abortProcess}
        />
        {centerButton}
        <IconButton
          icon="send"
          size={30}
          style = {[globalStyles.iconButtonStyles,{backgroundColor:colors.greenButtonColor}]}
          accessibilityLabel= "Add to records"
          onPress={uploadImage}
        />
      </View>
      <ErrorDialog visible={isError} onDismiss={()=>setError(false)} message={errorMessage}/>
    </View>
    )
  );
}

const loadingColor = '#245814ff'
const elementMargin = 8;
const styles = StyleSheet.create({
  loadingtext: {
    fontSize: 20,
    color: loadingColor,
    fontWeight: '700'

  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesender: {
    padding: 15,
    marginTop: 20,
    flex: 1,
    backgroundColor: "#fff",
    
  },
  mainimage: {
    height: '100%',
    aspectRatio: 'auto',
    borderRadius: 5,
  },
  imagecontainer: {
    marginBottom: elementMargin,
    height: '66%',
  },
  reelcontainer: {
    backgroundColor: colors.greybgColor,
    borderRadius: 6,

    maxHeight: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-evenly',

  },
  thumbnail: {
    width: 80,
    height: 80,
    justifyContent: 'flex-end', 
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 10,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    height: '100%',
    width: '100%',
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlayText: {
    color: '#fff',
    fontSize: 30,
  },
  buttoncontainer: {
    padding: 5,
    backgroundColor: colors.darkbgColor,
    borderRadius: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topbuttoncontainer: {
    marginBottom: elementMargin,
  },
  bottombuttoncontainer: {
    marginTop: elementMargin,
  },
});