import React, { useState } from 'react';

import {
  AsyncStorage,
  Dimensions,
  View,
  Text,
  SectionList,
  TouchableOpacity
} from 'react-native';

import AnimatedLoader from "react-native-animated-loader";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Icon } from 'react-native-elements';
import { getOdoo, connectAPI } from '../../utils/odoo.js';
import { useFocusEffect } from '@react-navigation/native';
import { selectBy, dropDatabase } from '../../database/database.js';

import styles from './styles.js';
import ModalConfirm from './ModalConfirm.js';
import ModalResponse from './ModalResponse.js';

export default function Wallet(props) {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalResponse, setShowModalResponse] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [analysisBalance, setAnalysisBalance] = useState(0);


  async function getBalanceInfo(user) {
    const odoo = getOdoo(user.email, user.password);
    const res = await connectAPI(odoo);

    if (typeof (res) !== undefined && res.hasOwnProperty('code') && res.code == 1) {
      const params = {
        domain: [
          ['user_id', '=', res.uid],
          ['state', 'not in', ['draft']]],
        fields: [
          'approved',
          'paid',
          'kanban_state',
          'state',
          'missions_id'
        ]
      };

      odoo.search_read('pops.measurement', params).then(function (res) {
        if (res.success) {
          const data = res.data;

          console.log(data);

          const rewards = data.map(async (i) => {
            console.log(i.missions_id[0]);
            const saved = await selectBy('mission', 'key', i.missions_id[0]);
            // console.log(saved);
            if (saved.rows.length == 0) {
              const params2 = {
                domain: [['id', '=', i.missions_id[0]]],
                fields: ['reward']
              };
              const res = await odoo.search_read('pops.missions', params2);
              if (res.success) {
                console.log(res.data);
                res.data.forEach((it) => {
                  i.reward = it.reward;
                });
              }
            } else {
              i.reward = saved.rows._array[0].reward;
              return i;
            }
          })

          Promise.all(rewards).then((r) => {
            r.forEach((i) => {
              if (i.approved == true && i.paid == false) {
                setCurrentBalance(currentBalance + i.reward);
              } else if (i.approved == false) {
                setAnalysisBalance(analysisBalance + i.reward);
              }
            })
          })

          // const analysis = data.filter((i)=>{
          //   return i.state == 'doing' || i.state == 'ordered';
          // });

          // const paid = data.filter((i)=>{
          //   return i.paid == true;
          // })

          // const approved = data.filter((i)=>{
          //   return i.approved == true;
          // })

          // const neglected = data.filter((i)=>{
          //   return i.approved == false;
          // });

          // const approved_total = approved.reduce(function(total, item) {
          //   return total + item;
          // }, 0);

          // const paid_total = paid.reduce(function(total, item) {
          //   return total + item;
          // }, 0);

          // const neglected_total = neglected.reduce(function(total, item) {
          //   return total + item;
          // }, 0);

          // const current_balance = approved - (paid_total + neglected_total);

          // const analysis_balance = analysis.reduce(function(total, item) {
          //   console.log(item);
          //   return total + item;
          // }, 0);

          // setAnalysisBalance(analysis_balance);

          // console.log('current_balance ');
          // console.log('analysis_balance ');

        }
      })
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('user').then((res) => {
        if (res !== null) {
          const u = JSON.parse(res);
          setUser(u);
          getBalanceInfo(u).then((r) => {
            console.log(r);
          });
        }
      });


      return () => {
        setUser({});
        setCurrentBalance(0);
        setAnalysisBalance(0);
      }
    }, [])
  );

  const rItem = ({ item }) => {
    console.log("llega aqui wey")
    return (
      <View>
        <View style={styles.separatorDate}>
          <Text style={styles.textGray}>26 DE  NOVEMBRO | SALDO R$ 33,02</Text>
        </View>

        <View style={styles.lineDetail}>
          <Text>Realizou un saque</Text>
          <Text style={styles.orangeText}>-R$ 33,02</Text>
        </View>

        <View style={styles.lineDetail}>
          <Text>Pagamento recebido</Text>
          <Text style={styles.greenText}>+R$ 33,02</Text>
        </View>

      </View>
    );
  };



  const wallteItems = [
    {
      title: '26 DE  NOVEMBRO | SALDO R$ 33,02',
      data: [
        {
          description: 'Realizou um saque',
          amount: 33.02,
          negative: true
        },
        {
          description: 'Pagamento recebido',
          amount: 33.02,
          negative: false
        },
      ]
    }, {
      title: '21 DE  NOVEMBRO | SALDO R$ 61,44',
      data: [
        {
          description: 'Realizou um saque',
          amount: 18.80,
          negative: true
        },
        {
          description: 'Pagamento recebido',
          amount: 50.23,
          negative: false
        },
        {
          description: 'Pagamento recebido',
          amount: 30.00,
          negative: false
        },
        {
          description: 'Valor retornado',
          amount: 0.01,
          negative: false
        },
      ]
    },

  ];


  const renderItem = ({ item }) => (
    <View style={styles.lineDetail}>
      <Text>{item.description}</Text>
      <Text style={(item.negative ? styles.orangeText : styles.greenText)}>{item.negative && <Text>-</Text>} R$ {item.amount}</Text>
    </View>
  );

  const goToConta = () => {
    console.log("go to conta screens")
    setShowModal(true)
  }


  return (
    <SafeAreaView style={styles.container}>
      <Header
        backgroundColor='#e40063'
        leftComponent={{
          icon: 'arrow-back',
          size: 32,
          color: '#fff',
          onPress: () => props.navigation.navigate('Mapa')
        }}
        centerComponent={{ text: 'Minha Carteira', style: [styles.title] }}
        containerStyle={{
          borderBottomWidth: 0,
          paddingTop: 0,
          height: 60
        }}
      />

      <SectionList
        ListHeaderComponent={
          <View style={{ width: '100%' }}>
            <View style={[styles.headerPrimary, styles.flexRow, styles.pv20]}>
              <View style={[styles.grow1]}>
                <Text style={styles.lightLabel}>SALDO DISPONÍVEL</Text>
                <Text style={styles.lightLabel}>R$ {currentBalance}</Text>
              </View>
              <View style={[styles.grow1]}>
                <Text style={styles.lightLabel}>EM ANÁLISE</Text>
                <Text style={styles.lightLabel}>R$ {analysisBalance}</Text>
              </View>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => goToConta()}>
                <Text style={styles.lightLabel} >Sacar para conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        style={{ width: '100%' }}
        sections={wallteItems}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.textGray, styles.separatorDate]}>{title}</Text>
        )}

      />

      <ModalConfirm
        showModal={showModal}
        setShowModal={setShowModal.bind(this)}
        setShowModalResponse={setShowModalResponse.bind(this)}
      />

      <ModalResponse
        showModalResponse={showModalResponse}
        setShowModalResponse={setShowModalResponse.bind(this)}
      />

    </SafeAreaView>
  );
}
