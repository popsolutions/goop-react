import React, { useState, useEffect } from 'react';
import { 
  AsyncStorage,
  BackHandler,
  Dimensions,
  Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';


export default function Foto(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);

  const [text, setText] = useState('Tirar Selfie');
  const [foto, setFoto] = useState('');

  let camera = '';

  async function takePicture(){
    try{
      let photo = await camera.takePictureAsync({quality: 0.3, base64: true});
      camera.pausePreview();
      setFoto({uri: photo.uri, base64: photo.base64});
      setText('Enviar');
      return true;
    }catch(e){
      return false;
    }
  }

  function cancelar(){
    camera.resumePreview();
    setText('Tirar Selfie');
  }

  function salvar(){
    console.log(foto);
    AsyncStorage.setItem('foto', JSON.stringify({foto: foto}), () => {
      props.navigation.navigate('Cadastro');
    });
  }

  // const onBackPress = () => {
  //   console.log('backpRESS');
  //   props.navigation.navigate('CadastroForm1');
  // };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       console.log('backpRESS');
  //       props.navigation.navigate('CadastroForm1');
  //     };

  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //     // return () =>
  //     //   BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, [])
  // );

  useFocusEffect(() => {
    (async () => {
      // BackHandler.addEventListener('hardwareBackPress', onBackPress);
      const { status, granted } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log('status ',status);
      console.log('granted ', granted);
      if(status !== 'granted'){
        props.navigation.navigate('Cadastro');
      }

      // if (hasPermission === null) {
      //   props.navigation.navigate('CadastroForm1');
      // }

    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    // props.navigation.navigate('CadastroForm1');
    return <Text>Sem acesso à Câmera</Text>;
  }
  return (
    <View style={{ 
      // display: 'flex', 
      // flex:1, 
      width: Dimensions.get('window').width }}>
      <Camera 
        style={{ aspectRatio: 1/1, alignSelf: 'center' }} 
        type={type} 
        ref={ref => {camera = ref}} 
        ratio='1:1'
        >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            width: '100%',
            height:  Dimensions.get('window').height,
            flexDirection: 'row'
          }}>

          {text == 'Tirar Selfie' &&
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              flexDirection: 'row',
              textAlign: 'center',
              flexGrow: 1
            }}
            onPress={() => {
              const pic = takePicture();
              // console.log(pic);
            }}>
            <Text style={{ 
              backgroundColor: '#2d2e49',
              fontSize: 18,
              marginBottom: 0,
              padding: 15, 
              flexGrow: 1,
              flex: 1,
              color: 'white',
              textAlign: 'center'
            }}>{text}</Text>
          </TouchableOpacity>
          }

          {text == 'Enviar' && 
            <View style={{
              flex: 1, 
              alignSelf: 'flex-end', 
              justifyContent: 'center', 
              flexDirection: 'row', 
              backgroundColor: 'gray' }}>
              <TouchableOpacity
              style={{
                width: Dimensions.get('window').width/2,
                alignSelf: 'flex-end',
              }}
              onPress={() => {
                salvar()
              }}>
                <Text style={{ 
                  backgroundColor: '#2d2e49',
                  fontSize: 18, 
                  marginBottom: 0,
                  padding: 15, 
                  color: 'white',
                  textAlign: 'center'
                }}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
              style={{
                width: Dimensions.get('window').width/2,
                alignSelf: 'flex-end',
              }}
              onPress={() => {
                cancelar()
              }}>
                <Text style={{ 
                  backgroundColor: '#e40063',
                  fontSize: 18, 
                  marginBottom: 0,
                  padding: 15, 
                  color: '#fff',
                  textAlign: 'center'
                }}>Cancelar</Text>
              </TouchableOpacity>
              
            </View>
          }
        </View>
      </Camera>
    </View>
  );
}