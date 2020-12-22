import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  lottie: {
    width: 100,
    height: 100
  }
});

export default styles;
