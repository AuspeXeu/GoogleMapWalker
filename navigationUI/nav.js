//reference: https://developers.google.com/maps/documentation/javascript/streetview#StreetViewServiceResponses
//example code: https://developers.google.com/maps/documentation/javascript/examples/streetview-events

var panorama;
var speed = 1020;

function initPano() {
    console.log("initialize pano");

    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: {lat: 40.455, lng: -79.929},
            pov: {
                heading: 90,
                pitch: 0
            },
            visible: true,
            linksControl: false
        });

    panorama.addListener('links_changed', function() {
        var links = panorama.getLinks();
        var currentHeading = panorama.getPov().heading;
        var leftLink = getDirectionLink(links, currentHeading, -90);
        var rightLink = getDirectionLink(links, currentHeading, 90);
        var reverseLink = getDirectionLink(links, currentHeading, 180);
        updateLinks(leftLink, rightLink, reverseLink);
    });

    panorama.addListener('position_changed', function() {
        progress();
    });

    panorama.addListener('pano_changed', function() {
        //document.getElementById("pano_id").innerHTML = panorama.getPano();
        console.log(panorama.getPano());
    });

    return panorama;
}

function progress() {
    checkAudio();
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
    }, speed);
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
        if (Math.abs(currentHeading - link.heading) <= 80) {
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
    var links = panorama.getLinks();
    var leftLink = getDirectionLink(links, currentHeading, -90);
    if (leftLink !=null) {
        followLink(leftLink);
    }
    //progress();
}

function turnRight() {
    var currentHeading = panorama.getPov().heading;
    var links = panorama.getLinks();
    var rightLink = getDirectionLink(links, currentHeading, 90);
    if (rightLink != null) {
        followLink(rightLink);
    }
    //progress();
}

function reverseDir() {
    var currentHeading = panorama.getPov().heading;
    var links = panorama.getLinks();
    var reverseLink = getDirectionLink(links, currentHeading, 180);
    if (reverseLink != null) {
        followLink(reverseLink);
    }
    //progress();
}

function followLink(link) {
    var newHeading = link.heading;
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

function faster() {
    if (speed >= 520) {
        speed = speed - 500;
    }
}

function slower() {
    speed = speed + 500;
}

function checkAudio() {
    //Audio
    var intro = new Audio('audio/intro.m4a');
    var college = new Audio('audio/college.m4a');
    var fifth = new Audio('audio/fifth.m4a');
    var shady = new Audio('audio/shady.m4a');
    var mellon = new Audio('audio/mellon.m4a');
    var arrived = new Audio('audio/arrived.m4a');

    var panoID = panorama.getPano();
    if (panoID=="EME2ljxHxu0cLMCnJEApOg") {
        intro.play();
    }
    if (panoID=="KWpllTkTLiqxZKNxPXTrgQ") {
        college.play();
    }
    if (panoID=="4nuNGHuHzaKt0j3JXFgbWg") {
        fifth.play();
    }
    if (panoID=="UJb5tu0GjZGaAYWaHMV4vg") {
        shady.play();
    }
    if (panoID=="8nLXbODOS0ewStG7VUy08Q") {
        mellon.play();
    }
    if (panoID=="fXTISgSijhOs_wnVPnmKDw") {
        arrived.play();
    }
}