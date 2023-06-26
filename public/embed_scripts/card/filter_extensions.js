$(function () {

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