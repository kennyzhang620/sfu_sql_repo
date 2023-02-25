const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash =require("express-flash");
const passport = require("passport");
const cors = require("cors") //cross-origin resource sharing
const axios = require('axios')
const url = require('url')

const initializePassport = require("./passportConfig");
const globalAPIKey = "dQovNOSOTUaNoNZcs6Yvon0WyjM6JeULJSAbL2effgzxknVhAh"; 

initializePassport(passport);

//const bodyParser = require('body-parser');
const path = require('path')


const PORT = process.env.PORT || 5010;
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
//app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());    

/*CREATE TABLE SFU_Research(latitude FLOAT, longitude FLOAT, research_site VARCHAR(120),
 * project VARCHAR(120), pi VARCHAR (120), co_pi VARCHAR(120), collabs VARCHAR(120), keywords VARCHAR(120),
 * fperiod INTEGER, funder VARCHAR(120), url VARCHAR(12800), PRIMARY KEY(latitude, longitude));
 */
app.get("/",(req,res)=>{
    //res.send("Hello");
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

app.post('/view_db/:search/:index'), async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring "SFU" that matches any field and return the first 10 entries.
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
