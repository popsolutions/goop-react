import React, {useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {Header} from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectAll } from '../../database/database.js';

import {
  AsyncStorage,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  FlatList,
  View, 
} from 'react-native';

import styles from './styles.js';

export default function MissionsList(props){
  const [missions, setMissions] = useState([]); 
  const [loadMissions, setLoadMissions] = useState(false);

  useFocusEffect(
    React.useCallback(() => {

      selectAll('mission').then(function(res){
        console.log(res);
        if(res.hasOwnProperty('rows') && res.rows._array.length >0){
          // const data = res.rows._array.sort((a, b) => {
          //   console.log(a.distance);
          //   a.distance.localeCompare(b.distance, {numeric: true})
          // })
          setMissions(res.rows._array);
        }
      })
    },[loadMissions])
  );

  function onSelect(id, status){
    AsyncStorage.setItem('mission_key', JSON.stringify(id)).then(x => {
      if(status == "open"){
        props.navigation.navigate('Mission');
      }else{
        props.navigation.navigate('MissionProgress');
      }
    });
  }
  
  function Item({ id, title, address, distance, city, reward, status, onSelect }) {
    return (
      <TouchableOpacity
        onPress={() => onSelect(id, status)}
        style={[
          styles.item,
          { backgroundColor: (status == "done" ) ? 'rgba(228, 0, 99, 0.1)' : '#fff' },
          { borderColor: (status == "open" ) ? '#000' : '#e40063' },
          { borderWidth: status == "open" ? 1 : 2 },
        ]}
        >
        <View style={{flex: 1, flexDirection:'row', marginBottom: 5}}>
          <Image 
            source={require('../../assets/img/mission.png')}
            style={styles.itemImg}/>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18, lineHeight: 22}}>{title}</Text>
          </View>
        </View>
        <View style={{borderBottomWidth: 1, paddingVertical: 10}}>
      <Text style={[styles.title]}>{address} - {city}</Text>
        </View>
        <View style={{
          flex: 1, 
          flexDirection:'row', 
          marginTop: 15, 
          justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <Image 
              source={require('../../assets/img/reward.png')}
              style={styles.itemImg}/>
            <Text style={styles.title}>{reward}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Image 
              source={require('../../assets/img/way.png')}
              style={styles.itemImg}/>
            <Text style={styles.title}>{distance}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <Header
        backgroundColor='#fff'
        leftComponent={{ 
          icon: 'menu', 
          size: 32,
          containerStyle: { marginTop: 50 },
          color: '#333',
          onPress: () => props.navigation.openDrawer()
        }}
        containerStyle={{
          borderBottomWidth: 0, 
          paddingTop: 0, 
          height: 125
        }}
      />
      <View>
        <FlatList
          data={missions.sort((a, b) => a.distance.toString().localeCompare(b.distance.toString(), undefined, { numeric: true, sensitivity: 'base' }))}
          renderItem={({ item }) => (
            <Item
              id={item.key}
              title={item.subject}
              address={item.address}
              city={item.city}
              distance={item.distance}
              reward={item.reward}
              onSelect={onSelect}
              status={item.status}
            />
          )}
          keyExtractor = { (item, index) => index.toString() }
          style={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}