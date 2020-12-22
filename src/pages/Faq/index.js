import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native-elements';

const BACON_IPSUM =
  "Bacon ipsum dolor amet chuck turducken landjaeger tongue spare ribs. \
  Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. \
  Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham \
  hock tongue shank andouille boudin brisket.";

const CONTENT = [
  {
    title: 'O que é GOOP?',
    content: 'O Aplicativo GOOP busca por usuários que cumpram as missões com objetivo de documentar marcas/estabelecimentos oferecidas em seu sistema. Resposta a perguntas, fotos e comparativo de preços são algumas das modalidades de missões oferecidas.'
  },
  {
    title: 'Para que ele serve?',
    content: 'Pois as funcionalidades são infinitas, mas básicamente permite que pessoas monitorem suas marcas e procedimentos já em instância final, solicitem fotos, respondam perguntas e/ou comparem preços de produtos/serviços.'
  },
  {
    title: 'O que o usuário ganha com isso?',
    content: 'O GoOpper ganha créditos que podem ser depositados por meios eletrônicos e reputação para alcançar missões de maior reputação e retorno financeiro por tempo estimado.',
  },
  {
    title: 'O que somos?',
    content: 'Uma cuminidade/plataforma colaborativa, cooperativa, mutualista que usa software livre. Backends e analises de dados em sistemas interconectados e alguma coisa a mais. Mas em essencia somos colegas que nos ajudamos para construir um sistema em que o dado e a informação sejam uteis. Para que isso serve se depois: I DAI!? Essa é a proxima pergunta',
  },
  {
    title: 'E Dai!',
    content: 'Bom basicamente o que ocorre é que o marketing e a comunicação se baseiam em subjetividade e análise de esta subjetividade em sistemas de bigData é muito complexa. Analizar os dados de maneira efetiva ajuda marcas e empresas a oferecerem produtos/serviços mais justos e efetivos. Desta maneira a rede de Goopers pode contar com muitas missões em um rede espalhada cumprindo suas missões',
  },
  {
    title: 'REPUTAÇÃO',
    content: 'Você acumula pontos de experiência sempre que cumpre uma missão! Isto lhe abrirá portas para mais tipos de missão e valores diferentes. Testes de consumidor oculto estão sendom implementados.'
  },
  {
    title: 'Seventh my Question?',
    content: BACON_IPSUM,
  },
  {
    title: 'Eighth Question?',
    content: BACON_IPSUM,
  },
  {
    title: 'Nineth the Question?',
    content: BACON_IPSUM,
  },
  {
    title: 'Tenth Question?',
    content: BACON_IPSUM,
  },
];

import styles from './styles.js';

export default function Faq(props) {
  const [state, setState] = useState({
    activeSections: [],
    collapsed: true,
    multipleSelect: false,
  });

  function toggleExpanded(){
    setState({ collapsed: !state.collapsed });
  };

  const setSections = sections => {
    setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  const renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <Text style={[styles.headerText, 
          isActive ? styles.headerActive : styles.headerInactive]}>{section.title}</Text>
      </Animatable.View>
    );
  };

  function renderContent(section, _, isActive) {
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
          <Text style={{lineHeight: 25}}>{section.content}</Text>
        </Animatable.Text>
      </Animatable.View>
    );
  }

  const { activeSections } = state;

  return (
    <SafeAreaView style={[styles.container]} >
      <Header
        backgroundColor='#fff'
        leftComponent={{ 
          icon: 'menu', 
          size: 32,
          color: '#333',
          onPress: () => props.navigation.openDrawer()
        }}
        centerComponent={{
          text: 'FAQ',
          style: { 
            color: '#333',
            fontSize: 22
          }
        }}
        containerStyle={{
          borderBottomWidth: 0, 
          paddingTop: 0, 
          height: 60
        }}
      />
      <View style={{ backgroundColor: '#fff'}}>
        <Accordion
          activeSections={activeSections}
          sections={CONTENT}
          touchableComponent={TouchableHighlight}
          expandMultiple={false}
          renderHeader={renderHeader}
          renderContent={renderContent}
          duration={400}
          onChange={setSections}
          sectionContainerStyle={{borderBottomWidth: 1, borderTopWidth: 1}}
          containerStyle={{borderBottomWidth: 1, borderTopWidth: 1}}
        />
      </View>
    </SafeAreaView>
  )
  
}
