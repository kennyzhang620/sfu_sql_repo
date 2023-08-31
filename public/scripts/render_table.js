var dataBaseArray = null;
var tableView = document.getElementsByClassName("main_editor")
var addView = document.getElementsByClassName("add_entry")
var searchBar = document.getElementById('search_bar')
var searchIndex = document.getElementById("counter_id")
var storedData = null;
var currSize = 0;
var updateList = [false, false, false, false, false, false, false, false, false, false, false]
var currIndex = 0;
var storedInd = -1;
var input = document.createElement('input');
const inputField = document.getElementsByName("input_sel")

input.type = 'file';
input.accept = ".csv";
const TIMEOUT = 7800;
const SESSION_TO = 1000*60*30;

var updateDetected = false;

function clearInput() {
    for (var i=0;i<inputField.length; i++) {
        inputField[i].value = "";
    }
    
    for (var i=0;i<updateList.length;i++) {
        updateList[i] = false;
    }
}
function print(objectD) {
    console.log(objectD)
}

function numeric_not_empty(num) {
    return (num != "" && !isNaN(num))
}

function not_empty(num) {
    return (num != "")
}

function indicate(id, func_ptr) {
    var element = document.getElementById(id);

    if (func_ptr(element.value)) {
        element.style.backgroundColor = "white"
        return true;
    }
    else {
        element.style.backgroundColor = "red"
        return false;
    }

}

function clearCells() {
    var inner = tableView

    if (inner != null) {
        var container = inner[0];

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

    }
	
	console.log("cleared/");
}


function updateDB(ind) {
    updateList[ind] = true;
    console.log(updateList);

	var items = document.getElementsByName(`${ind}_field`)
	var nlat = items[0]
	

    if (!updateDetected) {
        updateDetected = true;
    }

}

function deleteDB(uid, lat, long) {

    console.log("UID: ", uid)
    const newEntry = {
        "latitude": lat,
        "longitude": long,
        "uid": uid,
        "auth_key": "93y7y33"
    }

    sendPacket('/sfu-research-db/delete_entry', 'POST', newEntry, true, loadClear, onfailure);
}

function updateDBEntry(uid, lat, long, rs, proj, pi, cpi, collabs, kw, fperiod, fund, url) {
    const newEntry = {
        "uid": uid,
        "latitude": lat,
        "longitude": long,
        "project": proj,
        "research_sites": rs,
        "pi_main": pi,
        "co_pi": cpi,
        "collabs": collabs,
        "keywords": kw,
        "funders": fund,
        "year": fperiod,
        "url": url
    }

    sendPacket('/sfu-research-db/update_entry/', 'POST', newEntry, true, loadClear, onfailure);
}

function runUpdates() {

    var allow = true;
    var del = false;
    for (var i = 0; i < updateList.length; i++) {
        if (i != updateList.length - 1 && updateList[i]) {
            const items = document.getElementsByName(`${i}_field`);

            if (items.length == 12)
                allow = (indicate(items[1].id, numeric_not_empty) && indicate(items[2].id, numeric_not_empty) && indicate(items[4].id, not_empty) && indicate(items[9].id, numeric_not_empty))
            else
                allow = (indicate(items[0].id, numeric_not_empty) && indicate(items[1].id, numeric_not_empty) && indicate(items[3].id, not_empty) && indicate(items[8].id, numeric_not_empty))

            if (items[0].checked) {
                del = true;
            }
        }
    }

    
    if (del) {
        const val = confirm("Database entries detected that are marked for deletion. Press OK to confirm deletion.")

        if (!val || !allow) {
            allow = false;
        }
    }

    const newEntry = {
        "latitude": document.getElementById("add_lat").value,
        "longitude": document.getElementById("add_long").value,
        "project": document.getElementById("add_proj").value,
        "year": document.getElementById("add_fperiod").value,
    }

    if (updateList[updateList.length - 1]) {
		
        indicate("add_lat", numeric_not_empty)
        indicate("add_long", numeric_not_empty)
        indicate("add_proj", not_empty)
        indicate("add_fperiod", numeric_not_empty)
		
		 if (!enforceEntry(newEntry.latitude, newEntry.longitude, newEntry.project, newEntry.year)) {
        	 allow = false;

        	 var lat = "Latitude"; var long = "Longitude"; var proj = "Project"; var y = "Funding Period";
        	 if (!isNaN(newEntry.latitude) && newEntry.latitude != "")
            	 lat = ""

        		 if (!isNaN(newEntry.longitude) && newEntry.longitude != "")
            		 long = ""

        	     if (newEntry.project != "")
           			 proj = ""

             if (!isNaN(newEntry.year) && newEntry.year != "")
                 y = ""

        	 alert(`One or more of the following fields are blank: ${lat} ${long} ${proj} ${y}`)
		}
    }


    if (allow) {

        for (var i = 0; i < updateList.length; i++) {
            if (i != updateList.length - 1 && updateList[i]) {
                const items = document.getElementsByName(`${i}_field`);

                if (items.length == 12) {
                    if (items[0].checked) {
                        deleteDB(items[0].id.replace(/\D/g, ''), items[1].value, items[2].value);
                    }
                    else {
                        updateDBEntry(items[0].id.replace(/\D/g, ''), items[1].value, items[2].value, items[3].value, items[4].value, items[5].value, items[6].value, items[7].value, items[8].value, items[9].value, items[10].value, items[11].value);
                    }
                }
                else {
                    updateDBEntry(items[0].id.replace(/\D/g, ''), items[0].value, items[1].value, items[2].value, items[3].value, items[4].value, items[5].value, items[6].value, items[7].value, items[8].value, items[9].value, items[10].value);
                }
                
            }
            else if (i == updateList.length - 1 && updateList[i]) {
                console.log("Update1");
                pushNewEntry();

            }
        }

    }

}

