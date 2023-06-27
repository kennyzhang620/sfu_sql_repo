// JavaScript source code

// Initialize the map.
const USE_SERVER_DATA = true;
var Image_Shift = 453;
//var homeCoords = [52.476089, -50.825867];
// World centred 
// var homeCoords = [52.476089, -87.276242];

var homeCoords = [49.2787096,-122.918803];

var txtFile = new XMLHttpRequest();
var parsedD = {};
var initialize = false;
var results = [];
var colours = [];

var markers = [];
var max_res_size = 12;
var curr_limit = max_res_size;

var prevMarker = 0;
var currLabel = null;
var dbLevel = 0;

//var searchbar = document.getElementById("search");
var homebutton = document.getElementById("homebtn");
var settingsBtn = document.getElementById("settingsbtn");
// var settingsPne = document.getElementById("settingspane");
var filtersBtn = settingsBtn;
var filtersPne = document.getElementById("filters_norm");
var filtersPC = document.getElementById("filters_pc");
var infoPanel = document.getElementById("items_main");

var metadataWin = document.getElementsByClassName('data_header');
var metadataWinID = document.getElementById("data_header");
var image_panel = document.getElementById("image_display");
var indexCounter = document.getElementsByClassName('counters')

var inputBars = document.getElementsByClassName("filter_input");
var FiltersActive = false;

var defaultStyle = 'https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=qYOU04zmJXYprHE89esvVcT3qGW68VsSgDdYXjXUUmZgDRBajbH3e58EHY5bONXU';
var lightStyle = 'https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=qYOU04zmJXYprHE89esvVcT3qGW68VsSgDdYXjXUUmZgDRBajbH3e58EHY5bONXU';
var darkStyle = 'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=qYOU04zmJXYprHE89esvVcT3qGW68VsSgDdYXjXUUmZgDRBajbH3e58EHY5bONXU';

var minZoomV = 3;
var maxZoomV = 18;

var map = L.map('map', {
	minZoom: minZoomV,
	maxZoom: maxZoomV,
	zoomSnap: 1,
	maxBoundsViscosity: 1.0,
	zoomControl: false
}).setView(homeCoords, minZoomV+7);
L.control.zoom({
	position: 'topright'
}).addTo(map);

map.setZoom(minZoomV+7);
homebutton.click();

//var southWest = L.latLng(-89.98155760646617, -179); 
//var northEast = L.latLng(89.99346179538875, 180);

var southWest = L.latLng(-90, -220);
var northEast = L.latLng(90, 200);

var bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on('drag', function () {
	map.panInsideBounds(bounds, { animate: false });
});

var mapSize = document.getElementById("map");

var tiles = L.tileLayer(lightStyle, {}).addTo(map);
map.attributionControl.addAttribution("<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors");

var prevB = document.getElementsByClassName('prev_btn_c')
var nextB = document.getElementsByClassName('next_btn_c')

function loadSection() {
	const lower = dbLevel*1000
	const upper = (dbLevel+1)*1000
	
	console.log(lower,upper);
	if (USE_SERVER_DATA) {
		txtFile.open("GET", `https://educdv.ca/sfu-research-db/public/view_db/${lower}/${upper}`, true);
		txtFile.onload = function (e) {
			if (txtFile.readyState === 4) {
				if (txtFile.status === 200) {
					var csvData = txtFile.responseText;

					rawParsedD = JSON.parse(csvData);

					//parsedD = rawRarsedD.sort((a,b) => 0.5 - Math.random);
					parsedD = shuffle(rawParsedD);

					console.log("CSV Obtained successfully. Loading the rest...");
					
					init();
					newSection();
					homebutton.click();
					
				} else {
					console.error(txtFile.statusText);
				}
			}
		};
		txtFile.onerror = function (e) {
			console.error(txtFile.statusText);
		};

		txtFile.send();
	}
	else {
		csvData = document.getElementById("csv_data").innerHTML;
		parsedD = $.csv.toObjects(csvData);
	}
}


