// imports all the required nodes
const express = require("express");
const crypt = require("crypto");
const session = require("express-session");
//creates the express application
const app = express();
//allows the server to read the stuff submitted
app.use(express.urlencoded({ extended: true }));

// makes the website able to save cookies to remember the user once they log in
app.use(session({
    secret: process.env.SESSION_SECRET || "development-secret-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60,
        httpOnly: true,
        secure: false
    }
}));

// import to be able to locate files
const path = require("path");
app.use(express.static(path.join(__dirname, "../pages")));

// connects to the mysql database
const mysql = require("mysql2");
const pass = process.env.ROOTPASS; 
const conn = mysql.createConnection({host:"localhost",user:"root",password:"anan4394",database:"dummyusertable",port:3306});

//password hashing
const hashRounds = 100;
const hashLength=64;
const salt = "salt";

// returns whether the database was connected to or not
conn.connect(function(err)
{
	if(err)
		console.log("Couldnt connect to MySQL",err);
	else
		console.log("Database connection established");
	
});

// processes the register info the user gives
app.post("/register",function(req,res)
{
    let username = req.body.username;
    let email = req.body.email;
    let plainPass = req.body.password;

	hashedPass = crypt.pbkdf2Sync(plainPass,salt, hashRounds, hashLength, 'sha512').toString(`hex`); // encrypts the password
    let sql = "INSERT INTO `user` (username, email, password) VALUES (?, ?, ?)"; //puts the user info into the database
    conn.query(sql, [username, email, hashedPass], function(err, result) {
		//results whether the registration was successful or not
		if (err)
			console.log("There was an error inserting a student",err)
		else
		{
			res.send(`
				<p>You have successfully registered!</p>
				<a href="/login.html">Login here</a>
			`);
		}
	});
	
});

// processes the login info the user provides
app.post("/login",function(req,res)
{
    let username = req.body.username;
    let plainPass = req.body.password;

	let hashedPass = crypt.pbkdf2Sync(
		plainPass,salt, hashRounds, hashLength, 'sha512'
	).toString(`hex`);//encrypts the password

    let sql = "SELECT * FROM `user` WHERE username = ? AND password = ?"; //checks the user information whether it matches in the database
	conn.query(sql, [username, hashedPass], function(err, result) {
		if(err)
			res.send(err);
		else
		{	
			//result if the user information pair isnt in the database
			if (result.length === 0)
			{
				console.log('results of the query',result);
				res.send('<p>Your password or username are incorrect<br> <a href="/login.html">Login </a> here </p> ');	
			}
			else
			{
				// store the username in the session after successful login
				req.session.user = {
					username: username
				};

				// send the user to their profile page
				res.send(`
					<p>You have logged in successfully ${username}</p>
					<a href="/profile">Visit your profile</a>
				`);
			}
		} 
	});
});

//creates the profile page to log out of and to read username
app.get("/profile", function(req, res)
{
    if (!req.session.user)
    {
        res.send(`
            <h2>You are not logged in!</h2>
            <a href="/login.html">Login here</a>
        `);
    }
    else
    {
        res.send(`
            <h1>Welcome to your profile!</h1>
            <p>Your username is: ${req.session.user.username}</p>
            <a href="/logout">Logout</a>
        `);
    }
});

//logout page, ends the login session and lets the user know
app.get("/logout", function(req, res)
{
    req.session.destroy(function(err)
    {
        if (err)
        {
            res.send("Error logging out");
        }
        else
        {
            res.send(`
                <h2>You have successfully logged out!</h2>
                <a href="/login.html">Login again</a>
            `);
        }
    });
});

app.listen(3000);