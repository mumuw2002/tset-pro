require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./server/config/passport');

const app = express();
const port = process.env.PORT || 5001;

// Middleware สำหรับ parse body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// เชื่อมต่อ MongoDB
connectDB()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    });

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'Lax',
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON requests

// Set Content Security Policy header
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", 
        "default-src 'none'; img-src 'self' data:; script-src 'self'; style-src 'self';");
    next();
});

app.use(flash());

// ตั้งค่า EJS เป็น template engine
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// กำหนด public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/', require('./server/routes/authRoutes'));
app.use('/', require('./server/routes/indexRoutes'));
app.use('/', require('./server/routes/spaceRoutes'));

app.get('*', (req, res) => {
    res.status(404).render('404');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
