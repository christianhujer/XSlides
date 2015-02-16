var Util = {
    getFirstDescendantId : function(node) {
        var nodes = node.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.id) return node.id;
            if (node.childNodes) {
                var id = Util.getFirstDescendantId(node);
                if (id)
                    return id;
            }
        }
    },
    getSearchParameter : function(name) {
        var search = window.location.search.substring(1).split("&");
        for (var i = 0; i < search.length; i++) {
            var kv = search[i].split("=");
            if (kv[0] == name)
                return kv[1];
        }
    },
    load : function(uri) {
        var req = new XMLHttpRequest();
	try {
	    req.open('GET', uri, false);
	    req.send();
            return req.responseText;
	} catch (err) {
            var msg = "Error loading " + uri + " using XMLHttpRequest: " + err.message;
	    console.log(msg);
	    return msg;
        }
    },
    removeIds : function(node) {
        if (node instanceof Element && node.hasAttribute('id'))
            node.removeAttribute('id');
        var nodes = node.childNodes;
        for (var i = 0; i < nodes.length; i++)
            this.removeIds(nodes[i]);
    },
};

var XSlides = {
    currentSlide : null,
    nowheel : false,
    numberOfSlides : 0,
    toc : document.createElementNS('http://www.w3.org/1999/xhtml', 'div'),

    /* Helper methods */
    isFirstNodeOfSlide : function(node) {
        return node.tagName == "h1" || node.tagName == "H1";
    },

    isLastNodeOfSlide : function(node) {
        var nextSibling = node.nextSibling;
        return !nextSibling || this.isFirstNodeOfSlide(nextSibling);
    },

    getSlideNumberFromHash : function(hash) {
        var match;
        if (match = /^#([+-]?)\((\d+)\)$/.exec(hash)) {
            var slideDelta = Number(match[2]);
            switch (match[1]) {
            case '+': return this.currentSlide + slideDelta;
            case '-': return this.currentSlide - slideDelta;
            default: return slideDelta;
            }
        }
        if (hash == '#next()') return this.currentSlide + 1;
        if (hash == '#prev()' || hash == '#previous()') return this.currentSlide - 1;
        if (hash == '#first()') return 1;
        if (hash == '#last()') return this.numberOfSlides;
        var id = hash.substring(1);
        for (var element = document.getElementById(id); element; element = element.parentNode)
            if (element.slideNumber)
                return element.slideNumber;
    },

    /* private methods */
    installEventHandlers : function() {
        document.addEventListener('keydown', function(e) { XSlides.keydown(e) }, false);
        document.addEventListener('keypress', function(e) { XSlides.keypress(e) }, false);
        document.addEventListener('mousewheel', function(e) { XSlides.mousewheel(e) }, false);
        window.addEventListener('hashchange', function(e) { XSlides.hashchange(e) }, false);
        window.addEventListener('resize', function(e) { XSlides.setFontSizeFromWindowSize(e) }, false);
    },

    addXSlidesStylesheet : function() {
        this.linkStylesheet('XSlides.css');

        var stylename = Util.getSearchParameter('style');
        if (stylename)
            this.linkStylesheet('styles/' + stylename + '.css');
    },

    linkStylesheet : function(href) {
        var linkEl = document.createElementNS('http://www.w3.org/1999/xhtml', 'link');
        linkEl.setAttribute('rel', 'Stylesheet');
        linkEl.setAttribute('type', 'text/css');
        linkEl.setAttribute('href', href);
        document.head.appendChild(linkEl);
    },

    createSlideDiv : function(childNodes) {
        var divElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        divElement.setAttribute('class', 'slide');
        divElement.setAttribute('id', 'slide' + ++XSlides.numberOfSlides);
        for (var i = 0; i < childNodes.length; ++i)
            divElement.appendChild(childNodes[i]);
        divElement.slideNumber = XSlides.numberOfSlides;
        divElement.addEventListener('mousewheel', function(e) { XSlides.divwheel(e) }, false);
        return divElement;
    },

    convertHeadingsIntoSlides : function() {
        var nodes = document.body.childNodes;
        var slides = [];
        var nodesOfCurrentSlide = [];
        var slideStartFound = false;

        for (var i = 0; i < nodes.length; i++) {
            var currentNode = nodes.item(i);
            nodesOfCurrentSlide.push(currentNode);
            if (XSlides.isFirstNodeOfSlide(currentNode)) {
                slideStartFound = true;
                var a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                var clone = currentNode.cloneNode(true);
                while (clone.childNodes.length > 0)
                    a.appendChild(clone.childNodes[0]);
                Util.removeIds(a);
                a.setAttribute('href', '#(' + (this.numberOfSlides + 1) + ')');
                a.addEventListener('click', function() { XSlides.toggleToc() }, false);
                this.toc.appendChild(a);
            }
            if (slideStartFound && XSlides.isLastNodeOfSlide(currentNode)) {
                slides.push(XSlides.createSlideDiv(nodesOfCurrentSlide));
                nodesOfCurrentSlide = [];
                i = -1;
                slideStartFound = false;
            }
        }
        for (var i = 0; i < slides.length; i++)
            document.body.appendChild(slides[i]);
    },

    finalizeToc : function() {
        this.toc.className = 'XSlidesToc';
        document.body.appendChild(this.toc);
    },

    replaceContent : function(element, uri) {
        element.appendChild(document.createTextNode(Util.load(uri)));
    },

    loadSources : function() {
        var preElements = document.getElementsByTagName('pre');
        for (var i = 0; i < preElements.length; i++) {
            var preElement = preElements[i];
            var src = preElement.getAttribute('src');
            if (src)
                this.replaceContent(preElement, src);
        }
    },

    setFontSizeFromWindowSize : function() {
        document.getElementsByTagName('body')[0].style.fontSize = Math.sqrt(window.innerHeight * window.innerWidth / 640 / 480) * 100 + '%';
    },

    /* public methods */
    init : function() {
        window.addEventListener('load', XSlides.load, false);
    },

    getHashFromCurrentSlide : function(slideElement) {
        var slideId = Util.getFirstDescendantId(slideElement);
        if (slideId) return '#' + slideId;
        if (this.currentSlide == 1) return '#first()';
        if (this.currentSlide == this.numberOfSlides) return '#last()';
        return '#(' + this.currentSlide + ')';
    },

    displaySlide : function(slideNumber) {
        if (1 > slideNumber) slideNumber = 1;
        if (slideNumber > this.numberOfSlides) slideNumber = this.numberOfSlides;
        if (slideNumber == this.currentSlide) return;
        if (this.currentSlide)
            document.getElementById('slide' + this.currentSlide).style.display = 'none';
        this.currentSlide = slideNumber;
        var currentSlide = document.getElementById('slide' + this.currentSlide);
        currentSlide.style.display = 'block';
        window.location.hash = this.getHashFromCurrentSlide(currentSlide);
    },

    displaySlideFromHash : function() {
        var hash = window.location.hash;
        var slideNumber;
        if (hash) slideNumber = this.getSlideNumberFromHash(hash);
        if (!slideNumber) slideNumber = 1;
        this.displaySlide(slideNumber);
    },

    firstSlide : function() {
        this.displaySlide(1);
    },

    previousSlide : function() {
        this.displaySlide(this.currentSlide - 1);
    },

    nextSlide : function() {
        this.displaySlide(this.currentSlide + 1);
    },

    lastSlide : function() {
        this.displaySlide(this.numberOfSlides);
    },

    toggleToc : function() {
        this.toc.style.visibility = this.toc.style.visibility == 'visible' ? 'hidden' : 'visible';
    },

    /* event handlers */

    divwheel : function(e) {
        if (!e) { e = window.event; }
        this.nowheel = false;
        if (0 > e.wheelDelta)
            if (document.body.scrollHeight > document.body.scrollTop + window.innerHeight)
                this.nowheel = true;
        if (e.wheelDelta > 0)
            if (document.body.scrollTop > 0)
                this.nowheel = true;
    },

    hashchange : function(e) {
        this.displaySlideFromHash();
    },

    keydown : function(e) {
        if (!e) { e = window.event; }
        var keyCode = e.keyCode;
        switch (keyCode) {
        case 8: this.previousSlide(); return false; /* Backspace */
        case 33: this.previousSlide(); return; /* PowerPoint: page up */
        case 34: this.nextSlide(); return; /* PowerPoint: page down */
        case 35: this.lastSlide(); return; /* PowerPoint: end */
        case 36: this.firstSlide(); return; /* PowerPoint: pos1 */
        case 37: this.previousSlide(); return; /* PowerPoint: left */
        case 38: this.previousSlide(); return; /* PowerPoint: up */
        case 39: this.nextSlide(); return; /* PowerPoint: right */
        case 40: this.nextSlide(); return; /* PowerPoint: down */
        }
    },

    keypress : function(e) {
        if (!e) { e = window.event; }
        var keyCode = e.keyCode;
        switch (keyCode) {
        case 99: this.toggleToc(); return; /* c - table of contents */
        case 104: this.previousSlide(); return; /* vi: h */
        case 106: this.nextSlide(); return; /* vi: j */
        case 107: this.previousSlide(); return; /* vi: k */
        case 108: this.nextSlide(); return; /* vi: l */
        case 110: this.nextSlide(); return; /* PowerPoint: n */
        case 112: this.previousSlide(); return; /* PowerPoint: p */
        case 32: this.nextSlide(); return; /* PowerPoint: <SP> */
        case 49: this.firstSlide(); return; /* vi: 1 */
        case 13: this.nextSlide(); return; /* PowerPoint: <CR> */
        case 10: this.nextSlide(); return; /* PowerPoint: <LF> */
        case 71: this.lastSlide(); return; /* vi: G */
        case 103: this.firstSlide(); return; /* vi: g */
        }
    },

    mousewheel : function(e) {
        if (!e) e = window.event;
        if (e.ctrlKey) return;
        if (this.nowheel) {
            this.nowheel = false;
            return;
        }
        if (e.wheelDeltaX || e.wheelDeltaY) {
            /* Chrome supports two wheels, nice. */
            if (e.wheelDeltaY > 0) this.previousSlide();
            if (0 > e.wheelDeltaY) this.nextSlide();
            if (e.wheelDeltaX > 0) this.previousSlide();
            if (0 > e.wheelDeltaX) this.nextSlide();
            return;
        }
        /* Opera and Internet Explorer support one wheel. */
        if (e.wheelDelta > 0) this.previousSlide();
        if (0 > e.wheelDelta) this.nextSlide();
        /* No wheel support in Firefox. */
    },

    load : function() {
        XSlides.loadSources();
        XSlides.addXSlidesStylesheet();
        XSlides.convertHeadingsIntoSlides();
        XSlides.installEventHandlers();
        XSlides.setFontSizeFromWindowSize();
        XSlides.displaySlideFromHash();
        if (typeof(prettyPrint) == 'function')
            prettyPrint();
        XSlides.finalizeToc();
    },
};

XSlides.init();
