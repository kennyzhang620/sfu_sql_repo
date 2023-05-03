const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const sqlconnector = require('./dbConfigMSQL')
//const bcrypt = require('bcrypt');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const csvParser = require('csvtojson');
const cors = require('cors') //cross-origin resource sharing
const axios = require('axios')
const url = require('url')
const multer  = require('multer');

const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const bodyParser = require('body-parser');
const path = require('path')

const PORT = process.env.PORT || 5010;
app.use('/sfu-research-db/', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

function hashCode(str) {
    let hash = 0;
    for (var i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

app.use(cors({
    origin: '*' // change to webapp later
}));


const halfHr = 1000 * 60 * 30;
var session;

app.use(function(request, response, next) {

    if (request.headers['x-forwarded-proto'] !== 'https') {
       return response.redirect("https://" + request.headers.host + request.url);
    }

    next();
})
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

app.get('/sfu-research-db/',(req,res)=>{
    //res.send('Hello');
	console.log('Loading db');
    
    session = req.session;
    if (session.userid)
        res.redirect('/sfu-research-db/db');
    else
        res.redirect('/sfu-research-db/login?url=sfu-research-db/db');

});

app.get('/sfu-research-db/err', (req, res) => {
    res.render('pages/err')
});

function getPermissionType(n) {
    if (n == 1)
        return 'Viewer'
    if (n == 2)
        return 'Appender'
    if (n == 3)
        return 'Editor'
    if (n == 4)
        return 'Manager'

    if (n == 5)
        return 'Administrator'
}

async function send_ack(surl, token) {

    // getting img and converting to base64 - will need to replace with request to img database
    const ta = 'https://cas.sfu.ca/cas/serviceValidate' + '?service=' + surl + '&ticket=' + token;
    return await axios.get(ta);
}

async function querySQL(sql) {
    const result = await sqlconnector.query(sql).catch(err => { console.log('ERR!', err) })
    return result;
}

async function verify_allowed(sfuid) {
    try {
        const sqlStatement = `SELECT * FROM SFU_Allowed WHERE username = '${sfuid}'`;
        const results = await querySQL(sqlStatement);
        const data = { results: results};

        console.log('userdata:', data)

        if (data.results.length > 0) {
            return data.results[0].permission_level;
        }

    }
    catch (err) {
        console.log('Error: =>', err);
    }
    return 0;
}

app.get('/sfu-research-db/login?', async (req, res) => {

    console.log('testing cas auth');
	
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
	
	const redir_url = query.url
    const curr_url = req.protocol + '://' + req.get('host') + '/sfu-research-db/login?url=' + redir_url 
    const cas_url = 'https://cas.sfu.ca/cas/login?service=' + curr_url;
    
    
    const tid = query.ticket

    if (tid == null) {
        res.redirect(cas_url)
    }
    else {
        console.log('--->', curr_url, tid);
        var resp = await send_ack(curr_url, tid);
        console.log('rsults: ', res.status, res.data);

        if (resp.status == 200) {
            const parser = new XMLParser();
            let jObj = parser.parse(resp.data);

            let name = jObj['cas:serviceResponse']['cas:authenticationSuccess']
            if (name != null) {
                console.log('authUser: ', name['cas:user']);

                var getPermissionLevel = await verify_allowed(name['cas:user'])

                if (getPermissionLevel > 0) {
                    session = req.session;
                    session.userid = name['cas:user'];
                    session.permission_level = getPermissionLevel;
                    console.log(req.session)

                    res.redirect('/' + redir_url);
                }
                else {
                    res.redirect('/sfu-research-db/err');
                }
            }
            else {
                res.redirect('/sfu-research-db/err');
            }
        }
    }

});

app.get('/sfu-research-db/db', (req, res) => {
    //res.send('Hello');
    console.log('Loading db');

    session = req.session;
    if (session.userid && session.permission_level > 0)
        res.render('pages/database_research', { sfu_id: session.userid, db_type: getPermissionType(session.permission_level) });
    else
        res.redirect('/sfu-research-db/login?url=sfu-research-db/db');

});

app.get('/sfu-research-db/db2', (req, res) => {
    //res.send('Hello');
    console.log('Loading db2');
    session = req.session;
    if (session.userid && session.permission_level > 0)
        res.render('pages/database_pubs', { sfu_id: session.userid, db_type: getPermissionType(session.permission_level) });
    else
        res.redirect('/sfu-research-db/login?url=sfu-research-db/db2');

});

app.get('/sfu-research-db/view_db/:index', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring 'SFU' that matches any field and return the first 10 entries.
    let ind = req.params.index

    session = req.session;
    if (session.userid && session.permission_level > 0) {
        const start = ind * 10
        const end = start + 10

        console.log('Range: ', start, end)
        const sqlStatement = `SELECT * FROM SFU_Research LIMIT 10 OFFSET ${start};`;

        try {
            var commandstoDB = sqlStatement

            const result = await querySQL(sqlStatement)
            const data = { results: result, p_level: session.permission_level };

            console.log(data)
            //  console.log(data.results[0].is_healthy)
            // res.render('pages/Information', data);
            res.json(data);
            status = 0;
        }
        catch (error) {
            console.log('X->', error);
            status = -2;
            res.json('None.')
        }
    }
    else {
        res.status(403);
    }
});

app.get('/sfu-research-db/view_db/:search/:index', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring 'SFU' that matches any field and return the first 10 entries.
    let searchP = req.params.search.replace(/'/g, "''")
    let ind = req.params.index

    session = req.session;
    if (session.userid && session.permission_level > 0) {
		if (ind == -101) {
	        try {
				
				const sqlStatement = `SELECT COUNT(*) FROM SFU_Research;`
	            var commandstoDB = sqlStatement

	            const result = await querySQL(sqlStatement)
	            const data = { results: result, p_level: session.permission_level };

	            console.log(data)
	            //  console.log(data.results[0].is_healthy)
	            // res.render('pages/Information', data);
	            res.json(data);
	            status = 0;
	        }
	        catch (error) {
	            console.log('X->', error);
	            status = -2;
	            res.json('None.')
	        }
		}
		else {
        const start = ind * 10
        const end = start + 10

        console.log('Range: ', start, end)
        // latitude	longitude	research_site	project	pi	co_pi	collabs	keywords	fperiod	funder	url
        const sqlStatement = `SELECT * FROM SFU_Research WHERE
        (project LIKE '%${searchP}%' OR research_site LIKE '%${searchP}%' OR pi LIKE '%${searchP}%' OR co_pi LIKE '%${searchP}%' or collabs LIKE '%${searchP}%' or keywords LIKE '%${searchP}%' or funder LIKE '%${searchP}%' or url LIKE '%${searchP}%') 
        LIMIT 10 OFFSET ${start};`;

        try {
            var commandstoDB = sqlStatement

            const result = await querySQL(sqlStatement)
            const data = { results: result, p_level: session.permission_level  };

            console.log(data)
            //  console.log(data.results[0].is_healthy)
            // res.render('pages/Information', data);
            res.json(data);
            status = 0;
        }
        catch (error) {
            console.log('X->', error);
            status = -2;
            res.json('None.')
        }
		}
    }
    else {
        res.status(403);
    } 
});


app.get('/sfu-research-db-public/view_db/:index', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring 'SFU' that matches any field and return the first 10 entries.
    let ind = req.params.index
        const start = ind * 10
        const end = start + 10

        console.log('Range: ', start, end)
        const sqlStatement = `SELECT * FROM SFU_Research LIMIT 10 OFFSET ${start};`;

        try {
            var commandstoDB = sqlStatement

            const result = await querySQL(sqlStatement)
            const data = { results: result, p_level: 0 };

            console.log(data)
            //  console.log(data.results[0].is_healthy)
            // res.render('pages/Information', data);
            res.json(data);
            status = 0;
        }
        catch (error) {
            console.log('X->', error);
            status = -2;
            res.json('None.')
        }
    
});

app.get('/sfu-research-db/view_db_2/:index', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring 'SFU' that matches any field and return the first 10 entries.
    let ind = req.params.index

    session = req.session;
    if (session.userid && session.permission_level > 0) {
        const start = ind * 10
        const end = start + 10

        console.log('Range: ', start, end)
        const sqlStatement = `SELECT * FROM SFU_Plot LIMIT 10 OFFSET ${start};`;

        try {
            var commandstoDB = sqlStatement

            const result = await querySQL(sqlStatement)
            const data = { results: result, p_level: session.permission_level };

            console.log(data)
            //  console.log(data.results[0].is_healthy)
            // res.render('pages/Information', data);
            res.json(data);
            status = 0;
        }
        catch (error) {
            console.log('X->', error);
            status = -2;
            res.json('None.')
        }
    }
    else {
        res.status(403);
    }
});

