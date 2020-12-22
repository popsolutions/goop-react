import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  white: {
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'left',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    padding: 10,
    borderWidth: 0,
    borderColor: '#2d2e49'
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500'
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderWidth: 1
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
    width: 100,
    height: 100
  },
});

export default styles;