function strToColour(str) {
	var res = str.charCodeAt(0);
	for (var i = 1; i < str.length; i++) {
		res -= str.charCodeAt(i);
	}

	if (res < 0)
		return -res;

	return res;
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
	  let j = Math.floor(Math.random() * (i + 1));
	  let temp = array[i];
	  array[i] = array[j];
	  array[j] = temp;
	}
	return array;
}
  
  function zoomingFactor(vector) {
  	
  }
   
function generateColours(maxList) {
	var colours = [];
	for (var i = 0; i < 3; i++) {
		for (var x = 0; x < 250; x++) {
			for (var y = 0; y < 250; y++) {

				if (colours.length < maxList) {
					if (i == 0)
						colours.push([Math.random() * 220, Math.random() * 220, Math.random() * 220]);

					if (i == 1)
						colours.push([Math.random() * 220, Math.random() * 220, Math.random() * 220]);

					if (i == 2)
						colours.push([Math.random() * 220, Math.random() * 220, Math.random() * 220]);
				}
				else {
					return colours;
				}
			}
		}
	}

	return colours;
}

function clearFields() {
	for (var i = 0; i < inputBars.length; i++) {
		inputBars[i].value = "";	
	}
	
	filter(inputBars[1].value, inputBars[2].value, inputBars[3].value, inputBars[4].value, inputBars[5].value, inputBars[6].value, inputBars[7].value, inputBars[8].value);
	homebutton.click();
}

function updateBars() {
	for (var i = 0; i < inputBars.length; i++) {

		if (filtersPC.style.display != 'block') {
			if (i + 9 < inputBars.length) {
				inputBars[i + 9].value = inputBars[i].value ? inputBars[i].value.trim() : "";
			}
		}
		else {
			if (i - 9 >= 0) {
				inputBars[i - 9].value = inputBars[i].value ? inputBars[i].value.trim() : "";
			}
		}
	}
}
function init() {
	if (!initialize) {
	console.log(inputBars)
	for (var i = 0; i < inputBars.length; i++) {
		console.log("aaa_>", i, inputBars[i].placeholder, "  ", inputBars[i].value);

		inputBars[i].addEventListener('keypress', function (keyin) {

			if (keyin.key == "Enter") {
				// Inefficient code ahead!

				

				//   console.log("DXXXX: ", inputBars[0].value, inputBars[1].value, inputBars[2].value, inputBars[3].value, inputBars[4].value, inputBars[5].value, inputBars[6].value, inputBars[7].value);
				updateBars();
				filter(inputBars[1].value, inputBars[2].value, inputBars[3].value, inputBars[4].value, inputBars[5].value, inputBars[6].value, inputBars[7].value, inputBars[8].value);
			}
		});



	}

	colours = generateColours(parsedD.length);
	clearFields();
	
	initialize = true;
	}
}


function disableView() {
	map.dragging.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	map.boxZoom.disable();
	map.keyboard.disable();
	if (map.tap) map.tap.disable();
	document.getElementById('map').style.cursor = 'default';
}

function enableView() {
	map.dragging.enable();
	map.touchZoom.enable();
	map.doubleClickZoom.enable();
	map.scrollWheelZoom.enable();
	map.boxZoom.enable();
	map.keyboard.enable();
	if (map.tap) map.tap.enable();
	document.getElementById('map').style.cursor = 'grab';
}

function isHidden(element) {

	if (element != null) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
}
function getRelativePos(currRange, units) {
	// Get exact visible cell value from relative position from scroll
	// Then recalculate shift value


	var inner = document.getElementsByClassName("img_collection");

	if (inner != null) {
		var container = inner[0];

		if (container != null) {
			for (var r = currRange - units; r < currRange + units; r++) {
				//	console.log("Scanning: ", r)
				var curr = r;

				if (curr < 0)
					curr = 0;

				if (curr > results.length)
					curr = results.length - 1;

				if (curr >= 0 && curr < results.length) {
					if (curr >= 0 && curr < results.length && container.children[curr] != null)
						if (isHidden(container.children[curr].children[2]) && isHidden(container.children[curr].children[1]))
							return (curr);
				}
			}
		}
	}

}

function occludeActive(currl) {
	currl.parentElement.style.zIndex = currl.style.zIndex;
}

