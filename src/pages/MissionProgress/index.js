import React, {useState, useRef} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Overlay } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedLoader from 'react-native-animated-loader';
import LottieView from 'lottie-react-native';
import { getOdoo, connectAPI } from '../../utils/odoo.js';
import { 
  selectBy,
  selectByMultiple, 
  insertData,
  update
} from '../../database/database.js';
import {
  Alert,
  AsyncStorage,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View
} from 'react-native';

import styles from './styles.js';

export default function MissionProgress(props) {
  const [challenges, setChallenges] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mission, setMission] = useState({});
  const [remaining, setRemaining] = useState('');
  const [restante, setRestante] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState({});
  const [missionImage, setMissionImage] = useState(require('../../assets/img/startup.png'));
  const [title, setTitle] = useState('Missão em andamento');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [countDownDate, setcountDownDate] = useState('');
  
  const animation = useRef(null);

  function setQuizzes(quizz_ids, key){
    if(quizz_ids.length > 0){
      return quizz_ids.map((i) => {
        const m = {};
        m.key = i;
        m.name = "Responder Perguntas";
        m.type = "quizz";
        m.mission_id = key;
        m.done = 0;
        return m;
      });
    }

    return [];
  }

  async function getPhotoChallenges(photo_ids, key, odoo){
    if(photo_ids.length > 0){
      const params_photos = {
        domain: [['id', 'in', photo_ids]],
      }

      const photo_challenges = await odoo.search_read('pops.photo.lines', params_photos);

      if(photo_challenges.success){
        return photo_challenges.data.map((i) =>{
          const m = {};
          m.key = i.id;
          m.name = i.name;
          m.type = "photo";
          m.mission_id = key,
          m.done = 0;
          return m;
        });
      }
    }

    return [];
  }

  async function getPriceComparisonChallenges(ids, key, odoo){
    if(ids.length > 0){
      const params = {
        domain: [['id', 'in', ids]],
      }

      const challenges = await odoo.search_read('pops.price_comparison.lines', params);

      if(challenges.success){
        return challenges.data.map((i) =>{
          const m = {};
          m.key = i.id;
          m.name = i.name;
          m.type = "price_comparison";
          m.mission_id = key,
          m.done = 0;
          return m;
        });
      }
    }

    return [];
  }


  async function getChallenges(email, password, mission){
    const odoo = getOdoo(email, password);
    try{
      const res = await connectAPI(odoo);

      if(res.hasOwnProperty('code') && res.code == 1){
        const q_ids = mission.quizz_ids.split(',').map(Number);
        const quizzes_ = setQuizzes(q_ids, mission.key);

        const p_ids = mission.photo_ids.split(',').map(Number);
        const pic = getPhotoChallenges(p_ids, mission.key, odoo);

        const price_comparison_ids = mission.price_comparison_ids.split(',').map(Number);
        const price_comparison_tasks = getPriceComparisonChallenges(price_comparison_ids, mission.key, odoo);

        const promises = quizzes_.concat(pic).concat(price_comparison_tasks).map(async(i)=>{
          return await insertData('challenge', i);
        })

        return Promise.all(promises).then(function(res){
          if(res.length > 1){
            res = res[0].concat(res[1]);
          }

          const tasks = res.map((r) => {
            insertData('challenge', r);
            return r;
          });

          return tasks;
        });
      }else{
        // tratar erro
        setIsLoading(false);
        return [];
      }
    }catch(e){
      console.log(e);
    }
  }

  function Item({ id, type, name, onSelect, done}) {
    const filename = done ? 
      require('../../assets/img/star-fill.png') : 
      require('../../assets/img/star.png');
    return (
      <TouchableOpacity
        onPress={() => onSelect(type, id)}
        style={[
          styles.item
        ]}
      >
        <View style={{flex: 1, flexDirection:'row', marginBottom: 5}}>
          <Image 
            source={filename}
            style={{width: 25, height: 25, marginRight: 10}}/>
          <View>
            <Text style={{
              fontSize: 18, 
              lineHeight: 22, 
              color: '#000'}}
              >{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function onSelect(type, key){
    AsyncStorage.setItem('challenge_id', JSON.stringify({key: key})).then(function(){
      if(type == "quizz"){
        props.navigation.navigate('Quizz');
      }
      else if(type == "price_comparison"){
        props.navigation.navigate('PriceComparison');
      }
      else{
        props.navigation.navigate('AppCamera');
      }
    })
  }

  function getIsVisible(challenges){
    const visible = challenges.filter((c)=>{
      return c.done == 0;
    });

    if(visible.length == 0){
      return true;
    }else{
      return false;
    }
  }

  async function updateMeasurement(odoo, measurement){
    const obj = {};
    try{
      const local = await AsyncStorage.getItem('local');
      if(local !== null){
        const local_obj = JSON.parse(local);
        obj.measurement_latitude = local_obj.latitude;
        obj.measurement_longitude = local_obj.longitude;
      }
    }catch(e){
      console.log(e);
    }

    obj.kanban_state = 'ordered';
    obj.state = 'ordered';
    obj.date_finished = new Date();

    odoo.update('pops.measurement', [parseInt(measurement.key)], obj)
      .then(response => { 
        if(response.success){
          setIsLoading(false);
          update('measurement', {kanban_state: 'ordered'}, 'id', measurement.id).then((r) => {
            setOverlayVisible(true);
            animation.current.play();
          });
        }else{
          Alert.alert('Erro ao enviar missão');
        }
      })
      .catch(e => { 
        console.log(e);
      });
  }

  async function getPhotoLines(challenges, measurement_key){
    const photo_lines = challenges.filter((r) => {
      return r.type == "photo";
    });

    if(photo_lines.length > 0){
      return photo_lines.map(async(it) => {
        if(it.done == 1){
          try{
            const photo = await AsyncStorage.getItem('foto_c'+ it.key);
            const pic = JSON.parse(photo);

            const l = {};
            l.name = it.name;
            l.photo = pic.base64;
            l.photo_id = it.key;
            l.measurement_id = parseInt(measurement_key);
            return l;
          }
          catch(e){
            console.log(e);
          }
        }
      });
    }else{
      return [];
    }
  }

  async function getQuizzLines(challenges, measurement_key){
    const quizz_lines = challenges.filter((r) => {
      return r.type == "quizz";
    });

    if(quizz_lines.length > 0){
      return quizz_lines.map(async(it) => {
        const obj = {measurement_id: measurement_key};
        const _quizzlines = await selectByMultiple('measurement_quizzlines', obj);
        return _quizzlines.rows._array;
      })[0];
    }else{
      return [];
    }
  }

  async function getPriceComparisonLines(challenges, measurement_key){
    const lines = challenges.filter((r) => {
      return r.type == "price_comparison";
    });

    if(lines.length > 0){
      return lines.map(async(it) => {
        const obj = {measurement_id: measurement_key};
        const _lines = await selectByMultiple('price_comparison_line', obj);
        return _lines.rows._array;
      })[0];
    }else{
      return [];
    }
  }

  async function sendMeasurement(odoo, promises, model, errorMessage){
    return Promise.all(promises).then((res) => {
      const mapa = res.map(async(it)=>{
        const r = await odoo.create(model, it);
        if(r.success){
          return true;
        }else{
          return false;
        }
      });

      return Promise.all(mapa).then((r) => {
        if(r.includes(false)){
          Alert.alert(errorMessage);
        }
        return r;
      });
    });
  }

  async function enviar(){
    try{
      setIsLoading(true);

      const odoo = getOdoo(user.email, user.password);
      const res = await connectAPI(odoo);

      try{
        const sel = await selectBy('measurement', 'missions_id', mission.key);
        
        if(sel.rows._array.length > 0){
          const measurement = sel.rows._array[0];
          let send_pic = [];
          let send_quizzes = [];
          let send_prices = [];

          const photo_lines = await getPhotoLines(challenges, measurement.key);
          
          if(photo_lines.length > 0){     
            send_pic = await sendMeasurement(
              odoo,
              photo_lines, 
              'pops.measurement.photolines', 
              'Erro ao enviar fotos'
            );
          }

          const quizz_lines = await getQuizzLines(challenges, measurement.key);
          
          if(quizz_lines.length > 0){
            try{
              send_quizzes = await sendMeasurement(
                odoo,
                quizz_lines, 
                'pops.measurement.quizzlines', 
                'Erro ao enviar quizz'
              );
            }catch(e){
              console.log(e);
            }
          }

          const price_comparison_lines = await getPriceComparisonLines(challenges, measurement.key);

          if(price_comparison_lines.length > 0){
            try{
              send_prices = await sendMeasurement(
                odoo,
                price_comparison_lines, 
                'pops.measurement.price_comparison.lines', 
                'Erro ao enviar preços'
              );
            }catch(e){
              console.log(e);
            }
          }
          
          Promise.all(send_pic.concat(send_quizzes).concat(send_prices)).then((res) => {
            if(!res.includes(false)){
              updateMeasurement(odoo, measurement);
            }
          })
        }
      }catch(e){
        setIsLoading(false);
      }
    }catch(e){
      setIsLoading(false);
    }
  }

  const x = setInterval(function() {
    if(countDownDate !== ''){ 
    // Get today's date and time
      var now = new Date().getTime();
    
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
    
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        setRemaining('TEMPO ESGOTADO');
      }else{
        setRemaining(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
      }
    }
  }, 1000);

  function showChallenges(ch_list){
    const ch = [];

    const ch_ = ch_list.map(function(i){
      if(i.type == "photo" || i.type == "price_comparison"){
        ch.push(i);
      }
      return i;
    });

    const quizz_task = ch_.filter((i) => {
      return i.type == "quizz";
    });

    if(quizz_task.length > 0){
      const quizz_status = quizz_task.filter((i) =>{
        return i.done == 0;
      });

      const q_ = [{
        name: "Responder Perguntas", 
        type: "quizz", 
        done: quizz_status.length == 0 ? 1 : 0
      }]
  
      return ch.concat(q_);
    }else{
      return ch;
    }
  }

  function drawMission(key, u){
    selectBy('mission', 'key', key).then((res)=>{
      if(res.rows._array.length > 0){
        setMission(res.rows._array[0]);
        const miss = res.rows._array[0];

        if(miss.started == "done"){
          setIsLoading(false);
          setOverlayVisible(true);
          animation.current.play();
        }else{
          setcountDownDate(new Date(miss.date_finished).getTime());

          selectBy('challenge', 'mission_id', miss.key).then(async(r) =>{
            if(r.rows.length > 0){
              checkComplete(r.rows._array);
              const ch = showChallenges(r.rows._array);
              setChallenges(ch);
              setIsVisible(getIsVisible(r.rows._array));
              setIsLoading(false);
            }else{
              try{
                const ch_list = await getChallenges(u.email, u.password, miss);
                checkComplete(ch_list);
                const ch = showChallenges(ch_list);
                setChallenges(ch);
                setIsVisible(getIsVisible(ch_list));
                setIsLoading(false);
              }catch(e){
                console.log(e);
              }
            }
          });
        }
      }
    })
  }

  function checkComplete(ch_list){
    const incomplete = ch_list.filter((it) =>{
      return it.done == 0;
    });
    
    if(incomplete.length == 0){
      setMissionImage(require('../../assets/img/astronaut.png'));
      setTitle('Missão Completa');
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      AsyncStorage.getItem('user').then((res) => {
        if(res !== null){
          const u = JSON.parse(res); 
          setUser(u);

          AsyncStorage.getItem('mission_key').then((res) => {
            const key = JSON.parse(res);

            const m_search = {missions_id : key, user_id: u.uid, kanban_state: 'done'};
            selectByMultiple('measurement', m_search).then(function(res){
              if(res.rows.length > 0){
                setIsLoading(false);
                setOverlayVisible(true);
                animation.current.play();
              }else{
                drawMission(key, u);                
              }
            })
          });
        }else{
          props.navigation.navigate('Login');
        }
      });

      return () => {
        clearInterval(x);
        setIsLoading(false);
      }

    },[])
  );

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
          onPress: () => {
            setIsLoaded(!isLoaded);
            props.navigation.navigate('Mapa')
          }
        }}
        containerStyle={{ paddingTop: 50}}
      />
      <ScrollView 
        style={{paddingHorizontal: 35, flex: 1}}  
        contentContainerStyle={{flexGrow: 1}} 
        nestedScrollEnabled={true} >

        <View style={{
          backgroundColor: '#fff', 
          flex: 1, 
          flexDirection:'column', 
          justifyContent:'space-between', 
          paddingHorizontal: 35}}>
          
          <View>
            <Text 
              style={{
                color: '#808080', 
                fontSize: 20, 
                textAlign: 'center', 
                fontWeight: 'bold'}}>{title}</Text>
            <View style={{ alignSelf:'center', marginVertical: 30}}>
              <Image source={missionImage} style={{width: 100, height: 100}}/>
            </View>
          </View>

          <View>
            {challenges.map((item, index) => {
              return (
                <Item
                  id={item.key}
                  key={index}
                  name={item.name}
                  type={item.type}
                  done={item.done}
                  onSelect={onSelect}
                />
              )
            })}
          </View>

          <View style={{
            marginVertical: 10, 
            alignSelf:'center', 
            borderTopWidth: 1, 
            paddingVertical: 20}}>
            <Text style={{
              color: '#808080', 
              textAlign: 'center', 
              fontSize: 16, 
              marginVertical: 20}}>
              Tempo restante para finalizar missão</Text>
            <View style={{height: 26}}>
              <Text style={{
                fontSize: 24, 
                textAlign: 'center', 
                lineHeight: 40, 
                fontWeight: 'bold' }}>{ remaining }</Text>
            </View>
            <View style={{height: 26}}>
              <Text style={{
                fontSize: 24, 
                textAlign: 'center', 
                lineHeight: 40, 
                color: 'red',
                fontWeight: 'bold' }}>{ restante }</Text>
            </View>
          </View>

          {isVisible && <TouchableHighlight
            style={styles.button}
            onPress={() => {
              enviar()
            }}
            underlayColor="#fff">
            <Text style={styles.submitText}>Enviar</Text>

          </TouchableHighlight>}
        </View>
      </ScrollView>

      <Overlay isVisible={overlayVisible} fullScreen={true}>
        <View style={{
          justifyContent :'center', 
          alignItems: 'center',
          padding: 35,
          flex: 1}}>
          <LottieView
            ref={animation}
            style={styles.checkLottie}
            source={require('../../assets/lottie/433-checked-done.json')}
            loop={false}
            speed={1}
          />
          <Text 
            style={{fontSize: 20, textAlign: 'center', margin: 35 }}>
              Sua missão foi enviada com sucesso. O sistema está processando.</Text>
          <TouchableHighlight
            style={styles.button}
            onPress={() => {
              setOverlayVisible(false);
              props.navigation.navigate('Mapa');
            }}
            underlayColor="#fff">
            <Text style={styles.submitText}>Ok</Text>
          </TouchableHighlight>
        </View>
      </Overlay>
            
    </SafeAreaView>
    )
  );
}
