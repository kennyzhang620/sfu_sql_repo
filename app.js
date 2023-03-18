const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
//const bcrypt = require("bcrypt");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors") //cross-origin resource sharing
const axios = require('axios')
const url = require('url')

const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const bodyParser = require('body-parser');
const path = require('path')

const PORT = process.env.PORT || 5010;
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(String(d) + '\n');
  log_stdout.write(String(d) + '\n');
};

const halfHr = 1000 * 60 * 30;
var session;

app.use(
    sessions({
        //what this does this a key we
        //want to keep secret and it's just going to encrypt all of our 
        //information we store in the session the next variable
        secret: process.env.SECRET,


        //is should we it's saying should we save our session variables if nothing has
        //changed if none of our informations change which we don't want to do that's what I say well that's what I'm saying is false
        resave: false,

        cookie: { maxAge: halfHr},
        //then finally save initialized that's also has to be false 
        //because we want to save session details if there's been no value placed
        //in the session which is false
        saveUninitialized: false



    })
);

app.get("/sfu-research-db/",(req,res)=>{
    //res.send("Hello");
	console.log("Loading db");
    
    session = req.session;
    if (session.userid)
        res.redirect("/sfu-research-db/db");
    else
        res.redirect("/sfu-research-db/login");

});

app.get('/sfu-research-db/err', (req, res) => {
    res.render("pages/err")
});

function getPermissionType(n) {
    if (n == 1)
        return "Viewer"
    if (n == 2)
        return "Appender"
    if (n == 3)
        return "Editor"
    if (n == 4)
        return "Manager"
}

async function send_ack(surl, token) {

    // getting img and converting to base64 - will need to replace with request to img database
    const ta = 'https://cas.sfu.ca/cas/serviceValidate' + '?service=' + surl + '&ticket=' + token;
    return await axios.get(ta);
}

async function verify_allowed(sfuid) {
    try {
        const sqlStatement = `SELECT * FROM SFU_Allowed WHERE username = '${sfuid}'`;

        console.log("===>", sqlStatement)
        const client = await pool.connect();
        const result = await client.query(sqlStatement);
        const data = { results: result.rows };

        console.log("userdata:", data)
        client.release();

        if (data.results.length > 0) {
            return data.results[0].permission_level;
        }
    }
    catch (err) {
        
    }
    return 0;
}

app.get("/sfu-research-db/login?", async (req, res) => {

    console.log("testing cas auth");
    const curr_url = req.protocol + '://' + req.get('host') + '/sfu-research-db/login'
    const cas_url = 'https://cas.sfu.ca/cas/login?service=' + curr_url;
    
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    const tid = query.ticket

    if (tid == null) {
        res.redirect(cas_url)
    }
    else {
        console.log("--->", curr_url, tid);
        var resp = await send_ack(curr_url, tid);
        console.log("rsults: ", res.status, res.data);

        if (resp.status == 200) {
            const parser = new XMLParser();
            let jObj = parser.parse(resp.data);

            let name = jObj['cas:serviceResponse']['cas:authenticationSuccess']
            if (name != null) {
                console.log("authUser: ", name['cas:user']);

                var getPermissionLevel = await verify_allowed(name['cas:user'])

                if (getPermissionLevel > 0) {
                    session = req.session;
                    session.userid = name['cas:user'];
                    session.permission_level = getPermissionLevel;
                    console.log(req.session)

                    res.redirect("/sfu-research-db/db");
                }
                else {
                    res.redirect("/sfu-research-db/err");
                }
            }
            else {
                res.redirect("/sfu-research-db/err");
            }
        }
    }

});

app.get("/sfu-research-db/db", (req, res) => {
    //res.send("Hello");
    console.log("Loading db");

    session = req.session;
    if (session.userid && session.permission_level > 0)
        res.render("pages/database_research", { sfu_id: session.userid, db_type: getPermissionType(session.permission_level) });
    else
        res.redirect("/sfu-research-db/login");

});

app.get("/sfu-research-db/db2", (req, res) => {
    //res.send("Hello");
    console.log("Loading db2");
    session = req.session;
    if (session.userid && session.permission_level > 0)
        res.render("pages/database_pubs", { sfu_id: session.userid, db_type: getPermissionType(session.permission_level) });
    else
        res.redirect("/sfu-research-db/login");

});