function updatepos() {
	var x = image_panel;
	var ind = parseInt(x.scrollTop / Image_Shift);

	var currind = getRelativePos(ind, 12);
	//console.log("SRL_>", x.scrollTop, x.scrollTop / Image_Shift, currind == undefined, curr_limit);
	if (currind != prevMarker && markers.length > 0) {
		if (prevMarker >= 0 && prevMarker < markers.length) {
			var label = document.getElementById(`label_${prevMarker}`);
			console.log(`label_${prevMarker}`);
			label.style.width = "20px";
			label.style.height = "20px";
			label.style.fontSize = "14px";
			label.style.opacity = "0.5";
			label.style.zIndex = "340";

			occludeActive(label);
		}

		prevMarker = currind;
	}

	if (ind != null && ind != NaN) {
		//console.log("Currind: ", ind, currind, Image_Shift);

		if (currind >= curr_limit - 4) {
			curr_limit += max_res_size;
			Image_Shift = parseInt(x.scrollTop / currind);
			clearCells();
			generateCell(results, curr_limit);
		}
		else if (currind < (curr_limit - (max_res_size + 3))) {
			curr_limit -= max_res_size;
			parseInt(x.scrollTop / currind);
			clearCells();
			generateCell(results, curr_limit);
		}

		//console.log("MMK: ", markers[ind]);

		if (currind >= 0 && currind < markers.length) {
			var label = document.getElementById(`label_${currind}`);
			label.style.width = "40px";
			label.style.height = "40px";
			label.style.fontSize = "28px";
			label.style.opacity = "1";
			label.style.zIndex = "10000";
			//	document.getElementById(`label_${currind}`).style = "text-align:center;color: white;background-color: #660099;width: 40px;height: 40px;border-radius: 30px; font-size: 28px;";
			//console.log("LX", markers[currind].getElement());

			currLabel = label;
			occludeActive(currLabel);
			map.setView([results[currind].latitude, results[currind].longitude]);

		}
	}

}

function clearCells() {
	var inner = document.getElementsByClassName("img_collection");

	if (inner != null) {
		var container = inner[0];

		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}

	}

	console.log("cleared/");
}

function checkIfImageExists(url, callback) {
	const img = new Image();
	img.src = url;

	if (img.complete) {
		callback(true);
	} else {
		img.onload = () => {
			callback(true);
		};

		img.onerror = () => {
			callback(false);
		};
	}
}

function loadDefault(element_id) {
	var image_n = document.getElementById(element_id);

	image_n.src = "https://educdv.ca/sfu-research-db/icons/placeholder.png";

	//console.log("ERRO!");
}

function generateCell(res, max_size) {

	var inner = document.getElementsByClassName("img_collection");
	//console.log("res: ", res);
	var newNode = null;
	for (var i = 0; i < res.length; i++) {
		if (inner != null && res != null && i < max_size) {

			var container = inner[0];

			//console.log("res1: ", res[i].Project)
			var filler = `<div id="filler" style="width: 100px; height: 100px;"></div>`;

			var imageD = res[i].url;
			const rgbV = colours[strToColour(res[i].project) % colours.length];

			var html = `<div class="img_header">
							<div id="circle_base" style="text-align: center;">
								<div id="circle" style="color: white; background-color: rgba(${rgbV[0]}, ${rgbV[1]}, ${rgbV[2]}, 1); opacity: 1; border-radius: 40px; width: 25px; height: 25px;">${i + 1}</div>
							</div>
                            <input type="image" id="image_${i}" style="width: 100%; height: 100%;" src="${imageD}" onerror="loadDefault('image_${i}')"/>
							<div class="text_content">
                                <div id="title_header" style="padding:6px; width: 90%;">${res[i].project}</div>
                                <div id="organization_bdy" style="padding:6px; width: 90%;">${res[i].funder} - ${res[i].fperiod}</div>
                                <div id="organization_bdy" style="padding:6px; width: 90%;">${res[i].pi} (PI) - ${res[i].research_site}</div>
								<div id="organization_bdy" style="padding:6px; width: 90%;">${res[i].co_pi} (Co-PI) - ${res[i].research_site}</div>
                            </div>
                        </div>`;
            // console.log(html);
			newNode = document.createRange().createContextualFragment(html);
			container.appendChild(newNode);
		}
	}

	if (newNode != null) {
		newNode = document.createRange().createContextualFragment(filler);
		container.appendChild(newNode);
	}

}

