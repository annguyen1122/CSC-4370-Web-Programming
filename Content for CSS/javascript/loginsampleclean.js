const express = require("express");
const crypt = require("crypto");
const app = express(); 
app.use(express.urlencoded({ extended: true }));
const path = require("path");
app.use(express.static(path.join(__dirname, "../pages")));

const mysql = require("mysql2");
const pass = process.env.ROOTPASS; 
const conn = mysql.createConnection({host:"localhost",user:"root",password:"anan4394",database:"dummyusertable",port:3306});


const hashRounds = 100;
const hashLength=64;
const salt = "salt";


conn.connect(function(err)
{
	if(err)
		console.log("Couldnt connect to MySQL",err);
	else
		console.log("Database connection established");
	
});

//
app.post("/register",function(req,res)
{
    let username = req.body.username;
    let email = req.body.email;
    let plainPass = req.body.password;

	hashedPass = crypt.pbkdf2Sync(plainPass,salt, hashRounds, hashLength, 'sha512').toString(`hex`);
    let sql = "INSERT INTO `user` (username, email, password) VALUES (?, ?, ?)";
    conn.query(sql, [username, email, hashedPass], function(err, result) {
		if (err)
			console.log("There was an error inserting a student",err)
		else
			res.send('You have successfully registered! <a href="/login.html">Login here</a>');
	});
	
});

app.post("/login",function(req,res)
{
    let username = req.body.username;
    let plainPass = req.body.password;

	let hashedPass = crypt.pbkdf2Sync(
		plainPass,salt, hashRounds, hashLength, 'sha512'
	).toString(`hex`);

    let sql = "SELECT * FROM `user` WHERE username = ? AND password = ?";
	conn.query(sql, [username, hashedPass], function(err, result) {
		if(err)
			res.send(err);
		else
		{
			if (result.length === 0)
			{
				console.log('results of the query',result);
				res.send('<p>Your password or username are incorrect<br> <a href="/login.html">Login </a> here </p> ');	
			}
			else
				res.send(`<p>You have logged in successfully ${username}</p>`);
		} 
	});
});



app.listen(3000);