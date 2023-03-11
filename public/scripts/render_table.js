var dataBaseArray = null;
var tableView = document.getElementsByClassName("main_editor")
var addView = document.getElementsByClassName("add_entry")
var storedData = null;
var updateList = [false, false, false, false, false, false, false, false, false, false, false]

var updateDetected = false;
function print(objectD) {
    console.log(objectD)
}


function animationState() {
    console.log("CLICKED!", cBtn.style.animationPlayState);
    cBtn.style.display = "block";
    uBtn.style.display = "block";

    if (cBtn.style.animationDirection == "reverse" || cBtn.style.animationPlayState == "") {
        cBtn.style.animationDirection = "normal";
        uBtn.style.animationDirection = "normal";
        cBtn.style.animationPlayState = "running";
        uBtn.style.animationPlayState = "running";

        hoverBtn.style.filter = "opacity(0.4) drop-shadow(0 0 0 green)";
        console.log("XX");
    }
    else if (cBtn.style.animationPlayState == "paused") {
        cBtn.style.animationDirection = "reverse";
        uBtn.style.animationDirection = "reverse";
        cBtn.style.animationPlayState = "running";
        uBtn.style.animationPlayState = "running";

        hoverBtn.style.filter = "initial";
        console.log("XX2");
    }

    uBtn.style.animationName = "topout";
    cBtn.style.animationName = "pullout";
}

function modifyfilters() {
    filterList[0] = hs.value;
    filterList[1] = ed.value;
    filterList[2] = pp.value;
    filterList[3] = ptype.value;

    console.log(filterList);
    filterDisplay();
}

function subStrCheck(results, substr) {
    var query = substr;
    return results.common_name.toLowerCase().includes(query) || results.latin_name.toLowerCase().includes(query) || results.plant_description.toLowerCase().includes(query)
        || (results.disease_name != null && results.disease_name.toLowerCase().includes(query));
}
function filterDisplay() {
    if (storedData != null) {
        if (storedData != null && storedData.results != null && storedData.results.length > 0) {
            clearCells();

            var results = storedData.results;
            for (var i = 0; i < results.length; i++) {
                var allow = true

                var query = searchbar.value.toLowerCase();
                if (subStrCheck(results[i], query)) {
                    if (filterList[0] != "Any") {
                        console.log(results[i], filterList[1]);
                        if (filterList[0] == 'healthy' && (results[i].is_healthy == null || results[i].is_healthy != true)) {
                            allow = false;
                        }
                        else if (filterList[0] == "unhealthy" && (results[i].is_healthy != null && results[i].is_healthy == true)) {
                            allow = false;
                        }
                    }

                    if (filterList[1] != "Any") {
                        if (filterList[1] == "Edible" && (results[i].is_edible == null || results[i].is_edible != true)) {
                            allow = false;
                        }
                        else if (filterList[1] == "Inedible" && (results[i].is_edible != null || results[i].is_edible == true)) {
                            allow = false;
                        }
                    }

                    if (filterList[2] != "Any") {
                        if (filterList[2] == "Cutting" && (results[i].division == null || results[i].division != true)) {
                            allow = false;
                        }
                        if (filterList[2] == "Division" && (results[i].division == null || results[i].division != true)) {
                            allow = false;
                        }
                        else if (filterList[2] == "Grafting" && (results[i].grafting == null || results[i].grafting != true)) {
                            allow = false;
                        }
                        else if (filterList[2] == "Seeds" && (results[i].seeds == null || results[i].seeds != true)) {
                            allow = false;
                        }
                        else if (filterList[2] == "Spores" && (results[i].spores == null || results[i].spores != true)) {
                            allow = false;
                        }
                        else if (filterList[2] == "Suckers" && (results[i].suckers == null || results[i].suckers != true)) {
                            allow = false;
                        }

                    }
                    if (filterList[3] != "Any") {
                        if (filterList[3] == "Food") {
                            if (!subStrCheck(results[i], "food") && !subStrCheck(results[i], "vegetable") && !subStrCheck(results[i], "fruit") && !subStrCheck(results[i], "berry") && !subStrCheck(results[i], "berries") && !subStrCheck(results[i], "edible"))
                                allow = false;
                        }
                        else {
                            if (!subStrCheck(results[i], filterList[3].toLowerCase()))
                                allow = false;
                        }
                    }

                    //    console.log(parsedD.results[i].image_data)
                }
                else {
                    allow = false;
                }

                if (allow)
                    generateCell(results[i].image64, results[i].id);
            }
        }
    }
}

function displayFilters() {
    if (filters.style.display == "none" || filters.style.display == "") {
        filters.style.display = "block";
    }
    else {
        filters.style.display = "none";
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

    sendPacket('/delete_entry', newEntry);
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
        "url": url,
        "auth_key": "93y7y33"
    }

    sendPacket('/update_entry/', newEntry);
}

