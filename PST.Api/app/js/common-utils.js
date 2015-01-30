
var StringUtil = StringUtil || {};
StringUtil.uppercaseFirstChar = function(str) {
	return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
};
StringUtil.isBlank = function(val) {
	if (isString(val)) {
		return val==null || val.replace(/\s/g, "").length == 0;
	} else {
		return val == null;
	}
};

StringUtil.isEmpty = function(val) {
	return val==null || val == '';
};
StringUtil.isNotEmpty = function(val) {
	return !StringUtil.isEmpty(val);
};

StringUtil.getLastWord = function(str) {
	return /\b\w+$/.exec(str)[0];
};

StringUtil.trim = function(val) {
	if (!val) {
		return null;
	}

	return val.replace(/^\s+/, "").replace(/\s+$/, "");
};


var DateUtil = DateUtil || {};

DateUtil.SECOND_LENGTH = 1000;
DateUtil.MINUTE_LENGTH = 60 * DateUtil.SECOND_LENGTH;
DateUtil.HOUR_LENGTH = 60 * DateUtil.MINUTE_LENGTH;
DateUtil.DAY_LENGTH = 24 * DateUtil.HOUR_LENGTH;
DateUtil.YEAR_LENGTH = 365 * DateUtil.DAY_LENGTH;

DateUtil.yesterday = function() {
	return DateUtil.addDays(new Date(), -1 );
};

DateUtil.DAY_LENGTH = 24*60*60*1000;

DateUtil.addDays = function(date1, days) {
	var date = new Date(date1.getTime());
	date.setDate(date.getDate() + days);
	return date;
};
DateUtil.addMonth = function(date1, month) {
	var date = new Date(date1.getTime());
	date.setMonth(date.getMonth() + month);
	return date;
};
DateUtil.addMinutes = function(date1, minutes) {
	var date = new Date(date1.getTime());
	date.setMinutes(date.getMinutes() + minutes);
	return date;
};
DateUtil.format2digits = function(num) {
	num = "" + num;
	if (num.length == 1) {
		return "0" + num;
	}
	return num;
};
DateUtil.format = function(date, format) {
	return format
		.replace(/yyyy/g, date.getFullYear())
		.replace(/MM/g, DateUtil.format2digits(date.getMonth()+1))
		.replace(/dd/g, DateUtil.format2digits(date.getDate()))
		.replace(/HH/g, DateUtil.format2digits(date.getHours()))
		.replace(/mm/g, DateUtil.format2digits(date.getMinutes()))
		;
};

DateUtil.sameDay = function(d1, d2) {
	return DateUtil.truncate(d1).getTime() == DateUtil.truncate(d2).getTime();
};

DateUtil.parse = function(str, format) {
	if (format=="yyyy_MM_dd") {
		var m = /(\d+)_(\d+)_(\d+)/.exec(str);
		return new Date(m[1], m[2] - 1, m[3]);
	}
	if (format=="yyyy_MM") {
		var m = /(\d+)_(\d+)/.exec(str);
		return new Date(m[1], m[2] - 1);
	}
	throw "Unsupported format: " + format;
};

DateUtil.dayOfWeek = function(day) {
	if (day == 0) {
		return "Chủ nhật";
	}
	return "Thứ " + (day+1);
};

DateUtil.isToday = function(date) {
	return DateUtil.truncate(date).getTime() == DateUtil.truncate(new Date()).getTime();
};

DateUtil.dayEnd = function(date) {
	return new Date(DateUtil.truncate(DateUtil.addDays(date, 1)).getTime() - 1);
};
DateUtil.monthEnd = function(date) {
	return new Date(DateUtil.truncateMonth(DateUtil.addMonth(date, 1)).getTime() - 1);
};
DateUtil.truncate = function(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
DateUtil.truncateHour = function(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0);
};
DateUtil.truncateMinute = function(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
};
DateUtil.truncateMonth = function(date) {
	return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
};

DateUtil.weekBegin = function(date) {
	var dow = date.getDay();

	return new Date(date.getFullYear(), date.getMonth(), date.getDate() - dow, 0, 0, 0);
};


var TimingUtil = TimingUtil || {};

