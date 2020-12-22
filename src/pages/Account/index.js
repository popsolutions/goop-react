import React, {useState} from 'react';
import {
  AsyncStorage,
  Image,
  Text,
  View, 
} 
from 'react-native';
import { Header } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputScrollView from 'react-native-input-scroll-view';
import AnimatedLoader from 'react-native-animated-loader';
import { selectBy } from '../../database/database.js';

import styles from './styles.js';

export default function Account(props){
  const [user, setUser] = useState({});
  const [busy, setBusy] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async function(){
        if(Object.keys(user).length == 0){
          const val = await AsyncStorage.getItem('user');
          if(val !== null){
            const res = JSON.parse(val);
            selectBy('user', 'uid', res.uid).then(function(res){
              if(res.rows.length > 0){
                const u = res.rows._array[0];
                const bday = u.birthdate.split('-');
                u.birthdate = bday[2] + '/' + bday[1] + '/' + bday[0];
                setUser(u);
                setBusy(false);
              }
            });
          }
        }
      }
      getUser();

      return () => {
        setUser({});
      }
    },[])
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
      <SafeAreaView style={[styles.white]} >
        <Header
          backgroundColor='#fff'
          leftComponent={{ 
            icon: 'menu', 
            size: 32,
            color: '#333',
            onPress: () => props.navigation.openDrawer()
          }}
          containerStyle={{
            borderBottomWidth: 0, 
            paddingTop: 0, 
            height: 60
          }}
          centerComponent={{
            text: 'Minha Conta',
            style: { 
              color: '#333',
              fontSize: 22
            }
          }}
        />
        <View>
          <InputScrollView 
            keyboardAvoidingViewProps={{keyboardVerticalOffset: 100}}
            keyboardShouldPersistTaps="handled"
            useAnimatedScrollView={true}
            >
            <View 
              style={[styles.white, styles.mainView]}>
              <View>
                <View style={[styles.alignItemsCenter, imageView]}>
                  <Image 
                    source={{uri: `data:image/gif;base64,${user.image}`}} 
                    style={styles.image} />
                </View>
                <View style={styles.labelInputGroup}>
                  <Text style={styles.label}>Nome Completo</Text>
                  <Text style={styles.input}>{user.name}</Text>
                </View>
                <View style={styles.labelInputGroup}>
                  <Text style={styles.label}>CPF</Text>
                  <Text style={styles.input}>{user.cnpj_cpf}</Text>
                </View>
                <View style={[styles.twoRows, styles.labelInputGroup]}>
                  <View style={[styles.column, styles.labelInputGroup]}>
                    <Text style={styles.label}>Nascimento</Text>
                    <Text style={styles.input}>{user.birthdate}</Text>    
                  </View>
                  <View style={[styles.column, styles.labelInputGroup]}>
                    <Text style={styles.label}>Gênero</Text>
                    <Text style={styles.input}>{user.gender}</Text>
                  </View>
                </View>
                <View style={styles.labelInputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.input}>{user.email}</Text>
                </View>
                <View style={styles.labelInputGroup}>
                  <Text style={styles.label}>Celular</Text>
                  <Text style={styles.input}>{user.mobile}</Text>
                </View>
              </View>
            </View>
          </InputScrollView>
        </View>
      </SafeAreaView>
    )
  );
}