app.get('/sfu-research-db/view_db_2/:search/:index', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring 'SFU' that matches any field and return the first 10 entries.
    let searchP = req.params.search.replace(/'/g, "''")
    let ind = req.params.index

    session = req.session;
    if (session.userid && session.permission_level > 0) {
		if (ind == -101) {
	        try {
				
				const sqlStatement = `SELECT COUNT(*) FROM SFU_Plot;`
	            var commandstoDB = sqlStatement

	            const result = await querySQL(sqlStatement)
	            const data = { results: result, p_level: session.permission_level };

	            console.log(data)
	            //  console.log(data.results[0].is_healthy)
	            // res.render('pages/Information', data);
	            res.json(data);
	            status = 0;
	        }
	        catch (error) {
	            console.log('X->', error);
	            status = -2;
	            res.json('None.')
	        }
		}
		else {
        const start = ind * 10
        const end = start + 10

        console.log('Range: ', start, end)
        // latitude	longitude	research_site	project	pi	co_pi	collabs	keywords	fperiod	funder	url

        const sqlStatement = `SELECT * FROM SFU_Plot WHERE
        (publication_title LIKE '%${searchP}%' OR author LIKE '%${searchP}%' OR co_author LIKE '%${searchP}%' OR institution LIKE '%${searchP}%' or region LIKE '%${searchP}%' or reference LIKE '%${searchP}%') 
        LIMIT 10 OFFSET ${start};`;

        try {
            var commandstoDB = sqlStatement

            const result = await querySQL(sqlStatement)
            const data = { results: result, p_level: session.permission_level };

            console.log(data)
            //  console.log(data.results[0].is_healthy)
            // res.render('pages/Information', data);
            res.json(data);
            status = 0;
        }
        catch (error) {
            console.log('X->', error);
            status = -2;
            res.json('None.')
        }
		}
    }
    else {
        res.status(403);
    }
});