function newSection() {
	colours = generateColours(parsedD.length);
	filter(inputBars[1].value, inputBars[2].value, inputBars[3].value, inputBars[4].value, inputBars[5].value, inputBars[6].value, inputBars[7].value, inputBars[8].value);
	updatepos();
	
	if (dbLevel <= 0) {
		for (var x = 0; x < prevB.length; x++) {
			prevB[x].disabled = true;
		}
	}
	else {
		for (var x = 0; x < prevB.length; x++) {
			prevB[x].disabled = false;
		}
	}
	
	console.log(nextB)
	for (var i=0;i<indexCounter.length;i++) {
		if (parsedD.length >= 1000) {
			indexCounter[i].innerHTML = `${dbLevel*1000} - ${(dbLevel + 1) * 1000}`
			for (var x = 0; x < nextB.length; x++) {
				nextB[x].disabled = false;
			}
			
		}
		else {
			indexCounter[i].innerHTML = `${dbLevel*1000} - ${parsedD.length}`
			for (var x = 0; x < nextB.length; x++) {
				nextB[x].disabled = true;
			}
		}
	}
}

function movePtr(val) {
	console.log("DB: ", dbLevel, val)
    if (dbLevel + val >= 0) {
		console.log("wtf", parsedD.length );
		if (val > 0 && parsedD.length >= 1000) {
        	dbLevel += val;
			
			loadSection()
		}
		else if (val < 0) {
			dbLevel += val;
			
			loadSection()
		}
	}
}

