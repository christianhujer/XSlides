const NORMAL = 1;
const BLANK = 2;
const BLACK = 3;
const WHITE = 4;
const HELP = 5;
currentSlide = 0;
blank = NORMAL;
commandlineEnabled = false;
nowheel = false;

/** Event handler for mouse wheel.
 * @param e Event object.
 */
function mousewheel(e) {
    if (!e) { e = window.event; }
    if (nowheel) {
        nowheel = false;
        return;
    }
    if (e.wheelDeltaY) {
        /* Chrome supports two wheels, nice. */
        if (e.wheelDeltaY > 0) { previousSlide(); }
        if (0 > e.wheelDeltaY) { nextSlide(); }
        return;
    }
    /* Opera and Internet Explorer support one wheel. */
    if (e.wheelDelta > 0) { previousSlide(); }
    if (0 > e.wheelDelta) { nextSlide(); }
    /* No wheel support in Firefox. */
}

/** Eventhandler for wheel on div.
 * @param e Event object.
 */
function divwheel(e) {
    if (!e) { e = window.event; }
    if (0 > e.wheelDelta)
        if (e.currentTarget.scrollHeight > e.currentTarget.scrollTop + e.currentTarget.clientHeight)
            nowheel = true;
    if (e.wheelDelta > 0)
        if (e.currentTarget.scrollTop > 0)
            nowheel = true;
}

/** Event handler for mouse down event.
 * @param e Event object.
 */
function mousedown(e) {
    if (!e) e = window.event;
    /*window.alert(e.button);*/
    return false;
}

/** Event handler for mouse click event.
 * @param e Event object.
 */
function click(e) {
    if (!e) e = window.event;
    /* Note: On IE, e.button is always 0 here - looks like a bug. */
    switch (e.button) {
    /*LMB*/case 0: nextSlide(); return false;
    /*MMB*/case 1: previousSlide(); return false;
    /*RMB*/case 2: /* TODO:2011-07-02:hujerc:3:Implement context menu. */; return false;
    }
}

/** Event handler for the keydown event.
 * @param e Event object.
 */
function keydown(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode;
    if (commandlineEnabled) {
        switch (keyCode) {
        case 27: disableCommandline(); return; /* esc */
        /*default: window.alert(keyCode);*/
        }
    } else {
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
        case 112: help(); return false; /* PowerPoint: vi: F1 */
        case 116: enableCommandline(); return false; /* F5 */
        /*default: window.alert(keyCode);*/
        }
    }
}

/** Toggles blanking the slides / screen. */
function toggleBlank(newBlank) {
    document.getElementById('screenWhite').style.display = 'none';
    document.getElementById('screenBlack').style.display = 'none';
    document.getElementById('slide_help').style.display = 'none';
    if (newBlank == blank) {
        blank = NORMAL;
        activateSlide(currentSlide);
        return;
    }
    if (newBlank == BLACK) {
        document.getElementById('screenBlack').style.display = 'block';
    } else if (newBlank == WHITE) {
        document.getElementById('screenWhite').style.display = 'block';
    } else if (newBlank == BLANK) {
        document.getElementById('slide_' + currentSlide).style.display = 'none';
        document.getElementById('currentSlide').innerHTML = currentSlide + ' (blank)';
    } else if (newBlank == HELP) {
        document.getElementById('slide_' + currentSlide).style.display = 'none';
        document.getElementById('slide_help').style.display = 'block';
        document.getElementById('currentSlide').innerHTML = currentSlide + ' (help)';
    }
    blank = newBlank;
}

/** Event handler for the keypress event.
 * @param e Event object.
 */
