import React, { useState } from 'react';

import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Modal
} from 'react-native';

import AnimatedLoader from "react-native-animated-loader";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOdoo, connectAPI } from '../../utils/odoo.js';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles.js';

export default function ModalResponse(props) {
  const [showButtonCode, setShowButtonCode] = useState(false);

  const manageModal = (value) => {
    props.setShowModalResponse(value)
  }

  const confirm = () => {
    manageModal(false)
  }


  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={props.showModalResponse}
      onRequestClose={() => { manageModal(false) }}
    >
      <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', flex: 1, justifyContent: 'flex-end' }} >

        <View style={styles.containerBottomModal}>
          <View style={[styles.contentModal, { height: 180 }]}>
            <Text style={styles.titleModal}>Saque realizado com sucesso!</Text>
            <Text style={styles.contentTextModal}>Em até 2 dias úteis o dinheiro estará disponível em sua conta bancária cadastrada.</Text>
          </View>

          <TouchableOpacity
            style={styles.buttonFullPink}
            onPress={() => confirm()}>
            <Text style={styles.white}>Ir para minha carteira</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ Modal>
  );
}
