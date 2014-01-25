// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
function Delta(dc, dr) {
    this.dc = dc;
    this.dr = dr;
};

Delta.prototype.equals = function(other) {
    return this.dr == other.dr && this.dc == other.dc;
};

Delta.prototype.add = function(other) {
    if (!other)
	return this;
    return new Delta(this.dc + other.dc, this.dr + other.dr);
};

Delta.prototype.sub = function(other) {
    if (!other)
	return this;
    return new Delta(this.dc - other.dc, this.dr - other.dr);
};

Delta.from_char = function(ch) {
    if (ch == 'W')
	return new Delta(0, -1);
    if (ch == 'D')
	return new Delta(1, 0);
    if (ch == 'A')
	return new Delta(-1, 0);
    if (ch == 'S')
	return new Delta(0, 1);
    return null;
};
