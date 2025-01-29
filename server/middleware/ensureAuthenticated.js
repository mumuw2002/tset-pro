
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'กรุณาล็อกอินเพื่อเข้าถึงหน้านี้');
        res.redirect('/login');
    }
};