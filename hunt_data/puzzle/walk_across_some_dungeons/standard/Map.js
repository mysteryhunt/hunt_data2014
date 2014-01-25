// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
function Map(id, source) {
    //console.info('loading map '+id);
    var floor_source = source[0];
    var legend_source = source[1];
    
    var legend = {
	'@': ' @',
	'#': ' #',
	'O': ' O',
	'-': '- ',
	'|': '| ',
	'+': '+ ',
	'>': '>>',
	'(': '( ',
	')': ') ',
	'$': '$$',
	':': ': ',
        ' ': '  '
    };
    $.each(legend_source, function(index, value) {
	legend[value[0]] = value.substr(1);
    });

    this.id = id;
    this.width = Math.max.apply(Math, $.map(floor_source, function(line) {
	return line.length
    }));
    this.height = floor_source.length;
    this.floors = [];
    for (var i = 0; i < this.width * this.height; i ++)
	 this.floors[i] = Floor.SPACE;
    this.enemies = [];
    this.coins = 0;
    this.warps = {};
    this.moves = [];
    //console.info('  '+this.width+' x '+this.height);
    var map = this;
    $.each(floor_source, function(row, line) {
	//console.info('  row '+row+': '+line);
	for (var col = 0; col < line.length; col ++) {
	    var ch = line[col];
	    //console.info('    col '+col+': '+ch);
	    var loc = new Location(col, row);
	    if (!(ch in legend))
		throw new Error('unexpected character \''+ch+'\' in map source: level '+id+' row '+row+' col '+col);
	    var what = legend[ch];
	    var floor_char = what[0];
	    map.floors[loc.index(map)] = new Floor(floor_char);
	    if (floor_char == '$')
		map.coins ++;
	    var special_char = what[1];
	    var params = what.substr(2).split(' ');
	    if (special_char == '@') {
		map.player = new Actor(special_char, loc);
	    } else if (special_char == '>') {
		map.exit = loc;
	    } else if (special_char == '%') {
		var warp_id = params[0];
		map.floors[loc.index(map)].warp_id = warp_id;
		if (!(warp_id in map.warps)) {
		    map.warps[warp_id] = [];
		}
		map.warps[warp_id].push(loc);
	    } else if (special_char == '#' || special_char == 'O') {
		map.enemies.push(new Actor(special_char, loc));
	    } else if (special_char == 'i') {
		map.enemies.push(new Runner(special_char, loc, 2));
	    } else if (special_char == 'g') {
		map.enemies.push(new Zombie(special_char, loc, 1, parseInt(params[0])));
	    } else if (special_char == 'z') {
		map.enemies.push(new Zombie(special_char, loc, 2, parseInt(params[0])));
	    } else if (special_char == 'Z') {
		map.enemies.push(new Zombie(special_char, loc, 3, parseInt(params[0])));
	    } else if (special_char == 'A') {
		map.enemies.push(new Archer(special_char, loc, Delta.from_char(params[0]), parseInt(params[1]), parseInt(params[2])));
	    } else if (special_char == 'G') {
		map.enemies.push(new Golem(special_char, loc, Delta.from_char(params[0]), parseInt(params[1]), parseInt(params[2])));
            } else if (special_char == "~") {
                map.enemies.push(new Chomper(params[0], loc, parseInt(params[1]), parseInt(params[2])));
	    }
	}
    });
}