function filter(projectName, researchNames, piNames, copiNames, collabNames, funderName, timePeriod, keywordList) {

	console.log("checkerL -> ", projectName, researchNames, piNames, collabNames, funderName, timePeriod, keywordList);
	clearCells();
	results.length = 0;
	for (var x = 0; x < markers.length; x++) {
		map.removeLayer(markers[x]);
	}
	
	cleartags()

	markers.length = 0;
	var count = 0;
	
	var calculatedSqDistance = [0,0];
	var averageLatLong = [0,0,0]

	for (var i = 0; i < parsedD.length; i++) {

		var Project = parsedD[i].project?.trim() ?? "";
		var PIs = parsedD[i].pi?.trim() ?? "";
		var CoPIs = parsedD[i].co_pi?.trim() ?? "";
		var Collabs = parsedD[i].collabs?.trim() ?? "";
		var Funder = parsedD[i].funder?.trim() ?? "";
		var TimePeriod = parsedD[i].fperiod;
		var keywords = parsedD[i].keywords?.trim() ?? "";
		var site = parsedD[i].research_site?.trim() ?? "";
		var coordsLat = parsedD[i].latitude;
		var coordsLong = parsedD[i].longitude;

		console.log("maint: ", Project.toLowerCase(),'<->', (projectName?.toLowerCase().trim() ?? ""))
		if (Project.toLowerCase().includes(projectName?.toLowerCase().trim() ?? "") &&
			site.toLowerCase().includes(researchNames?.toLowerCase().trim() ?? "") &&
			PIs.toLowerCase().includes(piNames?.toLowerCase().trim() ?? "") &&
			CoPIs.toLowerCase().includes(copiNames?.toLowerCase().trim() ?? "") &&
			Collabs.toLowerCase().includes(collabNames?.toLowerCase().trim() ?? "") &&
			Funder.toLowerCase().includes(funderName?.toLowerCase().trim() ?? "") &&
			TimePeriod.toString().toLowerCase().includes(timePeriod?.toLowerCase().trim() ?? "") &&
			keywords.toLowerCase().includes(keywordList?.toLowerCase().trim() ?? "")) {

			var colourV = strToColour(Project);

			colourV = colourV % colours.length;

			//	console.log("CLR: ", colours[colourV]);

			var labelTxt = L.divIcon({ className: 'my-div-icon', html: `<div id="label_${count}" style="text-align:center;color:white; opacity: 0.8; background-color: rgba(${colours[colourV][0]},${colours[colourV][1]},${colours[colourV][2]},0.8);width: 20px;height: 20px;border-radius: 30px; font-size: 14px;">${++count}</div>` });
			averageLatLong[0] += coordsLat; averageLatLong[1] += coordsLong;
			averageLatLong[2]++;
			calculatedSqDistance[0] += Math.sqrt(Math.pow(parsedD[i].latitude,2) + Math.pow(parsedD[i].longitude,2))
			calculatedSqDistance[1]++
			
			const markerT = L.marker([parsedD[i].latitude, parsedD[i].longitude], {
				icon: labelTxt, id: count - 1
			}).addTo(map);

			//	console.log("===>", Project, PIs, CoPIs, Collabs);
			//		console.log(markers[i]);
			// uncomment for mix of tooltip and popup
			//markerI.bindTooltip(`${i+1}`, {permanent: false, className: "my-label", offset: [0, 0] });
			//markerI.bindTooltip(metadata2, {className: 'tooltip'});

			markerT.on('click', function (e) {
				//	console.log("START: ", e.sourceTarget.options.id);
				curr_limit = (parseInt(e.sourceTarget.options.id / max_res_size) + 1) * max_res_size;
				clearCells();
				generateCell(results, curr_limit);

				var sP = document.getElementById(`image_${e.sourceTarget.options.id}`);

				//	console.log("Sposss: ", sP.getBoundingClientRect())
				//	console.log("XX: ", image_panel.scrollTop);

				image_panel.scrollTop += sP.getBoundingClientRect().y - 178;//68;

				//	console.log("Eposss: ", sP.getBoundingClientRect())
				//	console.log("XX2: ", image_panel.scrollTop);
			});

			//	console.log(markerT);

			markers.push(markerT);

			results.push(parsedD[i]);
			updatetags(i);	
		}
	}
	
	calculatedSqDistance = calculatedSqDistance[0]/calculatedSqDistance[1]
	averageLatLong = [averageLatLong[0]/averageLatLong[2], averageLatLong[1]/averageLatLong[2]]
	console.log("Norm:", calculatedSqDistance - Math.sqrt(Math.pow(averageLatLong[0],2) + Math.pow(averageLatLong[1],2)), averageLatLong)
	
	generateCell(results, max_res_size);
	console.log("added #markers:", count);
	console.log("tester", collabs_availableTags)
	map.setView([averageLatLong[0], averageLatLong[1]], minZoomV)
	loadtags()
}

loadSection();

function changeTileType(tileURL) {
	tiles = L.tileLayer(tileURL, {}).addTo(map);
}

function zoomChange() {
	if (infoPanel.style.display != 'none') {
		infoPanel.style.display = "none";
	}

	// Tooltip only
	document.querySelectorAll(".leaflet-tooltip-pane").forEach(a => a.style.display = "block");
	// or mix of popup and tooltip
	/* if (map['_zoom'] < 10 ) {
		//document.getElementsByTagName("STYLE").display = "none";
		//document.className("tooltioWin").style("display") = "none";
		document.querySelectorAll(".leaflet-tooltip-pane").forEach(a => a.style.display = "none");
	} else {
		// document.getElementsByTagName("STYLE").display = "block";
		// document.className("tooltioWin").style("display") = "none";
		document.querySelectorAll(".leaflet-tooltip-pane").forEach(a => a.style.display = "block");
	}
	*/

	// occludeActive(currLabel);
	console.log("zoom level: ", map._zoom);
	//adjustWin();
}


function searchLocalDB(query) {
	for (var i = 0; i < parsedD.length; i++) {
		var Project = parsedD[i].project;
		var PIs = parsedD[i].pi;
		var CoPIs = parsedD[i].co_pi;
		var Collabs = parsedD[i].collabs;
		var Funder = parsedD[i].funder;
		var TimePeriod = parsedD[i].fperiod.toString();
		var keywords = parsedD[i].keywords;
		var site = parsedD[i].research_sites;
		var coordsLat = parsedD[i].latitude;
		var coordsLong = parsedD[i].longitude;

		if (Project.includes(query) || Funder.includes(query) || TimePeriod.includes(query) || site.includes(query)) {
			return parsedD[i];
		}
	}

	return null;
}

