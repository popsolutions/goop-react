import React, {useState} from 'react';
import {
  AsyncStorage,
  FlatList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  View
} 
from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import { SafeAreaView } from 'react-native-safe-area-context';
import {Header, Icon} from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { getOdoo, connectAPI } from '../../utils/odoo.js';
import { 
  selectBy, 
  insertData, 
  update,
  selectAll,
  selectByMultiple } 
from '../../database/database.js';

import styles from './styles.js';

export default function Quizz(props) {
  const [key, setKey] = useState({});
  const [user, setUser] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setVisible] = useState(false);
  const [measurement, setMeasurement] = useState(null);

  function onSelect(id, option){
    console.log(id);
    console.log(option);
    const que = questions.map(function(item){
      console.log(item);
      if(item.key == id){
        item.alternatives.forEach(function(it){
          if(it.id == option){
            it.selected = true;
          }else{
            it.selected = false;
          }
        })

        const alt = item.alternatives.filter((it)=>{
          return it.selected == true;
        });

        item.done = true;
        // console.log('alt ' + JSON.stringify(alt));
      }
      return item;
    });
    // console.log(que);
    setQuestions(que);

    const visible = que.filter((item)=>{
      return item.done !== true;
    });

    if(visible.length == 0){
      setVisible(true);
    }else{
      setVisible(false);
    }
  }

  function getAlternatives(odoo, ids) {
    console.log('getAlternatives');
    const params_answers = {
      domain: [['id', 'in', ids]]
    }

    return odoo.search_read('pops.quizz.lines', params_answers)
      .then(function(r){
        if(r.success){  
          const alternatives = r.data.map((item) => {
            const a = {};
            a.id = item.alternative_id[0];
            a.name = item.alternative_id[1];
            a.selected = false;
            return a;
          });
          console.log(alternatives);
          return alternatives;
        }
      });
  }

  async function getTodos(promise_array){
    console.log('getTodos');

    const r = await Promise.all(promise_array);
    console.log(r);
    return r;
  }

  async function getQuizzes(email, password, mission, measurement_key){
    console.log('getQuizzes');

    const odoo = getOdoo(email, password);

    try{
      const res = await connectAPI(odoo);

      // const ch_params = {mission_id: mission.key, type: 'quizz'};

      // const challenges = await selectByMultiple('challenge', ch_params);

      // if(challenges.rows.length == 0){
        const params_quizz = {
          domain: [['id', 'in', mission.quizz_ids.split(',').map(Number)]]
        }
  
        return odoo.search_read('pops.quizz', params_quizz)
          .then((res) => {
            console.log(res);

            if(res.success){
              let qanda = [];

              res.data.forEach(item => {
                qanda.push(getAlternatives(odoo, item.quizz_line_ids));
              });

              getTodos(qanda).then(function(r){
                const questions_ = res.data.map((item, idx) => {
                  const q = {};
                  q.key = item.id;
                  q.id = item.id;
                  q.name = item.name;
                  q.measurement_id = measurement_key;
                  q.missions_id = mission.key;
                  q.alternatives = r[idx];
                  return q;
                })              

                setQuestions(questions_);

                setIsLoading(false);
              }) 
            }else{
              console.log(res);
              return [];
            }
          });
      // }else{
      //   selectBy('quizz', 'key', challenges.rows._array[0].key).then((r)=>{
      //     console.log(r);
      //   })
      // }
    }catch(e){
      console.log(e);
    }
  }

  async function getItem(name){
    const r = await AsyncStorage.getItem(name);
    return JSON.parse(r);
  }

  async function salvar(){
    // console.log(questions);
    // console.log(measurement);

    const m = questions.map((it) => {
      const q = {};

      const answer = it.alternatives.filter((r) => {
        return r.selected == true;
      });

      q.alternative_id = answer[0].id;
      q.quizz_id = it.key;
      q.measurement_id = parseInt(measurement.key);

      const insert = insertData('measurement_quizzlines', q);
      const findChallenge = selectByMultiple('challenge', {key: it.key});
      
      console.log('findChallenge ' + JSON.stringify(findChallenge));
      
      const up = update('challenge', {done: 1}, 'key', it.key);
      return q;
    });
  
    Promise.all(m).then(function(res){
      console.log(res);
      
      // selectAll('quizz').then(function(R){
      //   console.log(r);
      // })
      // console.log('_quizz ' + JSON.stringify(_quizz));
      // const _chh = selectAll('challenge');
      // console.log('_chh ' + JSON.stringify(_chh));
      // console.log('findChallenge ' + JSON.stringify(challenge));

      props.navigation.navigate('MissionProgress');
    });

  }

  function Item({ key, id, name, alternatives, onSelect }) {
    return (
      <View style={{backgroundColor: '#fff', padding: 25}}>
        <View style={{ paddingVertical: 10}}>
          <Text style={{
            color: '#000', 
            paddingHorizontal: 20, 
            paddingVertical: 10, 
            fontSize: 18, 
            lineHeight: 20, 
            textAlign:'center'}}>{key} {name}</Text>
            {
              alternatives.map((it)=>{
                console.log('alternatives ' + JSON.stringify(it));
                return (
                  <TouchableOpacity
                    key={it.id}
                    onPress={() => onSelect(id, it.id)}
                    style={[
                      { paddingHorizontal: 50, paddingVertical: 10 },
                    ]}
                    >
                    <View style={{flexDirection: 'row'}}>
                      <Icon name={ it.selected ? 'radio-button-checked' : 'radio-button-unchecked'}/>
                      <Text style={{fontSize: 16, paddingHorizontal: 10}}>{it.name}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })
            }
        </View>
      </View>
    );
  }

  useFocusEffect(
    React.useCallback(() => {
      // setQuestions([]);
      console.log('Quizz');

      const getData = async () => {
        const key_ = await getItem('mission_key');
        setKey(key_);

        if(questions.length == 0){
          try{
            const res = await getItem('user');
            if(res == null){
              props.navigation.navigate('Login');
            }
            else{
              setUser(res);
              
              const u = res;
              const obj = {'missions_id': key_, 'user_id': u.uid};
              
              selectAll('measurement').then(function(res){
                console.log(res)
              });

              const measurement_ = await selectByMultiple('measurement', obj);
              console.log('measurement ' + JSON.stringify(measurement_));

              if(measurement_.rows._array.length > 0){
                setMeasurement(measurement_.rows._array[0]);
                const measurement_item = measurement_.rows._array[0];
                const dbMission = await selectBy('mission', 'key', key_);
                if(dbMission.rows._array.length > 0){
                  getQuizzes(u.email, u.password, dbMission.rows._array[0], measurement_item.key);
                }
              }
            }
          }catch(e){
            console.log(e);
          }
        }
      }

      getData();
      
    }, [])
  )

  return (
    
      <SafeAreaView 
        style={[styles.white, { flexGrow: 1, marginTop:Platform.OS === 'ios' ? 0 : -50 }]} >
        <Header
          backgroundColor='#fff'
          leftComponent={{ 
            icon: 'keyboard-arrow-left', 
            size: 36,
            color: '#333',
            onPress: () => {
              setIsLoading(true);
              // setQuestions([]);
              console.log('press');
              props.navigation.navigate('MissionProgress');
            }
          }}
          containerStyle={{ 
            paddingTop: 50, 
          }}
        />
        { questions && questions.length == 0 ? (
            <AnimatedLoader
              visible={true}
              overlayColor="rgba(255,255,255,0.75)"
              source={require('../../assets/loader/loader.json')}
              animationStyle={styles.lottie}
              speed={1}
            />
          ) : (
            <View style={{flex: 1, flexGrow: 1, backgroundColor: '#fff'}}>
          <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fff'}}>Perguntas</Text>
          <FlatList
            data={questions}
            renderItem={({ item }) => (
              <Item
                id={item.key}
                name={item.name}
                alternatives={item.alternatives}
                onSelect={onSelect}
              />
            )}
            keyExtractor = { (item, index) => index.toString() }
            style={{flex: 1}}
          />
          {isVisible && (<TouchableHighlight
            style={styles.button}
            onPress={() => {
              salvar()
            }}
            underlayColor="#fff">
            <Text style={styles.submitText}>Enviar</Text>
          </TouchableHighlight>)}
        </View>
          )
        }
      </SafeAreaView>
  )
}
