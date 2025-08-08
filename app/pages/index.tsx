import { Link } from 'expo-router'
import { StyleSheet, Text, View,Button } from 'react-native'
import UniversalAddButton from '../../components/fab'

// import { useRouter } from 'expo-router';

const Home = () => {
  // const router = useRouter();
  return (
    <View style={styles.centered}>
      <Text style={styles.centeredtop}>HOME</Text>
      {/* <Link style={styles.spacing} href="../camera">Open camera</Link>
      <Link style={styles.spacing} href="../imagebrowser">Browse photos</Link> */}
      {/* <UniversalAddButton/> */}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  centeredtop: {
    width: '100%',
    height: '20%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 50,
    fontWeight: 900,
  },
  centered: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 50,
    fontWeight: 900,
  },
  spacing: {
    padding: 25,
    marginBottom: 40,
  }

})