$(function () {
            var pi_availableTags = [];
            var coPIs_availableTags = [];
            var period_availableTags = [];
            var site_availableTags = [];
            var funder_availableTags = [];
			var project_availableTags = [];
			var collabs_availableTags = [];
			
            for (var i = 0; i < parsedD.length; i++) {

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

            }

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
			
			// Collabs
            $("#filters_norm #filter_search").autocomplete({
                source: collabs_availableTags,
                select: function (event, ui) {
                    filter(inputBars[1].value,
                        inputBars[2].value,
                        inputBars[3].value,
                        inputBars[4].value,
                        iui.item.value,
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
                        iui.item.value,
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

            $("#filters_pc #filter_fun_main").on('input', function () {
                console.log($(this).val());
            });

            // Disapble dragging when filtering

            $('#filters_norm').mousedown(function () {
                map.dragging.disable();
                map.touchZoom.disable();
            });

            $('#filters_pc').mousedown(function () {
                map.dragging.disable();
                map.touchZoom.disable();

            });

            $('html').mouseup(function () {
                map.dragging.enable();
                map.touchZoom.enable();
            });


        });