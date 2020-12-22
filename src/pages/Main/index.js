import React, {useState} from 'react';

import Account from '../Account';
import AppCamera from '../AppCamera';
import Config from '../Config';
import Faq from '../Faq';
import Mapa from '../Mapa';
import Mission from '../Mission';
import MissionsList from '../MissionsList';
import MissionProgress from '../MissionProgress';
import Quizz from '../Quizz';
import Wallet from '../Wallet';
import PriceComparison from '../PriceComparison';

import { SafeAreaView } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';

import {
  AsyncStorage,
  Image,
  Text,
  TouchableOpacity,
  View, 
} from 'react-native';

import {ButtonGroup} from 'react-native-elements';
import { selectBy, dropDatabase } from '../../database/database.js';

import styles from './styles.js';

const Drawer = createDrawerNavigator();

export default function Main(props) {
  const [user, setUser] = useState({});
  const buttons = ['Missões','Mapa'];
  const [index, setIndex] = useState(1);

  function updateScreen(idx){
    // if(idx !== index){
      if(idx == 0){
        setIndex(0);
        props.navigation.navigate('MissionsList');
      }
      if(idx == 1){
        setIndex(1);
        props.navigation.navigate('Mapa');
      }
    // }
  }

  function CustomDrawerContent(props) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
          <View style={{backgroundColor: '#e40063', flex: 1, minHeight: 70 }}>
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
              <View style={{ marginLeft: 10, flex: 1}}>
                <Text style={{color: 'white', }}>{user.name}</Text>
              </View>
            </View>
            <View>
            <Text style={{
              color: 'white', 
              textAlign: 'center', 
              marginVertical: 5}}>Missões cumpridas {parseInt(user.missions_count)}</Text>
            </View>
            <View style={{ marginVertical: 15, paddingHorizontal: 20 }}>
              <ButtonGroup
                selectedButtonStyle={{backgroundColor: '#fff'}}
                selectedTextStyle={{color: '#e40063'}}
                buttonStyle={{backgroundColor: '#e40063'}}
                textStyle={{color: '#fff'}}
                onPress={updateScreen}
                selectedIndex={index}
                buttons={buttons}
                containerStyle={{height: 40}}
              />
            </View>
          </View>
          <View style={{backgroundColor: 'white', flex: 2, justifyContent: 'flex-start'}} >
            <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuItemContent} 
                onPress={() => {
                  props.navigation.navigate('Wallet');
                }}>
                <Image
                  source={require('../../assets/img/menu/wallet.png')}
                  style={styles.menuItemImage}
                />
                <Text style={styles.menuItemText}>Carteira</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuItemContent} 
                onPress={() => {
                  props.navigation.navigate('Account');
                }}>
                <Image
                  source={require('../../assets/img/menu/card.png')}
                  style={styles.menuItemImage}
                />
                <Text style={styles.menuItemText}>Minha Conta</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuItemContent} 
                onPress={() => {
                  console.log('noti')
                }}>
                <Image
                  source={require('../../assets/img/menu/bell.png')}
                  style={styles.menuItemImage}
                />
                <Text style={styles.menuItemText}>Notificações</Text>
              </TouchableOpacity>
            </View> */}
            <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuItemContent} 
                onPress={() => {
                  props.navigation.navigate('Faq');
                }}>
                <Image
                  source={require('../../assets/img/menu/speak.png')}
                  style={styles.menuItemImage}
                />
                <Text style={styles.menuItemText}>FAQ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuItemContent} 
                onPress={() => {
                  props.navigation.navigate('Config');
                }}>
                <Image
                  source={require('../../assets/img/menu/gear.png')}
                  style={styles.menuItemImage}
                />
                <Text style={styles.menuItemText}>Configurações</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuItemContent} 
                onPress={() => {
                  AsyncStorage.removeItem('user', (err, result) =>{
                    AsyncStorage.multiRemove(['user','challenges']).then(function(r){
                      dropDatabase();
                    }).then(()=>{
                      setUser({});
                      props.navigation.navigate('Login');
                    });
                  });
                }}>
                <Image
                  source={require('../../assets/img/menu/exit.png')}
                  style={styles.menuItemImage}
                />
                <Text style={styles.menuItemText}>Sair</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuItemContent} 
                onPress={() => {
                  props.navigation.navigate('Cadastro2');
                }}>
                <Text style={styles.menuItemText}>CADASTRO2</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  async function getUser(){
    const res = await AsyncStorage.getItem('user');
    if(res !== null){
      const u = JSON.parse(res);
      console.log(u.id);

      selectBy('user', 'uid', u.uid).then((res)=>{
        console.log(res);

        if(res.hasOwnProperty('rows') && res.rows._array.length > 0){
          setUser(res.rows._array[0]);

          console.log(res.rows._array[0]);
        }
      });
    }
  }
  
  useFocusEffect(() => {
    console.log('Main');

    if(Object.keys(user).length == 0){
      getUser();
    }
  });

  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>      
      <Drawer.Screen name="Mapa" component={Mapa} />
      <Drawer.Screen name="Account" component={Account} />
      <Drawer.Screen name="MissionsList" component={MissionsList} />
      <Drawer.Screen name="Mission" component={Mission} />
      <Drawer.Screen name="MissionProgress" component={MissionProgress} />
      <Drawer.Screen name="AppCamera" component={AppCamera} />
      <Drawer.Screen name="Quizz" component={Quizz}/>
      <Drawer.Screen name="Wallet" component={Wallet}/>
      <Drawer.Screen name="Faq" component={Faq}/>
      <Drawer.Screen name="Config" component={Config}/>
      <Drawer.Screen name="PriceComparison" component={PriceComparison}/>
    </Drawer.Navigator>
  );
}
