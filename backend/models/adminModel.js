const db = require('../dbModel.js')
const Admin = {
    retrieveAdminData : function (admin_id, callback) {
        const sql_query = `
        SELECT * 
        FROM students 
        WHERE role='admin' 
        AND id=?
        `;
        db.query(sql_query, [admin_id], callback);
    },
};

module.exports = Admin;