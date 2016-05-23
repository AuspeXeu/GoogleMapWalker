//reference: https://developers.google.com/maps/documentation/javascript/streetview#StreetViewServiceResponses
//example code: https://developers.google.com/maps/documentation/javascript/examples/streetview-events

var panorama;

function initPano() {
    console.log("initialize pano");

    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: {lat: 40.455, lng: -79.929},
            pov: {
                heading: 90,
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
        var currentHeading = panorama.getPov().heading;
        var forwardLink = getForwardLink(links, currentHeading);
        if (forwardLink != null) {
            panorama.setPov(/** @type {google.maps.StreetViewPov} */({
                heading: forwardLink.heading,
                pitch: 0
            }));
            panorama.setPano(forwardLink.pano);
        }
        var leftLink = getDirectionLink(links, currentHeading, -90);
        var rightLink = getDirectionLink(links, currentHeading, 90);
        var reverseLink = getDirectionLink(links, currentHeading, 180);
        updateLinks(leftLink, rightLink, reverseLink);
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

function getDirectionLink(links, currentHeading, turn) {
    var turnHeading = fixHeading(currentHeading + turn);
    return getForwardLink(links, turnHeading);
}

function turnLeft() {
    var currentHeading = panorama.getPov().heading;
    var newHeading = fixHeading(currentHeading - 90);
    panorama.setPov(/** @type {google.maps.StreetViewPov} */({
        heading: newHeading,
        pitch: 0
    }));
}

function turnRight() {
    var currentHeading = panorama.getPov().heading;
    var newHeading = fixHeading(currentHeading + 90);
    panorama.setPov(/** @type {google.maps.StreetViewPov} */({
        heading: newHeading,
        pitch: 0
    }));
}

function reverseDir() {
    var currentHeading = panorama.getPov().heading;
    var newHeading = fixHeading(currentHeading - 180);
    panorama.setPov(/** @type {google.maps.StreetViewPov} */({
        heading: newHeading,
        pitch: 0
    }));
}

function fixHeading(heading) {
    if (heading > 180) {
        return heading - 360;
    }
    if (heading < -180) {
        return heading + 360;
    }
    return heading;
}

function updateLinks(leftLink, rightLink, reverseLink) {
    if (leftLink != null) {
        document.getElementById("left_label").innerHTML = leftLink.description;
    } else {
        document.getElementById("left_label").innerHTML = "";
    }
    if (rightLink != null) {
        document.getElementById("right_label").innerHTML = rightLink.description;
    } else {
        document.getElementById("right_label").innerHTML = "";
    }
    if (reverseLink != null) {
        document.getElementById("reverse_label").innerHTML = reverseLink.description;
    } else {
        document.getElementById("reverse_label").innerHTML = "";
    }
}