app.get('/sfu-research-db/view_db/:index', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring "SFU" that matches any field and return the first 10 entries.
    let ind = req.params.index

    session = req.session;
    if (session.userid && session.permission_level > 0) {
        const start = ind * 10
        const end = start + 10

        console.log("Range: ", start, end)
        const sqlStatement = `SELECT * FROM SFU_Research LIMIT 10 OFFSET ${start};`;

        try {
            var commandstoDB = sqlStatement

            const client = await pool.connect();
            const result = await client.query(commandstoDB);
            const data = { results: result.rows, p_level: session.permission_level };

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
        res.status(403);
    }
});

app.get('/sfu-research-db/view_db/:search/:index', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring "SFU" that matches any field and return the first 10 entries.
    let searchP = req.params.search
    let ind = req.params.index

    session = req.session;
    if (session.userid && session.permission_level > 0) {
        const start = ind * 10
        const end = start + 10

        console.log("Range: ", start, end)
        // latitude	longitude	research_site	project	pi	co_pi	collabs	keywords	fperiod	funder	url
        const sqlStatement = `SELECT * FROM SFU_Research WHERE
        (project LIKE '${searchP}' OR research_site LIKE '${searchP}' OR pi LIKE '${searchP}' OR co_pi LIKE '${searchP}' or collabs LIKE '${searchP}' or keywords LIKE '${searchP}' or funder LIKE '${searchP}' or url LIKE '${searchP}') 
        LIMIT 10 OFFSET ${start};`;

        try {
            var commandstoDB = sqlStatement

            const client = await pool.connect();
            const result = await client.query(commandstoDB);
            const data = { results: result.rows, p_level: session.permission_level  };

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
        res.status(403);
    } 
});
 
app.post('/sfu-research-db/add_entry/', async (req, res) => {

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

    session = req.session;
    if (session.userid && session.permission_level >= 2) {
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
        res.status(403);
    }
});

app.post('/sfu-research-db/add_entry_2/', async (req, res) => {

    console.log("Reading...");
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let Pub = req.body.pub_title;
    let Institution = req.body.institution
    let authors = req.body.authors
    let co_auth = req.body.co_authors
    let collab = req.body.collabs
    let title = req.body.title
    let region = req.body.region
    let year = req.body.year;
    let auth_key = req.body.auth_key
    let references = req.body.references

    session = req.session;
    if (session.userid && session.permission_level >= 2) {
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
        res.status(403);
    }
});

app.post('/sfu-research-db/update_entry/', async (req, res) => {

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

    session = req.session;
    if (session.userid && session.permission_level >= 3) {
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
        res.status(403);
    }
});

app.post('/sfu-research-db/delete_entry/', async (req, res) => {

    console.log("Deleting..."); // all of the contents must match up with db contents. this prevents accidental deletion from packet loss.
    let uid = req.body.uid
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let auth_key = req.body.auth_key;

    session = req.session;
    if (session.userid && session.permission_level >= 4) {

        const sqlStatement = `DELETE FROM SFU_Research WHERE id = '${uid}' AND latitude = ${lat} AND longitude = ${long};`;

        const client = await pool.connect();
        const result = await client.query(sqlStatement);
        const data = { results: result.rows };
    
        client.release();
        res.json("Success!");
    }
    else {
        res.status(403);
    }
});


app.get('/sfu-research-db/logout', (req, res) => {
    req.session.destroy();
    res.redirect('https://cas.sfu.ca/cas/logout');
})

app.post('/sfu-research-db/view_db/?', async (req, res) => { // A stricter search. pass in a post request with query requirements and (10*N, 10*N + 10) range of entries.
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

app.get('/sfu-research-db/view_db_all', async (req, res) => {
 

    session = req.session;
    if (session.userid && session.permission_level >= 0) {

        try {
            var commandstoDB = `SELECT * from SFU_Research;`;

            const client = await pool.connect();
            const result = await client.query(commandstoDB);
            const data = { results: result.rows, p_level: session.permission_level };

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