TimingUtil.syncDelay = function (f, delay) {
	delay = delay || 1000;

	var globalInterrupted = null;
	return function() {
		if (globalInterrupted) {
			globalInterrupted[0] = true;
		}
		var interrupted = [false];
		globalInterrupted = interrupted;
		setTimeout(function() {
			if (!interrupted[0]) {
				f();
			}
		}, delay);
	};
};

var LangUtil = LangUtil || {};
LangUtil.booleanValue = function(o) {
	if (o == null) {
		return false;
	}

	if (o == false || o == true) {
		return o;
	}

	if (typeof o == "string") {
		return o != "false";
	}

	return true;
};
LangUtil.toNum = function(o) {
	if (o == null) {
		return null;
	}

	return o * 1;
};


var ObjectUtil = ObjectUtil || {};

ObjectUtil.equals = function (o1, o2) {
	if (o1 == null) {
		return o2 == null;
	}

	if (o2 == null) {
		return false;
	}

	if ((typeof o1) != (typeof o2)) {
		return false;
	}

	if (typeof o1 != "object") {
		return o1 == o2;
	}

	if (o1.length != o2.length) {
		return false;
	}

	for (var i in o1) {
		if (!ObjectUtil.equals(o1[i], o2[i])) {
			return false;
		}
	}
	for (var i in o2) {
		if (!ObjectUtil.equals(o1[i], o2[i])) {
			return false;
		}
	}

	return true;
};

ObjectUtil.copy = function(fromO, toO) {
	for (var name in fromO) {
		toO[name] = fromO[name];
	}
};
ObjectUtil.clone = function(obj) {
	if (obj.length == null) {
		return jQuery.extend(true, {}, obj);
	} else {
		var ret = [];
		for ( var i in obj) {
			ret[i] = clone(obj[i]);
		}
		return ret;
	}
};

ObjectUtil.clear = function(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			delete obj[prop];
		}
	}
};
ObjectUtil.hasValue = function(o) {
	if (o == null) {
		return false;
	}
	for (var i in o) {
		if (o.hasOwnProperty(i)) {
			return true;
		}
	}
	return false;
}

var Http = Http || {};
Http.afterSharp = function() {
	var href = window.location.href;
	var index = href.indexOf("#");
	if (index == -1) {
		return null;
	}
	return href.substring(index + 1);
};

var RegexUtil = RegexUtil || {};

RegexUtil.replaceAll = function(str, exp, replace) {

	if (typeof replace == "string") {
		var replaceStr = replace;
		replace = function(m) {
			return RegexUtil.replaceAll(replaceStr, "\\$(\\d+)", function(m1) {
				return m[1*m1[1]];
			});
		};
	}

	var result = "";

	for (;;) {
		var m = new RegExp(exp).exec(str);
		if (m != null) {
			result += str.substring(0, m.index);
			result += replace(m);
			str = str.substring(m.index + m[0].length);
		} else {
			return result + str;
		}
	}
};

var Fs = Fs || {};
Fs.p0 = function(p1, a) {
	return function() {
		p1(a);
	}
};

Fs.invokeAll = function(funcs, data1, data2) {
	for (var i in funcs) {
		funcs[i](data1, data2);
	}
};

Fs.invokeChecks = function(funcs, data) {
	for (var i in funcs) {
		if (funcs[i](data)) {
			return true;
		}
	}
	return false;
};

Fs.cache = function(f0) {
	var invoked = false;
	var cachedData = null;
	return function() {
		if (!invoked) {
			cachedData = f0();
			invoked = true;
		}

		return cachedData;
	};
};

Fs.sequel = function (fs) {
	return function() {
		for (var i in fs) {
			fs[i]();
		}
	};
};

Fs.tail1 = function(func, b, c) {
	return function(a) {
		return func(a, b, c);
	};
};
Fs.tail2 = function(func, c, d) {
	return function(a, b) {
		return func(a, b, c, d);
	};
};

Fs.invoke = function(func) {
	if ((typeof func) == "function") {
		return func();
	} else {
		return func;
	}
};

var Cols = Cols || {};
Cols.values = function(map) {
	var ret = [];
	for ( var k in map) {
		ret.push(map[k]);
	}
	return ret;
};
Cols.find = function(col, func) {
	for (var i in col) {
		var e = col[i];
		if (func(e)) {
			return e;
		}
	}
	return null;
};


