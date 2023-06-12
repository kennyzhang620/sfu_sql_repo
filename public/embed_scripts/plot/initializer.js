var base = document.getElementsByClassName('main_view')

function init_main() {

	var inner = base
	console.log("testing!", inner)
	var newNode = null;
		if (inner != null) {

			var container = inner[0];

			var html = `

<section class="Map_interface">
            <section class="map_container">
                <div class="map" id="map"></div>
            </section>
        </section>

        <div class="Filters_Pane">
            <div id="reg_sect" style="text-align:left; padding: 6px;">
                <div id="section_reg" style="padding: 1px;">REGION</div>
                <div id="selectors" style="padding:8px;">
                    <select name="rname" id="region_select" onchange="adjustReg()">
                        <option value="ALL">All</option>
                        <option value="NA">North America</option>
                        <option value="SA">South America</option>
                        <option value="EUR">Europe</option>
                        <option value="ASIA">Asia</option>
                        <option value="ME">Middle East</option>
                        <option value="AFR">Africa</option>
                        <option value="OCEANIA">Oceania</option>

                    </select>
                </div>
                <div id="section_year" style="padding: 1px;">YEAR</div>
                <div id="selector_slider" style="padding:8px;">
                    <div id="slider" style="height: 20px;">
                        <div id="val_left" class="sliderValue" data-index="0" value="10" style="float:left;">10</div>
                        <div id="val_right" class="sliderValue" data-index="1" value="90" style="float:left;transform:translate(-101%,400%);">90</div>
                    </div>
                    <div id="main_slider" style="padding:8px; transform: translate(30%, -13%);"><div id="slider-range" style=""></div></div>
                </div>
                <div id="section_entries" style="padding: 1px;">PLOT ENTRIES</div>
                <div id="selector_entry" style="padding:8px;">
        			<button id="prev_btn" onclick="movePtr(-1)"><</button><index id="counter_id" class="counters" style="padding: 6px; font-size:12px;">0 - 1000</index><button id="next_btn" onclick="movePtr(1)">></button>
                </div>
            </div>
        </div>
			`;
			
			console.log(container)
            // console.log(html);
			newNode = document.createRange().createContextualFragment(html);
			container.appendChild(newNode);
	}

}

init_main();