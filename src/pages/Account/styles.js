import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  white: {
    backgroundColor: '#fff',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 130
  },
  imageLabel: {
    fontSize: 14,
    color: '#fff',
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 100,
  },
  titleView: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingVertical: 10
  },
  title: {
    fontSize: 24,
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
    padding: 10
  },
  initValueTextStyle: {
    color: '#858585'
  },
  cancelContainerStyle: {
    height: 0,
    overflow: 'hidden',
  },
  optionStyle: {
    padding: 0,
  },
  twoRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {flexGrow: 1, flexBasis: 0},
  modalSelector: {
    backgroundColor: '#fff',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 0,
    padding: 0,
  },
  selectTextStyle: {
    color: '#858585',
    backgroundColor: '#fff',
    borderWidth: 0,
    padding: 0,
    marginTop: -3,
  },
  touchableStyle: {
    height: 38,
    borderRadius: 10,
    borderWidth: 0,
  },
  optionTextStyle: {
    backgroundColor: 'white',
    paddingVertical: 20,
    color: '#2d2e49',
  },
  optionContainerStyle:{
    backgroundColor: '#fff'
  },
  selectStyle: {
    borderWidth: 0,
    height: 38,
    marginBottom: 0,
    borderRadius: 10,
  },
  childrenContainerStyle: {
    height: 38,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderRadius: 10,
    padding: 0,
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
    alignSelf: 'center',
  },
  darkText: {
    color: '#000',
    alignSelf: 'center',
  },
  alignItemsCenter: {alignItems: 'center'},
  lightButton: {
    alignSelf: 'center',
    padding: 5,
    marginBottom: 40,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  droidSafeArea: {
    flex: 1,
    // paddingTop: Constants.statusBarHeight,
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
  button: {
    backgroundColor: '#2d2e49',
    borderColor: '#2d2e49',
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingTop: 15,
    width: 150,
    paddingBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20
  },
  labelInputGroup: {
    height: 95
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {
    justifyContent: 'space-between',
    flex: 1,
    flexGrow: 1,
  },
  imageView: {
    height: 150, 
    marginBottom: 10
  }
});

export default styles;