//reference: https://developers.google.com/maps/documentation/javascript/streetview#StreetViewServiceResponses
//example code: https://developers.google.com/maps/documentation/javascript/examples/streetview-events

var panorama;

function initPano() {
    console.log("initialize pano");

    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: {lat: 40.455, lng: -79.929},
            pov: {
                heading: 0,
                pitch: 0
            },
            visible: true
        });

    panorama.addListener('links_changed', function() {
        progress();
    });

    return panorama;
}

function progress() {
    setTimeout(function() {
        var links = panorama.getLinks();
        var forwardLink = getForwardLink(links, panorama.getPov().heading);
        if (forwardLink != null) {
            panorama.setPov(/** @type {google.maps.StreetViewPov} */({
                heading: forwardLink.heading,
                pitch: 0
            }));
            panorama.setPano(forwardLink.pano);
        }
    }, 1000);
}

function getBestLink(links, currentHeading) {
    var bestLink = null;
    var diff = 360;
    for (var i in links) {
        var link = links[i];
        var thisDiff = Math.abs(currentHeading - link.heading);
        if (thisDiff < diff) {
            bestLink = link;
            diff = thisDiff;
        }
    }
    return bestLink;
}

function getForwardLink(links, currentHeading) {
    var maybeForward = [];
    for (var i in links) {
        var link = links[i];
        if (Math.abs(currentHeading - link.heading) <= 45) {
            maybeForward.push(link);
        }
    }
    return getBestLink(maybeForward, currentHeading);
}

function turnLeft() {

}

function turnRight() {
    console.log("LEFT");
}

function reverseDir() {
    console.log("LEFT");
}