function runUpdates() {
    for (var i = 0; i < updateList.length; i++) {
        if (i != updateList.length - 1 && updateList[i]) {
            const items = document.getElementsByName(`${i}_field`);

            if (items[0].checked) {
                const val = confirm("Database entries detected that are marked for deletion. Press OK to confirm deletion.")

                if (val) {
                    deleteDB(items[0].id.replace(/\D/g, ''), items[1].value, items[2].value)
                }


            }
            else {
                updateDBEntry(items[0].id.replace(/\D/g, ''), items[1].value, items[2].value, items[3].value, items[4].value, items[5].value, items[6].value, items[7].value, items[8].value, items[9].value, items[10].value, items[11].value);
            }
        }
        else if (i == updateList.length - 1 && updateList[i]) {
			console.log("Update1");
            pushNewEntry();
        }
    }

  //  top.location.reload()
}

function insertAsStr(dataEntry, ind) {
    var out = `
            <tr>
                <td><input type="checkbox" name="${ind}_field" id="${dataEntry.id}_rm" value="" oninput="updateDB(${ind})"></td>
                <td><input type="number" name="${ind}_field" id="${dataEntry.id}_lat" value="${dataEntry.latitude}" oninput="updateDB(${ind})"\></td>
                <td><input type="number" name="${ind}_field" id="${dataEntry.id}_long" value="${dataEntry.longitude}" oninput="updateDB(${ind})"\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_rs" value="${dataEntry.research_site}" oninput="updateDB(${ind})"\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_proj" value="${dataEntry.project}" oninput="updateDB(${ind})"\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_pi" value="${dataEntry.pi}" oninput="updateDB(${ind})"\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_cpi" value="${dataEntry.co_pi}" oninput="updateDB(${ind})"\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_collabs" value="${dataEntry.collabs}" oninput="updateDB(${ind})"\></td>
                <td><input type="text" name="${ind}_field" d="${dataEntry.id}_kw" value="${dataEntry.keywords}" oninput="updateDB(${ind})"\></td>
                <td><input type="number" name="${ind}_field" id="${dataEntry.id}_fperiod" value="${dataEntry.fperiod}" oninput="updateDB(${ind})"\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_fund" value="${dataEntry.funder}" oninput="updateDB(${ind})"\></td>
                <td><input type="text" name="${ind}_field" id="${dataEntry.id}_url" value="${dataEntry.url}" oninput="updateDB(${ind})"\></td>
            </tr>
	`
	return out;
	
}
function generateCell(tb, dataEntries, start, end) { // in packs of 10 each.

    var inner = tb

    if (inner != null) {

        var container = inner[0];

        var base = `
        <table>
            <tr>
                <td>Mark for Deletion</td>
                <td>Latitude (AutoFill capable)</td>
                <td>Longitude (AutoFill capable)</td>
                <td>Research Sites</td>
                <td>Project</td>
                <td>Principle Investigator</td>
                <td>Co-PIs</td>
                <td>Collaborators (not funders)</td>
                <td>Research Keywords (AutoFill capable)</td>
                <td>Funding Period</td>
                <td>Funder</td>
                <td>Image URL</td>
            </tr>`
		var insert = ""
		for (var i =start;i<end;i++) {
			insert += insertAsStr(dataEntries[i], i)
		}
		
		var endEl = `</table>`

        var newNode = document.createRange().createContextualFragment(base+insert+endEl);
        container.appendChild(newNode);

    }
    
}

function getDB() {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "/test_case?key=testkey1928");

    txtFile.onload = function (e) {
        if (txtFile.readyState === 4) {
            if (txtFile.status === 200) {
                var csvData = txtFile.responseText;

                if (csvData != null) {
                    parsedD = JSON.parse(csvData);
                    storedData = parsedD;
                    console.log("--->", parsedD);

                    if (parsedD != null && parsedD.results != null && parsedD.results.length > 0) {
                        clearCells();

                        console.log("rest: ", parsedD.results);
                        generateCell(tableView, parsedD.results, 0,parsedD.results.length)
 
                    }
                }


            }
            else {
                console.error(txtFile.statusText);
            }
        }
    };

    txtFile.onerror = function (e) {
        console.error(txtFile.statusText);
    };

    txtFile.send();

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

function sendPacket(url, data_main) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("POST", url);

    txtFile.setRequestHeader("Accept", "application/json");
    txtFile.setRequestHeader("Content-Type", "application/json");

    txtFile.onload = function (e) {
        if (txtFile.readyState === 4) {
            if (txtFile.status === 200) {
                var csvData = txtFile.responseText;
                console.log(csvData, "<<<<");
                console.log(csvData)

            }
            else {
                console.log("--->>>", txtFile.statusText);
            }
        }
    };

    txtFile.onerror = function (e) {
        console.error(txtFile.statusText);
    };

    txtFile.send(JSON.stringify(data_main));
}

function enforceEntry(lat, long, proj, fundperiod) {
    return (!isNaN(lat) && !isNaN(long) && proj != "" && !isNaN(fundperiod))
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
        "auth_key": "93y7y33"
    }

    console.log("ETR", enforceEntry(newEntry.latitude, newEntry.longitude, newEntry.project, newEntry.fundperiod))
    if (enforceEntry(newEntry.latitude, newEntry.longitude, newEntry.project, newEntry.fundperiod))
        sendPacket('/add_entry', newEntry);
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

window.addEventListener("beforeunload", function (e) {
    if (updateDetected) {
        var confirmationMessage = 'It looks like you have been editing something. '
            + 'If you leave before saving, your changes will be lost.';

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }
});

clearCells();
getDB()
