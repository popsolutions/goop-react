import Odoo from 'react-native-odoo-promise-based';

const baseUrl = "charismabi.com.br";

export const getOdoo = (login, password) => {
  const odoo = new Odoo({
    host: baseUrl,
    database: 'charisma-prod',
    username: login,
    password: password, 
    port: 443,
    protocol: "https"
  });

  console.log('odoo');
  console.log(odoo);

  return odoo;
}

export const connectAPI = (odoo) => {
  const odoo_res = odoo.connect()
    .then(res => { 
      if(res.hasOwnProperty('data')){
        if(res.data.uid == false){
          throw 'Email e/ou senha incorretos';
        }else{
          return {code: 1, uid: res.data.uid};
        }
      }
    })
    .catch(e => {
      console.log(e);
      return {code: 0, e: e};
    });

  return odoo_res;
}