Cols.yield = function(col, func) {
	var ret = Array.isArray(col) ? [] : {};
	for (var i in col) {
		var e = func(col[i]);
		if (e != null) {
            ret[i] = e;
		}
	}
	return ret;
};
Cols.filter = function(col, func) {
	var ret = [];
	for (var i in col) {
		if (func(col[i])) {
			ret.push( col[i] );
		}
	}
	return ret;
};
Cols.join = function(col, delimiter) {
	var ret = "";
	for (var i in col) {
		if (ret.length > 0) {
			ret += delimiter;
		}
		ret += col[i];
	}
	return ret;
};
Cols.merge = function(map1, map2) {
	for ( var k in map2) {
		map1[k] = map2[k];
	}
};

Cols.eachLine = function(/*final List<F>*/ steps, /*final P2<F,P1<N>>*/ digF, /*final List<N>*/ collecteds, /*final P1<List<N>>*/ resultF) {

	if (steps.length == 0) {
		resultF(collecteds);
		return;
	}

	var feed = steps[0];
	digF(feed, function(n) {
		var newCollecteds = Cols.copy(collecteds);
		newCollecteds.push(n);
		Cols.eachLine(steps.slice(1, steps.length), digF, newCollecteds, resultF);
	});
};

Cols.each = function(col, p1) {
	for (var i = 0; i<col.length; i++) {
		p1(col[i]);
	}
};

/**
 * collect(ele, total)
 */
Cols.collect = function(col, init, collect) {
	var total = init;
	for (var i in col) {
		total = collect(col[i], total);
	}
	return total;
};
Cols.sum = function(col, getNum) {
	return Cols.collect(col, 0, function(e, sum) {
        var val = (getNum ? getNum(e) : e);
        if (val == null) {
            return sum;
        }
        return val + sum;
	});
};

/**
 * p2<Element,P0 onDone> 
 */
Cols.eachPar = function(col, p2) {
	Cols.eachPar1(0, col, p2);
};
Cols.eachPar1 = function(index, col, p2) {
	if (index >= col.length) {
		return;
	}

	p2(col[index], function() {
		Cols.eachPar1(index+1, col, p2);
	});
};


Cols.indexOf = function(ele, col, colExtract) {
	for (var i in col) {
		if (colExtract(col[i]) == ele) {
			return i;
		}
	}
	return -1;
};

Cols.copy = function(arr1) {
	var ret = [];

	for (var i in arr1) {
		ret.push(arr1[i]);
	}
	return ret;
};
Cols.eachChildRecursive = function(/*A*/ a,
		/*F1<A, Collection<A>>*/ digF,
		/*P1<A>*/ p1) {
	var col = digF(a);
	if (col==null) {
		return;
	}
	for (var childI in col) {
		var child = col[childI];
		p1(child);
		Cols.eachChildRecursive(child, digF, p1);
	}
};

Cols.addList = function(key, value, maps) {
	var list = maps[key];
	if (list == null) {
		list = [];
		maps[key] = list;
	}
	list.push(value);
};

Cols.isEmpty = function(col) {
	return col == null || col.length == 0;
};

Cols.isNotEmpty = function(col) {
	return !Cols.isEmpty(col);
};

Cols.addAll = function (from, to) {
	for (var i in from) {
		to.push(from[i]);
	}
};

Cols.addRemove = function(col) {
	return function(item) {
		col.push(item);
		return function() {
			col.splice(col.indexOf(item), 1);
		}
	}
};

Cols.toEnd = function(array) {
	var i = array.length + 1;
	return function() {
		if (i > 1) {
			i--;
		}
		return array[array.length-i];
	}
};

Cols.remove = function(e, col) {
	var i = col.indexOf(e);
	if (i == -1) {
		return;
	}
	col.splice(i, 1);
};

Cols.removeBy = function(col, f) {
    for (var j = 0; j < col.length; j++) {
        var obj = col[j];
        if (f(obj)) {
            col.splice(j, 1);
        }
    }
};
Cols.removeAll = function(col, list) {
	for (var i in col) {
		var item = col[i];
		var rowI = list.indexOf(item);

		if (rowI == -1) {
//			alert("Can not find");
			return;
		}
		list.splice(rowI, 1);
	}
};

