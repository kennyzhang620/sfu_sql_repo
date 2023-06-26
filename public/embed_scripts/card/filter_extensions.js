$(function () {
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