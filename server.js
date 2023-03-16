const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
//const bcrypt = require("bcrypt");
//const session = require("express-session");
//const flash = require("express-flash");
//const passport = require("passport");
const cors = require("cors") //cross-origin resource sharing
const axios = require('axios')
const url = require('url')

//const initializePassport = require("./passportConfig");

//initializePassport(passport);

const bodyParser = require('body-parser');
const path = require('path')


const PORT = process.env.PORT || 5010;
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
//app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//app.use(
//    session({
//        //what this does this a key we
//        //want to keep secret and it's just going to encrypt all of our 
//        //information we store in the session the next variable
//        secret: 'secret',


//        //is should we it's saying should we save our session variables if nothing has
//        //changed if none of our informations change which we don't want to do that's what I say well that's what I'm saying is false
//        resave: false,

//        //then finally save initialized that's also has to be false 
//        //because we want to save session details if there's been no value placed
//        //in the session which is false
//        saveUninitialized: false



//    })
//);

//app.use(passport.initialize());

//app.use(passport.session());


//app.use(flash());


//app.get("/users/register", (req, res) => {
//    res.render("pages/register");
//});

//app.get("/users/login", (req, res) => {
//    console.log('testing login')
//    res.render("pages/login");
//});

//app.get("/users/dashboard", (req, res) => {

//    if (req.user != null)
//        res.render("pages/Image_Display_Grid", { user: req.user.name });
//    else
//        res.redirect("/users/login");
//});

//app.get("/users/logout", (req, res) => {
//    req.logout(req.user, err => {
//        if (err) return next(err);
//        req.flash("success_msg", "You have logged out");
//        res.redirect("/users/login");
//    });

//});

//app.post("/users/register", async (req, res) => {
//    let name = req.body.name;
//    let email = req.body.email;
//    let password = req.body.password;
//    let password2 = req.body.password2;

//    console.log(name, email, password, password2);

//    // console.log({ name, email, password, password2 });

//    let errors = [];

//    if (!name || !email || !password || !password2) {
//        errors.push({ message: "Please enter all fields" });
//    }

//    if (password.length < 6) {
//        errors.push({ message: "Password should be at least 6 characters" });
//    }

//    if (password != password2) {
//        errors.push({ message: "Passwords do not match" });
//    }

//    if (errors.length > 0) {
//        res.render("pages/register", { errors });
//    }

//    else {
//        //form validation has passed
//        let hashedPassword = await bcrypt.hash(password, 10);
//        console.log(hashedPassword);

//        pool.query(`SELECT * FROM users WHERE email=$1`, [email], (err, results) => {
//            if (err) {
//                throw err;
//            }

//            console.log(results.rows);

//            if (results.rows.length > 0) {
//                errors.push({ message: "Email already registered" });
//                res.render("pages/register", { errors });
//            }
//            else {
//                pool.query(`INSERT INTO users (name,email,password)
//                VALUES ($1,$2,$3)
//                RETURNING id, password`,
//                    [name, email, hashedPassword],
//                    (err, results) => {
//                        if (err) {
//                            throw err;
//                        }
//                        console.log(results.rows);
//                        req.flash("success_msg", "You are now registered! Please log in");
//                        res.redirect("/users/login");
//                    })
//            }
//        });

//    }
//});

//app.post("/users/login", passport.authenticate("local", {
//    successRedirect: "/users/dashboard",
//    failureRedirect: "/users/login",
//    failureFlash: true
//})
//);

app.get("/cas_test", (req, res) => {

});

app.get("/",(req,res)=>{
    //res.send("Hello");
	console.log("Loading db");
    res.render("pages/dashboard")

});

app.get("/db2", (req, res) => {
    //res.send("Hello");
    console.log("Loading db");
    res.render("pages/dashboard")

});

app.get("/users/register", (req,res)=>{
    res.render("pages/register");
});

app.get("/users/login", (req,res)=>{
    console.log('testing login')
    res.render("pages/login");
});

app.get("/users/dashboard", (req, res) => {

    if (req.user != null)
        res.render("pages/Image_Display_Grid", { user: req.user.name });
    else
        res.redirect("/users/login");
});

app.post('/view_db/:search/:index', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring "SFU" that matches any field and return the first 10 entries.
    let searchP = req.params.search
    let ind = req.params.index
    let auth_key = req.body.auth_key // a hybrid GET/POST system. POST for key, URLEncoding for search params/index

    if (auth_key == "93y7y33" && query.index != null) {
        const start = query.index * 10
        const end = start + 10

        // latitude	longitude	research_site	project	pi	co_pi	collabs	keywords	fperiod	funder	url
        const sqlStatement = `SELECT * FROM SFU_Research WHERE id >= ${start} AND id <= ${end} AND
        (project LIKE '${searchP}' OR research_site LIKE '${searchP}' OR pi LIKE '${searchP}' OR co_pi LIKE '${searchP}' or collabs LIKE '${searchP}' or keywords LIKE '${searchP}' or funder LIKE '${searchP}' or url LIKE '${searchP}') 
        LIMIT 10;`;

        try {
            var commandstoDB = sqlStatement

            const client = await pool.connect();
            const result = await client.query(commandstoDB);
            const data = { results: result.rows };

            console.log(data)
            //  console.log(data.results[0].is_healthy)
            // res.render("pages/Information", data);
            res.json(data);
            status = 0;
            client.release();
        }
        catch (error) {
            console.log('X->', error);
            status = -2;
            res.json("None.")
        }
    }
    else {
        res.json("error")
    } 
});
 