function keypress(e) {
    if (!e) {
        e = window.event;
    }
    var keyCode = e.keyCode;
    if (commandlineEnabled) {
        switch (keyCode) {
        case 58: retval = commandlineEnabled; enableCommandline(); return retval; /* vi: : */
        /*default: window.alert(keyCode);*/
        }
    } else {
        switch (keyCode) {
        case 104: previousSlide(); return; /* vi: h */
        case 106: nextSlide(); return; /* vi: j */
        case 107: previousSlide(); return; /* vi: k */
        case 108: nextSlide(); return; /* vi: l */
        case 110: nextSlide(); return; /* PowerPoint: n */
        case 112: previousSlide(); return; /* PowerPoint: p */
        case 32: nextSlide(); return; /* PowerPoint: <SP> */
        case 13: nextSlide(); return; /* PowerPoint: <CR> */
        case 10: nextSlide(); return; /* PowerPoint: <LF> */
        case 71: lastSlide(); return; /* vi: G */
        case 103: firstSlide(); return; /* vi: g */
        case 58: retval = commandlineEnabled; enableCommandline(); return retval; /* vi: : */
        case 46: if (!commandlineEnabled) toggleBlank(BLANK); return; /* PowerPoint: . */
        case 98: if (!commandlineEnabled) toggleBlank(BLACK); return; /* PowerPoint: b */
        case 119: if (!commandlineEnabled) toggleBlank(WHITE); return; /* PowerPoint: w */
        case 63: help(); return; /* ? */
        /*default: window.alert(keyCode);*/
        }
    }
}

/** Disables the commandline. */
function disableCommandline() {
    document.getElementById('command').blur();
    document.getElementById('commandline').style.display = 'none';
    document.getElementById('command').value = "";
    commandlineEnabled = false;
}

/** Enables the commandline. */
function enableCommandline() {
    document.getElementById('commandline').style.display = 'block';
    document.getElementById('command').focus();
    commandlineEnabled = true;
}

/** Activates the specified slide.
 * @param newSlide Slide to activate (number).
 */
function activateSlide(newSlide) {
    if (blank != NORMAL) {
        return;
    }
    if (newSlide > LAST_SLIDE) {
        newSlide = LAST_SLIDE;
    }
    if (0 > newSlide) {
        newSlide = 0;
    }
    document.getElementById('slide_' + currentSlide).style.display = 'none';
    document.getElementById('slide_' + newSlide).style.display = 'block';
    currentSlide = newSlide;
    document.getElementById('currentSlide').innerHTML = currentSlide;
    if (document.getElementById('slide_' + currentSlide + "_logo")) {
        document.getElementById('logo').src = document.getElementById('slide_' + currentSlide + "_logo").src;
    } else {
        document.getElementById('logo').src = logoSrc;
    }
}

/** Activates the first slide. */
function firstSlide() {
    activateSlide(0);
}

/** Activates the last slide. */
function lastSlide() {
    activateSlide(LAST_SLIDE);
}

/** Activates the next slide. */
function nextSlide() {
    activateSlide(currentSlide + 1);
}

/** Activates the previous slide. */
function previousSlide() {
    activateSlide(currentSlide - 1);
}

/** Processes a command. */
function processCommand() {
    command = document.getElementById('command').value;
    command = command.replace(/^:/, "");
    if (command.match(/^\d+$/)) {
        activateSlide(Number(command));
    } else if (command.match(/^(\+|-)\d+$/)) {
        activateSlide(currentSlide + Number(command));
    } else if (command.match(/^e$/)) {
        window.location.reload();
    } else if (command.match(/^n(ext)?$/)) {
        nextSlide();
    } else if (command.match(/^prev(ious)?$/)) {
        previousSlide();
    } else if (command.match(/^fir(st)?$/)) {
        firstSlide();
    } else if (command.match(/^la(st)?$/)) {
        lastSlide();
    }
    disableCommandline();
}

/** Display help. */
function help() {
    toggleBlank(HELP);
}

/** Start handler. */
function begin() {
    logoSrc = document.getElementById('logo').src;
    activateSlide(1);
    divs = document.getElementsByTagName('div');
    for (i = 0; divs.length > i; i++) {
        el = divs.item(i);
        el.onmousewheel = divwheel;
    }
}
function enableNavigator() {
    /* TODO:2011-07-02:hujerc:3:Implement enable navigator. */
    document.body.style.cursor = 'crosshair';
    /*document.getElementById('navBar').style.display = 'block';*/
}
function disableNavigator() {
    /* TODO:2011-07-02:hujerc:3:Implement disable navigator. */
    document.body.style.cursor = 'default';
    /*document.getElementById('navBar').style.display = 'none';*/
}
document.onkeydown = keydown;
document.onkeypress = keypress;
document.onclick = click;
document.onmousedown = mousedown;
document.onmousewheel = mousewheel;
