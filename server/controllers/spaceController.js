//server\controllers\spaceController.js
exports.SpaceDashboard = async (req, res) => {
    res.render("space/space-dashboard", {
        layout: "../views/layouts/space"
    });
};