function insertAsStr(dataEntry, ind, security_level) {
    var chkbx = `<td><input type="checkbox" name="${ind}_field" id="${dataEntry.id}_rm" value="" oninput="updateDB(${ind})"></td>`
    var readOnly = ""
    if (security_level < 3)
        readOnly = "readonly"
    
	if (security_level < 4)
		chkbx = "";
    var out = `
            <tr>` + chkbx + 
                `
                <td><input type="number" name="${ind}_field" id="${dataEntry.id}_lat" value="${dataEntry.latitude}" oninput="updateDB(${ind})" onclick='indicate("${dataEntry.id}_lat", numeric_not_empty)' onkeyup='indicate("${dataEntry.id}_lat", numeric_not_empty)' ${readOnly}\></td>
                <td><input type="number" name="${ind}_field" id="${dataEntry.id}_long" value="${dataEntry.longitude}" oninput="updateDB(${ind})" onclick='indicate("${dataEntry.id}_long", numeric_not_empty)' onkeyup='indicate("${dataEntry.id}_long", numeric_not_empty)' ${readOnly}\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_rs" value="${dataEntry.research_site}" oninput="updateDB(${ind})" ${readOnly}\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_proj" value="${dataEntry.project}" oninput="updateDB(${ind})" onclick='indicate("${dataEntry.id}_proj", not_empty)' onkeyup='indicate("${dataEntry.id}_proj", not_empty)' ${readOnly}\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_pi" value="${dataEntry.pi}" oninput="updateDB(${ind})" ${readOnly}\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_cpi" value="${dataEntry.co_pi}" oninput="updateDB(${ind})" ${readOnly}\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_collabs" value="${dataEntry.collabs}" oninput="updateDB(${ind})" ${readOnly}\></td>
                <td><input type="text" name="${ind}_field" d="${dataEntry.id}_kw" value="${dataEntry.keywords}" oninput="updateDB(${ind})" ${readOnly}\></td>
                <td><input type="number" name="${ind}_field" id="${dataEntry.id}_fperiod" value="${dataEntry.fperiod}" oninput="updateDB(${ind})" onclick='indicate("${dataEntry.id}_fperiod", numeric_not_empty)' onkeyup='indicate("${dataEntry.id}_fperiod", numeric_not_empty)' ${readOnly}\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_fund" value="${dataEntry.funder}" oninput="updateDB(${ind})" ${readOnly}\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_url" value="${dataEntry.url}" oninput="updateDB(${ind})" ${readOnly}\></td>
            </tr>
	`
	return out;
	
}
function generateCell(tb, dataEntries, start, end, security_level) { // in packs of 10 each.

    var inner = tb

    if (inner != null) {

        var container = inner[0];
		
		var deleteM = `<td>Mark for Deletion</td>`
		
		if (security_level < 4)
			deleteM = "";
		
        if (security_level < 2) {
            document.getElementById('entry_add').style.display = 'none';
            document.getElementById('submit_updates').style.display = 'none';
        }
        var base = `
        <table>
            <tr>` + deleteM + 
				`
                <td>Latitude (Required)</td>
                <td>Longitude (Required)</td>
                <td>Research Sites</td>
                <td>Project (Required)</td>
                <td>Principle Investigator</td>
                <td>Co-PIs</td>
                <td>Collaborators (not funders)</td>
                <td>Research Keywords </td>
                <td>Funding Period (Required)</td>
                <td>Funder</td>
                <td>Image URL</td>
            </tr>`
		var insert = ""
		for (var i =start;i<end;i++) {
			insert += insertAsStr(dataEntries[i], i, security_level)
		}
		
		var endEl = `</table>`

        var newNode = document.createRange().createContextualFragment(base+insert+endEl);
        container.appendChild(newNode);

    }
    
}

