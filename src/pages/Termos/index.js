import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Header} from 'react-native-elements';
import { WebView } from 'react-native-webview';


export default function Termos(props) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        backgroundColor='#e40063'
        leftComponent={{ 
          icon: 'arrow-back', 
          size: 32,
          color: '#fff',
          onPress: () => props.navigation.navigate('Config')
        }}
        containerStyle={{
          borderBottomWidth: 0, 
          paddingTop: 0, 
          height: 60
        }}
      />
      <WebView source={{ uri: 'http://goop.popsolutions.co/termos-de-uso' }} style={{ marginTop: -60}}/>
    </SafeAreaView>
  );
}