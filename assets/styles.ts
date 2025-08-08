import { StyleSheet ,Dimensions} from 'react-native';

//colors
export const colors = {
  primary: '#6200ee',
  background: '#f5f5f5',
  text: '#333',
  buttonBgColor :'#d7c0d1ff',
  greenButtonColor: '#83ea9eff',
  redButtonColor: '#e78383ff',
  greybgColor: '#b3b2b2ff',
  darkbgColor: '#201c1cff',
};

//constants
const { width,height  } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;
//styles
export const globalStyles = StyleSheet.create({
  screen: {
    padding: 15,
    marginTop: 20,
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    marginVertical: 12,
  },
  roundedBox: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#eee',
  },
  iconButtonStyles: {
    // padding:0,
    // margin:0,
    width: 50,
    height: 50,
    // position: 'relative',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.buttonBgColor,
  }
});

export {SCREEN_WIDTH,SCREEN_HEIGHT}