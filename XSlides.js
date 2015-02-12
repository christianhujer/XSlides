var XSlides_currentSlide = 0;
var XSlides_numberOfSlides = 0;

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
        return element.tagName == "h1";
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

    function keydown(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode;
        switch (keyCode) {
        case 8: previousSlide(); return false; /* Backspace */
        case 33: previousSlide(); return; /* PgUp */
        case 34: nextSlide(); return; /* PgDn */
        }
    }

    function installEventHandlers() {
        document.onkeydown = keydown;
    }

    convertHeadingsIntoSlides();
    installEventHandlers();
    XSlides_displaySlide(1);
}