(function() {
    Map.prototype._warp_locs = function(loc) {
	return this.warps[this.floor_at(loc).warp_id] || [loc];
    };

    Map.prototype.floor_at = function(loc) {
	if (loc.r < 0 || loc.r >= this.height || loc.c < 0 || loc.c >= this.width)
	    return Floor.WALL;
	return this.floors[loc.index(this)];
    };

    Map.prototype.enemy_at = function(loc) {
	var locs = this._warp_locs(loc);
	var ret;
	$.each(this.enemies, function(index, enemy) {
	    $.each(locs, function(index, loc) {
		if (enemy.loc.equals(loc)) {
		    if (ret && enemy.ch == '#')
			return;
		    ret = enemy;
		}
	    });
	});
	return ret;
    };

    Map.prototype.actor_at = function(loc) {
	var ret;
	var player = this.player;
	$.each(this._warp_locs(loc), function(index, loc) {
	    if (player.loc.equals(loc)) {
		ret = player;
		return false;
	    }
	});
	if (ret)
	    return ret;
	return this.enemy_at(loc);
    };

    Map.prototype.render = function() {
	var actors = {};
	var map = this;
	$.each(this.enemies, function(index, enemy) {
	    actors[enemy.loc.index(map)] = enemy;
	});
	actors[this.player.loc.index(map)] = this.player;

	function render_at(loc) {
	    var ret;
	    $.each(map._warp_locs(loc), function(index, loc) {
		index = loc.index(map);
		if (index in actors) {
		    ret = actors[index];
		    return false;
		}
	    });
	    return (ret || map.floor_at(loc)).ch;
	}

	var ret = [];
	for (var r = 0; r < this.height; r ++) {
	    var row = [];
	    for (var c = 0; c < this.width; c ++)
		row.push(render_at(new Location(c, r)));
	    ret.push(row.join(''));
	}
	return ret.join('\n');
    };

    Map.prototype.player_check = function() {
	if (this.exit && this.player.loc.equals(this.exit))
	    throw new EscapeException('player pushed out of level '+this.id);
	f = this.floor_at(this.player.loc);
	if (f.ch == '$') {
	    f.ch = ' ';
	    this.coins --;
	    if (this.coins == 0) {
		$.each(this.floors, function(index, f) {
		    if (f.ch == ':')
			f.ch = ' ';
		});
	    }
	}
    };

    Map.prototype.actor_push = function(actor, delta, kill, fly) {
	var map = this;
	var result = false;
	if (kill === undefined)
	    kill = true;
	$.each(this._warp_locs(actor.loc), function(index, loc) {
	    var loc2 = loc.add(delta);
	    if (!map.floor_at(loc2).is_walkable())
		return;
	    var e = map.actor_at(loc2);
	    if (fly && e && e.ch == '#')
		e = void 0;
	    if (e && e.ch == '#') {
		if (actor === map.player)
		    throw new DeathException('player pushed into '+e.ch);
		map.enemies.splice(map.enemies.indexOf(actor), 1);
		if (actor.ch == 'O')
		    map.enemies.splice(map.enemies.indexOf(e), 1);
	    } else if (e) {
		if (kill && actor === map.player && e.ch != 'O')
		    throw new DeathException('player pushed into '+e.ch);
		if (kill && e === map.player && e.ch != 'O')
		    throw new DeathException('player collided with '+actor.ch);
		return
	    } else {
		actor.loc = loc2;
	    }
	    if (actor === map.player)
		map.player_check();
	    result = true;
	    return false;
	});
	return result;
    };

    Map.prototype.player_move = function(delta) {
	if (!delta)
	    return false;
	var map = this;
	var result = false;
	$.each(this._warp_locs(map.player.loc), function(index, loc) {
	    var loc2 = loc.add(delta);
	    e = map.enemy_at(loc2);
	    if (e && (e.ch == '-' || e.ch == '|'))
		return;
	    if (e && (e.ch == 'O')) {
		if (!map.actor_push(e, delta))
		    return;
		e = map.enemy_at(loc2);
	    }
	    f = map.floor_at(loc2);
	    if (!f.is_walkable())
		return;
	    map.player.loc = loc2;
	    if (e)
		throw new DeathException('player walked into '+e.ch);
	    map.player_check();
	    result = true;
	    return false;
	});
	return result;
    };

    Map.prototype.conveyer = function(topush, kill) {
	var map = this;
	var more = true;
	while (more) {
	    more = false;
	    $.each(topush.slice(0), function(index, a) {
		f = map.floor_at(a.loc);
		var delta = undefined;
		if (f.ch == ')')
		    delta = 1;
		else if (f.ch == '(')
		    delta = -1;
		if (a.ch == 'a')
		    delta = undefined;
		if (delta) {
		    if (map.actor_push(a, new Delta(delta, 0), kill)) {
			topush.splice(topush.indexOf(a), 1);
			more = true;
			return false;
		    }
		} else {
		    topush.splice(topush.indexOf(a), 1);
		}
	    });
	}
    };

    Map.prototype.action = function(key) {
	var move;
	if (key == 37 || key == 65) {
	    move = 'A';
	} else if (key == 38 || key == 87) {
	    move = 'W';
	} else if (key == 39 || key == 68) {
	    move = 'D';
	} else if (key == 40 || key == 83) {
	    move = 'S';
	} else
	    throw new Error('unexpected key ' + key);
	delta = Delta.from_char(move);
	if (!this.player_move(delta))
	    return;
	this.moves.push(move);
	$.each(this.enemies, function(index, a) {
	    a.tick();
	});
	var tomove = this.enemies.slice(0);
	var more = true;
	var map = this;
	while (more) {
	    more = false;
	    $.each(tomove.slice(0), function(index, a) {
		if (a.act(map, false)) {
		    tomove.splice(tomove.indexOf(a), 1);
		    more = true;
		    return false;
		}
	    });
	    if (more)
		continue;
	    $.each(tomove.slice(0), function(index, a) {
		if (a.act(map, true)) {
		    tomove.splice(tomove.indexOf(a), 1);
		    more = true;
		    return false;
		}
	    });
	}
	topush = this.enemies.slice(0);
	topush.push(this.player);
	this.conveyer(topush, false);
	this.conveyer(topush, true);
    };
})();
