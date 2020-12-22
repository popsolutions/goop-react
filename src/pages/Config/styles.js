import {StyleSheet, Dimensions} from 'react-native';
// import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 1,
    // paddingBottom: Constants.statusBarHeight,
  },
  white: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
  },
  inputArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    textAlign: 'center',
    color: '#858585',
  },
  initValueTextStyle: {
    color: '#858585'
  },
  lightButton:{
    borderColor: '#2d2e49',
    backgroundColor: '#2d2e49',
    borderRadius: 35,
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    paddingVertical: 10,
    marginVertical: 15
  },
  lightButtonText:{
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  },
  label: {
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    marginBottom: 5,
  },
  error: {
    fontSize: 10,
    color: 'red',
  },
});

export default styles;