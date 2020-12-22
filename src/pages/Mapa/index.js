import React, {useState} from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import RNLocation from 'react-native-location';
import { useFocusEffect } from '@react-navigation/native';
import {Header} from 'react-native-elements';
import AnimatedLoader from "react-native-animated-loader";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOdoo, connectAPI } from '../../utils/odoo.js';
import { 
  insertData, 
  selectAll, 
  selectBy,
  selectByMultiple,
  update, 
  deleteData 
} from '../../database/database.js';

import {
  Alert, 
  AsyncStorage, 
  BackHandler,
  Dimensions,
  Platform,
  Text,
  View
} from 'react-native';

import styles from './styles.js';

const mapaStyle = [
  {
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#f9b84c',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#f9b84c',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#f9b84c',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#f9b84c',
      },
    ],
  },
  {
    featureType: 'landscape.natural.landcover',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#f0b34b',
      },
    ],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#e1a645',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#d6d6d6',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#c0c0c0',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ebebeb',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#5c99ff',
      },
    ],
  },
];

function storeData(name, object){
  AsyncStorage.mergeItem(name, JSON.stringify(object), () => {
    AsyncStorage.getItem(name, (err, result) => {
      //console.log(result);
      return result;
    });
  });
}

export default function Mapa(props) {
  const [marker, setMarker] = useState();
  const [region, setRegion] = useState({latitudeDelta: 0.0922,longitudeDelta: 0.0421});
  const [busy, setBusy] = useState(true);
  const [missions, setMissions] = useState([]);
  const [user, setUser] = useState({});
  const [loadMissions, setLoadMissions] = useState(false);

  // Get current device location and set Marker on Map
  async function getLocationAsync(){
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse"
      }
    }).then(granted => {
      if (granted) {
        RNLocation.getLatestLocation({ timeout: 60000 })
          .then(latestLocation => {
            // Use the location here
          // })
          // let geo = await RNLocation.getCurrentPositionAsync({
          //   distanceInterval: 2,
          //   maximumAge: 60000
          // });

          // const region = {
          //   latitude: geo.coords.latitude, 
          //   longitude: geo.coords.longitude, 
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421
          // };

          // setRegion(region);

          // AsyncStorage.setItem('local', JSON.stringify(region)).then(() => {
          //   setBusy(false);
          // })

          setMarker(<Marker
            coordinate={latestLocation.coords}
            title="Você está aqui"
            description="Sua Localização"
          />);

          return latestLocation;
        })
      }
    });
  }

  /**
   * Get Mission Measurements from current user.
   *
   * @return status
   */
  async function getMeasurements(odoo, uid, partner_id, id){

    const params_measurement = {
      domain: [
        ['partner_id', '=', partner_id], 
        ['missions_id','=',id]
      ],
    }

    try{
      const res = await odoo.search_read('pops.measurement', params_measurement);
      if(res.success == true){
        if(res.data.length > 0){
          const found_measurement = res.data[0];

          const measurement = {
            name: found_measurement.display_name,
            missions_id: found_measurement.missions_id[0], 
            user_id: uid, 
            key: found_measurement.id,
            kanban_state: found_measurement.kanban_state,
            approved: found_measurement.approved,
            paid: found_measurement.paid
          }

          console.log('found_measurement ');
          console.log(found_measurement);
          console.log('price_comparison_lines_ids');
          console.log(found_measurement.price_comparison_lines_ids);

          // if(found_measurement.hasOwnProperty('price_comparison_lines_ids')){
          //   const search_params = {
          //     domain: [
          //       ['measurement_id', 'in', found_measurement.price_comparison_lines_ids]
          //     ]
          //   };

          //   console.log(search_params);

          //   const price_comparsion_lines = await odoo.search_read('pops.measurement.price_comparison.lines', search_params);

          //   console.log('price_comparsion_lines');
          //   console.log(price_comparsion_lines)
          // }

          try{
            const savedMeasurement = await selectBy('measurement', 'key', measurement.key);

            if(savedMeasurement.rows.length == 0){
              const res_ = await insertData('measurement', measurement);
              return measurement.kanban_state;
            }
            else{
              const res_ = await update('measurement', measurement, 'key', measurement.key);
              return measurement.kanban_state;
            }            
          }catch(e){
            console.log(e);
            return undefined;
          }
        }else{
          return 'open';
        }
      }else{
        console.log(res);
        return undefined;
      } 
    }catch(e){
      console.log(e);
    }
    // }).catch(e => { 
    //console.log('getMeasurement error ' + JSON.stringify(e)) 
    // });
  }

  async function insertOrUpdateMission(item, existent){
    console.log('insertOrUpdateMission');

    const it = item;

    console.log('item');
    console.log(item);
    
    const status = item.status;

    console.log('status');
    console.log(item.status);

    it.establishment_id = item.establishment_id[0];
    it.establishment_name = item.establishment_id[1];
    it.photo_ids = item.photo_ids.join(',');
    it.quizz_ids = item.quizz_ids.join(',');
    it.price_comparison_ids = item.price_comparison_ids.join(',');
    it.reward = parseFloat(item.reward).toFixed(2);
    it.status = '';

    if(existent.includes(it.key)){
      try{
        const up = await update('mission', it, 'key', it.key);
        if(up.rowsAffected == 1){
          it.status = await status;
          console.log(it.status);
          const up3 = await update('mission', it, 'key', it.key);
          return up3;
        }
      }catch(e){
        console.log('e: ' + JSON.stringify(e));
      }
    }else{
      try{
        const res = await insertData('mission',item);
        if(res){
          const up = await update('mission', it, 'key', it.key);
          it.up = up;
          it.status = await status;
          delete(it.up);
          const up2 = await update('mission', it, 'key', it.key);
          return up2;
        }
      }catch(e){
        console.log('e: ' + JSON.stringify(e));
      }
    }
  }

  function insertMissions(odoo, uid, partner_id, missions, geo, existent){
    console.log('insertMissions');
    console.log('missions_list ');

    const missions_list = missions.map((item) => {
      const m = {};
      console.log('\n');
      console.log(m);
      m.key = item.id;
      m.name = item.name;
      m.subject = item.subject;
      m.type_mission = item.type_mission;
      m.instructions = item.instructions;
      m.date_finished = item.date_finished;
      // m.closed = item.closed;
      m.photo_ids = item.photo_ids;
      m.quizz_ids = item.quizz_ids;
      m.price_comparison_ids = item.price_comparison_ids;
      m.reward = item.reward;
      m.scores = item.scores;
      m.establishment_id = item.establishment_id;
      return m;
    });

    const estab_ids = missions_list.map((m) => {
      return m.establishment_id[0];
    })

    if(estab_ids.length > 0){
      const params = {
        domain: [['id', 'in', estab_ids]],
      }

      odoo.search_read('pops.establishment', params).then(res => {
        if(res.success){
          
          if(res.data.length > 0){
            const result = missions_list.map(m => {
              const address = res.data.find(d=> d.id === m.establishment_id[0]);
              m.address = address.address; 
              m.neighbor = address.neighbor;
              m.city = address.city;
              m.state = address.state;
              m.latitude = parseFloat(address.latitude);
              m.longitude = parseFloat(address.longitude);
              m.reward = parseFloat(m.reward).toFixed(2);
              m.distance = getDistanceFromLatLonInKm(m.latitude, m.longitude, geo.latitude, geo.longitude);
              return m; 
            });

            const promises = [];

            result.forEach((item) => {
              promises.push(
                insertOrUpdateMission(item, existent).then(async(res)=>{
                  return getMeasurements(odoo, uid, partner_id, item.key).then((res)=>{
                    console.log('getMeasurements res');
                    console.log(res);
                    return update('mission', {status: res}, 'key', item.key).then((r)=>{
                      return r;
                    })
                  });
                })
              )
            });

            Promise.all(promises).then(function(res){
              //console.log('PROMISE.ALL ' + JSON.stringify(res));
              getLocalMissions();
            })            
          }
        }
      });
    }
    // });
  }

  function getLocalMissions(){
    selectAll('mission').then(function(res){
      if(res.rows.length > 0){
        setMissions(res.rows._array);
      }
    });
  }

  async function getMissions(email, password, partner_id, geo){
    console.log('getMissions');
    try{
      let existent = [];
      let existent_list = [];

      const existent_res = await selectAll('mission');

      console.log('existent_res ' + JSON.stringify(existent_res));

      if(existent_res.rows.length > 0){
        existent = existent_res.rows._array.map((it)=>{
          return it.key;
        });
      }
    
      const odoo = getOdoo(email, password);
      
      try{
        const res = await connectAPI(odoo);

        if(typeof(res) !== undefined){
          if(res.hasOwnProperty('code') && res.code == 1){
            const uid = res.uid;

            if(existent.length > 0){
              try{
                let params = {
                  domain: [
                    ['id', 'in', existent],
                  ],
                }

                const _existent = await odoo.search_read('pops.missions', params)
                  .then(response => { 
                    if(response.success){
                      const r = response.data.map((it)=>{
                        if(it.closed || it.measurement_count >= it.limit || new Date(it.date_finished) <= new Date()){
                          const obj = {user_id: uid, missions_id: it.id};
                          selectByMultiple('measurement', obj).then(function(res){
                            if(res.rows.length == 0){
                              deleteData('challenge', 'mission_id', it.id).then((r)=>{
                                deleteData('mission', 'key', it.id)
                                  .then(function(res){
                                    if(res.rowsAffected == 1){
                                      return res;
                                    }
                                  });
                              })
                            }
                          });
                        }else{
                          return it;
                        }
                      });

                      return r;
                    }else{
                      console.log(response);
                    }
                  });

                console.log('_existent ' + JSON.stringify(_existent));

                existent_list = _existent.filter((it)=>{
                  return it != false;
                });
              }catch(e){
                console.log(e);
              }
            }

            const params_new = {
              domain: [
                ['id', 'not in', existent],
                ['closed', '=', false],
                ['state', '=', 'open'],
                ['date_finished', '>=', new Date()]
              ],
            }

            const new_ = await odoo.search_read('pops.missions', params_new)
              .then(response => { 
                console.log('response new ');
                console.log(JSON.stringify(response));
                if(response.success){
                  return response.data;
                }
              })
              .catch(e => { 
                console.log('error search_read _new '+ JSON.stringify(e));
                return [];
              });
                          
            const complete_list = existent_list.concat(new_).filter((i)=>{
              return typeof(i) !== 'undefined' && i.hasOwnProperty('id');
            });
              
            insertMissions(odoo, uid, partner_id, complete_list, geo, existent);
          }
        }
      }catch(e){
        console.log(e);
        Alert.alert('Problemas ao conectar com o servidor');
      }
    }catch(e){
      console.log(e);
    }

  }

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d.toFixed(2);
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  useFocusEffect(
    React.useCallback(() => {
      
      const getData = async () => {
        const res = await AsyncStorage.getItem('user');
        if(res == null){
          props.navigation.navigate('Login');
        }
        else{
          console.log(Object.keys(res));
          console.log(res.id);
          setUser(JSON.parse(res));
          return res;
        }
      }

      getData().then(function(r){
        // if(r !== undefined){
          const u = JSON.parse(r);
          setUser(JSON.parse(r));

          console.log(u);
          console.log('u partner_id');
          console.log(u.id);

          getLocationAsync().then(function(res){
            getMissions(u.email, u.password, u.id, res.coords);
          });
        // }
        // else{

        // }
      });

      const onBackPress = () => {
        BackHandler.exitApp();
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);

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
        <SafeAreaView style={styles.container}>
          <Header
            backgroundColor='#fff'
            leftComponent={{ 
              icon: 'menu', 
              size: 32,
              containerStyle: { marginTop: 20 },
              color: '#333',
              onPress: () => props.navigation.openDrawer()
            }}
            containerStyle={{
              borderBottomWidth: 0, 
              paddingTop: 0, 
              height: 80
            }}
          />
          <View>
            <MapView 
              style={styles.mapStyle} 
              customMapStyle={mapaStyle} 
              provider={PROVIDER_GOOGLE}
              loadingEnabled={false}
              region={region}
              fitToElements={true}
              showsUserLocation={true}
              initialRegion={region}
              >
              {marker}
              {missions.map((m) => {
                return (
                  <Marker
                      coordinate={{
                        latitude: m.latitude,
                        longitude: m.longitude
                      }}
                      key = {m.key}
                      // title = { m.subject }
                      onPress = {()=>{
                        AsyncStorage.setItem('mission_key', JSON.stringify(m.key))
                          .then(x => {
                            if(m.status == "open"){
                              props.navigation.navigate('Mission');
                            }else{
                              props.navigation.navigate('MissionProgress');
                            }
                          })
                      }}
                      image = { 
                        m.status == "ordered" ? 
                        require('../../assets/img/gps-done.png') :
                        require('../../assets/img/gps.png')}
                  >
                  </Marker>
                  );
                })
              }
            </MapView>
          </View>
        </SafeAreaView>
      )
  );
}
