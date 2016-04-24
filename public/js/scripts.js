$(function() {
    $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 2
    });
    $("#price_seat").keydown(function(e) {
        var oldvalue=$(this).val();
        var field=this;
        setTimeout(function () {
            if(field.value.indexOf('$') !== 0) {
                $(field).val(oldvalue);
            } 
        }, 1);
    }); 

    $('select').material_select();
}); 

function driver_submit() {
    $.ajax({
        url: "/drivers",
        method: "POST",
        dataType:"json",
        data: {
            startId : $("input[name=start_locs]:checked").val(),
            leave_earliest : $("#driver_leave_earliest").val(),
            leave_latest : $("#driver_leave_latest").val(),
            end_point : $("#driver_endpoint").val(),
            price_seat : $("#driver_price_seat").val(),
            seats : $("#driver_seats").val(),
            threshold : $("#driver_threshold").val(),
        },
        success: function(data, stat) {
        }
    });
}