app.post('/add_entry/', async (req, res) => {

    console.log("Reading...");
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let Proj = req.body.project;
    let Research_S = req.body.research_sites
    let PI = req.body.pi_main
    let coPIs = req.body.co_pi
    let collab = req.body.collabs
    let funders = req.body.funders 
    let keywords = req.body.keywords
    let fundyear = req.body.year;
    let auth_key = req.body.auth_key
    let url = req.body.url

    if (auth_key == "93y7y33") {
        const sqlStatement = `INSERT INTO SFU_Research (latitude, longitude, research_site, project, pi, co_pi, collabs, keywords, fperiod, funder, url) VALUES (${lat},${long},'${Research_S}','${Proj}', '${PI}', '${coPIs}', '${collab}', '${keywords}', ${fundyear}, '${funders}', '${url}');`;

        console.log("===>", sqlStatement)
        const client = await pool.connect();
        const result = await client.query(sqlStatement);
        const data = { results: result.rows };

        console.log(data)
        client.release();

        res.json("Success!");
    }
    else {
        res.error(403);
    }
});


app.post('/update_entry/', async (req, res) => {

    console.log("Reading...");
    let uid = req.body.uid;
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let Proj = req.body.project;
    let Research_S = req.body.research_sites
    let PI = req.body.pi_main
    let coPIs = req.body.co_pi
    let collab = req.body.collabs
    let funders = req.body.funders
    let keywords = req.body.keywords
    let fundyear = req.body.year;
    let auth_key = req.body.auth_key
    let url = req.body.url

    if (auth_key == "93y7y33") {
        const sqlStatement = `UPDATE SFU_Research SET latitude = ${lat}, longitude = ${long}, research_site = '${Research_S}', project = '${Proj}', pi = '${PI}', co_pi = '${coPIs}', collabs = '${collab}', keywords = '${keywords}', fperiod = ${fundyear}, funder = '${funders}', url = '${url}' WHERE id = ${uid};`;


        console.log("===>", sqlStatement)
        const client = await pool.connect();
        const result = await client.query(sqlStatement);
        const data = { results: result.rows };
         
        console.log(data)
        client.release();

        res.json("Success!");
    } 
    else {
        res.error(403);
    }
});

app.post('/delete_entry/', async (req, res) => {

    console.log("Deleting..."); // all of the contents must match up with db contents. this prevents accidental deletion from packet loss.
    let uid = req.body.uid
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let auth_key = req.body.auth_key;

    if (auth_key == "93y7y33") {

        const sqlStatement = `DELETE FROM SFU_Research WHERE id = '${uid}' AND latitude = ${lat} AND longitude = ${long};`;

        const client = await pool.connect();
        const result = await client.query(sqlStatement);
        const data = { results: result.rows };
    
        client.release();
        res.json("Success!");
    }
    else {
        res.error(403);
    }
});

app.post('/view_db/?', async (req, res) => { // A stricter search. pass in a post request with query requirements and (10*N, 10*N + 10) range of entries.
    /*
req.body.data = {
         Project: “data1”,
         Research_Sites: “data1”,
         PI: “data1”,
         Co-PI: “data1”,
         Collabs: “data1”,
         Funders: “data1”,
         keywords: “data1”,
         auth_key: “3d3dij3dijaisjais”,
 .  }
*/

    let Proj = req.body.project;
    let Research_S = req.body.research_sites
    let PI = req.body.pi_main
    let coPIs = req.body.co_pi
    let collab = req.body.collabs
    let funders = req.body.funders
    let keywords = req.body.keywords
    let auth_key = req.body.auth_key

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    if (auth_key == "93y7y33" && query.index != null) {
        const start = query.index * 10
        const end = start + 10

        const sqlStatement = `SELECT * FROM SFU_Research WHERE id >= ${start} AND id <= ${end} AND (project LIKE '${Proj}' OR ) 
LIMIT 10;`;
    }
});

app.get('/test_case?', async (req, res) => {

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

    if (query != null && query.key == "testkey1928") {
        try {
            var commandstoDB = `SELECT * from SFU_Research;`;

            const client = await pool.connect();
            const result = await client.query(commandstoDB);
            const data = { results: result.rows };

            console.log(data)
            //  console.log(data.results[0].is_healthy)
            // res.render("pages/Information", data);
            res.json(data);
            status = 0;
            client.release();
        }
        catch (error) {
            console.log('X->', error);
            status = -2;
            res.json("None.")
        }
    }
    else {
        res.json("Invalid key.")
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // allows us to export app for use in testing
