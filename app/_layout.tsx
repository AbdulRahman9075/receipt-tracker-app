import { Tabs,usePathname} from 'expo-router';
import { PaperProvider,
 } from 'react-native-paper';
import UniversalAddButton from '../components/fab/fab'
import { AccountProvider } from '../accountContext';
import { Entypo,FontAwesome,Ionicons } from '@expo/vector-icons';

export default function Layout() {
  
  const pathname = usePathname();
  // console.log(pathname);
  return (
      <AccountProvider>
        <PaperProvider>
          <Tabs  screenOptions={{ tabBarActiveTintColor: '#9c1cb0ff' }}>
            <Tabs.Screen name="pages/index" options={{ 
              title:'Home',
              tabBarIcon: ({ color }) => <Entypo size={25} name="home" color={color} />,
              headerShown: false,
              }} />
            <Tabs.Screen name="pages/records" options={{
              title:'Records',
              tabBarIcon: ({ color }) => <FontAwesome size={25} name="list-ul" color={color} />,
              headerShown: false,
              
              }} />
            <Tabs.Screen name="pages/settings" options={{
              title:'Settings',
              tabBarIcon: ({ color }) => <Ionicons size={25} name="settings-sharp" color={color} />,
              headerShown: false }} />
            <Tabs.Screen name="camera" options={{headerShown: false,href:null }} />
            <Tabs.Screen name="imagebrowser" options={{ headerShown: false ,href:null}} />
          </Tabs>
          {<UniversalAddButton />}
        </PaperProvider>
      </AccountProvider>
  )
}