function loadDBAsync(csvData) {
    if (csvData != null) {
        parsedD = JSON.parse(csvData);
        storedData = parsedD;
        console.log("--->", parsedD);

        if (parsedD != null && parsedD.results != null && parsedD.results.length > 0) {
            clearCells();

            console.log("rest: ", parsedD.results);
            generateCell(tableView, parsedD.results, 0, parsedD.results.length, parsedD.p_level)

        }
    }
}

function getDB(searchparams, ind) {

    var inURL = ""
    if (searchparams != "")
        inURL = `/sfu-research-db/view_db/${searchparams}/${ind}`
    else {
        inURL = `/sfu-research-db/view_db/${ind}`
    }

    sendPacket(inURL, 'GET', '', true, loadDBAsync, null, onfailure);

}

function LoadUploadPanel() {
    uoverlay.style.display = "block";
    animationState();
}

function HideOverlay() {
    uoverlay.style.display = "none";
}

function encodeImageFileAsURL(fileN) {

    display_rm.style.display = 'inline-block';

    var filesSelected = fileN;
    if (filesSelected != null) {
        var fileToLoad = filesSelected;

        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64

            console.log("Converted Base64 version is: ");
            console.log(srcData);

            display_r.src = srcData;

            display_r.style = "border: 3px solid grey;"
            sendEncoded(srcData);
        }
        fileReader.readAsDataURL(fileToLoad);
    }
    else {
        console.error("Not correct file!");
    }
}

function deleteAll() {

    if (confirm("Are you sure you want to clear all visible entries?")) {
        var idsDelete = []

        for (var i = 0; i < updateList.length - 1; i++) {
            const items = document.getElementsByName(`${i}_field`);
            if (items != null && items[i] != null)
                idsDelete.push(items[0].id.replace(/\D/g, ''))
        }


        const deletePacket = {
            ids: idsDelete
        }

        sendPacket('/sfu-research-db/delete_entry_1_bulk/', 'POST', deletePacket, true, lo, onfailure)

    }
}

function alert_ref(strData) {
    alert(strData)
    top.location.reload();
}

function consoleSQL() {
    var input = prompt("Enter an SQL command. (Note: Only INSERT, DELETE, UPDATE are supported for security reasons. All must refer to SFU_Research and have WHERE. Any other command will be blocked from executing.)")

    if (input.length > 0) {
        const commands = {
            commands: input,
            database: 'SFU_Research'
        }

        sendPacket('/sfu-research-db/command_db/', 'POST', commands, true, alert_ref, onfailure)
    }
}

function sendPacket(url, type, data_main, asyncV = false, callback = null, failure = null) {
    var txtFile = new XMLHttpRequest();
    txtFile.open(type, url, asyncV);

    txtFile.setRequestHeader("Accept", "application/json");
    txtFile.setRequestHeader("Content-Type", "application/json");
	txtFile.timeout = TIMEOUT;
    txtFile.onload = function (e) {
        if (txtFile.readyState === 4) {
            if (txtFile.status === 200) {
                var csvData = txtFile.responseText;
               // console.log(csvData, "<<<<");
             //   console.log(csvData)
				
				if (callback != null) {
					callback(csvData)
				}

            }
            else {
                console.log("--->>>", txtFile.statusText);
				if (failure != null) {
					failure(txtFile.statusText)
				}
            }
        }
    };

	txtFile.ontimeout = function(e) {
		alert("Connection timed out. Please refresh the page and try again.");
	}
	
    txtFile.onerror = function (e) {
        alert("An error has occurred. Please refresh the page and try again.");
        console.error(txtFile.statusText);
    };

    txtFile.send(JSON.stringify(data_main));
}

function sendFile(filePtr, addr) {
    var sender = new XMLHttpRequest();
    var fdata = new FormData();
    fdata.append("csv_data", filePtr);
    sender.open("POST", addr, true)
	sender.timeout = TIMEOUT; // definition of slowness
    console.log("FD: ", fdata)
    sender.onload = function (e) {
        if (sender.readyState === 4) {
            if (sender.status === 200) {
                var csvData = sender.responseText;
                // console.log(csvData, "<<<<");
               // console.log(csvData)

                searchDB();
            }
            else {
                console.log("--->>>", sender.statusText);
                onfailure();
            }
        }
    };
	
	sender.ontimeout = function(e) {
		alert("Connection timed out. Please refresh the page and try again.");
	}; 

    sender.onerror = function (e) {
        alert("An error has occurred. Please refresh the page and try again.");
        console.error(txtFile.statusText);
    };
    
    sender.send(fdata);
}

