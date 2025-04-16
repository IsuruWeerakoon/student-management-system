const adminModel = require('../models/adminModel.js')
exports.getAdminData = function (req, res) {
    const admin_id = req.user.userID;
    adminModel.retrieveAdminData(admin_id, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.json(result[0]);
    });
}