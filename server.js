const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();
app.use("/css", express.static("css"));
app.use("/img", express.static("img"));
app.use("/js", express.static("js"));


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root1234",
    database: "ecommerce",
    connectionLimit: 10

});

connection.connect(function(error){
    if(error){
        console.log("Error in connecting to database");
    }else{
        console.log("Connected to database");
    }
});

app.get("/",function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/register", encoder, function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    let sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    let values = [username, password, email];

    connection.query(sql, values, function(error, result){
        if(error){
            console.log("Error in inserting data", error);
            res.status(500).send("An error occurred during registration");
        }else{
            console.log("User registered successfully");
            res.redirect("/login.html");
        }
    });
});
app.post("/", encoder, function(req, res){
    let username = req.body.username;
    let password = req.body.password;

    connection.query("select * from loginuser where email = ? and password = ?", [username, password], function(error, result, fields){
        if (results.length > 0) {
            res.redirect("/homepage.html");
        } else {
            res.send("Invalid username or password");
            res.redirect("/");
        }
        res.end();
    })
})

// when login is successful
app.get("/homepage.html", function(req, res){
    res.sendFile(__dirname + "/homepage.html");
})


app.listen(4000)
