import { Dimensions, Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  white: {
    backgroundColor: 'white'
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginBottom : 125,
  },
  menuItem: {
    flex: 1, 
    justifyContent: 'space-between'
  },
  menuItemContent: { 
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  menuItemImage: {
    height: 40,
    width: 40,
    marginRight: 10
  },
  menuItemText: {
    fontSize: 16, 
    lineHeight: 20, 
    paddingLeft: 10,
    textAlign: 'center',
    paddingTop: 10
  },
  item:{
    padding: 20,
    borderRadius: 20,
    borderColor: '#000',
    borderWidth: 1,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemImg: {
    width: 25, 
    height: 25, 
    marginRight: 10
  }
});

export default styles;