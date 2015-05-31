var NS_XHTML = 'http://www.w3.org/1999/xhtml';
var availableStyles = [ 'alien', 'alienTV', 'comic', 'oldschool', 'original' ];
var scriptDir = (function() {
    var scriptNodeList = document.getElementsByTagName('script');
    var scriptElement = scriptNodeList.item(scriptNodeList.length - 1);
    var scriptUri = scriptElement.src;
    var scriptDir = scriptUri.substring(0, scriptUri.lastIndexOf('/') + 1);
    return scriptDir;
}());

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
    fa : function(text) {
        var span = document.createElementNS(NS_XHTML, 'span');
        span.setAttribute('class', 'fa');
        span.appendChild(document.createTextNode(text));
        return span;
    },
};

var XSlides = {
    mode : 'normal', /* ['normal', 'black', 'white'] */
    currentSlide : null,
    nowheel : false,
    numberOfSlides : 0,
    currentFontSizeFactor : 4,
    fontSizeFactors : [0.5, 0.66, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0],
    toc : document.createElementNS(NS_XHTML, 'div'),
    help : document.createElementNS(NS_XHTML, 'div'),
    footer : document.createElementNS(NS_XHTML, 'div'),
    documentTitle : null,

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
        this.linkStylesheet(scriptDir + 'XSlides.css');
        this.linkStylesheet(scriptDir + 'DefaultStyles.css');

        /*var stylename = Util.getSearchParameter('style');
        if (stylename)
            this.linkStylesheet('styles/' + stylename + '.css', 'XSlidesStyle');*/
    },

    relativizeToScript : function(uri) {
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
        for (var i = 0; i < childNodes.length; ++i) {
            if (childNodes[i].tagName == 'h1' || childNodes[i].tagName == 'H1') {
                var h1Container = document.createElementNS(NS_XHTML, 'div');
                h1Container.setAttribute('class', 'h1Container');
                divElement.appendChild(h1Container);
                h1Container.appendChild(childNodes[i]);
            } else {
                divElement.appendChild(childNodes[i]);
            }
        }
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
        var tocHead = document.createElementNS(NS_XHTML, 'div');
        var tocList = document.createElementNS(NS_XHTML, 'div');

        var headline = document.createElementNS(NS_XHTML, 'h4');
        headline.appendChild(document.createTextNode('Table of Contents'));
        this.toc.appendChild(headline);
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
        this.toc.appendChild(tocList);

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
                tocList.appendChild(a);
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
        document.body.appendChild(this.toc);
    },

    initHelp : function() {
        this.help.className = 'XSlidesHelp';

        var headline = document.createElementNS(NS_XHTML, 'h4');
        headline.appendChild(document.createTextNode('Help'));
        this.help.appendChild(headline);

        var table = Util.createTable(
            ["Keys", "", "Operation"],
            [
                ["h,j,k,l",                                       "\uf120", "vi-style"         ],
                ["Home, 1, g",                                    "\uf049", "First Slide"      ],
                ["Up, Left, Page Up, Backspace, h, k, p",         "\uf053", "Previous Slide"   ],
                ["Down, Right, Page Down, Enter, Space, j, l, n", "\uf054", "Next Slide"       ],
                ["End, G",                                        "\uf050", "Last Slide"       ],
                ["<, -, >, +",                                    "\uf031", "Change font size" ],
                ["c",                                             "\uf022", "Table of Contents"],
                ["f",                                             "\uf0d7", "Footer"           ],
                ["b",                                             "\uf016", "Black screen"     ],
                ["w",                                             "\uf15b", "White screen"     ],
                ["?, F1",                                         "\uf128", "This Help"        ],
            ]
        );
        var trs = table.getElementsByTagNameNS(NS_XHTML, 'tbody')[0].getElementsByTagNameNS(NS_XHTML, 'tr');
        for (var i = 0; i < trs.length; i++)
            trs[i].childNodes[1].setAttribute('class', 'fa');
        this.help.appendChild(table);
        document.body.appendChild(this.help);
    },

    getCopyright : function() {
        var metaNodes = document.getElementsByTagNameNS(NS_XHTML, 'meta');
        for (var i = 0; i < metaNodes.length; i++) {
            if (metaNodes[i].getAttribute('name') == 'copyright')
                return metaNodes[i].getAttribute('content');
        }
        return '';
    },

    initBlankSlides : function() {
        var black = document.createElementNS(NS_XHTML, 'div');
        var white = document.createElementNS(NS_XHTML, 'div');
        black.setAttribute('id', 'slide_black');
        white.setAttribute('id', 'slide_white');
        document.body.appendChild(black);
        document.body.appendChild(white);
    },
    initFooter : function() {
        this.footer.className = 'XSlidesFooter';
        this.footer.innerHTML += '<ul class="left"><li title="f: Footer" onclick="javascript:XSlides.toggleFooter();"><span class="fa">&#xf0d7;</span></li><li title="c: Table of Contents" onclick="javascript:XSlides.toggleToc();"><span class="fa">&#xf03a;</a></li><li title="?/F1: keyboard help" onclick="javascript:XSlides.toggleHelp()"><span class="fa">&#xf11c;</span></li><li title="b: Black screen" onclick="javascript:XSlides.toggleMode(\'black\')"><span class="fa">&#xf016;</span></li><li title="w: White screen" onclick="javascript:XSlides.toggleMode(\'white\')"><span class="fa">&#xf15b;</span></li><li title="&lt;, -: Smaller font" onclick="javascript:XSlides.decreaseFontSize()"><span class="fa">&#xf068;</span></li><li><span class="fa">&#xf031;</span></li><li title="&gt;, +: Bigger font" onclick="javascript:XSlides.increaseFontSize()"><span class="fa">&#xf067;</span></li></ul><ul class="right"><li>' + this.getCopyright() + '</li><li title="XSlides on Twitter"><a href="https://twitter.com/christianhujer" class="fa">&#xf099;</a></li><li title="XSlides on Github"><a href="https://github.com/christianhujer/XSlides/" class="fa">&#xf09b;</a></li></ul><ul class="center"><li title="Home, 1, g: First Slide" onclick="XSlides.firstSlide()"><span class="fa">&#xf049;</span></li><li title="Up, Left, Page Up, Backspace, h, k, p: Previous Slide" onclick="XSlides.previousSlide()"><span class="fa">&#xf053;</a></li><li><span id="currentSlideNumber"></span> / <span id="slideCount"></span></li><li title="Down, Right, Page Down, Enter, Space, j, l, n: Next Slide" onclick="XSlides.nextSlide()"><span class="fa">&#xf054;</span></li><li title="End, G: Last Slide" onclick="XSlides.lastSlide()"><span class="fa">&#xf050;</span></li></ul>';
        document.body.appendChild(this.footer);
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
        document.body.style.fontSize = this.fontSizeFactors[this.currentFontSizeFactor] * Math.sqrt(window.innerHeight * window.innerWidth / 640 / 480) * 100 + '%';
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
        document.getElementById('currentSlideNumber').innerHTML = this.currentSlide;
        document.getElementById('slideCount').innerHTML = this.numberOfSlides;
        document.title = documentTitle + ": " + currentSlide.getElementsByTagNameNS(NS_XHTML, "h1")[0].innerText + " (" + this.currentSlide + "/" + this.numberOfSlides + ")";
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

    decreaseFontSize : function() {
        this.currentFontSizeFactor--;
        if (this.currentFontSizeFactor < 0)
            this.currentFontSizeFactor = 0;
        this.setFontSizeFromWindowSize();
    },

    increaseFontSize : function() {
        this.currentFontSizeFactor++;
        if (this.currentFontSizeFactor >= this.fontSizeFactors.length)
            this.currentFontSizeFactor = this.fontSizeFactors.length - 1;
        this.setFontSizeFromWindowSize();
    },

    toggleVisibility : function(el) {
        el.style.visibility = el.style.visibility == 'visible' ? 'hidden' : 'visible';
    },

    toggleToc : function() {
        this.toggleVisibility(this.toc);
    },

    toggleHelp : function() {
        this.toggleVisibility(this.help);
    },

    toggleFooter : function() {
        this.toggleVisibility(this.footer);
    },

    toggleMode : function(targetMode) {
        this.mode = this.mode == targetMode ? 'normal' : targetMode;
        document.getElementById('slide_white').style.visibility = 'hidden';
        document.getElementById('slide_black').style.visibility = 'hidden';
        /*document.getElementById('slide_blank').style.visibility = 'hidden';*/
        if (this.mode != 'normal')
            document.getElementById('slide_' + this.mode).style.visibility = 'visible';
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
        case 49: this.firstSlide(); return; /* vi: 1 */
        case 71: this.lastSlide(); return; /* vi: G */
        case 103: this.firstSlide(); return; /* vi: g */
        case 104: this.previousSlide(); return; /* vi: h */
        case 106: this.nextSlide(); return; /* vi: j */
        case 107: this.previousSlide(); return; /* vi: k */
        case 108: this.nextSlide(); return; /* vi: l */

        case 10: this.nextSlide(); return; /* PowerPoint: <LF> */
        case 13: this.nextSlide(); return; /* PowerPoint: <CR> */
        case 32: this.nextSlide(); return; /* PowerPoint: <SP> */
        case 46: this.toggleMode('blank'); return; /* PowerPoint: . */
        case 98: this.toggleMode('black'); return; /* PowerPoint: b */
        case 110: this.nextSlide(); return; /* PowerPoint: n */
        case 112: this.previousSlide(); return; /* PowerPoint: p */
        case 119: this.toggleMode('white'); return; /* PowerPoint: w */

        case 63: this.toggleHelp(); return; /* ? */
        case 99: this.toggleToc(); return; /* c - table of contents */
        case 102: this.toggleFooter(); return; /* f - footer */
        case 60: this.decreaseFontSize(); return; /* < */
        case 62: this.increaseFontSize(); return; /* > */
        case 43: this.increaseFontSize(); return; /* + */
        case 45: this.decreaseFontSize(); return; /* - */
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
        this.documentTitle = document.getElementsByTagNameNS(NS_XHTML, "title")[0].innerText;
        XSlides.loadSources();
        XSlides.addXSlidesStylesheet();
        XSlides.convertHeadingsIntoSlides();
        XSlides.initBlankSlides();
        XSlides.initHelp();
        XSlides.initFooter();
        XSlides.installEventHandlers();
        XSlides.setFontSizeFromWindowSize();
        XSlides.displaySlideFromHash();
        if (typeof(prettyPrint) == 'function')
            prettyPrint();
        XSlides.finalizeToc();
    },
};

