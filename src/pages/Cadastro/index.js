import React, { useEffect, useState } from 'react';

import { Icon } from 'react-native-elements';

import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';

import {
  BackHandler,
  Keyboard,
  Text,
  View,
} from 'react-native';

import styles from './styles.js';

export default function Cadastro(props) {
  const [loaderVisible, setLoaderVisible] = useState(false);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    setLoaderVisible(true);

    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const _keyboardDidShow = () => {
    setShowPagination(false);
  };

  const _keyboardDidHide = () => {
    Keyboard.dismiss();
    setShowPagination(true);
  };

  const onBackPress = () => {
    Keyboard.dismiss();
    props.navigation.navigate('Login');
    return false;
  };

  const _onNavigationStateChange = (webViewState) => {
    if(webViewState.url == "https://charismabi.com.br/my"){
      props.navigation.navigate('Main');
    }
  }

  return (
    <SafeAreaView style={[styles.white, { flexGrow: 1 }]}>
      <View style={[styles.titleView, styles.white, { alignContent: 'center' }]}>
        <View style={{ flexGrow: 1 }}>
          <Text style={[styles.title, { textAlign: 'center' }]}>Cadastro</Text>
        </View>
        <View style={{ position: 'absolute', top: 8, left: 0 }}>
          <Icon
            name='keyboard-arrow-left'
            size={36}
            color='#333'
            onPress={() => {
              props.navigation.navigate('Login');
            }}
          />
        </View>
      </View>

      {loaderVisible &&
        <AnimatedLoader
          visible={true}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../../assets/loader/loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
      }

      <WebView
        source={{ uri: 'http://charismabi.com.br/web/signup' }}
        onLoad={loaderVisible => {
          setLoaderVisible(false)
        }}
        onNavigationStateChange={_onNavigationStateChange.bind(this)}
      />

    </SafeAreaView>
  );
}
