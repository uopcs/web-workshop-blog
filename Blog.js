
// As soon as the page has finished loading, run this function
window.addEventListener('load', function () {

    drawBanner();

    addSearchBarFunctionality();

});



////////////////////////// Code for drawing banners ////////////////////////////


/**
 * Draws stuff in the banner
 */
function drawBanner() {

    // The number of shapes to draw
    var lineNumber = 5;
    var circleNumber = 5;

    // Find the banner
    var banner = document.getElementById('banner');

    // Draw some lines
    for (var i = 0; i < lineNumber; i++) {
        drawRandomLine(banner);
    }

    // Draw some circles
    for (var i = 0; i < circleNumber; i++) {
        drawRandomCircle(banner);
    }
}


/**
 * Draws a circle of a random size at a random position on the canvas.
 * 
 * @param {SVG} canvas
 */
function drawRandomCircle(canvas) {

    // This tells the browser the shape belongs to an SVG
    var namespace = "http://www.w3.org/2000/svg";

    // One of these colours will be selected at random for the shape
    var colours = ["blue", "red", "gold"];

    // Randomly generate some shape properties
    var radius = randomInt(10, 40);
    var xPos = randomInt(radius, canvas.scrollWidth - radius);
    var yPos = randomInt(radius, canvas.scrollHeight - radius);
    var colour = colours[randomInt(0, colours.length - 1)];

    // Create the shape and set its properties
    var circle = document.createElementNS(namespace, 'circle');
    circle.setAttribute('cx', xPos);
    circle.setAttribute('cy', yPos);
    circle.setAttribute('r', radius);
    circle.setAttribute('stroke', colour);
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('stroke-opacity', '0.3');
    circle.setAttribute('fill', 'white');

    // Draw the shape on the canvas
    canvas.appendChild(circle);
}


/**
 * Draws a randomly oriented line on the canvas.
 * 
 * @param {SVG} canvas
 */
function drawRandomLine(canvas) {

    // This tells the browser the shape belongs to an SVG
    var namespace = "http://www.w3.org/2000/svg";

    // One of these colours will be selected at random for the line
    var colours = ["blue", "red", "gold"];

    // Randomly select a colour from the list
    var colour = colours[randomInt(0, colours.length - 1)];

    // Create the shape and set its properties
    var line = document.createElementNS(namespace, 'line');
    line.setAttribute('x1', randomInt(0, canvas.scrollWidth));
    line.setAttribute('x2', randomInt(0, canvas.scrollWidth));
    line.setAttribute('y1', 0);
    line.setAttribute('y2', canvas.scrollHeight);
    line.setAttribute('stroke', colour);
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-opacity', '0.3');

    // Draw the shape on the canvas
    canvas.appendChild(line);
}


/**
 * Generates a random integer between min and max (inclusive)
 * 
 * @param {int} min
 * @param {int} max
 * @returns {int}
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




/////////////////////////// Code for tag searching /////////////////////////////


/**
 * Makes the search bar functional
 */
function addSearchBarFunctionality() {

    // Find the search bar
    var searchBar = document.getElementById('search');

    /* 
     * Note:
     * As well as the .addEventListner method, it is also possible to set the
     * event directly using .on[event_name] 
     * The main diffrence is that this removes any other functions currently 
     * attatched to the same event on the element.
     */

    // Whenever the value changes, perform a search for the current value.
    searchBar.onchange = function () { // For Chrome
        searchByTag(searchBar.value);
    };
    searchBar.onkeyup = function () { // For other browsers
        searchByTag(searchBar.value);
    };
}


/**
 * Hides all articles without the search tag.
 * 
 * @param {String} tagName
 */
function searchByTag(tagName) {

    // Assume there are no matches untill proven otherwise
    var noMatches = true;

    // Get a list of all our articles
    var tagLists = document.getElementsByClassName('tag_list');

    // Look through all the articles
    for (var i = 0; i < tagLists.length; i++) {

        var tagList = tagLists[i];

        // We know the tag_list is contained within an article;
        // This means the article is it's parent node (element) in the DOM.
        var article = tagList.parentNode;

        // Check if they have the tag
        if (tagInTagList(tagName, tagList)) {

            // If it does, make sure it's not hidden
            article.className = '';

            // We've found at least one match
            noMatches = false;

        } else {
            // Otherwise hide it
            article.className = 'hidden';
        }
    }


    // Inform the user if nothing matched their search

    // Try to find an existing notification
    var notification = document.getElementById('noMatchesNotification');

    // If there were no matches to the search
    if (noMatches) {

        // If the notification is not already shown
        if (notification === null) {

            // Create the notification
            var notification = "                            \
            <article id='noMatchesNotification'>            \
                <p>                                         \
                    Found no articles matching your search! \
                </p>                                        \
            </article>";

            // Put the notification code at the begining of the left column
            var leftColumn = document.getElementsByClassName('left')[0];
            leftColumn.innerHTML = notification + leftColumn.innerHTML;

            // Hide the footer
            document.getElementsByTagName("footer")[0].className = 'hidden';
        }
    }
    // Otherwise if an old notification is still being shown
    else if (notification !== null) {

        // Remove the notification
        notification.parentNode.removeChild(notification);

        // Unhide the footer
        document.getElementsByTagName("footer")[0].className = '';
    }
}


/**
 * Determins whether a tag is contained in a tagList.
 * 
 * @param {String} tagName
 * @param {array(String)} tagList
 * @returns {Boolean}
 */
function tagInTagList(tagName, tagList) {

    // Get a list of all the tags in the tagList
    var tags = tagList.getElementsByTagName('LI');

    // Look through all the tags
    for (var i = 0; i < tags.length; i++) {

        // See the tag contains the search value
        if (stringContains(tags[i].innerHTML, tagName)) {

            // Exit as soon as we find a match 
            // (The article only needs to have the tag listed once)
            return true;
        }
    }
    // If we reach here, none of the tags where the one we we're looking for.
    return false;
}


/**
 * Determins whether the searchString is a sub-string if the sourceString.
 * This is equivelent to the String.contains() method in most other languages.
 * 
 * @param {String} sourceString
 * @param {String} searchString
 * @returns {Boolean}
 */
function stringContains(sourceString, searchString) {
    /*
     * Note:
     * .indexOf returns the position of the start of one string inside another,
     * this equals -1 if it is not contained in the string.
     * Comparing this value to -1 gives us a convenient boolean function.
     */
    return sourceString.indexOf(searchString) > -1;
}