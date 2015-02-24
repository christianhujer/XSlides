var NS_XHTML = 'http://www.w3.org/1999/xhtml';
var availableStyles = [ 'alien', 'alienTV', 'comic', 'oldschool', 'original' ];

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
            var msg = err + '\n' + err.stack;
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
    createTh : function(cell) {
        var th = document.createElementNS(NS_XHTML, 'th');
        th.appendChild(document.createTextNode(cell));
        return th;
    },
    createTd : function(cell) {
        var td = document.createElementNS(NS_XHTML, 'td');
        td.appendChild(document.createTextNode(cell));
        return td;
    },
    createTrTh : function(cells) {
        var tr = document.createElementNS(NS_XHTML, 'tr');
        for (var i = 0; i < cells.length; i++)
            tr.appendChild(Util.createTh(cells[i]));
        return tr;
    },
    createTrTd : function(cells) {
        var tr = document.createElementNS(NS_XHTML, 'tr');
        for (var i = 0; i < cells.length; i++)
            tr.appendChild(Util.createTd(cells[i]));
        return tr;
    },
    createThead : function(cells) {
        var thead = document.createElementNS(NS_XHTML, 'thead');
        thead.appendChild(Util.createTrTh(cells));
        return thead;
    },
    createTbody : function(rows) {
        var tbody = document.createElementNS(NS_XHTML, 'tbody');
        for (var i = 0; i < rows.length; i++)
            tbody.appendChild(Util.createTrTd(rows[i]));
        return tbody;
    },
    createTable : function(headers, rows) {
        var table = document.createElementNS(NS_XHTML, 'table');
        table.appendChild(Util.createThead(headers));
        table.appendChild(Util.createTbody(rows));
        return table;
    },
};

var XSlides = {
    currentSlide : null,
    nowheel : false,
    numberOfSlides : 0,
    toc : document.createElementNS(NS_XHTML, 'div'),
    help : document.createElementNS(NS_XHTML, 'div'),

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
        document.addEventListener('keydown', function(e) { return XSlides.keydown(e) }, false);
        document.addEventListener('keypress', function(e) { XSlides.keypress(e) }, false);
        document.addEventListener('mousewheel', function(e) { XSlides.mousewheel(e) }, false);
        window.addEventListener('hashchange', function(e) { XSlides.hashchange(e) }, false);
        window.addEventListener('resize', function(e) { XSlides.setFontSizeFromWindowSize(e) }, false);
    },

    addXSlidesStylesheet : function() {
        this.linkStylesheet('XSlides.css');

        var stylename = Util.getSearchParameter('style');
        if (stylename)
            this.linkStylesheet('styles/' + stylename + '.css', 'XSlidesStyle');
    },

    linkStylesheet : function(href, id) {
        var linkEl = document.createElementNS(NS_XHTML, 'link');
        if (id) linkEl.setAttribute('id', id);
        linkEl.setAttribute('rel', 'Stylesheet');
        linkEl.setAttribute('type', 'text/css');
        linkEl.setAttribute('href', href);
        document.head.appendChild(linkEl);
    },

    createSlideDiv : function(childNodes, currentClass) {
        var divElement = document.createElementNS(NS_XHTML, 'div');
	if (currentClass)
            divElement.setAttribute('class', 'slide ' + currentClass);
	else
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
        var currentClass;
        var defaultClass = document.body.getAttribute('class');

        var headline = document.createElementNS(NS_XHTML, 'h4');
        headline.appendChild(document.createTextNode('Table of Contents'));
        this.toc.appendChild(headline);

        for (var i = 0; i < nodes.length; i++) {
            var currentNode = nodes.item(i);
            nodesOfCurrentSlide.push(currentNode);
            if (XSlides.isFirstNodeOfSlide(currentNode)) {
                currentClass = currentNode.getAttribute('class');
                slideStartFound = true;
                var a = document.createElementNS(NS_XHTML, 'a');
                var clone = currentNode.cloneNode(true);
                while (clone.childNodes.length > 0)
                    a.appendChild(clone.childNodes[0]);
                Util.removeIds(a);
                a.setAttribute('href', '#(' + (this.numberOfSlides + 1) + ')');
                a.addEventListener('click', function() { XSlides.tocLink() }, false);
                this.toc.appendChild(a);
            }
            if (slideStartFound && XSlides.isLastNodeOfSlide(currentNode)) {
                slides.push(XSlides.createSlideDiv(nodesOfCurrentSlide, currentClass || defaultClass));
                currentClass = undefined;
                nodesOfCurrentSlide = [];
                i = -1;
                slideStartFound = false;
            }
        }
        for (var i = 0; i < slides.length; i++)
            document.body.appendChild(slides[i]);
        document.body.removeAttribute('class');
    },

    finalizeToc : function() {
        this.toc.className = 'XSlidesToc';
        var checkbox = document.createElementNS(NS_XHTML, 'input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'tocStay');
        this.toc.appendChild(checkbox);
        var label = document.createElementNS(NS_XHTML, 'label');
        label.setAttribute('for', 'tocStay');
        label.setAttribute('title', 'stay on screen');
        label.appendChild(document.createTextNode('Sticky'));
        this.toc.appendChild(label);
        document.body.appendChild(this.toc);
    },

    createHelp : function() {
        this.help.className = 'XSlidesHelp';

        var headline = document.createElementNS(NS_XHTML, 'h4');
        headline.appendChild(document.createTextNode('Help'));
        this.help.appendChild(headline);

        this.help.appendChild(Util.createTable(["Keys", "Operation"], [["h,j,k,l", "vi-style navication"], ["Up, Left, Page Up, Backspace, h, k, p", "Previous Slide"], ["Down, Right, Page Down, Enter, Space, j, l, n", "Next Slide"], ["Home, 1, g", "First Slide"], ["End, G", "Last Slide"], ["c", "Display Table of Contents"], ["?, F1", "Display this help"]]));
        document.body.appendChild(this.help);
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
            document.getElementById('slide' + this.currentSlide).style.removeProperty('display');
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

    toggleHelp : function() {
        this.help.style.visibility = this.help.style.visibility == 'visible' ? 'hidden' : 'visible';
    },

    tocLink : function() {
        if (!document.getElementById('tocStay').checked) this.toggleToc();
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
        case 112: this.toggleHelp(); return false; /* PowerPoint: F1 */
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
        case 63: this.toggleHelp(); return; /* ? */
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
        XSlides.createHelp();
        XSlides.finalizeToc();
    },
};

XSlides.init();
