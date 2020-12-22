import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  white: {
    backgroundColor: '#fff',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  item:{
    padding: 20,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#2d2e49',
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingTop: 15,
    width: 150,
    paddingBottom: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
    alignSelf: 'center',
  },
  lottie: {
    // marginTop: 50,
    width: 100,
    height: 100,
    zIndex: 0
  }
});

export default styles;
