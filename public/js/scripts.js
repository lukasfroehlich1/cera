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

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var showTab = $(e.target).attr("href") // activated tab
        var hideTab = $(e.target).attr("name") // activated tab
        console.log(showTab);
        console.log(hideTab);
        $(showTab).show()
        $(hideTab).hide()
    });
}); 

function rider_submit() {
    $.ajax({
        url: "/riders",
        method: "POST",
        dataType:"json",
        data: {
            startId : $("input[name=rider_start_locs]:checked").val(),
            departure_date : $("#rider_departure_date").val(),
            leave_earliest : $("#rider_leave_earliest").val(),
            leave_latest : $("#rider_leave_latest").val(),
            end_point : $("#rider_endpoint").val(),
        },
        success: function(data, stat) {
        }
    });
}

function driver_submit() {
    $.ajax({
        url: "/drivers",
        method: "POST",
        dataType:"json",
        data: {
            startId : $("input[name=driver_start_locs]:checked").val(),
            leave_earliest : $("#driver_leave_earliest").val(),
            leave_latest : $("#driver_leave_latest").val(),
            departure_date : $("#driver_departure_date").val(),
            end_point : $("#driver_endpoint").val(),
            price_seat : $("#driver_price_seat").val(),
            seats : $("#driver_seats").val(),
            threshold : $("#driver_threshold").val(),
        },
        success: function(data, stat) {
        }
    });
}