homebutton.addEventListener('mousedown', function (clicked) {
	homebutton.style.transform = "scale(0.75,0.75)";
});

homebutton.addEventListener('click', function (clicked) {
	map.setZoom(minZoomV+7);
	map.setView(homeCoords, minZoomV+7);
	console.log("click");
	//adjustWin();
});

homebutton.addEventListener('mouseup', function (clicked) {
	homebutton.style.transform = "scale(1,1)";
});

settingsBtn.addEventListener('mousedown', function (clicked) {
	settingsBtn.style.transform = "scale(0.75,0.75)";
});

settingsBtn.addEventListener('mouseup', function (clicked) {
	settingsBtn.style.transform = "scale(1,1)";
});

map.on('zoomend', zoomChange);

window.addEventListener('resize', function (meta) {
	if (FiltersActive) {
		if (window.innerWidth / window.innerHeight >= (4 / 3)) {
			filtersPC.style.display = "block";
			filtersPne.style.display = "none";
		}
		else {
			filtersPne.style.display = "block";
			filtersPC.style.display = "none";
		}

	}
});

filtersBtn.addEventListener('click', function (clicked) {

	console.log(FiltersActive);

	if (!FiltersActive) {
		if (window.innerWidth / window.innerHeight >= (4 / 3)) {
			filtersPC.style.display = "block";
			filtersPne.style.display = "none";
			console.log("standard window, ratio:", window.innerWidth / window.innerHeight);
		}
		else {
			filtersPne.style.display = "block";
			filtersPC.style.display = "none";
			console.log("vertical window, ratio:", window.innerWidth / window.innerHeight);
		}

		FiltersActive = true;

		var container1 = document.getElementById("filters_norm");
		var inputs = container1.getElementsByTagName('input');
		for (var index = 0; index < inputs.length; ++index) {
			inputs[index].value = '';
		}

		var container2 = document.getElementById("filters_pc");
		inputs = container2.getElementsByTagName('input');
		for (var i = 0; i < inputs.length; ++i) {
			inputs[i].value = '';
		}
	}
	else {
		filtersPC.style.display = "none";
		filtersPne.style.display = "none";

		FiltersActive = false;
	}
	console.log("console click");

});

function restorePreviousView() {
	if (FiltersActive) {
		if (window.innerWidth / window.innerHeight >= (4 / 3)) {
			filtersPC.style.display = "block";
			filtersPne.style.display = "none";
			console.log("standard window, ratio:", window.innerWidth / window.innerHeight);
		}
		else {
			filtersPne.style.display = "block";
			filtersPC.style.display = "none";
			console.log("vertical window, ratio:", window.innerWidth / window.innerHeight);
		}

		// FiltersActive = true;

		// var container1 = document.getElementById("filters_norm");
		// var inputs = container1.getElementsByTagName('input');
		// for (var index = 0; index < inputs.length; ++index) {
		// 	inputs[index].value = '';
		// }

		// var container2 = document.getElementById("filters_pc");
		// var inputs = container2.getElementsByTagName('input');
		// for (var index = 0; index < inputs.length; ++index) {
		// 	inputs[index].value = '';
		// }
	}
	else {
		filtersPC.style.display = "none";
		filtersPne.style.display = "none";

		// FiltersActive = false;
	}
	console.log("view restored");
}
function coordsToStr(coords) {
	return coords[0] + ',' + coords[1];
}

function navigate(webNav, src, dest) {
	window.open(webNav + src + '/' + dest + '/');
}

function failure() {
	alert("Failed to obtain your location. Check your permissions and try again.");
	homebutton.src = "HomeIcon.png";
	sw_Location.checked = false;
}

console.log(window.innerHeight * 0.75);

console.log("main");
//adjustWin();

homebutton.click();

//navigate(redirectGMapNav, coordsToStr(homeCoords), 'Port Coquitlam')

window.addEventListener('resize', function (event) {
	console.log("resizing");
	//adjustWin();
}, true);




