var XSlides_currentSlide = 0;
var XSlides_numberOfSlides = 0;
var commandlineEnabled = false;

function XSlides_displaySlide(slideNumber) {
    if (1 > slideNumber)
        slideNumber = 1;
    if (slideNumber > XSlides_numberOfSlides)
        slideNumber = XSlides_numberOfSlides;
    if (XSlides_currentSlide != 0)
        document.getElementById('slide' + XSlides_currentSlide).style.display = 'none';
    document.getElementById('slide' + slideNumber).style.display = 'block';
    XSlides_currentSlide = slideNumber;
}

function XSlides_onload() {
    var slideNumber = 0;

    function isSlideStart(element) {
        return element.tagName == "h1" || element.tagName == "H1";
    }

    function isSlideEnd(element) {
        var nextSibling = element.nextSibling;
        return !nextSibling || isSlideStart(nextSibling);
    }

    function createSlideDiv(childNodes) {
        var divElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        divElement.setAttribute('class', 'slide');
        divElement.setAttribute('id', 'slide' + ++slideNumber);
        for (var i = 0; i < childNodes.length; ++i)
            divElement.appendChild(childNodes[i]);
        return divElement;
    }

    function convertHeadingsIntoSlides() {
        var nodes = document.body.childNodes;
        var newElements = [];
        var elementsOfCurrentSlide = [];
        var slideStartFound = false;

        for (var i = 0; i < nodes.length; i++) {
            var currentElement = nodes.item(i);
            elementsOfCurrentSlide.push(currentElement);
            if (isSlideStart(currentElement))
                slideStartFound = true;
            if (slideStartFound && isSlideEnd(currentElement)) {
                XSlides_numberOfSlides++;
                newElements.push(createSlideDiv(elementsOfCurrentSlide));
                elementsOfCurrentSlide = [];
                i = -1;
                slideStartFound = false;
            }
        }
        for (var i = 0; i < newElements.length; i++)
            document.body.appendChild(newElements[i]);
    }

    function previousSlide() {
        XSlides_displaySlide(XSlides_currentSlide - 1);
    }

    function nextSlide() {
        XSlides_displaySlide(XSlides_currentSlide + 1);
    }

    function firstSlide() {
        XSlides_displaySlide(1);
    }

    function lastSlide() {
        XSlides_displaySlide(XSlides_numberOfSlides);
    }

    function keydown(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode;
        switch (keyCode) {
        case 8: previousSlide(); return false; /* Backspace */
        case 33: previousSlide(); return; /* PowerPoint: page up */
        case 34: nextSlide(); return; /* PowerPoint: page down */
        case 35: lastSlide(); return; /* PowerPoint: end */
        case 36: firstSlide(); return; /* PowerPoint: pos1 */
        case 37: if (!commandlineEnabled) previousSlide(); return; /* PowerPoint: left */
        case 38: if (!commandlineEnabled) previousSlide(); return; /* PowerPoint: up */
        case 39: if (!commandlineEnabled) nextSlide(); return; /* PowerPoint: right */
        case 40: if (!commandlineEnabled) nextSlide(); return; /* PowerPoint: down */
        }
    }

    function keypress(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode;
        switch (keyCode) {
        case 104: previousSlide(); return; /* vi: h */
        case 106: nextSlide(); return; /* vi: j */
        case 107: previousSlide(); return; /* vi: k */
        case 108: nextSlide(); return; /* vi: l */
        case 110: nextSlide(); return; /* PowerPoint: n */
        case 112: previousSlide(); return; /* PowerPoint: p */
        case 32: nextSlide(); return; /* PowerPoint: <SP> */
        case 49: firstSlide(); return; /* vi: 1 */
        case 13: nextSlide(); return; /* PowerPoint: <CR> */
        case 10: nextSlide(); return; /* PowerPoint: <LF> */
        case 71: lastSlide(); return; /* vi: G */
        case 103: firstSlide(); return; /* vi: g */
        }
    }

    function installEventHandlers() {
        document.onkeydown = keydown;
        document.onkeypress = keypress;
    }

    function addXSlidesStylesheet() {
        linkStylesheet('XSlides.css');

        var stylename = getSearchParameter('style');
        if (stylename)
            linkStylesheet('styles/' + stylename + '.css');
    }

    function linkStylesheet(href) {
        var linkEl = document.createElementNS('http://www.w3.org/1999/xhtml', 'link');
        linkEl.setAttribute('rel', 'Stylesheet');
        linkEl.setAttribute('type', 'text/css');
        linkEl.setAttribute('href', href);
        document.head.appendChild(linkEl);
    }

    function getSearchParameter(name) {
        var search = window.location.search.substring(1).split("&");
        for (var i = 0; i < search.length; i++) {
            var kv = search[i].split("=");
            if (kv[0] == name)
                return kv[1];
        }
    }

    addXSlidesStylesheet();
    convertHeadingsIntoSlides();
    installEventHandlers();
    XSlides_displaySlide(1);
}

window.addEventListener('load', XSlides_onload, false);
