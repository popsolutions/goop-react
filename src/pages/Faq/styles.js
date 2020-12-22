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
  headerActive: {
    color: '#2d2e49',
    borderBottomWidth: 0,
  },
  headerInactive:{
    color: '#fff',
    backgroundColor: '#2d2e49',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderWidth: 1
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  inactive: {
    backgroundColor: '#2d2e49',
    borderBottomWidth: 1,
    borderTopWidth: 1
  }
});

export default styles;
