var base = document.getElementsByClassName('main_map')

    var pi_availableTags = [];
    var coPIs_availableTags = [];
    var period_availableTags = [];
    var site_availableTags = [];
    var funder_availableTags = [];
	var project_availableTags = [];
	var collabs_availableTags = [];
	
	var tagcollect = [null, 
		project_availableTags, 
		site_availableTags,
		pi_availableTags,
	    coPIs_availableTags,
		collabs_availableTags,
		funder_availableTags,
	    period_availableTags,
		 null]
	
	function cleartags(tags) {
		if (!tags.includes("pi"))
	    	pi_availableTags = [];
		if (!tags.includes("co-pi"))
	    	coPIs_availableTags = [];
		if (!tags.includes("period"))
	    	period_availableTags = [];
		if (!tags.includes("sites"))
	    	site_availableTags = [];
		if (!tags.includes("funder"))
	    	funder_availableTags = [];
		if (!tags.includes("project"))
			project_availableTags = [];
		if (!tags.includes("collabs"))
			collabs_availableTags = [];
	}
	
function updatetags(i, tags) {
	

	if (!tags.includes("pi")) {
        var PIs = parsedD[i].pi; //.substring(0, 50);
        pi_availableTags.push(PIs);
	}
	if (!tags.includes("co-pi")) {
        var CoPIs = parsedD[i].co_pi;
        coPIs_availableTags.push(CoPIs);
	}
	
	if (!tags.includes("period")) {
        var period = parsedD[i].fperiod.toString();
        period_availableTags.push(period);
	}
	
	if (!tags.includes("sites")) {
        var site = parsedD[i].research_site;
        site_availableTags.push(site);
	}
	if (!tags.includes("funder")) {
        var Funder = parsedD[i].funder;
        funder_availableTags.push(Funder);
	}
	if (!tags.includes("project")) {
		var Project = parsedD[i].project;
		project_availableTags.push(Project);
	}
	if (!tags.includes("collabs")) {
		var Collabs = parsedD[i].collabs;
		collabs_availableTags.push(Collabs);
	}
		// no keyword for now.

    // Remove duplicates
	
    pi_availableTags = pi_availableTags.filter(function (item, i, pi_availableTags) {
        return i == pi_availableTags.indexOf(item);
    });

    coPIs_availableTags = coPIs_availableTags.filter(function (item, i, coPIs_availableTags) {
        return i == coPIs_availableTags.indexOf(item);
    });

    period_availableTags = period_availableTags.filter(function (item, i, period_availableTags) {
        return i == period_availableTags.indexOf(item);
    });


    site_availableTags = site_availableTags.filter(function (item, i, site_availableTags) {
        return i == site_availableTags.indexOf(item);
    });

    funder_availableTags = funder_availableTags.filter(function (item, i, funder_availableTags) {
        return i == funder_availableTags.indexOf(item);
    });
	
	project_availableTags = project_availableTags.filter(function(item, i, project_availableTags) {
		return i == project_availableTags.indexOf(item);
	});
	
	collabs_availableTags = collabs_availableTags.filter(function(item, i, collabs_availableTags) {
		return i == collabs_availableTags.indexOf(item);
	});
	
	tagcollect = [null, 
			project_availableTags.sort(),
			site_availableTags.sort(),
			pi_availableTags.sort(),
		    coPIs_availableTags.sort(),
			collabs_availableTags.sort(),
			funder_availableTags.sort(),
		    period_availableTags.sort().reverse(),
			 null]
}

function autoUpdateDropDown(dd_id, name_t, tags) {
	console.log('test1')
	var selector = dd_id
	console.log('test1.', selector)
    if (selector != null && tags != null && tags.length != selector.length - 1) { // + 1 to account for empty tags (where only one option exists)
		const sel = selector.value
    	selector.length = 0;
		console.log('test2')
		var elementF = document.createElement(`option`) 
		elementF.text = name_t
		elementF.selected = true;
		selector.add(elementF, selector[selector.length])
		console.log('test2')
        for (var i=0;i<tags.length;i++) { 
			if (tags[i]	!= "" && tags[i] != null) {  
			var element = document.createElement(`option`) 
			element.text = tags[i]				                       
			selector.add(element, selector[selector.length])
			console.log('test2');
			}
    	}
		
		if (sel != null && sel != "" && tags.includes(sel)) {
			selector.value = sel;
		}
		else {
			selector.value = name_t
		}	
    }

}

function dropfilter_tags(el) {

}

