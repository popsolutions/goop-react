import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flex: 1, 
    justifyContent: 'space-between',
    // height: 80,
    paddingLeft: 20,
    padding: 10
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
  }
});

export default styles;
