const express = require('express')
const app      = express();
const port     = process.env.PORT || 9000;
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

let exphbs = require('express-handlebars')

const multer = require('multer')

const imageModel = require('./models/upload');

require('./config/passport')(passport); // pass passport for configuration

app.engine("handlebars", exphbs())
app.set("view engine", "handlebars")

app.use(express.static('public/images'))
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

const imageData = imageModel.find({})

let Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});


let upload = multer ({
    storage: Storage,
}).single("image");

app.get('/', (req,res) => {

    imageData.exec(function(err,data) {
        if(err) throw err;

        console.log(data)

        res.render('home',{records:data})
    })
});

app.post('/', (req, res) => {
    upload(req, res, function(err) {
        if(err){
            console.log(err);
            return res.end("Error something wrong.");
        } else {
            console.log(req.file.path)
            let imageName = req.file.filename

            let imageDetails = new imageModel({
                imagename: imageName,
            })

            imageDetails.save(function(err, doc){
                if(err) throw err;

                imageData.exec(function(err,data) {
                    if(err) throw err;

                    res.render('home',{records:data, success: true})
                })
            })
        }
    })
})

app.listen (port, () => {
    console.log(`Images uploading to port ${port}`)
})