function init_main() {

	var inner = base
	console.log("testing!", inner)
	var newNode = null;
		if (inner != null) {

			var container = inner[0];

			var html = `

        <div class="Filters_Pane" id="filters_norm">
            <div class="f_header">
                <div id="header_ft">Filter Options</div> 
				<a><div id="clear_fields" class="filter_input" onclick="clearFields()">Clear All</div></a>
<select id="filter_search" class="filter_input" name="All Projects"size="1">
  </select>
<select id="filter_site" class="filter_input" name="All Research Sites" size="1">
  </select>
                <div class="pi_section">
<select id="filter_pi_main" class="filter_input" name="All Principle Investigators" size="1">
  </select>
<select id="filter_pi_sub" class="filter_input" name="All Co-PIs"size="1">
  </select>
			    </div>
<select id="filter_colabs" class="filter_input" name="All Collaborators" size="1">
  </select>
                <div class="fund_section">
<select id="filter_fun_main" class="filter_input" name="All Funders" size="1">
  </select>
<select id="filter_fun_time" class="filter_input" name="All Years"size="1">
  </select>
				</div>
                <input type="text" class="filter_input" id="filter_keywords" placeholder="Keywords" style="display: none; width: 100%; padding: 5px; text-align: left; max-width: 979px;" hidden />
				<div class="navigator" style="padding: 6px;">
					<div id="indic" style="font-size:18px;">Number of Research Sites:</div>
        			<button class="prev_btn_c" onclick="movePtr(-1)">Previous</button><index id="counter_id" class="counters" style="padding: 6px; font-size:18px;">0 - 10 / 65</index><button class="next_btn_c" onclick="movePtr(1)">Next</button>
    			</div>
			</div>
        </div>

        <section class="Map_interface">

            <section class="map_container">

                <div class="map_container" id="items_main">
                    <div class="Filters_Pane" id="items_main2">
                        <div class="f_header">
                            <div class="main_header" style="text-align:center;">
                                <name>Research Facility</name>
                            </div>

                            <section class="data_header" id="data_header">
                            </section>
                        </div>
                    </div>
                </div>

                <div class="map" id="map">
                    <div class="Settings_Pane">
                        <input type="image" src="https://educdv.ca/sfu-research-db/icons/home-icon.png" style="right: 45px;" id="homebtn">
                        <input type="image" src="https://educdv.ca/sfu-research-db/icons/search-icon.png" style="right: 45px;" id="settingsbtn">

                        <section id="options_meta" style="width:106%; display:flex; z-index:1000;">

                            <div class="map_container" id="filters_pc">
                                <div class="Filters_Pane" style="width:160%;">
                                    <div class="f_header">
                                        <div id="header_ft">Filter Options</div> 
										<a><div id="clear_fields" class="filter_input" onclick="clearFields()">Clear All</div></a>
<select id="filter_search" class="filter_input" name="All Projects"size="1">
  </select>
<select id="filter_site" class="filter_input" name="All Research Sites" size="1">
  </select>

                                        <div class="pi_section">
<select id="filter_pi_main" class="filter_input" name="All Principle Investigators" size="1">
  </select>
<select id="filter_pi_sub" class="filter_input" name="All Co-PIs"size="1">
  </select>
                                        </div>
<select id="filter_colabs" class="filter_input" name="All Collaborators" size="1">
  </select>
                                        <div class="fund_section">
<select id="filter_fun_main" class="filter_input" name="All Funders" size="1">
  </select>
<select id="filter_fun_time" class="filter_input" name="All Years"size="1">
  </select>
                                        </div>
                                        <input type="text" style="display:none;"class="filter_input" id="filter_keywords" placeholder="Keywords" hidden />
										<div class="navigator" style="padding: 6px;">
											<div id="indic" style="font-size:18px;">Number of Research Sites:</div>
        									<button id="prev_btn" class="prev_btn_c" onclick="movePtr(-1)">Previous</button><index id="counter_id" class="counters" style="padding: 6px; font-size:18px;">0 - 10 / 65</index><button id="next_btn" class="next_btn_c" onclick="movePtr(1)">Next</button>
    									</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                    <div class="img_col_header" id="image_display" style="height: 85vh; width: 400px; position: relative; top: 22px; right: -13px; z-index: 1000; overflow-y:scroll; overflow-x:hidden;" onmouseover="disableView()" onmouseout="enableView()" onscroll="updatepos()">
                        <div class="img_collection">
                        </div>
                    </div>

                </div>

            </section>

        </section>

			`;
			
			console.log(container)
            // console.log(html);
			newNode = document.createRange().createContextualFragment(html);
			container.appendChild(newNode);
	}

}

init_main();
