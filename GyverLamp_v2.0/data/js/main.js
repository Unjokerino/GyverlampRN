function start() {
    $.getJSON("config.json", function(data) {
        var jsonssid = data.ssid;
        var jsonpassword = data.password;

        if (jsonssid === undefined || jsonssid === null) {} else {
            document.getElementById('ssid').value = jsonssid;
        }

        if (jsonpassword === undefined || jsonpassword === null) {} else {
            document.getElementById('ssidPass').value = jsonpassword;
        }
    });
}

$(function() {
    var websock;
    websock = new WebSocket('wss://echo.websocket.org');
    websock.onopen = function(evt) { console.log('websock open'); };
    websock.onclose = function(evt) { console.log('websock close'); };
    websock.onerror = function(evt) { console.log(evt); };
    $("input[type=\"checkbox\"]").not("[data-switch-no-init]").bootstrapSwitch();



    websock.onmessage = function(evt) {
        console.log(evt.data);
        this.evt = evt
        if (evt.data.substring(0, 6) == 'volume') {
            var getvolume = evt.data.substring(6);
            $("#volume").ionRangeSlider({
                type: "single",
                min: 1,
                max: 255,
                from: getvolume,
                keyboard: true,

                onFinish: function(data) {
                    $.ajax("/volume?volume=" + data.from);
                    websock.send('volume' + data.from);
                }
            });

        } else if (evt.data.substring(0, 5) == 'speed') {
            var getspeed = evt.data.substring(5);
            $("#speeed").ionRangeSlider({
                type: "single",
                min: 1,
                max: 255,
                from: getspeed,
                keyboard: true,

                onFinish: function(data) {
                    $.ajax("/speed?speed=" + data.from);
                    websock.send('speed' + data.from);
                }
            });

        } else if (evt.data.substring(0, 5) == 'scale') {
            var getscale = evt.data.substring(5);
            $("#scale").ionRangeSlider({
                type: "single",
                min: 1,
                max: 100,
                from: getscale,
                keyboard: true,

                onFinish: function(data) {
                    $.ajax("/scale?scale=" + data.from);
                    websock.send('scale' + data.from);
                }
            });

        } else {

        }

        // console.log(evt.data.substring(0, 8));


    };


    $('#effect').change(function() {
        var selectedText = $(this).find("option:selected").text();
        var selectedval = $(this).find("option:selected").val();
        $.ajax("/saveeffect?effect=" + selectedval);

        websock.send('effect' + selectedval);
    });



});