app.get('/sfu-research-db/public/view_db/:start/:end', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring 'SFU' that matches any field and return the first 10 entries.
    let start = req.params.start
    let end = req.params.end

    console.log('Range: ', start, end)
    const sqlStatement = `SELECT * FROM SFU_Research LIMIT ${end} OFFSET ${start};`;

    try {
        var commandstoDB = sqlStatement

        const result = await querySQL(sqlStatement)
        const data = result;

        console.log(data)
        //  console.log(data.results[0].is_healthy)
        // res.render('pages/Information', data);
        res.json(data);

        status = 0;
    }
    catch (error) {
        console.log('X->', error);
        status = -2;
        res.json('None.')
    }

});

app.get('/sfu-research-db/public/view_db_2/:start/:end', async (req, res) => { // example: /view_db/SFU/0 // searches for db entry with substring 'SFU' that matches any field and return the first 10 entries.
    let start = req.params.start
    let end = req.params.end

        console.log('Range: ', start, end)
        const sqlStatement = `SELECT * FROM SFU_Plot LIMIT ${end} OFFSET ${start};`;

        try {
            var commandstoDB = sqlStatement

            const result = await querySQL(sqlStatement)
            const data = result;

            console.log(data)
            //  console.log(data.results[0].is_healthy)
            // res.render('pages/Information', data);
            res.json(data);

            status = 0;
        }
        catch (error) {
            console.log('X->', error);
            status = -2;
            res.json('None.')
        }
    
});

