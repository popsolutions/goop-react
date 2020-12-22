import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { getOdoo, connectAPI } from '../../utils/odoo.js';
import AnimatedLoader from "react-native-animated-loader";
import { insertData, selectBy, update } from '../../database/database.js';

import {
  Alert,
  AsyncStorage,
  FlatList,
  Modal,
  Image,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  View, 
} from 'react-native';

import styles from './styles.js';

export default function Mission(props) {
  const [mission, setMission] = useState({});
  const [user, setUser] = useState({});
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  async function getItem(name){
    const r = await AsyncStorage.getItem(name);
    return JSON.parse(r);
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log('Mission')

      setIsLoading(true);
      let isLoaded = true;

      async function load(){
        const u = await getItem('user');
        setUser(u);

        const id = await getItem('mission_key');

        console.log(id);

        selectBy('mission', 'key', id).then(async(res)=>{
          console.log(res);
          const m = res.rows._array[0];

          m.remaining = getRemaining(new Date(m.date_finished).getTime());

          setMission(m);

          const existent_ch = await selectBy('challenge', 'mission_id', m.key);

          console.log('existent_ch');
          console.log(existent_ch);

          if(existent_ch.rows._array.length == 0){

            const ch = await getChallenges(u.email, u.password, m);

            console.log('ch ' + JSON.stringify(ch));

            setChallenges(ch);
            setIsLoading(false);
          }else{
            const challenges = existent_ch.rows._array.reduce(function(total, item) {
              if(item.type == "photo" || item.type == "price_comparison") {
                total.push(item);
              }else{
                if(item.type = "quizz"){
                  if(total.filter((i)=>{ return i.type == "quizz";}).length == 0){
                    total.push(item);
                  }
                }
              }
              return total;
            }, []);

            setChallenges(challenges);
            setIsLoading(false);
          }
        });
      }

      if(isLoaded){
        load(isLoaded);
      }

      return () => {
        isLoaded = false;
      };
      
    }, [])
  );

  function getRemaining(countDownDate){
    var now = new Date().getTime();
    var distance = countDownDate - now;
  
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
    if (distance < 0) {
      return 'TEMPO ESGOTADO';
    }else{
      return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }
  }

  async function formatQuizzTasks(quizz_ids, key){
    if(quizz_ids.length > 0){
      console.log(quizz_ids);

      const quizzes = quizz_ids.split(',').map(Number);

      const promises = quizzes.map(async (it) => {
        const m = {};
        // m.id = it;
        m.key = it;
        m.name = "Responder Perguntas";
        m.type = "quizz";
        m.mission_id = key;
        m.done = 0;
        await insertData('challenge', m);
      });

      await Promise.all(promises);

      const m = {};

      m.id = quizz_ids;
      m.name = "Responder Perguntas";
      m.type = "quizz";
      m.done = 0;

      return [m];
    }else{
      return [];
    }
  }

  async function formatPhotoTasks(photo_ids, key, odoo){
    if(photo_ids.length > 0){
      const params_photos = {
        domain: [['id', 'in', photo_ids.split(',').map(Number)]],
      }

      const photo_challenges = odoo.search_read('pops.photo.lines', params_photos)
        .then(response => { 

          if(response.success){

            const promises = response.data.map(async(i) => {
              const m = {};
              m.key = i.id;
              m.mission_id = key,
              m.name = i.name;
              m.type = "photo";
              m.done = 0;

              await insertData('challenge', m);
              
              return m;
            });

            return Promise.all(promises);
          }
        })
        .catch(e => { 
          console.log('error search_read ');
          console.log(e);
          return [];
        });

      return photo_challenges;
    }else{
      return [];
    }
  }

  async function formatPriceComparisonTasks(price_comparison_ids, key, odoo){
    if(price_comparison_ids.length > 0){
      const params = {
        domain: [
          ['id', 'in', price_comparison_ids.split(',').map(Number)]
        ],
      }

      const tasks = odoo.search_read('pops.price_comparison', params)
        .then(response => { 
          console.log('price comparison challenges');

          if(response.success){
            const promises = response.data.map(async(i) => {
              const m = {};
              m.key = i.id;
              m.name = "Comparar Preços";
              m.type = "price_comparison";
              m.mission_id = key;
              m.done = 0;
              await insertData('challenge', m);
              return m;
            });

            return Promise.all(promises);
          }
        });

      return tasks;
    }else{
      return [];
    }
  }

  async function getChallenges(email, password, mission){
    console.log('getChallenges Mission');

    const odoo = getOdoo(email, password);
    const res = await connectAPI(odoo);

    let tasks = [];

    console.log(res);

    if(res.code){      
      quizz_tasks = await formatQuizzTasks(mission.quizz_ids, mission.key);

      console.log('quizz_tasks');
      console.log(quizz_tasks);

      photo_tasks = await formatPhotoTasks(mission.photo_ids, mission.key, odoo);

      console.log('photo_tasks');
      console.log(photo_tasks);

      price_comparison_tasks = await formatPriceComparisonTasks(mission.price_comparison_ids, mission.key, odoo);

      console.log('price_comparison_tasks');
      console.log(price_comparison_tasks);

      const ret = [...quizz_tasks, ...photo_tasks, ...price_comparison_tasks];

      console.log('ret');
      console.log(ret);

      return ret;
    }else{
      // tratar erro
      setIsLoading(false);
      return tasks;
    }
  }

  async function startChallenge(){
    console.log('startChallenge');
    const odoo = getOdoo(user.email, user.password);

    const res = await odoo.connect();
    
    const measurement = {
      name: mission.name,
      missions_id: mission.key, 
      user_id: user.uid, 
      date_started: new Date()
    }

    odoo.create('pops.measurement', measurement)
      .then(res => {
        console.log(res);
        if(res.success){
          console.log(res.data);

          measurement.key = res.data;
          measurement.kanban_state = 'draft';
          measurement.approved = false;
          measurement.paid = false;

          delete(measurement.date_started);

          insertData('measurement', measurement).then(async (res) => {
            console.log(res);
            try{
              const obj = {status: 'doing'};
              const up = await update('mission', obj, 'key', mission.key);
              console.log(up);
              if(up.rowsAffected == 1){
                console.log('GO TO MISSION PROGRESS');
                // props.navigation.navigate('MissionProgress');
              }
            }catch(e){
              console.log(e)
            }
          });

        // AsyncStorage.getItem('missions').then(function(r){
          
        //   const missions = JSON.parse(r);
      
        //   const _missions = missions.map(function(item){
        //     if(item.key == mission.key){
        //       item.status = "doing";
        //       item.measurement = res.data;
        //       setMission(item);
        //       console.log('\n********\nITEM\n********\n' + JSON.stringify(item));
        //       AsyncStorage.setItem('mission',JSON.stringify(item));
        //     }
        //     return item;
        //   });

        //   // console.log('\n********\nMISSIONS\n********\n' + JSON.stringify(item));
        //   AsyncStorage.setItem('missions',JSON.stringify(_missions));
        // });
        
        // return true;
      }else{
        throw res;
      }
    })
    .catch(e => {
      console.log(e);
      return false;
    })

    return res;
  }

  function Item({ name }) {
    return (
        <View style={[styles.item,{flex: 1, flexDirection:'row', marginBottom: 5}]}>
          <Image 
            source={require('../../assets/img/star.png')}
            style={{width: 25, height: 25, marginRight: 10}}/>
          <View>
            <Text style={{
              fontSize: 18, 
              lineHeight: 25, 
              color: '#000'}}
              >{name}</Text>
          </View>
        </View>
    );
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

    <SafeAreaView style={[styles.white, { flexGrow: 1, marginTop:Platform.OS === 'ios' ? 0 : -50 }]} >
      <Header
        backgroundColor='#fff'
        leftComponent={{ 
          icon: 'keyboard-arrow-left', 
          size: 36,
          color: '#333',
          onPress: () => props.navigation.navigate('MissionsList')
        }}
        containerStyle={{ paddingTop: 50}}
      />
      <ScrollView 
        style={{paddingHorizontal: 35, flex: 1}}  
        contentContainerStyle={{flexGrow: 1}} 
        nestedScrollEnabled={true} >
        <View style={{
          flex: 1,
          paddingBottom: 10
          }}>
          <View style={{
            flexGrow: 1, 
            paddingHorizontal: 20, 
            paddingBottom: 5, 
            borderBottomWidth: 1 }}>
            <Text style={{ 
              color: '#000', 
              fontSize: 20, 
              textAlign: 'center', 
              marginVertical: 10, 
              fontWeight: 'bold', 
              textTransform: 'uppercase' }}>{mission.subject}</Text>
            <Text 
              style={{ 
                color: '#000', 
                fontSize: 14, 
                textAlign: 'center' }}>{mission.address}</Text>
            <Text 
              style={{ 
                color: '#000', 
                fontSize: 14, 
                textAlign: 'center' }}>{mission.neighbor} - {mission.city}</Text>
            <View >
              <TouchableOpacity
                // style={styles.button}
                onPress={() => {
                  setModalVisible(true)
                }}>
                <View style={{ 
                  flex: 1, 
                  flexDirection: 'row', 
                  marginVertical: 25, 
                  justifyContent: 'center' }}>
                  <Image 
                    source={require('../../assets/img/instructions.png')}
                    style={{width: 25, height: 25, marginRight: 10}}/>
                  <Text style={{ color: '#000', fontSize: 14, textAlign: 'center' }}>Como executar a Missão</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexGrow: 1, marginVertical: 10, paddingVertical: 20}}>
            <View>
              <Text style={{fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>DESAFIOS</Text>
            </View>
            <View>
              {challenges.map((item, index) => {
                console.log(item);
                return (
                  <Item
                    name={item.name}
                    type={item.type_mission}
                    key={index}
                  />
                )
              })}
            </View>
          </View>
          <View style={{flexGrow: 1 }}>
            <View style={{ borderBottomWidth: 1, paddingVertical: 15}}>
              <Text style={{fontSize: 16, textAlign: 'center', color: '#808080', marginBottom: 10}}>Tempo restante para finalizar missão</Text>
              <Text style={{fontSize: 24, textAlign: 'center', lineHeight: 40 }}>{ mission.remaining }</Text>
            </View>
            <View style={[styles.button, {marginTop: 30, backgroundColor: '#e40063', borderRadius: 30}]}>
              <Text style={{textAlign: 'center', color: '#fff'}}>R$ {mission.reward}</Text>
            </View>
            { (mission.started !== true) && (
              <View>
                <TouchableHighlight
                  style={styles.button}
                  onPress={() => {
                    startChallenge().then(function(){
                      AsyncStorage.setItem('mission_key', JSON.stringify(mission.key)).then((res) => {
                        props.navigation.navigate('MissionProgress');
                      })
                    })
                  }}
                  underlayColor="#fff">
                  <Text style={styles.submitText}>Iniciar</Text>
                </TouchableHighlight>
              </View>)}
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={{ position: 'absolute', right: 15, top: 20 }}>
              <Icon 
                name='add-circle-outline'
                size={40}
                color='#c0c0c0'
                iconStyle={{ transform: [{ rotate: '45deg' }]}}
                onPress={() => {
                  setModalVisible(false);
                }}
              />
            </View>
            <View style={styles.modalView}>
              <Text style={styles.modalTitleText}>COMO EXECUTAR A MISSÃO</Text>
              <Text style={styles.modalText}>{mission.instructions}</Text>

              <TouchableHighlight
                style={styles.modalButton}
                underlayColor="rgba(228, 0, 99, 0.5)"
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.modalButtonText}>Entendi</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
    
    )
  );
}
