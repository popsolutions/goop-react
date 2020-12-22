import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    flexGrow: 1
  },
  safeArea: {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
  },
  body: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    alignContent: 'space-between',
  },
  imageArea: {
    flex: 2,
    flexGrow: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputArea: {
    flex: 1,
    flexGrow: 3,
    justifyContent: 'flex-start'
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
  pinkButton: {
    marginRight: 130,
    marginLeft: 130,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#e40063',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e40063',
  },
  facebook: {
    marginRight: 90,
    marginLeft: 90,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
    backgroundColor: '#1b6da1',
    borderColor: '#1b6da1',
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
  lightButton: {
    alignSelf: 'center',
    padding: 5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  wrapper: {},
  slide1: {
    flex: 1,
    // paddingTop: Platform.OS === 'android' ? 10 : 0,
    backgroundColor: '#fff',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  droidSafeArea: {
    flex: 1,
    // paddingTop: Platform.OS === 'android' ? 25 : 0
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
    backgroundColor: '#000',
  },
  lottie: {
    width: 100,
    height: 100,
  }
});

export default styles;
