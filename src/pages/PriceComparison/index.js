import React, {useState} from 'react';
import {
  AsyncStorage,
  FlatList,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  View
} 
from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { getOdoo, connectAPI } from '../../utils/odoo.js';
import { TextInputMask } from 'react-native-masked-text';
import AnimatedLoader from 'react-native-animated-loader';
import { 
  selectBy, 
  insertData, 
  update,
  selectAll,
  selectByMultiple } 
from '../../database/database.js';

import styles from './styles.js';

export default function PriceComparison(props) {
  const [product, setProduct] = useState({}); 
  const [task, setTask] = useState(0);
  const [price, setPrice] = useState('');
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setPrice('');
      setIsLoading(true);
      AsyncStorage.getItem('challenge_id').then((r)=>{
        setTask(JSON.parse(r).key);
        let task_ = JSON.parse(r).key;

        AsyncStorage.getItem('user').then((res)=>{
          if(res !== null ){
            setUser(JSON.parse(res));
            let u = JSON.parse(res);
            const odoo = getOdoo(u.email, u.password);

            connectAPI(odoo).then((r) => {
              const params = {
                domain: [['id', '=', task_]],
              }
  
              odoo.search_read('pops.price_comparison', params).then(function(res){
                if(res.success == true){
                  setProduct({
                    id: res.data[0]["product_id"][0],
                    name: res.data[0]["product_id"][1]
                  });
                  setIsLoading(false);
                }
              })
            })
          }
        });
      })
    }, [])
  );

  async function salvar(){
    const formattedPrice = parseFloat(price.replace(',', '.').replace(/[^0-9\.-]+/g,""));

    const key_ = await AsyncStorage.getItem('mission_key');

    const obj = {'missions_id': key_, 'user_id': user.uid};
    
    const measurement_ = await selectByMultiple('measurement', obj);

    if(measurement_.rows._array.length > 0){
      const line = {};
      line.missions_id = key_;
      line.measurement_id = measurement_.rows._array[0].key;
      line.price = formattedPrice;
      line.product_id = product.id;

      insertData('price_comparison_line', line);

      update('challenge', {done: 1}, 'key', task).then(function(res){
        props.navigation.navigate('MissionProgress');
      })
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
      <SafeAreaView 
      style={[styles.white, { flexGrow: 1, marginTop:Platform.OS === 'ios' ? 0 : -50 }]} >
      <Header
        backgroundColor='#fff'
        leftComponent={{ 
          icon: 'keyboard-arrow-left', 
          size: 36,
          color: '#333',
          onPress: () => {
            // setIsLoading(true);
            props.navigation.navigate('MissionProgress');
          }
        }}
        containerStyle={{ 
          paddingTop: 50, 
        }}
      />
      <View style={{flex: 1, flexGrow: 1, backgroundColor: '#fff', justifyContent: 'space-between'}}>
        <View style={{flexGrow: 1}}>
          <Text style={{
            textAlign:'center', 
            fontSize: 22}}>Produto</Text>
          <Text style={{
            textAlign:'center', 
            fontSize: 22, 
            paddingVertical: 40}}>{product.name}</Text>
        </View>
        <View style={{flexGrow: 1}}>
          <Text style={{
            textAlign:'center', 
            fontSize: 22}}>Preço</Text>
          <TextInputMask
            type={'money'}
            options={{
              precision: 2,
              separator: ',',
              delimiter: '.',
              unit: 'R$',
              suffixUnit: ''
            }}
            style={{
              borderWidth: 1, 
              fontSize: 18, 
              width: 200, 
              height: 40,
              borderRadius: 10,
              textAlign: 'center',
              marginTop: 10,
              marginBottom: 10,
              marginRight: 'auto', 
              marginLeft: 'auto'}}
            value={price}
            onChangeText={text => {
              setPrice(text)
            }}
          />
        </View>
        <View>
        <TouchableHighlight
            style={styles.button}
            onPress={() => {
              salvar()
            }}
            underlayColor="#fff">
            <Text style={styles.submitText}>Salvar</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
    )
  )
}