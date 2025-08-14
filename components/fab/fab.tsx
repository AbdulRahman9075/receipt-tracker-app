import{useState} from 'react';
import { FAB, Portal, PaperProvider} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter,usePathname} from "expo-router";
import AddEntryModal from './dataEntryModal';
const UniversalAddButton = () => {
  const [state, setState] = useState<{ open: boolean }>({ open: false });
  const onStateChange = (newState: { open: boolean }) => setState(newState);

  const [dataModalVisible, setVisible] = useState(false);
  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const router = useRouter();
  const { open } = state;
  const pathname = usePathname();
  // console.log(pathname);
  return (
      <Portal
      
      >
        <FAB.Group
          style={{
            
            position: 'absolute',
            bottom: 80,  
            right: 20,   
          }}
          fabStyle={{
            padding:0,
            margin:0,
            width: 65,
            height: 65,
            justifyContent: "center",
            alignItems: "center"
            
          }}
          open={open}
          visible={pathname === '/pages' || pathname === '/pages/records' || pathname === '/'}
          icon={
            open ? 'receipt' : 'plus'
            
          }
          actions={[
            { icon: 'plus', onPress: ()=> {openModal();}, 
              
            }, 
            {                                                           
              icon: 'camera',
              label: 'Take Photo',
              onPress: () => router.replace('/camera'),
            },
            {
              icon: 'image-multiple',
              label: 'Browse Photos',
              onPress: () => router.replace('/imagebrowser'),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
        <AddEntryModal visible={dataModalVisible} onDismiss={closeModal}/>
              
      </Portal>
  );
};

export default UniversalAddButton;

