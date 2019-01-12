<!DOCTYPE html>
<html lang="en">
<head>
    <?php
    include 'head.php';
    ?>

    <meta charset="UTF-8">
    <title>Car ride</title>
    <script type="text/javascript" src="script_2.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"/>
    <link rel="stylesheet" href="./assets/leaflet-routing-machine/dist/leaflet-routing-machine.css"/>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <script src="assets/Gauge/radial-gauge.js"></script>
    <script src="assets/leaflet.rotatedMarker.js"></script>


    <script src="assets/SegmentDisplay/sevenSeg.js"></script>

</head>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-7">
            <div style="height: 600px; width: 900px" id="mapid"></div>
            <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
                    integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
                    crossorigin=""></script>
        </div>

        <div class="col-md-4">
            <div class="row">
                <h2>Prekonaná vzdialenosť [km]:</h2>
                <div id="dist_seg"></div>
            </div>

            <div class="row">
                <h2>Priemerná rýchlosť [km/h]:</h2>
                <div id="avg_speed_seg"></div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-7">
            <h2>Graf rýchlosti:</h2>
            <div style="height: 600px; width: 900px" id="graph"></div>
        </div>

        <div class="col">
            <h2>Aktuálny čas počas cesty:</h2>
            <canvas style="width: 400px; height: 200px" id="clock"></canvas>
        </div>
        <div class="col">
            <h2>Aktuálna rýchlosť:</h2>
            <canvas id="actual_speed"></canvas>
        </div>
    </div>
</div>







</body>

</html>