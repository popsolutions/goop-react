import { DatabaseConnection } from './connect.js';

db = DatabaseConnection.getConnection();
db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
console.log('Foreign keys turned on')
);

export const databaseInit = () => {
    return InitDb(db);

    function InitDb(db) {
      var sql = [
        `CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          name text, 
          image blob,  
          birthdate text,
          function text, 
          cnpj_cpf text,
          education_level text, 
          gender text, 
          missions_count text,
          mobile text,
          email text,
          street text,
          city text,
          district text,
          state text,
          signup_url text,
          partner_id integer,
          password text,
          isLogged boolean,
          uid integer UNIQUE);`,

        `CREATE TABLE IF NOT EXISTS mission (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          key integer UNIQUE,
          name text,
          subject text,
          type_mission text,
          instructions text,
          date_finished text,
          photo_ids text,
          quizz_ids text,
          price_comparison_ids text,
          reward float,
          scores float,
          establishment_id integer,
          establishment_name text,
          status text,
          address text,
          neighbor text,
          city text,
          state text,
          latitude float,
          longitude float,
          distance float);`,

        `CREATE TABLE IF NOT EXISTS challenge (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          key INTEGER,
          mission_id integer,
          name text, 
          type text, 
          done boolean,
          FOREIGN KEY (mission_id) REFERENCES mission (key));`,

        `CREATE TABLE IF NOT EXISTS measurement (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          key INTEGER UNIQUE,
          user_id integer,
          missions_id integer,
          name text,
          kanban_state text,
          approved boolean,
          paid boolean,
          FOREIGN KEY (missions_id) REFERENCES mission (key),
          FOREIGN KEY (user_id) REFERENCES user (uid));`,

        `CREATE TABLE IF NOT EXISTS quizz (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          key INTEGER UNIQUE,
          name TEXT,
          answers TEXT,
          missions_id TEXT,
          measurement_id INTEGER,
          FOREIGN KEY (measurement_id) REFERENCES measurement (key),
          FOREIGN KEY (missions_id) REFERENCES mission (key));`,

        `CREATE TABLE IF NOT EXISTS quizzline (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          quizz_id INTEGER,
          alternative_id INTEGER,
          FOREIGN KEY (quizz_id) REFERENCES quizz (key));`,

        `CREATE TABLE IF NOT EXISTS measurement_quizzlines (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          quizz_id INTEGER,
          alternative_id INTEGER,
          measurement_id INTEGER,
          FOREIGN KEY (quizz_id) REFERENCES quizz (key),
          FOREIGN KEY (measurement_id) REFERENCES measurement (key));`,

        `CREATE TABLE IF NOT EXISTS price_comparsion (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          key INTEGER UNIQUE,
          product_id INTEGER,
          missions_id TEXT)`,

        `CREATE TABLE IF NOT EXISTS price_comparison_line (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          missions_id TEXT,
          measurement_id INTEGER,
          photo BLOB,
          price DOUBLE,
          product_id INTEGER,
          product_description TEXT,
          FOREIGN KEY (measurement_id) REFERENCES measurement (key),
          FOREIGN KEY (missions_id) REFERENCES mission (key));`,
        ];

        db.transaction(
          tx => {
            for (var i = 0; i < sql.length; i++) {
              console.log("execute sql : " + sql[i]);
              tx.executeSql(sql[i]);
            }
          }, (error) => {
            console.log("error call back : " + JSON.stringify(error));
            console.log(error);
          }, () => {
            console.log("transaction complete call back ");
          }
        );
    }
}

export const dropDatabase = () => {

  var sql = [
    `DROP TABLE IF EXISTS measurement_quizzlines`,
    `DROP TABLE IF EXISTS quizzline`,
    `DROP TABLE IF EXISTS quizz`,
    `DROP TABLE IF EXISTS measurement`,
    `DROP TABLE IF EXISTS challenge`,
    `DROP TABLE IF EXISTS mission`,
    `DROP TABLE IF EXISTS user`,
  ];

  return db.transaction(
      tx => {
        for (var i = 0; i < sql.length; i++) {
          console.log("execute sql : " + sql[i]);
          tx.executeSql(sql[i]);
        }
      }, (error) => {
        console.log("error call back : " + JSON.stringify(error));
        console.log(error);
      }, () => {
        console.log("transaction complete call back ");
      }
    );
}


