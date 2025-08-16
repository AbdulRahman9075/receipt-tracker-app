import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDefaultAccount = async (value: string) => {
  try {
    await AsyncStorage.setItem('default-account-key', value);
    console.log("SUCCESS: default account set");
  } catch (e) {
    console.log("FAILED: to store default value",e);
  }
};

export const getDefaultAccount= async ()=> {
  try {
    const value = await AsyncStorage.getItem('default-account-key');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
  }
};