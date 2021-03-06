var gauge = null;
var route = [];
var date = new Date();
var canvas_clock = null;
var ctx = null;
var line;
var distance = 0;
var marker;
var latitude = [];
var longitude = [];
var speed = [];
var act_speed = 0;
var avg_speed = 0;


//create icon class
var markerIcon = L.Icon.extend({
    options: {
        iconSize: [14, 35],
        iconAnchor: [7, 0],
    }
});

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

//create car icon
var carIcon = new markerIcon({iconUrl: './assets/images/bluecar.png'});

$(document).ready(function () {


    //inicialize the map
    var mymap = L.map('mapid').setView([48.166377, 17.18168], 15);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 25,
        id: 'mapbox.streets',
        accessToken: 'sk.eyJ1IjoibWFydGlua2F6diIsImEiOiJjanFvNWcxaDQwM2dnM3htaTF5b2Q0dmhyIn0.w8NqEomkQMeDXqJzL86rUQ'
    }).addTo(mymap);

    //create line for route waypoints
    var line = L.polyline(route, {color: 'blue'}).addTo(mymap);


    //create function for rotating marker   source https://www.mapbox.com/mapbox.js/example/v1.0.0/rotating-controlling-marker/
    L.RotatedMarker = L.Marker.extend({
        options: {angle: 0},
        _setPos: function (pos) {
            L.Marker.prototype._setPos.call(this, pos);
            if (L.DomUtil.TRANSFORM) {
                // use the CSS transform rule if available
                this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
            } else if (L.Browser.ie) {
                // fallback for IE6, IE7, IE8
                var rad = this.options.angle * L.LatLng.DEG_TO_RAD,
                    costheta = Math.cos(rad),
                    sintheta = Math.sin(rad);
                this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
                    costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
            }
        }
    });

// create rotation marker constructor
    L.rotatedMarker = function (pos, options) {
        return new L.RotatedMarker(pos, options);
    };

    //create new marker
    var marker = L.rotatedMarker(new L.LatLng(48.166377, 17.18168), {
        icon: carIcon
    }).addTo(mymap);


    // catch the stream of data
    if (typeof(EventSource) !== "undefined") {
        var source = new EventSource("http://vmzakova.fei.stuba.sk/tina/route1.php");

        source.addEventListener("message", function (e) {
            // console.log(e.data);
            if (e.data === 'END-OF-STREAM') {
                source.close();
            }
            //when data recieved
            else {
                var data = JSON.parse(e.data);

                // Add data to route for polyline
                route.push([parseFloat(data.latitude), parseFloat(data.longitude)]);

                //add coordinates to separate arrays
                latitude.push(data.latitude);
                longitude.push(data.longitude);

                //get latest two points
                var la2 = latitude[latitude.length - 1];
                var la1 = latitude[latitude.length - 2];
                var lo2 = longitude[longitude.length - 1];
                var lo1 = longitude[longitude.length - 2];

                //redraw line according new coordinates
                line = L.polyline(route, {color: 'blue'}).addTo(mymap);

                //calculate the angle between two points https://stackoverflow.com/questions/6189258/angle-between-two-known-android-geolocations
                var y = Math.sin(toRadians(lo2 - lo1)) * Math.cos(toRadians(la2));
                var x = Math.cos(toRadians(la1)) * Math.sin(toRadians(la2)) - Math.sin(toRadians(la1)) * Math.cos(toRadians(la2)) * Math.cos(toRadians(lo2 - lo1));
                var angle = Math.atan2(y, x);
                angle = angle * 180 / Math.PI;

                //rotate the marker
                marker.options.angle = angle;

                //move the marker
                var newLatLng = new L.LatLng(la2, lo2);
                marker.setLatLng(newLatLng);

                //calculate the distance between last two points in km also speed in km/s
                var delta_distance = distanceInKm(la1, lo1, la2, lo2);

                //add to total distance
                distance += delta_distance;

                //calculate actual speed in km/h
                act_speed = delta_distance * 3600;

                //add to speeds array
                speed.push(act_speed);

                // calculate avg speed
                avg_speed = (distance / speed.length) * 3600;

                date = new Date(data['timestamp'] * 1000);
                drawClock(date);
                drawSgmentDisplay('dist_seg', distance.toFixed(3), 'blue');
                drawSgmentDisplay('speed_seg', act_speed.toFixed(2), 'blue');
                drawSgmentDisplay('avg_speed_seg', avg_speed.toFixed(2), 'blue');
                drawSpeedGraph(speed, speed.length);
                drawGauge(act_speed);
            }
        }, false);
    }


    //Calculate distance  https://gps-coordinates.org/distance-between-coordinates.php
    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function distanceInKm(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2 - lat1);
        var dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var dist = earthRadiusKm * c;
        if (isNaN(dist)) {
            dist = 0;
        }
        return dist;
    }


    //draw display
    function drawSgmentDisplay(id, value, color) {
        $('#' + id).sevenSeg({
            value: value,
            digits: 5,
            colorOff: 'white',
            colorBackground: 'white',
            colorOn: color
        });
    }


    // CLOCK template from W3schools
    function drawClock(time) {
        var radius;
        if (canvas_clock === null) {
            canvas_clock = document.getElementById('clock');
        }
        radius = canvas_clock.height / 2;
        if (ctx === null) {
            ctx = canvas_clock.getContext("2d");
            ctx.translate(radius, radius);
        }
        radius = radius * 0.90;
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius, time);
    }


    function drawFace(ctx, radius) {
        var grad;

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'blue');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }

    function drawNumbers(ctx, radius) {
        var ang;
        var num;
        ctx.font = radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (num = 1; num < 13; num++) {
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    }

    function drawTime(ctx, radius, time) {
        var hour = time.getHours();
        var minute = time.getMinutes();
        var second = time.getSeconds();
        //hour
        hour = hour % 12;
        hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        drawHand(ctx, hour, radius * 0.5, radius * 0.07);
        //minute
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        drawHand(ctx, minute, radius * 0.8, radius * 0.07);
        // second
        second = (second * Math.PI / 30);
        drawHand(ctx, second, radius * 0.9, radius * 0.02);
    }

    function drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }


    //draw graph
    function drawSpeedGraph(speed, length) {
        var speeds = {
            x: length,
            y: speed,
            type: 'scatter'
        };
        var data = [speeds];
        var layout = {
            paper_bgcolor: "white",
            plot_bgcolor: "white",
            xaxis: {
                showgrid: false,
                color: 'black'
            },
            yaxis: {
                showgrid: false,
                color: 'black'
            },
        };
        Plotly.newPlot('graph', data, layout);
    }


    //draw gauge
    function drawGauge(value) {
        if (gauge)
            gauge.value = value;
        else {
            gauge = new RadialGauge({
                renderTo: 'actual_speed',
                width: 200,
                height: 200,
                units: 'km/h',
                minValue: 0,
                maxValue: 200,
                majorTicks: ['0', '20', '40', '60', '80', '100', '120', '140', '160', '180', '200'],
                minorTicks: 2,
                ticksAngle: 270,
                startAngle: 45,
                strokeTicks: true,
                highlights: [{from: 0, to: 70, color: 'rgba(127, 191, 63, 0.5)'}, {
                    from: 70,
                    to: 140,
                    color: 'rgba(220, 145, 59, 0.75)'
                }, {from: 140, to: 200, color: 'rgba(225, 7, 23, 0.5)'}],
            });
            gauge.draw();
            gauge.value = value;
        }
    }
});
