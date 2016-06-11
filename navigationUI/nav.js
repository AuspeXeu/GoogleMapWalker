//reference: https://developers.google.com/maps/documentation/javascript/streetview#StreetViewServiceResponses
//example code: https://developers.google.com/maps/documentation/javascript/examples/streetview-events

var panorama;
var speed = 1020;
var offPath = 0;

function initPano() {
    console.log("initialize pano");

    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: {lat: latstart, lng: lngstart},
            pov: {
                heading: startHeading,
                pitch: 0
            },
            visible: true,
            linksControl: true
        });

    panorama.addListener('links_changed', function() {
        var links = panorama.getLinks();
        var currentHeading = panorama.getPov().heading;
        var leftLink = getDirectionLink(links, currentHeading, -90);
        var rightLink = getDirectionLink(links, currentHeading, 90);
        var reverseLink = getDirectionLink(links, currentHeading, 180);
        updateLinks(leftLink, rightLink, reverseLink);
        checkAudio();
        if (intersection(leftLink, rightLink)) {
            progress(speed + 1000);
        } else {
            progress(speed);
        }
    });

    panorama.addListener('pano_changed', function() {
        //document.getElementById("pano_id").innerHTML = panorama.getPano();
        console.log(panorama.getPano());
    });

    return panorama;
}

function progress(nextSpeed) {
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
    }, nextSpeed);
}

function intersection(leftLink, rightLink) {
    if (leftLink!=null && leftLink.description!="") {
        return true;
    }
    if (rightLink!=null && rightLink.description!="") {
        return true;
    }
    return false;
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
        var diff = Math.min(Math.abs(currentHeading-link.heading), Math.abs(currentHeading-(link.heading-360)), Math.abs(currentHeading-(link.heading+360)))
        if (diff <= 88) {
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
        followLink(leftLink, fixHeading(currentHeading-90));
    }
}

function turnRight() {
    var currentHeading = panorama.getPov().heading;
    var links = panorama.getLinks();
    var rightLink = getDirectionLink(links, currentHeading, 90);
    if (rightLink != null) {
        followLink(rightLink, fixHeading(currentHeading+90));
    }
}

function reverseDir() {
    var currentHeading = panorama.getPov().heading;
    var links = panorama.getLinks();
    var reverseLink = getDirectionLink(links, currentHeading, 180);
    if (reverseLink != null) {
        followLink(reverseLink, fixHeading(currentHeading+180));
    }
    //progress();
}

function followLink(link, newHeading) {
    panorama.setPov(/** @type {google.maps.StreetViewPov}*/ ({
        heading: newHeading,
        pitch: 0
    }));
    panorama.setPano(link.pano);
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
    var panoID = panorama.getPano();
    var i = path.indexOf(panoID);

    if (i < 0) {
        offPath += 1;
        if (offPath == 2 || offPath == 10) {
            var wrong = new Audio('audio/wrong.m4a')
            wrong.play();
        }
        if (offPath > 3 && wrongWayTurns.has(panoID)) {
            wrongWayTurns.get(panoID).play();
        }
    } else {
        offPath = 0;
        var target = path[i+advance];
        if (audioTargets.has(target)) {
            audioTargets.get(target).play();
        }

    }
}