export const insertData = (table, obj) => {
  const internalObj = JSON.parse(JSON.stringify(obj));
  delete(internalObj.id);

  const keys = Object.keys(internalObj);
  const values = Object.values(internalObj);
  const placeholders = keys.map(function(i){
    return '?';
  });

  const query =  `INSERT INTO `+ table +` (`+ keys +`) values (`+ placeholders.join(',') +`);`;

  function executeTransaction(query, values) {
    return new Promise(function (resolve, reject) {
      db.transaction(function (transaction) {
        transaction.executeSql(query, values, 
        function (transaction, result) {
          resolve(result);
        }, 
        function(transaction, err){ 
          reject(err);
        });
      });
    });
  }

  return executeTransaction(query, values);
}

export const selectUser = (id) => {
  const sql = 'SELECT * FROM user WHERE id = ' + id + ';';

  return new Promise(function (resolve, reject) {
    db.transaction(function (transaction) {
      transaction.executeSql(sql, [], 
      function (transaction, result) {
        // console.log('transaction SELECT: ' + JSON.stringify(transaction));
        // console.log("Test: " + JSON.stringify(result));
        resolve(result);
      }, 
      function(transaction, err){ 
        console.log('transaction SELECT: ' + JSON.stringify(transaction));
        console.log("ErrorDB: " + JSON.stringify(err));
        reject(err);
      });
    });
  });
}

export const selectById = (table, id) => {
  const sql = 'SELECT * FROM ' + table + 'WHERE id = ' + id + ';';

  return new Promise(function (resolve, reject) {
    db.transaction(function (transaction) {
      transaction.executeSql(sql, [], 
      function (transaction, result) {
        resolve(result);
      }, 
      function(transaction, err){ 
        console.log('transaction SELECT: ' + JSON.stringify(transaction));
        console.log("ErrorDB: " + JSON.stringify(err));
        reject(err);
      });
    });
  });
}


export const selectBy = (table, property, equals) => {
  const sql = `SELECT * FROM ` + table + 
    ` WHERE ` + property + ` = ` + equals + ';';

  return new Promise(function (resolve, reject) {
    db.transaction(function (transaction) {
      transaction.executeSql(sql, [], 
      function (transaction, result) {
        resolve(result);
      }, 
      function(transaction, err){ 
        console.log('transaction SELECT: ' + JSON.stringify(transaction));
        console.log("ErrorDB: " + JSON.stringify(err));
        reject(err);
      });
    });
  });
}

export const selectByMultiple = (table, obj) => {
  const s = Object.entries(obj).map((it)=>{
    if(typeof(it[1]) === 'string'){
      return it[0] + ' = "' + it[1] + '"';
    }else{
      return it[0] + ' = ' + it[1];
    }
  });

  const sql = `SELECT * FROM ` + table + ` WHERE ` + s.join(' AND ') + `;`;

  return new Promise(function (resolve, reject) {
    db.transaction(function (transaction) {
      transaction.executeSql(sql, [], 
      function (transaction, result) {
        resolve(result);
      }, 
      function(transaction, err){ 
        reject(err);
      });
    });
  });
}

export const selectAll = (table) => {
  const sql = 'SELECT * FROM ' + table + ';';

  return new Promise(function (resolve, reject) {
    db.transaction(function (transaction) {
      transaction.executeSql(sql, [], 
      function (transaction, result) {
        resolve(result);
      }, 
      function(transaction, err){ 
        reject(err);
      });
    });
  });
}

export const update = (table,fields, field, field_value) => {
  const columns = Object.keys(fields);
  const values = Object.values(fields); 

  const placeholders = columns.join(' = ? ,') +' = ?';

  const sql = `UPDATE ` + table + 
    ` SET ` + placeholders + 
    ` WHERE ` + field + `=` + field_value + `;`;


  return new Promise(function (resolve, reject) {
    db.transaction(function (transaction) {
      transaction.executeSql(sql, values, 
      function (transaction, result) {
        resolve(result);
      }, 
      function(transaction, err){ 
        reject(err);
      });
    });
  });
}

export const deleteData = (table, field, field_value) => {
  const sql = `DELETE FROM ` + table + 
    ` WHERE ` + field + `=` + field_value + `;`;

  return new Promise(function (resolve, reject) {
    db.transaction(function (transaction) {
      transaction.executeSql(sql, [], 
      function (transaction, result) {
        resolve(result);
      }, 
      function(transaction, err){ 
        reject(err);
      });
    });
  });
}