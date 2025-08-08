import { Tabs,usePathname} from 'expo-router';
import { PaperProvider,
 } from 'react-native-paper';
import UniversalAddButton from '../components/fab'


export default function Layout() {
  
  const pathname = usePathname();
  // console.log(pathname);
  return (
    <PaperProvider>
      <Tabs>
        <Tabs.Screen name="pages/index" options={{ title:'Home',headerShown: false}} />
        <Tabs.Screen name="pages/records" options={{title:'Records',headerShown: false }} />
        <Tabs.Screen name="camera" options={{headerShown: false,href:null }} />
        <Tabs.Screen name="imagebrowser" options={{ headerShown: false ,href:null}} />
      </Tabs>
      {<UniversalAddButton />}
    </PaperProvider>
  )
}