var nc = {
    el : function(name, nodeOrText) {
        var el = document.createElementNS('http://www.w3.org/1999/xhtml', name);
        if (nodeOrText)
            if (nodeOrText instanceof Node)
                el.appendChild(nodeOrText);
            else if (typeof nodeOrText == 'string' || nodeOrText instanceof String)
                el.innerHTML = nodeOrText;
            else
                console.log('unsupported node type for node ' + nodeOrText + ' - typeof: ' + typeof nodeOrText);
            return el;
    },
    init : function() {
        var elements = ['blockquote', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ol', 'p', 'pre', 'strong', 'ul'];
        elements.forEach(function(elName) { nc[elName] = function(nodeOrText) { return nc.el(elName, nodeOrText); };});
    },
};
nc.init();

var MD = {
    init : function() {
        window.addEventListener('load', function() { MD.load(); }, false);
    },
    load : function() {
        var body = document.body;
        var text = body.innerHTML;
        if (!text.match(/^\s*#/)) return;
        body.textContent = '';
        body.setAttribute('class', 'original');
        var lines = text.split('\n');
        for (var lineNo = 0; lineNo < lines.length; lineNo++) {
            var line = lines[lineNo];
            console.log(line);
            if (line == '') body.appendChild(nc.p());
            else if (line.indexOf("# ") == 0) this.appendChild('h1', this.replaceInlineMarkup(line.substring(2)));
            else if (line.indexOf("## ") == 0) this.appendChild('h2', this.replaceInlineMarkup(line.substring(3)));
            else if (line.indexOf("### ") == 0) this.appendChild('h3', this.replaceInlineMarkup(line.substring(4)));
            else if (line.indexOf("#### ") == 0) this.appendChild('h4', this.replaceInlineMarkup(line.substring(5)));
            else if (line.indexOf("##### ") == 0) this.appendChild('h5', this.replaceInlineMarkup(line.substring(6)));
            else if (line.indexOf("###### ") == 0) this.appendChild('h6', this.replaceInlineMarkup(line.substring(7)));
            else if (line.indexOf("> ") == 0) this.continueChild("blockquote", this.replaceInlineMarkup(line.substring(2)));
            else if (line.indexOf("- ") == 0) this.continueChild('ul', nc.el('li', this.replaceInlineMarkup(line.substring(2))));
            else if (line.indexOf("* ") == 0) this.continueChild('ul', nc.el('li', this.replaceInlineMarkup(line.substring(2))));
            else if (line.indexOf("&lt;&lt;(") == 0) document.body.appendChild(this.createPre(line));
            else this.continueChild("p", this.replaceInlineMarkup(line));
        }
    },
    createPre : function(line) {
        var pre = nc.el('pre');
        var src = /\&lt;\&lt;\(([^)]*)\)/.exec(line)[1];
        pre.setAttribute('src', src);
        return pre;
    },
    replaceInlineMarkup : function(text) {
        return text.replace(/`(.*?)`/g, "<code>$1</code>");
    },
    appendChild : function(elName, nodeOrText) {
        document.body.appendChild(nc.el(elName, nodeOrText));
    },
    continueChild : function(elName, nodeOrText) {
        if (document.body.lastElementChild.tagName.toLowerCase() == elName)
            if (nodeOrText instanceof Element)
                document.body.lastElementChild.appendChild(nodeOrText);
            else
                document.body.lastElementChild.innerHTML += "\n" + nodeOrText;
        else
            document.body.appendChild(nc.el(elName, nodeOrText));
    },
    translateLine : function(text) {
        var nodes = [];
        var currentNode = null;
        for (var i = 0; i < text.length; i++) {
            switch (text[i]) {
                case '`': ;
            }
        }
        return nodes;
    },
};

MD.init();
XSlides.init();
