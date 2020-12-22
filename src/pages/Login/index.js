import React,  { useState, useRef } from 'react';
import InputScrollView from 'react-native-input-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedLoader from 'react-native-animated-loader';
import { getOdoo, connectAPI } from '../../utils/odoo.js';
import { databaseInit, insertData, selectBy } from '../../database/database.js';

import * as yup from 'yup';
import {Formik} from 'formik';

import { 
  AsyncStorage, 
  BackHandler,
  Dimensions, 
  Image, 
  Keyboard,
  TextInput, 
  Text, 
  TouchableHighlight, 
  View,
  Alert,
  StatusBar
} from 'react-native';

import COLORS from '../../utils/colors.js';
import styles from './styles.js';

export default function Login(props) {
  let {height, width} = Dimensions.get('window');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const bagRef = useRef();

  const inputs = {};
  const initialValues = {email: 'jaqueline.pnascimento@gmail.com', password: '00000000'};


  function focusNextField(id) {
    if (inputs[id].getElement) {
      inputs[id].getElement().focus();
    } else {
      inputs[id].focus();
    }
  }

  const fetchUser = async () => {
    try {      
      const _user = await AsyncStorage.getItem('user');

      if(_user !== null){
        const u = JSON.parse(_user);
        setUser(u);

        if(u.isLogged){
          setIsLoading(false);
          props.navigation.navigate('Main');
        }else{
          setIsLoading(false);
        }
      }else{
        setIsLoading(false);
      }
    }catch(e){
      console.log(e);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      databaseInit();
      
      fetchUser();

      const onBackPress = () => {
        Keyboard.dismiss();
        bagRef.current.handleReset();
        // setInitialValues({email: '', password: ''});
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const insertUser = async (table, d) => {
    try {
      const ret = await insertData(table,d);
      return ret;
    }
    catch(err){
      return err;
    }
  }

  async function sendLogin(data){
    setIsLoading(true);
    const odoo = getOdoo(data.email, data.password);

    try{
      const res = await connectAPI(odoo);

      if(res !== undefined && res.hasOwnProperty('code') && res.code == 1){
      
        const  params = {
          domain: [ [ 'email', '=', data.email] ],
          fields: [
            'name', 
            'image',
            'birthdate',
            'function', 
            'cnpj_cpf',
            'education_level', 
            'gender', 
            'missions_count',
            'mobile',
            'email',
            'street',
            'city',
            'district',
            'state',
            'signup_url'
          ]
        }
  
        odoo.search_read('res.partner', params)
          .then(async(response) => { 
  
            if(response.success){
              const user_ = response.data[0];
              user_.password = data.password;
              user_.isLogged = true;
              user_.uid = res.uid;
              user_.partner_id = res.id;

              console.log(user_);
              console.log(user_.partner_id);
  
              try{
                const r = await selectBy('user', 'uid', res.uid);
    
                if(r.rows._array.length > 0){
                  const userDB = {
                    uid: user_.uid, 
                    email: user_.email,
                    password: user_.password,
                    isLogged: user_.isLogged, 
                    id: r.rows._array[0]['id'],
                    partner_id: res.id
                  };
  
                  try{
                    await AsyncStorage.setItem('user', JSON.stringify(userDB));
                    setIsLoading(false);
                    props.navigation.navigate('Main');
                  }catch(e){
                    console.log(e);
                  }
                }else{
                  insertUser('user', user_).then(async(r) => {    
                    const userDB = {
                      uid: user_.uid, 
                      email: user_.email,
                      password: user_.password,
                      isLogged: user_.isLogged,
                      id: user_.id,
                      partner_id: user_.id
                    };
      
                    await AsyncStorage.setItem('user', JSON.stringify(userDB));
                    setIsLoading(false);
                    props.navigation.navigate('Main');
                  });
                }
              }catch(e){
                setIsLoading(false);
                Alert.alert('Erro desconhecido');
              }
            }
          })
          .catch(e => { 
            setIsLoading(false);
          });
      }else{
        setIsLoading(false);
        //setMessage(res.e);
      }
    }catch(e){
      // Alert.alert(
      //   '',
      //   'Erro ao conectar',
      //   [
      //     { text: 'Aceptar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      //   ],
      //   { cancelable: false }
      // )
      console.log(e);
      return false;
    }
  }

  return (
    isLoading ? (
      <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0.75)"
        source={require('../../assets/loader/loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      />
    ) : (
      <SafeAreaView style={{flex: 1, height: height, backgroundColor: '#fff'}}>
        <InputScrollView 
          keyboardShouldPersistTaps="always" >
          <Formik
            innerRef={bagRef}
            enableReinitialize={true}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialValues}
            onSubmit={values => {
              sendLogin(values);
            }}
            validationSchema={yup.object().shape({
              email: yup
                .string()
                .email('Digite um e-mail válido')
                .required('Preencha o Email'),
              password: yup
                .string()
                .min(6, 'A senha deve ter no mínimo 6 caracteres')
                .required('Preencha a Senha'),
            })}>
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              handleSubmit,
              handleReset
            }) => (
              <View style={[{flex: 1, height: height - StatusBar.currentHeight}]}>
                <View style={[styles.imageArea]}>
                  <Image
                    source={require('../../assets/img/logo.png')}
                    style={{width: width/2.5, height: width/2.5}}
                  />
                </View>
                <View style={styles.inputArea}>
                  <View style={{height: 100}}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      // autoFocus={true}
                      autoCapitalize='none'
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onChange={() => setMessage('') }
                      onFocus={() => setFieldTouched('email',false)}
                      style={styles.input}
                      keyboardType="email-address"
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        focusNextField('2');
                      }}
                      returnKeyType={'next'}
                      ref={input => {
                        inputs['1'] = input;
                      }}
                    />
                    {touched.email && errors.email && (
                      <Text style={[styles.label, styles.error]}>
                        {errors.email}
                      </Text>
                    )}
                  </View>
                  <View style={{height: 100}}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onChange={() => {
                        setFieldTouched('password',false);
                        setMessage('')
                      }}
                      onFocus={() => setFieldTouched('password',false)}
                      secureTextEntry={true}
                      style={styles.input}
                      ref={input => {
                        inputs['2'] = input;
                      }}
                    />
                    {touched.password && errors.password && (
                      <Text style={[styles.label, styles.error]}>
                        {errors.password}
                      </Text>
                    )}
                    <Text style={[styles.label, styles.error]}>{message}</Text> 
                  </View>
                </View>
                <View style={{ flex:1, flexGrow: 3, justifyContent: 'space-around'}}>
                  <TouchableHighlight
                    style={styles.pinkButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      handleSubmit();
                    }}
                    underlayColor={COLORS.lightTouchableUnderlay}>
                    <Text style={styles.submitText}>Entrar</Text>
                  </TouchableHighlight>
                 
                  <TouchableHighlight
                    style={styles.lightButton}
                    onPress={() => {
                      handleReset();
                      setMessage('');
                      props.navigation.navigate('Cadastro')
                    }}
                    underlayColor={COLORS.lightTouchableUnderlay}>
                    <Text style={styles.darkText}>Cadastre-se agora</Text>
                  </TouchableHighlight>
                </View>
              </View>
            )}
          </Formik>
        </InputScrollView>
      </SafeAreaView>
    )
  );
}