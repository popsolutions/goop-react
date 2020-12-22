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
  lottie: {
    width: 100,
    height: 100
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
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/1.5,
    marginTop: Dimensions.get('window').height/1.5,
  },
  modalButton: {
    width: Dimensions.get('window').width,
    backgroundColor: '#e40063',
    position: 'absolute',
    bottom: 0,
    height: 60   
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 55,
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center"
  },
  modalTitleText: {
    color:  '#e40063',
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 20,
    marginBottom: 20
  }
});

export default styles;
