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
import {
  CodeField,
  Cursor,
  MaskSymbol,
  useBlurOnFulfill,
  useClearByFocusCell,
  isLastFilledCell
} from 'react-native-confirmation-code-field';

import styles from './styles.js';

export default function ModalConfirm(props) {
  const [showButtonCode, setShowButtonCode] = useState(false);

  const manageModal = (value) => {
    props.setShowModal(value)
  }

  const confirm = () => {
    if (showButtonCode) {
      manageModal(false)
      props.setShowModalResponse(true)
      setShowButtonCode(false)
    } else {
      setShowButtonCode(true)
    }

  }
  const CELL_COUNT = 6;

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [propsCode, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell = ({ index, symbol, isFocused }) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell({ index, value })}>
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell, { marginBottom: 15 }]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };


  return (
    <Modal transparent={true}
      animationType="fade"
      visible={props.showModal}
      onRequestClose={() => { manageModal(false) }}
    >
      <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', flex: 1 }} >
        <View style={styles.containerModal}>

          {showButtonCode ?
            <View style={styles.contentModal}>
              <Text style={styles.titleModal}>Para a sua segurança</Text>
              <Text style={styles.contentTextModal}>Digite a sua senha para concluir a solicitação de saque para a sua conta bancária:</Text>

              <CodeField
                ref={ref}
                {...propsCode}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFiledRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={renderCell}
              />

            </View>
            :
            <View style={styles.contentModal}>
              <Text style={styles.titleModal}> Quanto você deseja sacar?</Text>
              <Text style={styles.contentTextModal}>Após a solicitação, em até 2 dias úteis, o dinheiro estará disponível em sua conta bancária cadastrada.</Text>
              <Text style={styles.amount}>R$ 200,00</Text>
            </View>}

          <TouchableOpacity
            style={styles.buttonFullPink}
            onPress={() => confirm()}>
            <Text style={styles.white}>Sacar para a conta bancária</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ Modal>
  );
}
