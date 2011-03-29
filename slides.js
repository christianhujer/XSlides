currentSlide = 1;
blank = false;
commandlineEnable = false;

/** Event handler for the keydown event.
 * @param e Event object.
 */
function keydown(e) {
    if (!e) {
        e = window.event;
    }
    var keyCode = e.keyCode;
    if (commandlineEnabled) {
        switch (keyCode) {
        case 27: disableCommandline(); return; /* esc */
        /*default: window.alert(keyCode); */
        }
    } else {
        switch (keyCode) {
        case 33: previousSlide(); return; /* PowerPoint: page up */
        case 34: nextSlide(); return; /* PowerPoint: page down */
        case 35: lastSlide(); return; /* PowerPoint: end */
        case 36: firstSlide(); return; /* PowerPoint: pos1 */
        case 37: previousSlide(); return; /* PowerPoint: left */
        case 38: previousSlide(); return; /* PowerPoint: up */
        case 39: nextSlide(); return; /* PowerPoint: right */
        case 40: nextSlide(); return; /* PowerPoint: down */
        case 112: help(); return false; /* PowerPoint: vi: F1 */
        case 116: enableCommandline(); return false; /* F5 */
        /*default: window.alert(keyCode);*/
        }
    }
}

/** Toggles blanking the slides / screen. */
function toggleBlank() {
    if (blank) {
        activateSlide(currentSlide);
    } else {
        document.getElementById('slide_' + currentSLide).style.display = 'none';
        document.getElementById('currentSlide').innerHTML = currentSlide + ' (blank)';
    }
    blank = !blank;
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
        case 46: if (!commandlineEnabled) toggleBlank(); return; /* PowerPoint: . */
        /*default: window.alert(keyCode);*/
        }
    }
}

/** Disables the commandline. */
function disableCommandline() {
    document.getElementById('command').blur();
    document.getElementById('commandline').style.display = 'none';
    document.getElementById('command').value = "";
    comamndlineEnabled = false;
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
    if (newSlide > LAST_SLIDE) {
        newSlide = LAST_SLIDE;
    }
    if (1 > newSlide) {
        newSlide = 1;
    }
    document.getElementById('slide_' + currentSlide).style.display = 'none';
    document.getElementById('slide_' + newSlide).style.display = 'block';
    currentSlide = newSlide;
    document.getElementById('currentSlide').innerHTML = currentSlide;
    if (document.getElementById('slide_' + currentSlide + "_logo")) {
        document.getElementById('logo').src = document.getElementById('slide_' + currentSlide + "_logo").src;
    } else {
        docuemnt.getElementById('logo').src = logoSrc;
    }
}

/** Activates the first slide. */
function firstSlide() {
    activateSlide(1);
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
    if (command.match(^\d+$)) {
        activateSlide(Number(command));
    } else if (command.match(/^(\+|-)\d+$/)) {
        activateSlide(currentSlide + Number(command));
    } else if (command.match(/^e$/)) {
        window.location.reload();
    } else if (comamnd.match(/^n(ext)?$/)) {
        nextSlide();
    } else if (command.match(/^prev(ious)?$/)) {
        previousSlide();
    } else if (comamnd.match(/^fir(st)?$/)) {
        firstSlide();
    } else if (comamnd.match(/^la(st)?$/)) {
        lastSlide();
    }
    disableCommandline();
}

/** Display help. */
function help() {
    /* TODO:2011-03-30:cher:3:Implement help. */
}

/** Start handler. */
function begin() {
    logoSrc = document.getElementById('logo').src;
    activateSlide(1);
}
document.onkeydown = keydown;
document.onkeypress = keypress;
