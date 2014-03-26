function setCookie(namespace, name, value) {
    var d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = namespace + "." + name+ "=" + value + "; expires=" + d.toGMTString() + "; path=/";
}

function getCookie(namespace, name) {
    var cookies = document.cookie.split(";");
    for (i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var n = cookie.substr(0, cookie.indexOf("=")).trim();
        var reg = new RegExp("^" + namespace + "\\.");
        if (n.match(reg)) {
            n = n.replace(reg, "");
            value = cookie.substr(cookie.indexOf("=") + 1);
            if (n == name) {
                return value;
            }
        }
    }
}

function OverscanConfig() {
    this.setOverscanCookie = function(name) {
        setCookie("overscan", name, this["_" + name]);
    }
    this.getOverscanCookie = function(name) {
        return getCookie("overscan", name);
    }
    this.getOverscanCookieInt = function(name) {
        return parseInt(this.getOverscanCookie(name));
    }
    this.setVisible = function(visible) {
        this._visible = visible;
        document.body.parentElement.style.backgroundColor = visible ? "#fff" : "#000";
        this.setOverscanCookie("visible");
    }
    this.getVisible = function() {
        return this._visible;
    }
    this.setProperty = function(name, value) {
        if (value < 0) {
            value = 0;
        }
        this["_" + name] = value;
        document.body.style[name] = value + "px";
        this.setOverscanCookie(name);
    }
    this.getProperty = function(name) {
        return this["_" + name];
    }
    this.capitalizeFirst = function(text) {
        return text.substr(0, 1).toUpperCase() + text.substr(1);
    }
    this.getGetterName = function(propertyName) {
        return "get" + this.capitalizeFirst(propertyName);
    }
    this.getSetterName = function(propertyName) {
        return "set" + this.capitalizeFirst(propertyName);
    }
    this.bindGetterSetter = function(name) {
        this.__defineSetter__(name, this[this.getSetterName(name)] = function(arg) { this.setProperty(name, arg);});
        this.__defineGetter__(name, this[this.getGetterName(name)] = function() { return this.getProperty(name); });
    }
    this.bindGettersSetters = function() {
        this.bindGetterSetter("top");
        this.bindGetterSetter("bottom");
        this.bindGetterSetter("left");
        this.bindGetterSetter("right");
    }
    this.__defineSetter__("visible", this.setVisible);
    this.__defineGetter__("visible", this.getVisible);

    this.setOverscan = function(value) {
        this.top += value;
        this.bottom += value;
        this.left += value;
        this.right += value;
    }
    this.getOverscan = function() {
        return 0;
    }
    this.__defineSetter__("overscan", this.setOverscan);
    this.__defineGetter__("overscan", this.getOverscan);

    this.bindGettersSetters();
    this.left = this.getOverscanCookieInt("left") || 0;
    this.right = this.getOverscanCookieInt("right") || 0;
    this.top = this.getOverscanCookieInt("top") || 0;
    this.bottom = this.getOverscanCookieInt("bottom") || 0;
    this.visible = this.getOverscanCookie("visible") === "true";
}
overscanConfig = new OverscanConfig();