async function insertDatabase1_CSV(parsedD) {
    var statusInd = 0;
    console.log("DD ", parsedD[0])
    for (var i = 0; i < parsedD.length; i++) {
        try {
            var Proj = parsedD[i].Project.replace(/'/g, "''")?.trim() ?? "";
            var PI = parsedD[i].PI.replace(/'/g, "''")?.trim() ?? "";
            var coPIs = parsedD[i]["Co-PI(s)"].replace(/'/g, "''")?.trim() ?? "";
            var collab = parsedD[i]['Collaborators\r\n(not funders)'].replace(/'/g, "''")?.trim() ?? "";
            var funders = parsedD[i].Funder.replace(/'/g, "''")?.trim() ?? "";
            var fundyear = parseInt(parsedD[i]["Funding period"].trim() ?? "");
            var keywords = parsedD[i]["Research keywords"].replace(/'/g, "''")?.trim() ?? "";
            var Research_S = parsedD[i]["Research Sites"].replace(/'/g, "''")?.trim() ?? "";
            var lat = parseFloat(parsedD[i].latitude.trim() ?? "");
            var long = parseFloat(parsedD[i].longitude.trim() ?? "");
            var url = parsedD[i].Image_URL.replace(/'/g, "''").trim() ?? '';
			var hC = hashCode(JSON.stringify(Proj+PI+coPIs+collab+funders+fundyear+keywords+Research_S+lat+long+url));

            const sqlStatement = `INSERT INTO SFU_Research (latitude, longitude, research_site, project, pi, co_pi, collabs, keywords, fperiod, funder, url, locator) VALUES (${lat},${long},'${Research_S}','${Proj}', '${PI}', '${coPIs}', '${collab}', '${keywords}', ${fundyear}, '${funders}', '${url}', '${hC}');`;

                  console.log('===>', sqlStatement)
            const result = await querySQL(sqlStatement)
            const data = { results: result };

            // console.log(data)
            statusInd++
        }
        catch (err) {
           	console.log('>>>>>', err)
            statusInd--;
        }

    }

    return statusInd;
}

async function insertDatabase2_CSV(parsedD) {
	var statusInd = 0;
	for (var i=0;i<parsedD.length;i++) {
				try {
                    var proj = parsedD[i]['Publication title'].replace(/'/g, "''").substring(0, 127) ?? '';
                    var authors = parsedD[i]['Faculty of Education Author(s)'].replace(/'/g, "''")?.trim() ?? '';
                    var co_auth = parsedD[i]['Co-author(s)'].replace(/'/g, "''")?.trim() ?? ''
                    var institution = parsedD[i].Institution.replace(/'/g, "''").trim() ?? '';
					var lat = parseFloat(parsedD[i].Latitude.trim() ?? '');
					var long = parseFloat(parsedD[i].Longitude.trim() ?? '');
                    var references = parsedD[i].References.replace(/'/g, "''").trim() ?? '';
                    var region = parsedD[i].Region.replace(/'/g, "''").trim()??''
					var year = parseInt(parsedD[i].Year.trim() ?? '');
					var hC = hashCode(JSON.stringify(proj+authors+co_auth+institution+lat+long+references+region+year));
				
		        const sqlStatement = `INSERT INTO SFU_Plot (latitude, longitude, publication_title, author, co_author, institution, region, year, reference, locator) VALUES (${lat},${long}, '${proj}','${authors}', '${co_auth}', '${institution}', '${region}', ${year}, '${references}', '${hC}');`;

		  //      console.log('===>', sqlStatement)
		        const result = await querySQL(sqlStatement)
		        const data = { results: result };

		       // console.log(data)
				statusInd++
				}
				catch (err) {
				//	console.log('>>>>>', err)
					statusInd--;
				}
		        
	}
	
	return statusInd;
}

var upload = multer();

app.post('/sfu-research-db/append_all/db1', upload.single('csv_data'), async function (req, res, next) {
    // req.file is the `uploadCsv` file 
    // req.body will hold the text fields, if there were any 

    console.log('Incoming transfer...')
    let file = req.body
    session = req.session;
    if (session.userid && session.permission_level >= 4) { // minimum lvl 4
        //  console.log(req.file);
        // the buffer here containes your file data in a byte array 
        var csvf = req.file.buffer.toString('utf8');

        const result_r = await csvParser().fromString(csvf);
        console.log('RES: ', result_r[0]);

        const cur_res = await insertDatabase1_CSV(result_r)

        if (cur_res > 0) {
            console.log('Successful appends: ', cur_res)
            res.status(200)
        }
        else {
            console.log('Appending failed.')
            res.status(404);
        }
    }
    else {
        res.status(403);
    }
});

app.post('/sfu-research-db/append_all/db2',upload.single('csv_data'), async function (req, res, next) {
          // req.file is the `uploadCsv` file 
          // req.body will hold the text fields, if there were any 
	
	console.log('Incoming transfer...')
	let file = req.body
	session = req.session;
	if (session.userid && session.permission_level >= 4) { // minimum lvl 4
      //  console.log(req.file);
        // the buffer here containes your file data in a byte array 
        var csvf = req.file.buffer.toString('utf8');
		
		const result_r = await csvParser().fromString(csvf);
		console.log('RES: ', result_r[0]);
		
		const cur_res = await insertDatabase2_CSV(result_r)
		
		if (cur_res > 0) {
			console.log('Successful appends: ', cur_res)
			res.status(200)
		}
		else {
			console.log('Appending failed.')
			res.status(404);
		}
	}		  
	else {
		res.status(403);
	}	  
});

app.post('/sfu-research-db/add_entry/', async (req, res) => {

    console.log('Reading...');
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let Proj = req.body.project.replace(/'/g, "''");
    let Research_S = req.body.research_sites.replace(/'/g, "''")
    let PI = req.body.pi_main.replace(/'/g, "''")
    let coPIs = req.body.co_pi.replace(/'/g, "''")
    let collab = req.body.collabs.replace(/'/g, "''")
    let funders = req.body.funders.replace(/'/g, "''") 
    let keywords = req.body.keywords.replace(/'/g, "''")
    let fundyear = req.body.year;
    let auth_key = req.body.auth_key
    let url = req.body.url.replace(/'/g, "''")
    var hC = hashCode(JSON.stringify(Proj+PI+coPIs+collab+funders+fundyear+keywords+Research_S+lat+long+url));
	
    session = req.session;
    if (session.userid && session.permission_level >= 2) {
        const sqlStatement = `INSERT INTO SFU_Research (latitude, longitude, research_site, project, pi, co_pi, collabs, keywords, fperiod, funder, url, locator) VALUES (${lat},${long},'${Research_S}','${Proj}', '${PI}', '${coPIs}', '${collab}', '${keywords}', ${fundyear}, '${funders}', '${url}', '${hC}');`;

        console.log('===>', sqlStatement)
        const result = await querySQL(sqlStatement)
        const data = { results: result };

        console.log(data)
        res.json('Success!');
    }
    else {
        res.status(403);
    }
});

app.post('/sfu-research-db/add_entry_2/', async (req, res) => {

    console.log('Reading...');

    let lat = req.body.latitude;
    let long = req.body.longitude;
    let proj = req.body.project.replace(/'/g, "''");
    let authors = req.body.authors.replace(/'/g, "''")
    let co_auth = req.body.co_authors.replace(/'/g, "''")
    let institution = req.body.institution.replace(/'/g, "''")
    let region = req.body.region.replace(/'/g, "''")
    let year = req.body.year;
    let references = req.body.ref.replace(/'/g, "''")
	var hC = hashCode(JSON.stringify(proj+authors+co_auth+institution+lat+long+references+region+year));

    session = req.session;
    if (session.userid && session.permission_level >= 2) {
        //CREATE TABLE SFU_Plot (id SERIAL, latitude FLOAT, longitude FLOAT, publication_title VARCHAR(225), author VARCHAR(100), co_author VARCHAR(100), institution VARCHAR(100), region VARCHAR(30),  year INTEGER, reference VARCHAR(100), PRIMARY KEY(id));
        // ALTER TABLE SFU_Plot ADD PRIMARY KEY (latitude, longitude, publication_title, region, year);
        const sqlStatement = `INSERT INTO SFU_Plot (latitude, longitude, publication_title, author, co_author, institution, region, year, reference, locator) VALUES (${lat},${long},'${proj}','${authors}', '${co_auth}', '${institution}', '${region}', ${year}, '${references}', '${hC}');`;

        console.log('===>', sqlStatement)
        const result = await querySQL(sqlStatement)
        const data = { results: result };

        console.log(data)
        res.json('Success!');
    }
    else {
        res.status(403);
    }
});

app.post('/sfu-research-db/update_entry_2/', async (req, res) => {

    console.log('Reading...');

    let uid = req.body.uid;
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let proj = req.body.project.replace(/'/g, "''");
    let authors = req.body.authors.replace(/'/g, "''")
    let co_auth = req.body.co_authors.replace(/'/g, "''")
    let institution = req.body.institution.replace(/'/g, "''")
    let region = req.body.region.replace(/'/g, "''")
    let year = req.body.year;
    let references = req.body.ref.replace(/'/g, "''")
	var hC = hashCode(JSON.stringify(proj+authors+co_auth+institution+lat+long+references+region+year));

    session = req.session;
    if (session.userid && session.permission_level >= 3) {
        const sqlStatement = `UPDATE SFU_Plot SET locator = '${hC}', latitude = ${lat}, longitude = ${long}, publication_title = '${proj}', author = '${authors}', co_author = '${co_auth}', institution = '${institution}', region = '${region}', year = ${year}, reference = '${references}' WHERE id = ${uid};`;


        console.log('===>', sqlStatement)
        const result = await querySQL(sqlStatement)
        const data = { results: result };

        console.log(data)

        res.json('Success!');
    }
    else {
        res.status(403);
    }
});

app.post('/sfu-research-db/update_entry/', async (req, res) => {

    console.log('Reading...');
    let uid = req.body.uid;
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let Proj = req.body.project.replace(/'/g, "''");
    let Research_S = req.body.research_sites.replace(/'/g, "''")
    let PI = req.body.pi_main.replace(/'/g, "''")
    let coPIs = req.body.co_pi.replace(/'/g, "''")
    let collab = req.body.collabs.replace(/'/g, "''")
    let funders = req.body.funders.replace(/'/g, "''")
    let keywords = req.body.keywords.replace(/'/g, "''")
    let fundyear = req.body.year;
    let hC = hashCode(JSON.stringify(Proj+PI+coPIs+collab+funders+fundyear+keywords+Research_S+lat+long+url));
    let url = req.body.url.replace(/'/g, "''")

    session = req.session;
    if (session.userid && session.permission_level >= 3) {
        const sqlStatement = `UPDATE SFU_Research SET locator = '${hC}', latitude = ${lat}, longitude = ${long}, research_site = '${Research_S}', project = '${Proj}', pi = '${PI}', co_pi = '${coPIs}', collabs = '${collab}', keywords = '${keywords}', fperiod = ${fundyear}, funder = '${funders}', url = '${url}' WHERE id = ${uid};`;


        console.log('===>', sqlStatement)
        const result = await querySQL(sqlStatement)
        const data = { results: result };
         
        console.log(data)

        res.json('Success!');
    } 
    else {
        res.status(403);
    }
});

app.post('/sfu-research-db/delete_entry/', async (req, res) => {

    console.log('Deleting...'); // all of the contents must match up with db contents. this prevents accidental deletion from packet loss.
    let uid = req.body.uid
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let auth_key = req.body.auth_key;

    session = req.session;
    if (session.userid && session.permission_level >= 4) {

        const sqlStatement = `DELETE FROM SFU_Research WHERE id = '${uid}'`;

        const result = await querySQL(sqlStatement);
        const data = { results: result };
    
        res.json('Success!');
    }
    else {
        res.status(403);
    }
});

app.post('/sfu-research-db/delete_entry_2/', async (req, res) => {

    console.log('Deleting...'); // all of the contents must match up with db contents. this prevents accidental deletion from packet loss.
    let uid = req.body.uid
    let lat = req.body.latitude;
    let long = req.body.longitude;

    session = req.session;
    if (session.userid && session.permission_level >= 4) {

        const sqlStatement = `DELETE FROM SFU_Plot WHERE id = '${uid}'`;

        const result = await querySQL(sqlStatement);
        const data = { results: result };

        res.json('Success!');
        console.log("Deleted: ", uid, lat, long, data.results)
    }
    else {
        res.status(403);
    }
});

app.post('/sfu-research-db/delete_entry_1_bulk/', async (req, res) => {

    console.log('Deleting bulk...'); // all of the contents must match up with db contents. this prevents accidental deletion from packet loss.
    let uids = req.body.ids

    console.log('uidss', uids)
    session = req.session;
    if (session.userid && session.permission_level >= 4 && uids != null) {

        for (var i = 0; i < uids.length; i++) {
            const uid = uids[i];
            const sqlStatement = `DELETE FROM SFU_Research WHERE id = ${uid}`;

            const result = await querySQL(sqlStatement);
            const data = { results: result };
            console.log("Deleted: ", uid)
        }
    }
    else {
        res.status(403);
    }

    res.json('Success!');
});

app.post('/sfu-research-db/delete_entry_2_bulk/', async (req, res) => {

    console.log('Deleting bulk...'); // all of the contents must match up with db contents. this prevents accidental deletion from packet loss.
    let uids = req.body.ids

    console.log('uidss', uids)
    session = req.session;
    if (session.userid && session.permission_level >= 4 && uids != null) {

        for (var i = 0; i < uids.length; i++) {
            const uid = uids[i];
            const sqlStatement = `DELETE FROM SFU_Plot WHERE id = ${uid}`;

            const result = await querySQL(sqlStatement);
            const data = { results: result };
            console.log("Deleted: ", uid)
        }
    }
    else {
        res.status(403);
    }

    res.json('Success!');
});

function sanitizer(commands, db) {
    const notallowed = ['drop', 'alter', 'create'] // selection is allowed due to some operations needing it
    const length = 450;

    if (commands == null || db == null)
        return false

    console.log("Check1")
    
    if (!commands.includes(db) && !commands.includes('SFU_Allowed'))
        return false

    console.log("Check1");
    const check = commands.toLowerCase();

    if (check.length > length)
        return false;

    if (check.includes('delete') && !check.includes('where'))
        return false;
	
    if (check.includes('update') && !check.includes('where'))
        return false;

    console.log("Check1");

    for (var na = 0; na < notallowed.length; na++) {
        if (check.includes(notallowed[na]))
            return false;
    }

    console.log("Check1");
    return true; // It's free of malicious queries!
}

app.post('/sfu-research-db/command_db/', async (req, res) => {

    let cmd = req.body.commands
    let database = req.body.database

    console.log(cmd, database)
    session = req.session;
    if (session.userid && session.permission_level >= 5) {

        if (sanitizer(cmd, database)) { // without sanitizer very bad
            const sqlStatement = cmd;

            const result = await querySQL(sqlStatement);
            const data = { results: result };

            console.log("Success!>>", result)
			res.json("Query result: " + JSON.stringify(result));
        }
        else {
			res.json("Query failed. Reason: Illegal command.");
            res.status(403);
        }
    }
    else {
		res.json("Insufficient permissions.");
        res.status(403);
    }

    res.status(200);
});


app.get('/sfu-research-db/logout', (req, res) => {
    req.session.destroy();
    res.redirect('https://cas.sfu.ca/cas/logout');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // allows us to export app for use in testing
