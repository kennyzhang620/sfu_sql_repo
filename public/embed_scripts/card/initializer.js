var base = document.getElementsByClassName('main_map')

    var pi_availableTags = [];
    var coPIs_availableTags = [];
    var period_availableTags = [];
    var site_availableTags = [];
    var funder_availableTags = [];
	var project_availableTags = [];
	var collabs_availableTags = [];
	
	function cleartags() {
	    pi_availableTags = [];
	    coPIs_availableTags = [];
	    period_availableTags = [];
	    site_availableTags = [];
	    funder_availableTags = [];
		project_availableTags = [];
		collabs_availableTags = [];
		
		try {
        $("#filters_norm #filter_search").autocomplete('destroy');
		$("#filters_pc #filter_search").autocomplete('destroy');
        $("#filters_norm #filter_pi_main").autocomplete('destroy');
        $("#filters_pc #filter_pi_main").autocomplete('destroy');
        $("#filters_norm #filter_pi_sub").autocomplete('destroy');
        $("#filters_pc #filter_pi_sub").autocomplete('destroy');
        $("#filters_norm #filter_fun_time").autocomplete('destroy');

        $("#filters_pc #filter_fun_time").autocomplete('destroy');
        $("#filters_norm #filter_site").autocomplete('destroy');

        $("#filters_pc #filter_site").autocomplete('destroy');
        $("#filters_norm #filter_fun_main").autocomplete('destroy');

        $("#filters_pc #filter_fun_main").autocomplete('destroy')
		}
		catch{}
	}
	
	function loadtags() {

		// Collabs
        $("#filters_norm #filter_search").autocomplete({
            source: collabs_availableTags,
            select: function (event, ui) {
                filter(inputBars[1].value,
                    inputBars[2].value,
                    inputBars[3].value,
                    inputBars[4].value,
                    ui.item.value,
                    inputBars[6].value,
                    inputBars[7].value,
                    inputBars[8].value);
					
					inputBars[5].value = ui.item.value
					updateBars();
            }
        });
		
        $("#filters_pc #filter_search").autocomplete({
            source: collabs_availableTags,
            select: function (event, ui) {
                filter(inputBars[10].value,
                    inputBars[11].value,
                    inputBars[12].value,
                    inputBars[13].value,
                    inputBars[14].value,
                    ui.item.value,
                    inputBars[16].value,
                    inputBars[17].value);
					
					inputBars[15].value = ui.item.value
					updateBars();
            }
        });


		// Project
        $("#filters_norm #filter_search").autocomplete({
            source: project_availableTags,
            select: function (event, ui) {
                filter(ui.item.value,
                    inputBars[2].value,
                    inputBars[3].value,
                    inputBars[4].value,
                    inputBars[5].value,
                    inputBars[6].value,
                    inputBars[7].value,
                    inputBars[8].value);
					
					inputBars[1].value = ui.item.value
					updateBars();
            }
        });
		
        $("#filters_pc #filter_search").autocomplete({
            source: project_availableTags,
            select: function (event, ui) {
                filter( ui.item.value,
                    inputBars[11].value,
                    inputBars[12].value,
                    inputBars[13].value,
                    inputBars[14].value,
                    inputBars[15].value,
                    inputBars[16].value,
                    inputBars[17].value);
					
					inputBars[10].value = ui.item.value
					updateBars();
            }
        });
		
        // PI
        $("#filters_norm #filter_pi_main").autocomplete({
            source: pi_availableTags,
            select: function (event, ui) {
                filter(inputBars[1].value,
                    inputBars[2].value,
                    ui.item.value,
                    inputBars[4].value,
                    inputBars[5].value,
                    inputBars[6].value,
                    inputBars[7].value,
                    inputBars[8].value);
					
					inputBars[3].value = ui.item.value
					updateBars();
            }
        });

        $("#filters_norm #filter_pi_main").on('input', function () {
            console.log($(this).val());
        });

        $("#filters_pc #filter_pi_main").autocomplete({
            source: pi_availableTags,
            select: function (event, ui) {
                filter(inputBars[10].value,
                    inputBars[11].value,
                    ui.item.value,
                    inputBars[13].value,
                    inputBars[14].value,
                    inputBars[15].value,
                    inputBars[16].value,
                    inputBars[17].value);

                console.log($(this).val());
				
				inputBars[12].value = ui.item.value
				updateBars();
            }
        });

        $("#filters_pc #filter_pi_main").on('input', function () {
            console.log($(this).val());
        });

        // CoPIs
        $("#filters_norm #filter_pi_sub").autocomplete({
            source: coPIs_availableTags,
            select: function (event, ui) {
                filter(inputBars[1].value,
                    inputBars[2].value,
                    inputBars[3].value,
                    ui.item.value,
                    inputBars[5].value,
                    inputBars[6].value,
                    inputBars[7].value,
                    inputBars[8].value);

                console.log($(this).val());
                console.log(inputBars);
				
				inputBars[4].value = ui.item.value
				updateBars();
            }
        });

        $("#filters_norm #filter_pi_sub").on('input', function () {
            console.log($(this).val());
        });

        $("#filters_pc #filter_pi_sub").autocomplete({
            source: coPIs_availableTags,
            select: function (event, ui) {
                filter(inputBars[10].value,
                    inputBars[11].value,
                    inputBars[12].value,
                    ui.item.value,
                    inputBars[14].value,
                    inputBars[15].value,
                    inputBars[16].value,
                    inputBars[17].value);
					
					inputBars[13].value = ui.item.value
					updateBars();
            }
        });

        $("#filters_pc #filter_pi_sub").on('input', function () {
            console.log($(this).val());
        });

        // Funding period
        $("#filters_norm #filter_fun_time").autocomplete({
            source: period_availableTags,
            select: function (event, ui) {
                filter(inputBars[1].value,
                    inputBars[2].value,
                    inputBars[3].value,
                    inputBars[4].value,
                    inputBars[5].value,
                    inputBars[6].value,
                    ui.item.value,
                    inputBars[8].value);

                console.log($(this).val());
                console.log(inputBars);
				
				inputBars[7].value = ui.item.value
				updateBars();
            }
        });

        $("#filters_norm #filter_fun_time").on('input', function () {
            console.log($(this).val());
        });

        $("#filters_pc #filter_fun_time").autocomplete({
            source: period_availableTags,
            select: function (event, ui) {
                filter(inputBars[10].value,
                    inputBars[11].value,
                    inputBars[12].value,
                    inputBars[13].value,
                    inputBars[14].value,
                    inputBars[15].value,
                    ui.item.value,
                    inputBars[17].value);
					
					inputBars[16].value = ui.item.value
					updateBars();
            }
        });

        $("#filters_pc #filter_fun_time").on('input', function () {
            console.log($(this).val());
        });

        // Site
        $("#filters_norm #filter_site").autocomplete({
            source: site_availableTags,
            select: function (event, ui) {
                filter(inputBars[1].value,
                    ui.item.value,
                    inputBars[3].value,
                    inputBars[4].value,
                    inputBars[5].value,
                    inputBars[6].value,
                    inputBars[7].value,
                    inputBars[8].value);

                console.log($(this).val());
                console.log(inputBars);
				
				inputBars[2].value = ui.item.value
				updateBars();
            }
        });

        $("#filters_norm #filter_site").on('input', function () {
            console.log($(this).val());
        });

        $("#filters_pc #filter_site").autocomplete({
            source: site_availableTags,
            select: function (event, ui) {
                filter(inputBars[10].value,
                    ui.item.value,
                    inputBars[12].value,
                    inputBars[13].value,
                    inputBars[14].value,
                    inputBars[15].value,
                    inputBars[16].value,
                    inputBars[17].value);
					
					inputBars[11].value = ui.item.value
					updateBars();
            }
        });

        $("#filters_pc #filter_site").on('input', function () {
            console.log($(this).val());
        });

        // Funder
        $("#filters_norm #filter_fun_main").autocomplete({
            source: funder_availableTags,
            select: function (event, ui) {
                filter(inputBars[1].value,
                    inputBars[2].value,
                    inputBars[3].value,
                    inputBars[4].value,
                    inputBars[5].value,
                    ui.item.value,
                    inputBars[7].value,
                    inputBars[8].value);

                console.log($(this).val());
                console.log(inputBars);
				
				inputBars[6].value = ui.item.value
				updateBars();
            }
        });

        $("#filters_norm #filter_fun_main").on('input', function () {
            console.log($(this).val());
        });

        $("#filters_pc #filter_fun_main").autocomplete({
            source: funder_availableTags,
            select: function (event, ui) {
                filter(inputBars[10].value,
                    inputBars[11].value,
                    inputBars[12].value,
                    inputBars[13].value,
                    inputBars[14].value,
                    ui.item.value,
                    inputBars[16].value,
                    inputBars[17].value);

					inputBars[15].value = ui.item.value
					updateBars();
            }
        });

		
	}