function enforceEntry(lat, long, proj, fundperiod) {
    return (lat != "" && long != "" && fundperiod != "" && !isNaN(lat) && !isNaN(long) && proj != "" && !isNaN(fundperiod))
}
function pushNewEntry() {
    const newEntry = {
        "latitude": document.getElementById("add_lat").value,
        "longitude": document.getElementById("add_long").value,
        "project": document.getElementById("add_proj").value,
        "research_sites": document.getElementById("add_rs").value,
        "pi_main": document.getElementById("add_pi").value,
        "co_pi": document.getElementById("add_cpi").value,
        "collabs": document.getElementById("add_collabs").value,
        "keywords": document.getElementById("add_kw").value,
        "funders": document.getElementById("add_fund").value,
        "year": document.getElementById("add_fperiod").value,
        "url": document.getElementById("add_url").value,
    }

    if (enforceEntry(newEntry.latitude, newEntry.longitude, newEntry.project, newEntry.year))
        sendPacket('/sfu-research-db/add_entry', 'POST', newEntry, true, loadClear, onfailure);
}

function loadClear() {
    searchDB();
    clearInput();
}

function sendUpdates() {
    /**

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

*/

    updateDetected = false;
    runUpdates();
}

function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file' && (ev.dataTransfer.items[i].type.match('^image/'))) {
                const file = ev.dataTransfer.items[i].getAsFile();
                console.log(`� file[${i}].name = ${file.name}`);
                encodeImageFileAsURL(file);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log(`� file[${i}].name = ${ev.dataTransfer.files[i].name}`);
        }
    }
}


function dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function manualHandler(ev1) {
    input.click();
}

input.onchange = e => {

    // getting a hold of the file reference
    var file = e.target.files[0];

    console.log("Sending...")
    sendFile(file, '/sfu-research-db/append_all/db1')
}

function onfailure() {
    alert("An error has occurred. Please refresh the page and try again.");
}

function printFAlert(failtxt) {
    alert("Your session timed out. Please refresh the page.");
}

const interval = setInterval(function() {
   // method to be executed;
   sendPacket('/sfu-research-db/session_check', 'GET', '', true, null, printFAlert)
 }, SESSION_TO/4);

window.addEventListener("beforeunload", function (e) {
    if (updateDetected) {
        var confirmationMessage = 'It looks like you have been editing something. '
            + 'If you leave before saving, your changes will be lost.';

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }
});

function sizeCB(csvData) {
    if (csvData != null) {
        currSize = JSON.parse(csvData).results;

        if (currSize.length)
            currSize = currSize[0]['COUNT(*)']

        console.log("+++++>", currSize)

        searchIndex.innerHTML = `${currIndex * 10} - ${(currIndex + 1) * 10} / ${currSize}`;

    }
}

function getSize() {

    var inURL = `/sfu-research-db/view_db/count/-101`
    sendPacket(inURL, 'GET', '', true, sizeCB, onfailure);

}

function movePtr(val) {

    var mod = false;
    for (var i = 0; i < updateList.length - 1; i++) {
        if (!mod)
            mod = updateList[i]
    }

    if (mod && (currIndex + val >= 0) && (currIndex + val < currSize)) {
        if (confirm("Unsaved changed detected. Continue anyway?")) {
            currIndex += val;

            searchIndex.innerHTML = `${currIndex * 10} - ${(currIndex + 1) * 10} / ${currSize}`;

            searchDB();
        }
    }
    else if (!mod){
        if (currIndex + val >= 0 && currIndex + val < currSize)
            currIndex += val;

        searchIndex.innerHTML = `${currIndex * 10} - ${(currIndex + 1) * 10} / ${currSize}`;

        searchDB();
    }
    
}

function searchDB() {
    if (searchBar.value != "") {
        if (storedInd == -1) {
            storedInd = currIndex
            currIndex = 0;
        }
    }
    else {
        if (storedInd != -1) {
            currIndex = storedInd
            storedInd = -1;
        }
    }

    reloadDB(searchBar.value);
    searchIndex.innerHTML = `${currIndex * 10} - ${(currIndex + 1) * 10} / ${currSize}`;
}

function reloadDB(squery) {
    clearCells();
    getDB(squery, currIndex)
    for (var i = 0; i < updateList.length - 1; i++) {
        updateList[i] = false;
    }
	getSize();
}

clearInput();
reloadDB('');
