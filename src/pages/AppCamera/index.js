import React, { useState } from 'react';
import { 
  Alert,
  AsyncStorage,
  BackHandler,
  Dimensions,
  Text, View, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useFocusEffect, withNavigationFocus } from '@react-navigation/native';
import {Header} from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
// import * as FileSystem from 'expo-file-system';
import { selectBy, update } from '../../database/database.js';
const RNFS = require('react-native-fs');

export default function AppCamera(props) {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(RNCamera.Constants.Type.back);

  const [text, setText] = useState('');
  const [foto, setFoto] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const [directoryExists, setDirectoryExists] = useState(false);

  let camera = null;

  async function takePicture(){
    try{
      let photo = await camera.takePictureAsync({quality: 0.3, base64: true});
      camera.pausePreview();
      setFoto({uri: photo.uri, base64: photo.base64});
      setText('Enviar');
      return true;
    }catch(e){
      console.log(e);
      return false;
    }
  }

  function cancelar(){
    camera.resumePreview();
    setText('Tirar Foto');
  }

  async function salvar(){  
    AsyncStorage.getItem('challenge_id').then(function(res){

      const challenge_id = JSON.parse(res);

      selectBy('challenge', 'key', challenge_id.key).then(function(res){
        if(res.rows._array.length > 0){
          AsyncStorage.setItem('foto_c'+ challenge_id.key, JSON.stringify(foto)).then(function(r){
            AsyncStorage.getItem('foto_c'+ challenge_id.key).then(function(res){
              update('challenge',{done: 1}, 'key', challenge_id.key).then(function(res){
                setIsLoaded(false);
                setText('Tirar Foto');
                props.navigation.navigate('MissionProgress');
              });
            })
          });
        }
      })
    });
  }

  useFocusEffect(() => {
      async function getPermissions(){
        if(!hasPermission){
          const { status, granted } = await Camera.requestPermissionsAsync();
          setHasPermission(status === 'granted');

          if(status !== 'granted'){
            Alert.alert('Você precisa permitir o uso da Câmera para usar o Goop');
            props.navigation.navigate('Mapa');
          }else{
            setText("Tirar Foto");
            setIsLoaded(true);
          }
        }else{
          setIsLoaded(true);
        }
      }

      getPermissions().then(function(){
        const AppFolder = 'goop_fotos';
        RNFS.ExternalStorageDirectoryPath +'/'+ AppFolder;
        RNFS.mkdir(DirectoryPath);
      });

      // const onBackPress = () => {
      //   console.log('backpRESS');
      //   props.navigation.navigate('MissionProgress');
      // };
      
      // BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
      // return () => {
      //   // camera = useRef(null);
      //   // setText("");
      // }
      //   BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [isLoaded])

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <View 
      style={{
        flex: 1, 
        backgroundColor: '#2d2e49',
        justifyContent: 'center'
        }}>
        <Text 
          style={{
            fontSize: 18,
            color: '#fff',
            textAlign: 'center',
            padding: 15
          }}
          >Sem acesso à Câmera</Text>
      </View>;
  }
  return isLoaded && (
    <SafeAreaView style={{ flexGrow:1, marginTop:Platform.OS === 'ios' ? 0 : -50, backgroundColor:'#fff' }} >
      <Header
        backgroundColor='transparent'
        leftComponent={{ 
          icon: 'keyboard-arrow-left', 
          size: 36,
          color: '#333',
          onPress: () => props.navigation.navigate('MissionProgress')
        }}
        containerStyle={{ paddingTop: 50}}
      />
      <Camera 
        style={{ flexGrow: 1, aspectRatio: 2/3, alignSelf: 'center' }} 
        type={type}
        ref={ref => {camera = ref}}
        ratio='1:1'
        >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row'
          }}>

          {text == 'Tirar Foto' &&
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                flexDirection: 'row',
                textAlign: 'center',
                flexGrow: 1
              }}
              onPress={() => {
                takePicture();
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
    </SafeAreaView>
  );
}