Cols.sortBy = function(byF) {
	var nullGoLast = true;
	return function(rd1, rd2) {
		var by1 = byF(rd1);
		var by2 = byF(rd2);

		if (by1 == null) {
			return by2 == null ? 0 : (nullGoLast ? 1 : -1);
		} else if (by2 == null) {
			return nullGoLast ? -1 : 1;
		}

		if ((typeof by1) == "string" ) {
			if (by1 < by2)
			     return -1;
			  if (by1 > by2)
			    return 1;
			  return 0;
		}
		return by1 - by2;
	};
};

Cols.index = function(col, by) {
    if (typeof by == "string") {
        var byAttr = by;
        by = function(ele) { return ele[byAttr];};
    }

    return Cols.collect(col, {}, function(ele, groups) {
        var index = by(ele);
        var list = groups[index];
        if (list == null) {
            list = [];
            groups[index] = list;
        }
        list.push(ele);
        return groups;
    });
};
Cols.group = function(col, by) {
    return Cols.values(Cols.index(col, by));
};



var Async = Async || {};


/**
 * var oneRun = Async.oneRun();
 * 
 * var run1 = oneRun();
 * var run2 = oneRun();
 * // Async post
 * alert(run1())
 * alert(run1())
 * alert(run2())
 */
Async.oneRun = function() {
	var lastRunRef = [null];
	return function() {
		if (lastRunRef[0] != null) {
			lastRunRef[0][0] = false;
		}
		var lastRun = [true];
		lastRunRef[0] = lastRun;

		return function() {
			var r = lastRun[0];
			lastRun[0] = false;
			return r;
		}
	}
};

Async.ladyFirst = function() {
	var afterLadyDone = null;
	var freeToGo = false;
	return {
		ladyDone: function() {
			freeToGo = true;
			if (afterLadyDone) {
				afterLadyDone();
			}
		},
		manTurn: function(func) {
			if (freeToGo) {
				func();
			} else {
				afterLadyDone = func;
			}
		}
	};
};

/**
 * @return checkF(checkIndex);
 */
Async.runWhenAllChecked = function(checkCount, func) {
	var flags = new Array(checkCount);
	for (var i=0;i<checkCount;i++) {
		flags[i] = false;
	}
	return function(chechIndex) {
		flags[chechIndex] = true;

		for (var i=0;i<checkCount;i++) {
			if (flags[i] == false) {
				return;
			}
		}

		func();
	}
};

Async.runAfterCount= function(checkCount, func) {
	return function(chechIndex) {
		checkCount --;

		if (checkCount <= 0) {
			func();
		}
	}
};

/**
 * func(quantity) => interrupted
 * @param func
 */
Async.incrementalRepeater = function(func) {
	var quantityFF = function() {
		var i = 0;
		var array = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
		return function() {
			i++;
			return array[Math.min(parseInt(i / 10), array.length-1)];
		}
	};

	var createRunner = function() {

		var sleepTimeF = Cols.toEnd([400, 300, 300, 300, 200, 200, 100]);
		var quantityF = quantityFF();
		var alive = true;
		// Start
		var run = function() {
			if (!alive) {
				return;
			}
			var interrupted = func(quantityF());
			if (interrupted) {
				alive = false;
				return;
			}
			setTimeout(run, sleepTimeF());
		};
		run();

		return {
			stop: function() {
				alive = false;
			}
		};
	};
	var runner = null;
	return {
		start: function() {
			if (runner != null) {
				return;
			}
			runner = createRunner();
		},
		stop: function() {
			if (runner != null) {
				runner.stop();
				runner = null;
			}
		}
	};
};

/**
 * checkF(val, stillValid)
 * @return invoke(val)
 */
Async.lazyValidate = function(startF, checkF) {
	var validating = [null];
	return function(val) {
		if (val == null) {
			alert("Async.lazyValidate: Not support null value");
			return;
		}
		var thisValidate = [val];
		if (validating[0] != null) {
			if (validating[0][0] == val) {
				// This val is being validated (not done)
				return;
			}
			validating[0][0] = null;
		}
		validating[0] = thisValidate;
		var stillValid = function() {
			return thisValidate[0] != null;
		};

		startF();
		setTimeout(function() {
			if (!stillValid()) {
				return;
			}
			checkF(val, stillValid);
		}, 500);
	}
};