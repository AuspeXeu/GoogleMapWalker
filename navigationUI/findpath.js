/**
 * Created by leah on 6/9/16.
 */

var turn_index = 0;

function startFind() {
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
        var next_dir = turn_dirs[turn_index];
        var next_turn = turn_names[turn_index];
        console.log(panorama.getPano());
        //pathFile.writeln(panorama.getPano());
        if (turn_index < turn_names.length) {
            if (leftTurn(leftLink, next_dir, next_turn)) {
                console.log(next_dir + " on " + next_turn + ": " + panorama.getPano() + ", was heading " + panorama.getPov().heading);
                turn_index++;
                turnLeft();
            } else if (rightTurn(rightLink, next_dir, next_turn)) {
                console.log(next_dir + " on " + next_turn + ": " + panorama.getPano() + ", was heading " + panorama.getPov().heading);
                turn_index++;
                turnRight();
            } else { //forward
                var currentHeading = panorama.getPov().heading;
                var forwardLink = getForwardLink(links, currentHeading);
                if (forwardLink != null) {
                    panorama.setPov(/** @type {google.maps.StreetViewPov} */({
                        heading: forwardLink.heading,
                        pitch: 0
                    }));
                    panorama.setPano(forwardLink.pano);
                }
            }
        }
        else {
            console.log("DONE");
        }
    });
}

function leftTurn(link, dir, name) {
    if (link==null) {
        return false;
    }
    return (dir=="L" && link.description==name);
}

function rightTurn(link, dir, name) {
    if (link==null) {
        return false;
    }
    return (dir=="R" && link.description==name);
}

function overshot() {
    console.log(turn_pano + " -- " + turn_heading);
    var panorama2 = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: {lat: latstart, lng: lngstart},
            pov: {
                heading: turn_heading,
                pitch: 0
            },
            visible: true,
            linksControl: true
        });

    panorama2.setPano(turn_pano);
    var steps = 0;

    panorama2.addListener('links_changed', function () {
        if (steps < 3) {
            steps++;
            var links = panorama2.getLinks();
            var currentHeading = panorama2.getPov().heading;
            var forwardLink = getForwardLink(links, currentHeading);
            if (forwardLink != null) {
                panorama2.setPov(({
                    heading: forwardLink.heading,
                    pitch: 0
                }));
                panorama2.setPano(forwardLink.pano);
            }
        } else {
            console.log(panorama2.getPano());
        }
    });
}