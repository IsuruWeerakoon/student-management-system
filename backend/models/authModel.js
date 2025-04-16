const db = require('../dbModel.js');

const Auth = {
    userLogin : function(email, callback){
        const sql_query = `SELECT id, email, password, role FROM students WHERE email=?`;
        db.query(sql_query, [email], callback);
    }, 
};

module.exports = Auth;