import React, {useState} from 'react';

import {
  AsyncStorage,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputScrollView from 'react-native-input-scroll-view';
import * as yup from 'yup';
import { Formik } from 'formik';
import { TextInputMask } from 'react-native-masked-text';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedLoader from 'react-native-animated-loader';

import {  
  selectBy
} from '../../database/database.js';

import styles from './styles.js';

export default function Config(props) {
  const [user, setUser] = useState({});
  const [busy, setBusy] = useState(true);

  const inputs = {};

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  } 

  useFocusEffect(
    React.useCallback(() => {
      
      const getData = async () => {
        const res = await AsyncStorage.getItem('user');
        if(res == null){
          props.navigation.navigate('Login');
        }
        else{
          return JSON.parse(res);
        }
      }

      getData().then(function(r){
        selectBy('user','uid', r.uid).then(function(res){
          if(res.rows.length > 0){
            res.rows._array[0].age = getAge(res.rows._array[0].birthdate);
            res.rows._array[0].address = res.rows._array[0].street;
            setUser(res.rows._array[0]);
            setBusy(false);
          }
        })
      });

      return () => {
        setUser({});
      }
    }, [])
  );



  return (
    busy ? (
      <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0.75)"
        source={require('../../assets/loader/loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      />
    ) : (
      <SafeAreaView style={[styles.container, {paddingTop: 0}]} >
        <Header
          backgroundColor='#fff'
          leftComponent={{ 
            icon: 'menu', 
            size: 32,
            color: '#333',
            onPress: () => props.navigation.openDrawer()
          }}
          centerComponent={{
            text: 'Configurações',
            style: { 
              color: '#333',
              fontSize: 22
            }
          }}
          containerStyle={{
            borderBottomWidth: 0, 
            paddingTop: StatusBar.currentHeight, 
            height: 60 + StatusBar.currentHeight
          }}
        />
        {/* <View style={{width: '100%', flexGrow: 1}}> */}
          <InputScrollView 
            keyboardAvoidingViewProps={{keyboardVerticalOffset: 100}}
            keyboardShouldPersistTaps="handled"
            useAnimatedScrollView={true}
            topOffset={150}
            // style={{flexGrow: 1, paddingTop: 60}}
            >
            <View style={{paddingHorizontal: 20, paddintTop: 0}}>
              <View style={{ 
                flexDirection:'row', 
                alignItems: 'center', 
                justifyContent: 'space-around',
                paddingVertical: 10
                }}>
                <Image
                  source={{uri: `data:image/gif;base64,${user.image}`}}
                  style={{ width: 100, height: 100, marginLeft: 5, borderRadius: 50 }}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{color: 'gray' }}>{user.name}</Text>
                  <Text style={{color: 'gray' }}>{user.age} Anos</Text>
                </View>
              </View>
            </View>
            <Formik
              validateOnBlur={false}
              validateOnChange={false}
              initialValues={user}
              onSubmit={values => createUser(values) }
              validationSchema={yup.object().shape({
                zip: yup
                  .string()
                  .min(8, 'O CEP deve ter 8 números')
                  .required('Preencha o CEP')
                  .test({
                    test: function(value){
                      return fetch('https://viacep.com.br/ws/'+ value+ '/json/')
                        .then(res => {
                          return res.json().then(function(r){
                            if(r.erro){
                              return false;
                            }else{
                              setAddress(r);
                              return true;
                            }
                          })
                        })
                    },
                    message:'CEP Inválido'
                  }),
                email: yup
                  .string()
                  .email('Email Inválido')
                  .required('Preencha o Email'),
                mobile: yup
                  .string()
                  .required('Preencha o Celular')
                  .matches(/\((1[1-9]|2[12478]|3[1-8]|4[1-9]|5[13-5]|6[1-9]|7[13-5]|7[79]|8[1-9]|9[1-9]{1})\) [9](\d{4}-\d{4})/g,"Número Inválido")
                  .test({
                    test: value => {
                      if (typeof(value) !== "undefined"){
                        const cel = value.substr(6,15);
                        return (cel.match(/(\d)\1{3}-(\d)\1{3}/g)) ? false : true;
                      }
                      return false;
                    },
                    message:'Número Inválido'
                  }),
              })}>
              {({
                values,
                handleChange,
                errors,
                setFieldTouched,
                touched,
                isValid,
                handleSubmit,
              }) => (
                <View>
                  <View>
                    <View style={{height: 90}}>
                      <Text style={styles.label}>Email</Text>
                      <TextInput
                        ref={ref => {
                          inputs['5'] = ref;
                        }}
                        maxLength={100}
                        style={styles.input}
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          focusNextField('6');
                        }}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        returnKeyType={'next'}
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onFocus={() => {
                          console.log('focus email');
                          setFieldTouched('email',false);
                        }}
                      />
                      {touched.email && errors.email && (
                        <Text style={[styles.label, styles.error]}>
                          {errors.email}
                        </Text>
                      )}
                    </View>
                    <View style={{height: 95}}>
                      <Text style={styles.label}>Celular</Text>
                      <TextInputMask
                        type={'cel-phone'}
                        style={styles.input}
                        options={{
                          maskType: 'BRL',
                          withDDD: true,
                          dddMask: '(99) ',
                        }}
                        value={values.mobile}
                        blurOnSubmit={true}
                        returnKeyType={'next'}
                        ref={input => {
                          inputs['6'] = input;
                        }}
                        onBlur={() => {
                          const ddd = values.mobile.substr(0,4);
                          console.log(ddd);
                          console.log(inputs['6'].isValid());
                          
                        }}
                        onChangeText={handleChange('mobile')}
                        onFocus={() => setFieldTouched('mobile',false)}
                      />
                      {touched.mobile && errors.mobile && (
                        <Text style={[styles.label, styles.error]}>
                          {errors.mobile}
                        </Text>
                      )}
                    </View>
                    <View style={{height: 95}}>
                      <Text style={styles.label}>Endereço</Text>
                      <TextInput
                        maxLength={40}
                        style={styles.input}
                        value={values.address}
                        blurOnSubmit={false}
                        returnKeyType={'next'}
                        ref={input => {
                          inputs['9'] = input;
                        }}
                        onSubmitEditing={() => {
                          focusNextField('10');
                          Keyboard.dismiss();
                        }}
                        keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                        onChangeText={handleChange('address')}
                        onFocus={()=>setFieldTouched('address',false)}
                      />
                      {touched.address && errors.address && (
                        <Text style={[styles.label, styles.error]}>
                          {errors.address}
                        </Text>
                      )}
                    </View> 
                    <View style={{height: 95}}>
                      <Text style={styles.label}>Conta Bancária</Text>
                      <TextInput
                        maxLength={40}
                        style={styles.input}
                        value={values.conta}
                        blurOnSubmit={false}
                        returnKeyType={'next'}
                        ref={input => {
                          inputs['9'] = input;
                        }}
                        onSubmitEditing={() => {
                          focusNextField('10');
                          Keyboard.dismiss();
                        }}
                        keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                        onChangeText={handleChange('conta')}
                        onFocus={()=>setFieldTouched('conta',false)}
                      />
                      {touched.conta && errors.conta && (
                        <Text style={[styles.label, styles.error]}>
                          {errors.conta}
                        </Text>
                      )}
                    </View>                   
                  </View>
                </View>
              )}
            </Formik>
            <View>
              <TouchableHighlight
                style={styles.lightButton}
                onPress={() => {

                }}
                >
                <Text style={styles.lightButtonText}>Sobre o GOOP</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.lightButton}
                onPress={() => {
                  props.navigation.navigate('Termos');
                }}
                >
                <Text style={styles.lightButtonText}>Termos de Uso</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.lightButton}
                onPress={() => {
                  
                }}
                >
                <Text style={styles.lightButtonText}>Desativar minha conta</Text>
              </TouchableHighlight>
            </View>
          </InputScrollView>
        {/* </View> */}
    </SafeAreaView>
    )
  );
}
