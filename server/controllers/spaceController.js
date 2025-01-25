//server\controllers\spaceController.js
const Space = require('../models/Space');
const User = require('../models/User');

exports.SpaceDashboard = async (req, res) => {
    try {
        const spaces = await Space.find(); // ดึงข้อมูล spaces จากฐานข้อมูล
        res.render("space/space-dashboard", {
            layout: "../views/layouts/space",
            user: req.user,
            spaces: spaces
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};