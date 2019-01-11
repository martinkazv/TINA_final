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
<div class="container">

    <div style="height: 400px; width: 600px" id="mapid"></div>

    <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
            integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
            crossorigin=""></script>


</div>

<div class="container">
    <canvas id="clock"></canvas>
</div>
<div class="container row">
    <div class="containter col-md-3">
        <h1>Prekonana vzdialenost [km]:</h1>
        <div id="dist_seg"></div>
    </div>


    <div class="containter col-md-3 col">
        <h1>Priemerna rychlost [km/h]:</h1>
        <div id="avg_speed_seg"></div>
    </div>

    <div class="col-md-auto col">
        <h1>Graf rýchlosti:</h1>
        <div id="graph"></div>
    </div>
</div>

<div class="container">
    <h1>Aktualna rychlost:</h1>
    <canvas id="actual_speed"></canvas>
</div


</body>

</html>