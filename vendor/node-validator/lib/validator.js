var net = require('net');

var Validator = exports.Validator = function() {}

Validator.prototype.check = function(str, fail_msg) {
    this.str = String(str || '');
    this.msg = fail_msg;
    return this;
}

//Create some aliases - may help code readability
Validator.prototype.validate = Validator.prototype.check;
Validator.prototype.assert = Validator.prototype.check;

Validator.prototype.error = function(msg) {
    throw msg;
}

Validator.prototype.isEmail = function() {
    if (!this.str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {
        this.error(this.msg || 'Invalid email');
    }
    return this;
}

Validator.prototype.isUrl = function() {
    if (!this.str.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2})?)|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/)) {
        this.error(this.msg || 'Invalid URL');
    }
    return this;
}

Validator.prototype.isIP = function() {
    //net.isIP is in node >= 0.3.0
    if (typeof net.isIP === 'function') {
        if (net.isIP(this.str) === 0) {
            this.error(this.msg || 'Invalid IP');
        }
    } else {
        if (!this.str.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
            this.error(this.msg || 'Invalid IP');
        }
    }
    return this;
}

Validator.prototype.isAlpha = function() {
    if (!this.str.match(/^[a-zA-Z]+$/)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isAlphanumeric = function() {
    if (!this.str.match(/^[a-zA-Z0-9]+$/)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isNumeric = function() {
    if (!this.str.match(/^-?[0-9]+$/)) {
        this.error(this.msg || 'Invalid number');
    }
    return this;
}

Validator.prototype.isLowercase = function() {
    if (!this.str.match(/^[a-z0-9]+$/)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isUppercase = function() {
    if (!this.str.match(/^[A-Z0-9]+$/)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isInt = function() {
    if (!this.str.match(/^(?:-?(?:0|[1-9][0-9]*))$/)) {
        this.error(this.msg || 'Invalid integer');
    }
    return this;
}

Validator.prototype.isDecimal = function() {
    if (!this.str.match(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/)) {
        this.error(this.msg || 'Invalid decimal');
    }
    return this;
}

Validator.prototype.isFloat = function() {
    return this.isDecimal();
}

Validator.prototype.notNull = function() {
    if (this.str === '') {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.isNull = function() {
    if (this.str !== '') {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.notEmpty = function() {
    if (this.str.match(/^[\s\t\r\n]*$/)) {
        this.error(this.msg || 'String is whitespace');
    }
    return this;
}

Validator.prototype.equals = function(equals) {
    if (this.str != equals) {
        this.error(this.msg || 'Not equal');
    }
    return this;
}

Validator.prototype.contains = function(str) {
    if (this.str.indexOf(str) === -1) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.notContains = function(str) {
    if (this.str.indexOf(str) >= 0) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.regex = Validator.prototype.is = function(pattern, modifiers) {
    if (typeof pattern !== 'function') {
        pattern = new RegExp(pattern, modifiers);
    }
    if (! this.str.match(pattern)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.notRegex = Validator.prototype.not = function(pattern, modifiers) {
    if (typeof pattern !== 'function') {
        pattern = new RegExp(pattern, modifiers);
    }
    if (this.str.match(pattern)) {
        this.error(this.msg || 'Invalid characters');
    }
    return this;
}

Validator.prototype.len = function(min, max) {
    if (this.str.length < min) {
        this.error(this.msg || 'String is too small');
    }
    if (typeof max !== undefined && this.str.length > max) {
        this.error(this.msg || 'String is too large');
    }
    return this;
}
