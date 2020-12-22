import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22
  },
  lightLabel: {
    color: '#fff',
    fontSize: 14
  },
  centerText: {
    textAlign: 'center',
  },
  mv20: {
    marginVertical: 20
  },
  headerPrimary: {
    backgroundColor: '#e40063',
    paddingHorizontal: 30,
    paddingBottom: 30,
    width: '100%'
  },
  button: {
    backgroundColor: '#e40063',
    width: '50%',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginTop: -10
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  grow1: {
    flexGrow: 1
  },
  pv20: {
    paddingVertical: 20
  },
  orangeText: {
    color: '#f24726'
  },
  textGray: {
    color: '#808080'
  },
  greenText: {
    color: '#8fd14f'
  },
  separatorDate: {
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    // marginHorizontal: 20
    alignSelf: 'center',
    textAlignVertical: "center"
  },

  lineDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    //width: '100%',
    marginHorizontal: 20
  },
  buttonFullPink: {
    backgroundColor: '#e40063',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  titleModal: {
    color: '#e40063',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  contentTextModal: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20
  },
  amount: {
    fontSize: 20,
    textAlign: 'center',
    color: '#808080'
  },
  white: {
    color: '#fff',
    fontSize: 15
  },
  containerModal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', 
    justifyContent: "center"
  },
  containerBottomModal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', 
    justifyContent: "flex-end"
  },
  contentModal: {
    width: '100%', 
    height: 250,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 35,
    justifyContent: 'space-around'
  },


  root: {
    padding: 20,
    minHeight: 300
  },
  titleCode: {
    textAlign: 'center', fontSize: 30
  },
  codeFiledRoot: {
    marginTop: 20
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor:'#e40063',
    textAlign: 'center',
    borderRadius: 10
  },
  focusCell: {
    borderColor: '#000',
  },


});
// border color e6e6e6
// text color 808080
export default styles;
