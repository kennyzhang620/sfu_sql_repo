var base = document.getElementsByClassName('main_map')

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
				<a><div id="clear_fields" class="filter_input" onclick="clearFields()">Clear Fields</div></a>
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
                <input type="text" class="filter_input" id="filter_keywords" placeholder="Keywords" style="width: 100%; padding: 5px; text-align: left; max-width: 979px;" hidden />
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
                        <input type="image" src="https://educdv.ca/sfu-research-db/icons/home-icon.png" style="right: 40px;" id="homebtn">
                        <input type="image" src="https://educdv.ca/sfu-research-db/icons/search-icon.png" style="right: 40px;" id="settingsbtn">

                        <section id="options_meta" style="width:106%; display:flex; z-index:1000;">

                            <div class="map_container" id="filters_pc">
                                <div class="Filters_Pane" style="width:160%;">
                                    <div class="f_header">
                                        <div id="header_ft">Filter Options</div> 
										<a><div id="clear_fields" class="filter_input" onclick="clearFields()">Clear Fields</div></a>
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
                                        <input type="text" class="filter_input" id="filter_keywords" placeholder="Keywords" hidden />
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