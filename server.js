const express = require("express");
var mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');
const encoder = bodyParser.urlencoded({ extended: true });

const app = express();
app.use("/js", express.static("js"))
app.use(express.static(__dirname));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); 


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use("/js", express.static("js"));
app.use("/css", express.static("css"));
app.use("/img", express.static("img"));


let connection = mysql.createConnection({
    host: "project-database.c5eyqs6ii7vq.us-east-1.rds.amazonaws.com",
    user: 'rdsuser',
    password: "password",
    database: "ecommerce",
    port: '3306',
});

connection.connect(function(error){
    if(error){
        console.log("Error in connecting to database");
        console.log(error)
    }else{
        console.log("Connected to database");
    }
});
app.get("/login", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/",function(req, res){
    res.render('index', { message: req.flash('message') });
});

app.get("/register", function(req, res){
    res.sendFile(__dirname + "/register.html");
});


app.post("/", function(req, res){
    // Handle the POST request
    let username = req.body.username;
    let password = req.body.password;

    let query = 
    "SELECT * FROM users WHERE username = ? AND password = ?";
    connection.query(query, [username, password], function(error, result){
        if(error){
            console.log("Error in authenticating user");
        }else{
            if(result.length > 0){
                console.log("User authenticated successfully");
                req.flash('message', 'Login successful!');
                res.redirect("/homepage.html"); // Redirect to homepage
            }else{
                console.log("Invalid credentials");
                req.flash('message', 'Invalid credentials.');
                res.redirect("/login"); // Redirect back to login
            }
        }
    });
});

app.post("/login", encoder, function(req, res){
    let username = req.body.username;
    let password = req.body.password;

    let query = "SELECT * FROM users WHERE username = ? AND password = ?";
    connection.query(query, [username, password], function(error, result){
        if(error){
            console.log("Error in authenticating user");
        }else{
            if(result.length > 0){
                console.log("User authenticated successfully");
                req.flash('message', 'Login successful!');
                res.redirect("/homepage.html"); // Redirect to homepage
            }else{
                console.log("Invalid credentials");
                req.flash('message', 'Invalid credentials.');
                res.redirect("/login"); // Redirect back to login
            }
        }
    });
});

app.post("/register", encoder, function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    let query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    connection.query(query, [username, password, email], function(error, result){
        if(error){
            console.log("Error in registering user");
        }else{
            console.log("User registered successfully");
            res.redirect("/login");
        }
    });
});



app.listen(3001, function(){
    console.log("Server started on port 3000");
});