function updatetags(i) {
	


        var PIs = parsedD[i].pi; //.substring(0, 50);
        pi_availableTags.push(PIs);

        var CoPIs = parsedD[i].co_pi;
        coPIs_availableTags.push(CoPIs);

        var period = parsedD[i].fperiod.toString();
        period_availableTags.push(period);

        var site = parsedD[i].research_site;
        site_availableTags.push(site);

        var Funder = parsedD[i].funder;
        funder_availableTags.push(Funder);
		
		var Project = parsedD[i].project;
		project_availableTags.push(Project);
		
		var Collabs = parsedD[i].collabs;
		collabs_availableTags.push(Collabs);
		// no keyword for now.

	
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
}

function autoUpdateDropDown(dd_id, tags) {
	console.log('test1')
	var selector = dd_id
    if (selector != null && tags.length != selector.length) {
    	selector.length = 0;
        console.log('test1')
        for (var i=0;i<tags.length;i++) {    				                       
			selector.add(document.createElement(`${tags[i]}`), selector[selector.length])
			console.log('test2');
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
				<a><div id="clear_fields" class="filter_input" onclick="clearFields()">Reset All</div></a>
                <input type="text" class="filter_input" id="filter_search" placeholder="Project Name" style="width:100%;padding:5px;text-align:left; max-width: 979px;" hidden />
                <input type="text" class="filter_input" id="filter_site" placeholder="Research Sites" style="width: 100%; padding: 5px; text-align: left; max-width: 979px;" />
                <div class="pi_section">
                    <input type="text" class="filter_input" id="filter_pi_main" placeholder="Principle Investigator" style="width: 100%; padding: 5px; text-align: left; max-width: 979px;"  />
                    <input type="text" class="filter_input" id="filter_pi_sub" placeholder="Co-PIs" style="width: 100%; padding: 5px; text-align: left; max-width: 979px;" />
                </div>
                <input type="text" class="filter_input" id="filter_colabs" placeholder="Collaborators" style="width: 100%; padding: 5px; text-align: left; max-width: 979px;" hidden />
                <div class="fund_section">
                    <input type="text" class="filter_input" id="filter_fun_main" placeholder="Funder" style="width: 100%; padding: 5px; text-align: left; max-width: 979px;" />
                    <input type="text" class="filter_input" id="filter_fun_time" placeholder="Period" style="width: 100%; padding: 5px; text-align: left; max-width: 979px;" />
                </div>
                <input type="text" class="filter_input" id="filter_keywords" placeholder="Keywords" style="display: none; width: 100%; padding: 5px; text-align: left; max-width: 979px;" hidden />
				<div class="navigator" style="float:right; padding: 6px;">
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
										<a><div id="clear_fields" class="filter_input" onclick="clearFields()">Reset All</div></a>
<select id="filter_test" size="1">
    <option>Apple</option>
    <option>Pear</option>
    <option>Banana</option>
    <option>Orange</option>
  </select>
                                        <input type="text" class="filter_input" id="filter_search" placeholder="Project Name" hidden />
                                        <input type="text" class="filter_input" id="filter_site" placeholder="Research Sites" />
                                        <div class="pi_section">
                                            <input type="text" class="filter_input" id="filter_pi_main" maxlength="140" placeholder="Principle Investigator" />
                                            <input type="text" class="filter_input" id="filter_pi_sub" placeholder="Co-PIs" />
                                        </div>
                                        <input type="text" class="filter_input" id="filter_colabs" placeholder="Collaborators" hidden />
                                        <div class="fund_section">
                                            <input type="text" class="filter_input" id="filter_fun_main" placeholder="Funder" />
                                            <input type="text" class="filter_input" id="filter_fun_time" placeholder="Period" />
                                        </div>
                                        <input type="text" style="display:none;"class="filter_input" id="filter_keywords" placeholder="Keywords" hidden />
										<div class="navigator" style="padding: 6px;">
											<div id="indic" style="font-size:18px;">Display Entries:</div>
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