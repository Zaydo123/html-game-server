const mysql = require('mysql');
const {createPool} = require("mysql");
const dotenv = require('dotenv').config();

//run for local development 
// /opt/homebrew/opt/mariadb/bin/mysqld_safe --datadir=/opt/homebrew/var/mysql

class Database {
    constructor() {

        if(!process.env.DB_HOST){
            console.log("You need to set the environment variables DB_HOST, DB_USER, DB_PASS and DB_NAME");
            process.exit(1);
        }
        if(!process.env.URL){
            console.log("You need to set the environment variables URL to the ip or url of your website");
            process.exit(1);
        }
        this.connection = createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });
    }
    createTable() {
        let sql = "CREATE TABLE IF NOT EXISTS games (name text NOT NULL,id text NOT NULL,image text DEFAULT NULL,visits int(11) NOT NULL,ranking int(11) NOT NULL,description text DEFAULT NULL,gamedistribution text DEFAULT NULL,needsConstantFocus tinyint(1) DEFAULT NULL,mirrors longtext DEFAULT NULL);";
        let sql2 = 'CREATE TABLE IF NOT EXISTS visits (url text NOT NULL, home_visits int(11) NOT NULL, UNIQUE KEY url (url));';
        let sql3 = 'CREATE TABLE IF NOT EXISTS requests (name text NOT NULL, email text NOT NULL, appname text NOT NULL, id text NOT NULL, UNIQUE KEY id (id));';
        //execute all sql statements
        this.connection.query(sql, (
            err, result) => {
            if (err) throw err;
        }
        );
        this.connection.query(sql2, (
            err, result) => {
            if (err) throw err;
        }
        );
        this.connection.query(sql3, (
            err, result) => {
            if (err) throw err;
        }
        );
        //add the website to the visits table
        this.insertHomeVisits(process.env.URL);
    }
    insertGame(game) {
        let sql = 'INSERT INTO games SET ?';
        this.connection.query(sql, game, (err, result) => {
            if (err) throw err;
            console.log('Game added');
        });
    }
    updateGame(field,value,id) {
        let sql = "UPDATE games SET "+field+"="+value+" WHERE id = '"+id+"'";
        this.connection.query(sql, (err, result) => {
            if (err) throw err;
        });
    }
    deleteGame(id) {
        let sql = 'DELETE FROM games WHERE id = ?';
        this.connection.query(sql, id, (err, result) => {
            if (err) throw err;
            console.log('Game deleted');
        });
    }
    getGames(callback) {
        let sql = 'SELECT * FROM games';
        this.connection.query(sql, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
    getGame(id, callback) {
        let sql = 'SELECT * FROM games WHERE id = ?';
        this.connection.query(sql, id, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
    insertHomeVisits(id) {
        this.getHomeVisits(id, (result,err) => {
            if (err) console.log(err);
            if(result[0]){
                return;
            } else{
                let sql = 'INSERT INTO visits (url, home_visits) VALUES ("'+ id+'",0)';
                this.connection.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log('Site added');
                });
            }
        });
    }
    getHomeVisits(id, callback) {
        let sql = 'SELECT * FROM visits WHERE url = ?';
        this.connection.query(sql, id, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
    updateHomeVisits(id,increment) {
        let sql = 'UPDATE visits SET home_visits = home_visits+' + increment+' WHERE url = "' +id+'"';
        this.connection.query(sql, (err, result) => {
            if (err) throw err;
            return result;
        });
    }
    //read all items from the games table and sort them by visit count. change the ranking of each item to the index of the item in the array
    updateRankings() {
        let sql = 'SELECT * FROM games ORDER BY visits DESC';
        this.connection.query(sql, (
            err, result) => {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                this.updateGame("ranking",i,result[i].id);
            }
        }
        );
    }
    //add a game request to the database
    addRequest(name,email,appname,id) {
        let sql = 'INSERT INTO requests (name, email, appname, id) VALUES ("'+name+'","'+email+'","'+appname+'","'+id+'")';
        this.connection.query(sql, (
            err, result) => {
            if (err) throw err;
        }
        );
    }
    //get all game requests from the database
    getRequests(callback) {
        let sql = 'SELECT * FROM requests LIMIT 100';
        this.connection.query(sql, (
            err, result) => {
            if (err) throw err;
            callback(result);
        }
        );
    }
    //delete a game request from the database
    deleteRequest(id) {
        let sql = 'DELETE FROM requests WHERE id = ?';
        this.connection.query(sql, id
            , (err, result) => {
            if (err) throw err;
        }
        );
    }



    end() {
        this.connection.end();
    }
    
}

module.exports = Database;