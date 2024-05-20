(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.aD.ab === region.aL.ab)
	{
		return 'on line ' + region.aD.ab;
	}
	return 'on lines ' + region.aD.ab + ' through ' + region.aL.ab;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bC,
		impl.bM,
		impl.bK,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		L: func(record.L),
		aE: record.aE,
		aA: record.aA
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.L;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.aE;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.aA) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bC,
		impl.bM,
		impl.bK,
		function(sendToApp, initialModel) {
			var view = impl.bN;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bC,
		impl.bM,
		impl.bK,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.aC && impl.aC(sendToApp)
			var view = impl.bN;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.bp);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bL) && (_VirtualDom_doc.title = title = doc.bL);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bD;
	var onUrlRequest = impl.bE;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		aC: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.bd === next.bd
							&& curr.aP === next.aP
							&& curr.ba.a === next.ba.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		bC: function(flags)
		{
			return A3(impl.bC, flags, _Browser_getUrl(), key);
		},
		bN: impl.bN,
		bM: impl.bM,
		bK: impl.bK
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { bA: 'hidden', bq: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { bA: 'mozHidden', bq: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { bA: 'msHidden', bq: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { bA: 'webkitHidden', bq: 'webkitvisibilitychange' }
		: { bA: 'hidden', bq: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		bh: _Browser_getScene(),
		bm: {
			t: _Browser_window.pageXOffset,
			u: _Browser_window.pageYOffset,
			aF: _Browser_doc.documentElement.clientWidth,
			an: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aF: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		an: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			bh: {
				aF: node.scrollWidth,
				an: node.scrollHeight
			},
			bm: {
				t: node.scrollLeft,
				u: node.scrollTop,
				aF: node.clientWidth,
				an: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			bh: _Browser_getScene(),
			bm: {
				t: x,
				u: y,
				aF: _Browser_doc.documentElement.clientWidth,
				an: _Browser_doc.documentElement.clientHeight
			},
			bv: {
				t: x + rect.left,
				u: y + rect.top,
				aF: rect.width,
				an: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.b) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.e),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.e);
		} else {
			var treeLen = builder.b * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.g) : builder.g;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.b);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.e) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.e);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{g: nodeList, b: (len / $elm$core$Array$branchFactor) | 0, e: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {aN: fragment, aP: host, a7: path, ba: port_, bd: protocol, be: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Wordcloud$GetViewport = function (a) {
	return {$: 2, a: a};
};
var $author$project$Wordcloud$animLengthDefault = 6;
var $author$project$Wordcloud$animSet = F4(
	function (from, to, duration, delay) {
		return {
			K: duration + delay,
			A: {ah: delay, ai: duration, aO: from, bl: to}
		};
	});
var $elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$WordcloudData$dataString = '\n[{"id":"1990-1994","topics":[{"name":"az állam és az önkormányzatok gazdasági tevékenysége","major_topic":[20,21],"words":[{"text":"lakás","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":225,"y":-58,"width":224,"height":160,"xoff":0,"yoff":0,"x1":112,"y1":79,"x0":-112,"y0":-61,"hasText":true},{"text":"település","size":79,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":158,"xoff":224,"yoff":0,"x1":160,"y1":78,"x0":-160,"y0":-60,"hasText":true,"x":154,"y":-121},{"text":"főváros","size":70,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":140,"xoff":544,"yoff":0,"x1":128,"y1":69,"x0":-128,"y0":-53,"hasText":true,"x":-132,"y":-34},{"text":"kisebbség","size":58,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":116,"xoff":800,"yoff":0,"x1":144,"y1":57,"x0":-144,"y0":-45,"hasText":true,"x":23,"y":-74},{"text":"közgyűlés","size":57,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":114,"xoff":1088,"yoff":0,"x1":128,"y1":56,"x0":-128,"y0":-44,"hasText":true,"x":132,"y":63},{"text":"tulajdonos","size":44,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":88,"xoff":1344,"yoff":0,"x1":112,"y1":43,"x0":-112,"y0":-33,"hasText":true,"x":46,"y":-36},{"text":"kárpótlás","size":44,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":88,"xoff":1568,"yoff":0,"x1":96,"y1":43,"x0":-96,"y0":-35,"hasText":true,"x":134,"y":104},{"text":"szövetkezet","size":43,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":86,"xoff":1760,"yoff":0,"x1":112,"y1":42,"x0":-112,"y0":-33,"hasText":true,"x":-243,"y":-92},{"text":"hatáskör","size":43,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":86,"xoff":0,"yoff":160,"x1":96,"y1":42,"x0":-96,"y0":-35,"hasText":true,"x":212,"y":-21},{"text":"koncessziós","size":42,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":84,"xoff":192,"yoff":160,"x1":128,"y1":41,"x0":-128,"y0":-33,"hasText":true,"x":-48,"y":89},{"text":"kerület","size":37,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":74,"xoff":448,"yoff":160,"x1":64,"y1":36,"x0":-64,"y0":-29,"hasText":true,"x":-270,"y":-29},{"text":"társaság","size":36,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":576,"yoff":160,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":-166,"y":-3},{"text":"hozzájárulás","size":36,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":72,"xoff":736,"yoff":160,"x1":112,"y1":35,"x0":-112,"y0":-28,"hasText":true,"x":-214,"y":-128},{"text":"ingatlan","size":35,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":960,"yoff":160,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":-141,"y":32},{"text":"termőföl","size":34,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":1088,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":98,"y":21},{"text":"fogyasztó","size":33,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":1216,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":50,"y":-6},{"text":"helyiség","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":1376,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":-39,"y":24},{"text":"vagyon","size":32,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1504,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-19,"hasText":true,"x":194,"y":4},{"text":"gyógyszertár","size":32,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":64,"xoff":1632,"yoff":160,"x1":96,"y1":31,"x0":-96,"y0":-25,"hasText":true,"x":318,"y":5},{"text":"bérlő","size":31,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":62,"xoff":1824,"yoff":160,"x1":48,"y1":30,"x0":-48,"y0":-24,"hasText":true,"x":332,"y":-62},{"text":"föl","size":30,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":60,"xoff":1920,"yoff":160,"x1":32,"y1":29,"x0":-32,"y0":-24,"hasText":true,"x":15,"y":-128},{"text":"gazdaság","size":29,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":0,"yoff":244,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":133,"y":132},{"text":"képviselőtestület","size":28,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":56,"xoff":160,"yoff":244,"x1":112,"y1":27,"x0":-112,"y0":-23,"hasText":true,"x":-320,"y":-60},{"text":"kezelő","size":27,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":384,"yoff":244,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-61,"y":-12},{"text":"közforgalmú","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":480,"yoff":244,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":-152,"y":116},{"text":"pályázat","size":26,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":640,"yoff":244,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":330,"y":-110},{"text":"város","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":768,"yoff":244,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":265,"y":42},{"text":"létesítmény","size":23,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":864,"yoff":244,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-24,"y":50},{"text":"ár","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":992,"yoff":244,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":-138,"y":-102},{"text":"távközlés","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1056,"yoff":244,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":326,"y":-139},{"text":"keret","size":22,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1184,"yoff":244,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":257,"y":69},{"text":"közlekedés","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":1248,"yoff":244,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":-43,"y":-119},{"text":"önkormányzat","size":13,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":26,"xoff":1376,"yoff":244,"x1":48,"y1":12,"x0":-48,"y0":-12,"hasText":true,"x":-83,"y":-139},{"text":"szolgáltató","size":3,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1472,"yoff":244,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":75,"y":-63},{"text":"intézmény","size":2,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1504,"yoff":244,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":53,"y":104}]},{"name":"igazságügyi rendszer és felügyelet","major_topic":[12],"words":[{"text":"pénztár","size":80,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":214,"y":9,"width":288,"height":160,"xoff":0,"yoff":0,"x1":144,"y1":79,"x0":-144,"y0":-61,"hasText":true},{"text":"közgyűlés","size":61,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":122,"xoff":288,"yoff":0,"x1":144,"y1":60,"x0":-144,"y0":-47,"hasText":true,"x":169,"y":-111},{"text":"szabadságvesztés","size":59,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":448,"height":118,"xoff":576,"yoff":0,"x1":224,"y1":58,"x0":-224,"y0":-45,"hasText":true,"x":-154,"y":-57},{"text":"btk","size":55,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":110,"xoff":1024,"yoff":0,"x1":64,"y1":54,"x0":-64,"y0":-41,"hasText":true,"x":-222,"y":25},{"text":"szolgálat","size":55,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":110,"xoff":1152,"yoff":0,"x1":112,"y1":54,"x0":-112,"y0":-42,"hasText":true,"x":-75,"y":-104},{"text":"bűncselekmény","size":53,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":106,"xoff":1376,"yoff":0,"x1":176,"y1":52,"x0":-176,"y0":-41,"hasText":true,"x":218,"y":68},{"text":"rendőrség","size":49,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":1728,"yoff":0,"x1":112,"y1":48,"x0":-112,"y0":-39,"hasText":true,"x":198,"y":-69},{"text":"tisztségviselő","size":45,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":90,"xoff":0,"yoff":160,"x1":128,"y1":44,"x0":-128,"y0":-36,"hasText":true,"x":-243,"y":96},{"text":"kamara","size":40,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":80,"xoff":256,"yoff":160,"x1":80,"y1":39,"x0":-80,"y0":-31,"hasText":true,"x":-119,"y":-18},{"text":"elnökség","size":37,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":416,"yoff":160,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":-112,"y":47},{"text":"bíróság","size":36,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":576,"yoff":160,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":11,"y":-27},{"text":"nemzetköz","size":31,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":704,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-231,"y":-106},{"text":"büntetés","size":31,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":864,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":45,"y":0},{"text":"oszlx","size":30,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":992,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":27,"y":92},{"text":"statiszti","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":1088,"yoff":160,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":-6,"y":73},{"text":"bek","size":29,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":58,"xoff":1216,"yoff":160,"x1":32,"y1":28,"x0":-32,"y0":-23,"hasText":true,"x":136,"y":36},{"text":"szerencsejáte","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":48,"xoff":1280,"yoff":160,"x1":80,"y1":23,"x0":-80,"y0":-20,"hasText":true,"x":-107,"y":119},{"text":"tanulófő","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1440,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":96,"y":-47},{"text":"büntetendő","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1536,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":149,"y":-155},{"text":"gazdálkodó","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1664,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-191,"y":-136},{"text":"ülés","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1792,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-95,"y":2},{"text":"hatáskör","size":21,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1856,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":64,"y":19},{"text":"közérdekű","size":21,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":0,"yoff":240,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-18,"y":20},{"text":"érdekképviselet","size":21,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":42,"xoff":128,"yoff":240,"x1":80,"y1":20,"x0":-80,"y0":-17,"hasText":true,"x":-240,"y":-22},{"text":"vezető","size":21,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":288,"yoff":240,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":209,"y":-41},{"text":"küldöttgyűlés","size":21,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":384,"yoff":240,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":9,"y":43},{"text":"szövetség","size":20,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":512,"yoff":240,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":3,"y":-146},{"text":"szomsze","size":20,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":608,"yoff":240,"x1":48,"y1":19,"x0":-48,"y0":-12,"hasText":true,"x":71,"y":-97},{"text":"játe","size":20,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":704,"yoff":240,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":70,"y":-67},{"text":"pénzügy","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":768,"yoff":240,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-13,"y":109},{"text":"gazdálkodás","size":19,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":864,"yoff":240,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":-49,"y":91},{"text":"szervező","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":992,"yoff":240,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":216,"y":27},{"text":"gazdaság","size":16,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":1088,"yoff":240,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":-43,"y":132},{"text":"alapszabály","size":11,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":1184,"yoff":240,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":194,"y":-58},{"text":"közjegyző","size":10,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":1248,"yoff":240,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":293,"y":-100},{"text":"tagság","size":3,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1312,"yoff":240,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":104,"y":-43}]},{"name":"költségvetés, adó","major_topic":[1],"words":[{"text":"adózó","size":80,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":8,"y":-115,"width":256,"height":160,"xoff":0,"yoff":0,"x1":128,"y1":79,"x0":-128,"y0":-61,"hasText":true},{"text":"intézmény","size":62,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":124,"xoff":256,"yoff":0,"x1":144,"y1":61,"x0":-144,"y0":-48,"hasText":true,"x":91,"y":-41},{"text":"szociális","size":53,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":106,"xoff":544,"yoff":0,"x1":112,"y1":52,"x0":-112,"y0":-41,"hasText":true,"x":237,"y":-83},{"text":"nyugdíj","size":52,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":104,"xoff":768,"yoff":0,"x1":96,"y1":51,"x0":-96,"y0":-41,"hasText":true,"x":-1,"y":36},{"text":"munkanélkül","size":52,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":104,"xoff":960,"yoff":0,"x1":144,"y1":51,"x0":-144,"y0":-41,"hasText":true,"x":190,"y":4},{"text":"pótle","size":51,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":102,"xoff":1248,"yoff":0,"x1":80,"y1":50,"x0":-80,"y0":-40,"hasText":true,"x":-4,"y":114},{"text":"munkáltató","size":49,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":98,"xoff":1408,"yoff":0,"x1":128,"y1":48,"x0":-128,"y0":-39,"hasText":true,"x":-149,"y":109},{"text":"adóelőleg","size":45,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":90,"xoff":1664,"yoff":0,"x1":112,"y1":44,"x0":-112,"y0":-36,"hasText":true,"x":-73,"y":-14},{"text":"forgalm","size":44,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":88,"xoff":0,"yoff":160,"x1":80,"y1":43,"x0":-80,"y0":-33,"hasText":true,"x":-90,"y":-63},{"text":"költségvetés","size":44,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":88,"xoff":160,"yoff":160,"x1":128,"y1":43,"x0":-128,"y0":-35,"hasText":true,"x":171,"y":46},{"text":"adóév","size":39,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":78,"xoff":416,"yoff":160,"x1":64,"y1":38,"x0":-64,"y0":-32,"hasText":true,"x":-133,"y":-98},{"text":"vállalkozó","size":37,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":544,"yoff":160,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":176,"y":-117},{"text":"segély","size":35,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":736,"yoff":160,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":-205,"y":138},{"text":"gyerm","size":34,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":864,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-20,"hasText":true,"x":156,"y":86},{"text":"önkormányz","size":34,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":68,"xoff":992,"yoff":160,"x1":96,"y1":33,"x0":-96,"y0":-27,"hasText":true,"x":-161,"y":15},{"text":"adókötelezettség","size":32,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":64,"xoff":1184,"yoff":160,"x1":128,"y1":31,"x0":-128,"y0":-25,"hasText":true,"x":217,"y":-147},{"text":"család","size":31,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":1440,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":-99,"y":136},{"text":"munkaügy","size":31,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":1568,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":75,"y":-92},{"text":"bevallás","size":30,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":1728,"yoff":160,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":13,"y":68},{"text":"mennyiség","size":30,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1856,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":276,"y":-41},{"text":"adóköteles","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":0,"yoff":248,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-145,"y":41},{"text":"térítés","size":30,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":160,"yoff":248,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-142,"y":69},{"text":"kifizető","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":256,"yoff":248,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":133,"y":123},{"text":"foglalkoztatás","size":29,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":58,"xoff":384,"yoff":248,"x1":96,"y1":28,"x0":-96,"y0":-23,"hasText":true,"x":93,"y":-179},{"text":"keret","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":576,"yoff":248,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":28,"y":139},{"text":"jövedelemadó","size":28,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":56,"xoff":672,"yoff":248,"x1":96,"y1":27,"x0":-96,"y0":-23,"hasText":true,"x":395,"y":-79},{"text":"járule","size":28,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":864,"yoff":248,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":234,"y":-178},{"text":"adóbevallás","size":27,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":960,"yoff":248,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":256,"y":89},{"text":"megfizetn","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1120,"yoff":248,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-203,"y":-28},{"text":"magánszemély","size":12,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":24,"xoff":1248,"yoff":248,"x1":48,"y1":11,"x0":-48,"y0":-10,"hasText":true,"x":107,"y":61},{"text":"adóhatóság","size":10,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":1344,"yoff":248,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":124,"y":-30},{"text":"támogatás","size":10,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":1408,"yoff":248,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":238,"y":-71},{"text":"társadalombiztosítás","size":4,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":8,"xoff":1472,"yoff":248,"x1":32,"y1":3,"x0":-32,"y0":-4,"hasText":true,"x":-78,"y":46},{"text":"járade","size":4,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1536,"yoff":248,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-146,"y":-8},{"text":"származó","size":3,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1568,"yoff":248,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-169,"y":-7},{"text":"fizetés","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1600,"yoff":248,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-31,"y":-55}]},{"name":"nemzetközi egyezmények","major_topic":[18,19],"words":[{"text":"egyezmény","size":80,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-249,"y":57,"width":416,"height":160,"xoff":0,"yoff":0,"x1":208,"y1":79,"x0":-208,"y0":-61,"hasText":true},{"text":"önkormányz","size":74,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":416,"height":148,"xoff":416,"yoff":0,"x1":208,"y1":73,"x0":-208,"y0":-56,"hasText":true,"x":-66,"y":120},{"text":"európ","size":61,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":122,"xoff":832,"yoff":0,"x1":96,"y1":60,"x0":-96,"y0":-47,"hasText":true,"x":-297,"y":123},{"text":"támogatás","size":59,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":118,"xoff":1024,"yoff":0,"x1":144,"y1":58,"x0":-144,"y0":-45,"hasText":true,"x":-218,"y":-6},{"text":"convent","size":52,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":104,"xoff":1312,"yoff":0,"x1":96,"y1":51,"x0":-96,"y0":-36,"hasText":true,"x":-271,"y":-53},{"text":"council","size":52,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":104,"xoff":1504,"yoff":0,"x1":96,"y1":51,"x0":-96,"y0":-40,"hasText":true,"x":157,"y":15},{"text":"europ","size":48,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":96,"xoff":1696,"yoff":0,"x1":80,"y1":47,"x0":-80,"y0":-27,"hasText":true,"x":195,"y":107},{"text":"stat","size":38,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":76,"xoff":1856,"yoff":0,"x1":48,"y1":37,"x0":-48,"y0":-27,"hasText":true,"x":-57,"y":77},{"text":"budapes","size":37,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":0,"yoff":160,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":29,"y":7},{"text":"parties","size":32,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":160,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-195,"y":-91},{"text":"főtitkár","size":31,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":288,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":43,"y":69},{"text":"ezer","size":29,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":416,"yoff":160,"x1":48,"y1":28,"x0":-48,"y0":-17,"hasText":true,"x":-84,"y":12},{"text":"építés","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":512,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":78,"y":-46},{"text":"forint","size":26,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":608,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-75,"y":-54},{"text":"letét","size":25,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":704,"yoff":160,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":-169,"y":-68},{"text":"gyerm","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":768,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-15,"hasText":true,"x":-138,"y":137},{"text":"protocol","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":864,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-107,"y":-77},{"text":"bűncselekmény","size":23,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":960,"yoff":160,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":181,"y":47},{"text":"members","size":23,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1120,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-154,"y":-117},{"text":"general","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1248,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-39,"y":37},{"text":"chil","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1344,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":198,"y":-81},{"text":"tornater","size":22,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1408,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-17,"hasText":true,"x":-118,"y":-98},{"text":"szerződő","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1504,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-67,"y":-11},{"text":"assembly","size":21,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1600,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":20,"y":-91},{"text":"bíróság","size":21,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1696,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":73,"y":33},{"text":"contracting","size":21,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1792,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":216,"y":-26},{"text":"request","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1920,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-16,"hasText":true,"x":-10,"y":137},{"text":"közgyűlés","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":0,"yoff":224,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":142,"y":-105},{"text":"ministers","size":20,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":96,"yoff":224,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":94,"y":140},{"text":"pers","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":192,"yoff":224,"x1":32,"y1":18,"x0":-32,"y0":-12,"hasText":true,"x":124,"y":-58},{"text":"secretarygeneral","size":18,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":36,"xoff":256,"yoff":224,"x1":80,"y1":17,"x0":-80,"y0":-14,"hasText":true,"x":36,"y":-25},{"text":"kormányzó","size":18,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":416,"yoff":224,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":145,"y":-75},{"text":"nyilatkozat","size":18,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":512,"yoff":224,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-76,"y":-123},{"text":"ratificat","size":18,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":608,"yoff":224,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":131,"y":73},{"text":"tanter","size":18,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":672,"yoff":224,"x1":32,"y1":17,"x0":-32,"y0":-13,"hasText":true,"x":18,"y":36},{"text":"territory","size":17,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":736,"yoff":224,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":255,"y":32},{"text":"accordanc","size":17,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":800,"yoff":224,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":19,"y":-63},{"text":"pécs","size":17,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":896,"yoff":224,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":-253,"y":-104},{"text":"committe","size":3,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":960,"yoff":224,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":44,"y":42}]},{"name":"államigazgatás és fegyveres testületek","major_topic":[12,16,20],"words":[{"text":"fegyelm","size":80,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-10,"y":-26,"width":288,"height":160,"xoff":0,"yoff":0,"x1":144,"y1":79,"x0":-144,"y0":-60,"hasText":true},{"text":"képviselő","size":62,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":124,"xoff":288,"yoff":0,"x1":144,"y1":61,"x0":-144,"y0":-48,"hasText":true,"x":-48,"y":64},{"text":"szolgálat","size":60,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":120,"xoff":576,"yoff":0,"x1":128,"y1":59,"x0":-128,"y0":-47,"hasText":true,"x":-115,"y":112},{"text":"katon","size":55,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":110,"xoff":832,"yoff":0,"x1":80,"y1":54,"x0":-80,"y0":-41,"hasText":true,"x":-159,"y":15},{"text":"végrehajtó","size":52,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":104,"xoff":992,"yoff":0,"x1":128,"y1":51,"x0":-128,"y0":-41,"hasText":true,"x":223,"y":22},{"text":"munkaviszony","size":47,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":94,"xoff":1248,"yoff":0,"x1":144,"y1":46,"x0":-144,"y0":-36,"hasText":true,"x":34,"y":-88},{"text":"adós","size":42,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":84,"xoff":1536,"yoff":0,"x1":64,"y1":41,"x0":-64,"y0":-33,"hasText":true,"x":223,"y":103},{"text":"jogviszony","size":40,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":80,"xoff":1664,"yoff":0,"x1":96,"y1":39,"x0":-96,"y0":-31,"hasText":true,"x":-5,"y":-127},{"text":"szavazat","size":39,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":1856,"yoff":0,"x1":80,"y1":38,"x0":-80,"y0":-28,"hasText":true,"x":-188,"y":-29},{"text":"polgár","size":39,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":78,"xoff":0,"yoff":160,"x1":64,"y1":38,"x0":-64,"y0":-32,"hasText":true,"x":-60,"y":146},{"text":"közalkalmazott","size":37,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":74,"xoff":128,"yoff":160,"x1":128,"y1":36,"x0":-128,"y0":-29,"hasText":true,"x":161,"y":62},{"text":"fizetés","size":36,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":384,"yoff":160,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":29,"y":11},{"text":"honvédelm","size":34,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":68,"xoff":512,"yoff":160,"x1":96,"y1":33,"x0":-96,"y0":-27,"hasText":true,"x":54,"y":115},{"text":"vezető","size":33,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":704,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":-198,"y":42},{"text":"köztisztviselő","size":30,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":60,"xoff":832,"yoff":160,"x1":96,"y1":29,"x0":-96,"y0":-24,"hasText":true,"x":-234,"y":69},{"text":"jelölt","size":28,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1024,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":148,"y":125},{"text":"munkavégzés","size":26,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":1120,"yoff":160,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":-284,"y":12},{"text":"közigazgatás","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":1280,"yoff":160,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":101,"y":86},{"text":"biztosítás","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":1440,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":150,"y":-60},{"text":"választópolgár","size":24,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":48,"xoff":1568,"yoff":160,"x1":80,"y1":23,"x0":-80,"y0":-20,"hasText":true,"x":176,"y":-21},{"text":"követelés","size":23,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1728,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":284,"y":-20},{"text":"hadköteles","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1856,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":244,"y":-44},{"text":"bíróság","size":22,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":0,"yoff":234,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-176,"y":133},{"text":"ügyész","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":96,"yoff":234,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-72,"y":13},{"text":"felülvizsgálat","size":22,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":192,"yoff":234,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":134,"y":-121},{"text":"legfelsőbb","size":21,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":320,"yoff":234,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":74,"y":133},{"text":"főváros","size":21,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":448,"yoff":234,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":190,"y":-86},{"text":"hatáskör","size":21,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":544,"yoff":234,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-159,"y":-62},{"text":"védelm","size":20,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":640,"yoff":234,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":18,"y":150},{"text":"külföld","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":736,"yoff":234,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":91,"y":28},{"text":"jegyző","size":20,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":832,"yoff":234,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":108,"y":-147},{"text":"jogerős","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":928,"yoff":234,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-126,"y":-91},{"text":"választás","size":12,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":1024,"yoff":234,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-237,"y":-10},{"text":"munkáltató","size":8,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":1088,"yoff":234,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":-85,"y":-6},{"text":"munkavállaló","size":6,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":12,"xoff":1152,"yoff":234,"x1":32,"y1":5,"x0":-32,"y0":-6,"hasText":true,"x":13,"y":-120},{"text":"szavazás","size":3,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1216,"yoff":234,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":242,"y":-64},{"text":"munkakör","size":2,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1248,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":196,"y":78},{"text":"tárgyalás","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1280,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-32,"y":19}]},{"name":"költségvetési kiadások","major_topic":[1],"words":[{"text":"önkormányzat","size":80,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":24,"y":26,"width":480,"height":160,"xoff":0,"yoff":0,"x1":240,"y1":79,"x0":-240,"y0":-61,"hasText":true},{"text":"előirányzat","size":74,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":148,"xoff":480,"yoff":0,"x1":176,"y1":73,"x0":-176,"y0":-56,"hasText":true,"x":221,"y":-29},{"text":"hozzájárulás","size":70,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":384,"height":140,"xoff":832,"yoff":0,"x1":192,"y1":69,"x0":-192,"y0":-53,"hasText":true,"x":-131,"y":-35},{"text":"felújítás","size":66,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":132,"xoff":1216,"yoff":0,"x1":128,"y1":65,"x0":-128,"y0":-51,"hasText":true,"x":251,"y":77},{"text":"minisztériu","size":52,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":104,"xoff":1472,"yoff":0,"x1":128,"y1":51,"x0":-128,"y0":-41,"hasText":true,"x":-246,"y":-102},{"text":"kormányzat","size":50,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":100,"xoff":1728,"yoff":0,"x1":128,"y1":49,"x0":-128,"y0":-40,"hasText":true,"x":-26,"y":-91},{"text":"oktatás","size":46,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":92,"xoff":0,"yoff":160,"x1":80,"y1":45,"x0":-80,"y0":-36,"hasText":true,"x":59,"y":84},{"text":"tartale","size":43,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":160,"yoff":160,"x1":80,"y1":42,"x0":-80,"y0":-33,"hasText":true,"x":-247,"y":1},{"text":"igazgatás","size":42,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":84,"xoff":320,"yoff":160,"x1":96,"y1":41,"x0":-96,"y0":-33,"hasText":true,"x":-78,"y":59},{"text":"költségvetés","size":41,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":82,"xoff":512,"yoff":160,"x1":112,"y1":40,"x0":-112,"y0":-33,"hasText":true,"x":-387,"y":-59},{"text":"forint","size":41,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":82,"xoff":736,"yoff":160,"x1":64,"y1":40,"x0":-64,"y0":-32,"hasText":true,"x":-130,"y":93},{"text":"kiadás","size":36,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":864,"yoff":160,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":-40,"y":105},{"text":"fejlesztés","size":33,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":992,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":291,"y":16},{"text":"hitel","size":33,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":1152,"yoff":160,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":-198,"y":-75},{"text":"intézet","size":27,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1248,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":43,"y":108},{"text":"szociális","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1344,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":132,"y":-86},{"text":"államháztartás","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":1440,"yoff":160,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":150,"y":-108},{"text":"kezelésű","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1600,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":205,"y":98},{"text":"itj","size":22,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":44,"xoff":1696,"yoff":160,"x1":16,"y1":21,"x0":-16,"y0":-19,"hasText":true,"x":43,"y":-25},{"text":"alapítvány","size":21,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1728,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":222,"y":-90},{"text":"település","size":21,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1856,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-225,"y":25},{"text":"lábjegyzet","size":21,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":0,"yoff":246,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-204,"y":48},{"text":"pénzügy","size":21,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":96,"yoff":246,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-202,"y":113},{"text":"finanszírozás","size":20,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":192,"yoff":246,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":-196,"y":-145},{"text":"elszámolás","size":20,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":320,"yoff":246,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":65,"y":46},{"text":"adó","size":20,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":448,"yoff":246,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-108,"y":-122},{"text":"befizetés","size":19,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":512,"yoff":246,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-110,"y":-142},{"text":"járule","size":18,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":608,"yoff":246,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":92,"y":123},{"text":"támogatás","size":16,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":672,"yoff":246,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":131,"y":102},{"text":"béralap","size":15,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":768,"yoff":246,"x1":32,"y1":14,"x0":-32,"y0":-13,"hasText":true,"x":-191,"y":70},{"text":"intézmény","size":13,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":832,"yoff":246,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":-239,"y":65},{"text":"beruházás","size":12,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":896,"yoff":246,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":242,"y":-113},{"text":"normatív","size":3,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":960,"yoff":246,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":192,"y":-71},{"text":"társadalombiztosítás","size":2,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":992,"yoff":246,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":105,"y":87},{"text":"egészségügy","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1024,"yoff":246,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-144,"y":-132},{"text":"egészségbiztosítás","size":1,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1056,"yoff":246,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":142,"y":120}]},{"name":"vállalkozások","major_topic":[15],"words":[{"text":"forin","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":219,"y":-99,"width":192,"height":160,"xoff":0,"yoff":0,"x1":96,"y1":79,"x0":-96,"y0":-60,"hasText":true},{"text":"telephely","size":79,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":158,"xoff":192,"yoff":0,"x1":160,"y1":78,"x0":-160,"y0":-59,"hasText":true,"x":141,"y":33},{"text":"út","size":74,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":148,"xoff":512,"yoff":0,"x1":64,"y1":73,"x0":-64,"y0":-56,"hasText":true,"x":-80,"y":-6},{"text":"nyereség","size":69,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":138,"xoff":640,"yoff":0,"x1":144,"y1":68,"x0":-144,"y0":-53,"hasText":true,"x":-139,"y":-124},{"text":"társaság","size":64,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":128,"xoff":928,"yoff":0,"x1":128,"y1":63,"x0":-128,"y0":-49,"hasText":true,"x":-234,"y":36},{"text":"mnb","size":59,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":118,"xoff":1184,"yoff":0,"x1":80,"y1":58,"x0":-80,"y0":-44,"hasText":true,"x":258,"y":-64},{"text":"beruházás","size":58,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":116,"xoff":1344,"yoff":0,"x1":144,"y1":57,"x0":-144,"y0":-45,"hasText":true,"x":-276,"y":-76},{"text":"származó","size":54,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":108,"xoff":1632,"yoff":0,"x1":128,"y1":53,"x0":-128,"y0":-42,"hasText":true,"x":-65,"y":-75},{"text":"vagyon","size":53,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":106,"xoff":0,"yoff":160,"x1":96,"y1":52,"x0":-96,"y0":-30,"hasText":true,"x":-190,"y":-13},{"text":"szerződő","size":51,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":102,"xoff":192,"yoff":160,"x1":112,"y1":50,"x0":-112,"y0":-39,"hasText":true,"x":-37,"y":96},{"text":"adóztatás","size":50,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":100,"xoff":416,"yoff":160,"x1":112,"y1":49,"x0":-112,"y0":-40,"hasText":true,"x":-243,"y":78},{"text":"bíróság","size":48,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":96,"xoff":640,"yoff":160,"x1":96,"y1":47,"x0":-96,"y0":-37,"hasText":true,"x":48,"y":-27},{"text":"osztale","size":39,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":832,"yoff":160,"x1":80,"y1":38,"x0":-80,"y0":-31,"hasText":true,"x":45,"y":-118},{"text":"népköztársaság","size":39,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":78,"xoff":992,"yoff":160,"x1":128,"y1":38,"x0":-128,"y0":-32,"hasText":true,"x":-240,"y":115},{"text":"ingatl","size":38,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":76,"xoff":1248,"yoff":160,"x1":64,"y1":37,"x0":-64,"y0":-29,"hasText":true,"x":-84,"y":58},{"text":"nemzetköz","size":35,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":1376,"yoff":160,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":163,"y":99},{"text":"térítés","size":34,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":1568,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":170,"y":68},{"text":"természetes","size":32,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":64,"xoff":1696,"yoff":160,"x1":96,"y1":31,"x0":-96,"y0":-25,"hasText":true,"x":189,"y":-38},{"text":"szabadalm","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":0,"yoff":262,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-189,"y":145},{"text":"fizetés","size":32,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":160,"yoff":262,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":161,"y":-64},{"text":"beruházó","size":31,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":288,"yoff":262,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-43,"y":20},{"text":"költség","size":28,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":448,"yoff":262,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":115,"y":-93},{"text":"tekintendő","size":28,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":544,"yoff":262,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":295,"y":-11},{"text":"kam","size":27,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":54,"xoff":704,"yoff":262,"x1":32,"y1":26,"x0":-32,"y0":-21,"hasText":true,"x":234,"y":121},{"text":"tenyésztés","size":27,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":768,"yoff":262,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-61,"y":118},{"text":"választottbíróság","size":27,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":54,"xoff":896,"yoff":262,"x1":96,"y1":26,"x0":-96,"y0":-21,"hasText":true,"x":-190,"y":-50},{"text":"találmány","size":26,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1088,"yoff":262,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":27,"y":-153},{"text":"oltal","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":1216,"yoff":262,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":-38,"y":-50},{"text":"állampolgár","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":1280,"yoff":262,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-200,"y":166},{"text":"illetőség","size":13,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":1440,"yoff":262,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":233,"y":64},{"text":"egyezmény","size":11,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":1504,"yoff":262,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":47,"y":106},{"text":"jövedel","size":8,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":16,"xoff":1568,"yoff":262,"x1":16,"y1":7,"x0":-16,"y0":-8,"hasText":true,"x":214,"y":-26},{"text":"adóztatható","size":6,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":12,"xoff":1600,"yoff":262,"x1":32,"y1":5,"x0":-32,"y0":-6,"hasText":true,"x":114,"y":-125},{"text":"licencdíj","size":3,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1664,"yoff":262,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-152,"y":-108},{"text":"üzlet","size":3,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1696,"yoff":262,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-217,"y":1},{"text":"utc","size":2,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1728,"yoff":262,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-205,"y":-21},{"text":"vállalkozás","size":1,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1760,"yoff":262,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-93,"y":-112}]},{"name":"ipar és kereskedelem","major_topic":[1,15,18],"words":[{"text":"vtsz","size":80,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":6,"y":-55,"width":192,"height":160,"xoff":0,"yoff":0,"x1":96,"y1":79,"x0":-96,"y0":-54,"hasText":true},{"text":"vámtarifa","size":68,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":384,"height":136,"xoff":192,"yoff":0,"x1":192,"y1":67,"x0":-192,"y0":-52,"hasText":true,"x":-23,"y":74},{"text":"gyártelep","size":66,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":132,"xoff":576,"yoff":0,"x1":144,"y1":65,"x0":-144,"y0":-51,"hasText":true,"x":-184,"y":21},{"text":"acél","size":53,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":106,"xoff":864,"yoff":0,"x1":64,"y1":52,"x0":-64,"y0":-41,"hasText":true,"x":177,"y":53},{"text":"gép","size":35,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":70,"xoff":992,"yoff":0,"x1":48,"y1":34,"x0":-48,"y0":-28,"hasText":true,"x":-40,"y":25},{"text":"gum","size":34,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":68,"xoff":1088,"yoff":0,"x1":48,"y1":33,"x0":-48,"y0":-20,"hasText":true,"x":-139,"y":100},{"text":"készüle","size":33,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":1184,"yoff":0,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":101,"y":100},{"text":"só","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":66,"xoff":1312,"yoff":0,"x1":32,"y1":32,"x0":-32,"y0":-25,"hasText":true,"x":42,"y":32},{"text":"szál","size":33,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":1376,"yoff":0,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":82,"y":32},{"text":"készítmény","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1472,"yoff":0,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":252,"y":78},{"text":"bizonyítvány","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1632,"yoff":0,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":3,"y":-4},{"text":"szöv","size":29,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":1792,"yoff":0,"x1":48,"y1":28,"x0":-48,"y0":-21,"hasText":true,"x":-199,"y":115},{"text":"kombinál","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1888,"yoff":0,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-135,"y":-123},{"text":"természetes","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":0,"yoff":160,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":-167,"y":137},{"text":"vámmentes","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":160,"yoff":160,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-183,"y":-31},{"text":"tömegszázale","size":24,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":48,"xoff":320,"yoff":160,"x1":80,"y1":23,"x0":-80,"y0":-20,"hasText":true,"x":-24,"y":-110},{"text":"lábjegyzet","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":480,"yoff":160,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":-38,"y":95},{"text":"európ","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":608,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":-108,"y":-71},{"text":"származe","size":21,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":672,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":67,"y":-127},{"text":"árumegnevezés","size":20,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":40,"xoff":768,"yoff":160,"x1":80,"y1":19,"x0":-80,"y0":-16,"hasText":true,"x":-51,"y":-37},{"text":"elektromos","size":20,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":928,"yoff":160,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":-202,"y":-52},{"text":"megjegyzés","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":1056,"yoff":160,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":54,"y":117},{"text":"árucsoport","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1184,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-13,"y":-138},{"text":"szintetikus","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1280,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-129,"y":-89},{"text":"mesterséges","size":19,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":1376,"yoff":160,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":205,"y":96},{"text":"észter","size":18,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":1504,"yoff":160,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":-169,"y":-106},{"text":"előállítot","size":18,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1568,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":141,"y":115},{"text":"mobr","size":18,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":1664,"yoff":160,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":201,"y":-30},{"text":"anyag","size":17,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1728,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-11,"hasText":true,"x":191,"y":-75},{"text":"előállítás","size":9,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":1792,"yoff":160,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":242,"y":26},{"text":"felhasznál","size":9,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":1856,"yoff":160,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":-87,"y":-23},{"text":"termék","size":8,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":16,"xoff":1920,"yoff":160,"x1":16,"y1":7,"x0":-16,"y0":-8,"hasText":true,"x":154,"y":80},{"text":"alkatrész","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1952,"yoff":160,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":151,"y":22},{"text":"ország","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1984,"yoff":160,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":108,"y":-97},{"text":"papír","size":1,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":0,"yoff":210,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":193,"y":-45},{"text":"származó","size":0,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":32,"yoff":210,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-11,"y":-121}]},{"name":"oktatás","major_topic":[6],"words":[{"text":"képzés","size":80,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":28,"y":-125,"width":288,"height":160,"xoff":0,"yoff":0,"x1":144,"y1":79,"x0":-144,"y0":-61,"hasText":true},{"text":"közoktatás","size":65,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":130,"xoff":288,"yoff":0,"x1":160,"y1":64,"x0":-160,"y0":-51,"hasText":true,"x":-241,"y":3},{"text":"oktatás","size":62,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":124,"xoff":608,"yoff":0,"x1":112,"y1":61,"x0":-112,"y0":-48,"hasText":true,"x":-149,"y":114},{"text":"tudományos","size":51,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":102,"xoff":832,"yoff":0,"x1":144,"y1":50,"x0":-144,"y0":-40,"hasText":true,"x":174,"y":2},{"text":"szakképzés","size":49,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":98,"xoff":1120,"yoff":0,"x1":128,"y1":48,"x0":-128,"y0":-39,"hasText":true,"x":93,"y":-74},{"text":"nevelésioktatás","size":46,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":92,"xoff":1376,"yoff":0,"x1":160,"y1":45,"x0":-160,"y0":-36,"hasText":true,"x":-152,"y":-78},{"text":"óvod","size":42,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":84,"xoff":1696,"yoff":0,"x1":64,"y1":41,"x0":-64,"y0":-33,"hasText":true,"x":143,"y":35},{"text":"tanulmány","size":39,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":78,"xoff":1824,"yoff":0,"x1":96,"y1":38,"x0":-96,"y0":-32,"hasText":true,"x":181,"y":-40},{"text":"pays","size":38,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":76,"xoff":0,"yoff":160,"x1":48,"y1":37,"x0":-48,"y0":-22,"hasText":true,"x":248,"y":-100},{"text":"gyerm","size":33,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":96,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-19,"hasText":true,"x":-105,"y":-43},{"text":"hallgató","size":33,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":224,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":56,"y":-48},{"text":"egyetem","size":32,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":352,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-23,"hasText":true,"x":32,"y":109},{"text":"del","size":31,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":62,"xoff":480,"yoff":160,"x1":32,"y1":30,"x0":-32,"y0":-24,"hasText":true,"x":199,"y":32},{"text":"művelődés","size":29,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":544,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-143,"y":31},{"text":"keret","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":704,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":-104,"y":-114},{"text":"vezető","size":28,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":800,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":-30,"y":-50},{"text":"vizsg","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":896,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":-157,"y":71},{"text":"fenntartó","size":25,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":992,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":58,"y":30},{"text":"szakképesítés","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":1120,"yoff":160,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-26,"y":-24},{"text":"pedagógi","size":25,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":1280,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":189,"y":110},{"text":"szakszervezet","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":48,"xoff":1408,"yoff":160,"x1":80,"y1":23,"x0":-80,"y0":-20,"hasText":true,"x":-7,"y":-3},{"text":"szabályzat","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1568,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":82,"y":73},{"text":"oktató","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1696,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":190,"y":-123},{"text":"akadém","size":23,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1792,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":61,"y":49},{"text":"évfoly","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1888,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":190,"y":-150},{"text":"borvide","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":0,"yoff":226,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-231,"y":-47},{"text":"körz","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":96,"yoff":226,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-4,"y":18},{"text":"szülő","size":22,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":160,"yoff":226,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":241,"y":28},{"text":"végzettség","size":22,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":224,"yoff":226,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":-23,"y":47},{"text":"intézmény","size":21,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":352,"yoff":226,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-55,"y":132},{"text":"bianc","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":480,"yoff":226,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":-73,"y":11},{"text":"ross","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":544,"yoff":226,"x1":32,"y1":20,"x0":-32,"y0":-13,"hasText":true,"x":-99,"y":-63},{"text":"iskol","size":12,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":24,"xoff":608,"yoff":226,"x1":16,"y1":11,"x0":-16,"y0":-10,"hasText":true,"x":219,"y":-28},{"text":"tanuló","size":10,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":640,"yoff":226,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":-27,"y":29},{"text":"felsőoktatás","size":9,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":704,"yoff":226,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":-100,"y":-142},{"text":"foglalkozás","size":3,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":768,"yoff":226,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":34,"y":-104},{"text":"doktor","size":3,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":800,"yoff":226,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":121,"y":43},{"text":"főiskol","size":0,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":832,"yoff":226,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-42,"y":-66}]},{"name":"vállalatok és pénzintézetek","major_topic":[15],"words":[{"text":"itj","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":129,"y":-61,"width":128,"height":160,"xoff":0,"yoff":0,"x1":64,"y1":79,"x0":-64,"y0":-60,"hasText":true},{"text":"pénzintézet","size":69,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":138,"xoff":128,"yoff":0,"x1":176,"y1":68,"x0":-176,"y0":-53,"hasText":true,"x":-102,"y":15},{"text":"befektetés","size":57,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":114,"xoff":480,"yoff":0,"x1":144,"y1":56,"x0":-144,"y0":-44,"hasText":true,"x":170,"y":-11},{"text":"költség","size":55,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":110,"xoff":768,"yoff":0,"x1":96,"y1":54,"x0":-96,"y0":-42,"hasText":true,"x":-155,"y":-40},{"text":"vállalkozás","size":48,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":96,"xoff":960,"yoff":0,"x1":128,"y1":47,"x0":-128,"y0":-37,"hasText":true,"x":-29,"y":-110},{"text":"vállalkozó","size":48,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":96,"xoff":1216,"yoff":0,"x1":112,"y1":47,"x0":-112,"y0":-37,"hasText":true,"x":19,"y":-67},{"text":"mérleg","size":48,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":96,"xoff":1440,"yoff":0,"x1":80,"y1":47,"x0":-80,"y0":-37,"hasText":true,"x":-196,"y":81},{"text":"adóalany","size":47,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":94,"xoff":1600,"yoff":0,"x1":112,"y1":46,"x0":-112,"y0":-37,"hasText":true,"x":-23,"y":55},{"text":"külföld","size":42,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1824,"yoff":0,"x1":80,"y1":41,"x0":-80,"y0":-32,"hasText":true,"x":-179,"y":-89},{"text":"felszámolás","size":41,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":82,"xoff":0,"yoff":160,"x1":112,"y1":40,"x0":-112,"y0":-33,"hasText":true,"x":-317,"y":-40},{"text":"beszámoló","size":40,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":80,"xoff":224,"yoff":160,"x1":96,"y1":39,"x0":-96,"y0":-32,"hasText":true,"x":-6,"y":89},{"text":"tulajdon","size":39,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":416,"yoff":160,"x1":80,"y1":38,"x0":-80,"y0":-31,"hasText":true,"x":-24,"y":121},{"text":"részesedés","size":36,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":72,"xoff":576,"yoff":160,"x1":96,"y1":35,"x0":-96,"y0":-28,"hasText":true,"x":226,"y":-56},{"text":"magánszemély","size":35,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":70,"xoff":768,"yoff":160,"x1":112,"y1":34,"x0":-112,"y0":-28,"hasText":true,"x":-16,"y":151},{"text":"követelés","size":33,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":992,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":-9,"y":-40},{"text":"értékesítés","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":66,"xoff":1152,"yoff":160,"x1":96,"y1":32,"x0":-96,"y0":-25,"hasText":true,"x":-157,"y":115},{"text":"vállalat","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1344,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":152,"y":16},{"text":"sztj","size":32,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":1472,"yoff":160,"x1":48,"y1":31,"x0":-48,"y0":-25,"hasText":true,"x":-125,"y":46},{"text":"bankfelügyel","size":27,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":1568,"yoff":160,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":-289,"y":47},{"text":"hitelező","size":27,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1728,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-56,"y":-148},{"text":"gazdálkodó","size":26,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":1856,"yoff":160,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":142,"y":38},{"text":"egyszerűsítet","size":26,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":0,"yoff":240,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":-32,"y":176},{"text":"ár","size":26,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":160,"yoff":240,"x1":32,"y1":25,"x0":-32,"y0":-21,"hasText":true,"x":-131,"y":138},{"text":"alapító","size":26,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":224,"yoff":240,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-185,"y":38},{"text":"beszerzés","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":320,"yoff":240,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":130,"y":60},{"text":"vezető","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":448,"yoff":240,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":177,"y":82},{"text":"eredmény","size":25,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":544,"yoff":240,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":119,"y":103},{"text":"átalakulás","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":672,"yoff":240,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":129,"y":-122},{"text":"pénzügy","size":23,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":800,"yoff":240,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-294,"y":-17},{"text":"társaság","size":13,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":896,"yoff":240,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":-270,"y":9},{"text":"gazdaság","size":8,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":960,"yoff":240,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":230,"y":-80},{"text":"értékpapír","size":3,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1024,"yoff":240,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-136,"y":-31},{"text":"részvénytársaság","size":3,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1056,"yoff":240,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":214,"y":38},{"text":"vagyonügynökség","size":3,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":6,"xoff":1088,"yoff":240,"x1":32,"y1":2,"x0":-32,"y0":-3,"hasText":true,"x":-81,"y":-76}]}]},{"id":"1994-1998","topics":[{"name":"költségvetés, adó","major_topic":[1],"words":[{"text":"költség","size":80,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-38,"y":-99,"width":288,"height":160,"xoff":0,"yoff":0,"x1":144,"y1":79,"x0":-144,"y0":-61,"hasText":true},{"text":"egészségbiztosítás","size":68,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":544,"height":136,"xoff":288,"yoff":0,"x1":272,"y1":67,"x0":-272,"y0":-52,"hasText":true,"x":-208,"y":-17},{"text":"adóév","size":62,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":124,"xoff":832,"yoff":0,"x1":96,"y1":61,"x0":-96,"y0":-48,"hasText":true,"x":61,"y":64},{"text":"jövedel","size":58,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":116,"xoff":1024,"yoff":0,"x1":112,"y1":57,"x0":-112,"y0":-44,"hasText":true,"x":-145,"y":-159},{"text":"forint","size":57,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":114,"xoff":1248,"yoff":0,"x1":80,"y1":56,"x0":-80,"y0":-43,"hasText":true,"x":190,"y":-76},{"text":"adóhatóság","size":57,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":114,"xoff":1408,"yoff":0,"x1":144,"y1":56,"x0":-144,"y0":-44,"hasText":true,"x":-208,"y":52},{"text":"származó","size":55,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":110,"xoff":1696,"yoff":0,"x1":128,"y1":54,"x0":-128,"y0":-42,"hasText":true,"x":9,"y":107},{"text":"társadalombiztosítás","size":53,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":448,"height":106,"xoff":0,"yoff":160,"x1":224,"y1":52,"x0":-224,"y0":-41,"hasText":true,"x":142,"y":-162},{"text":"adózó","size":52,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":104,"xoff":448,"yoff":160,"x1":80,"y1":51,"x0":-80,"y0":-41,"hasText":true,"x":-198,"y":-76},{"text":"járule","size":49,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":98,"xoff":608,"yoff":160,"x1":80,"y1":48,"x0":-80,"y0":-39,"hasText":true,"x":158,"y":107},{"text":"társaság","size":46,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":92,"xoff":768,"yoff":160,"x1":96,"y1":45,"x0":-96,"y0":-36,"hasText":true,"x":101,"y":-39},{"text":"itj","size":46,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":92,"xoff":960,"yoff":160,"x1":32,"y1":45,"x0":-32,"y0":-35,"hasText":true,"x":-72,"y":45},{"text":"nyugdíjbiztosítás","size":44,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":88,"xoff":1024,"yoff":160,"x1":160,"y1":43,"x0":-160,"y0":-35,"hasText":true,"x":82,"y":10},{"text":"munkáltató","size":43,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":86,"xoff":1344,"yoff":160,"x1":112,"y1":42,"x0":-112,"y0":-35,"hasText":true,"x":162,"y":-123},{"text":"vállalkozás","size":40,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":80,"xoff":1568,"yoff":160,"x1":112,"y1":39,"x0":-112,"y0":-32,"hasText":true,"x":-237,"y":-118},{"text":"külföld","size":38,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":76,"xoff":1792,"yoff":160,"x1":64,"y1":37,"x0":-64,"y0":-29,"hasText":true,"x":-250,"y":100},{"text":"beszerzés","size":38,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":0,"yoff":264,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":-174,"y":129},{"text":"adózás","size":35,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":192,"yoff":264,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":31,"y":136},{"text":"forgalm","size":35,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":320,"yoff":264,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":292,"y":-93},{"text":"támogatás","size":35,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":448,"yoff":264,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":-337,"y":-70},{"text":"fizetet","size":34,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":640,"yoff":264,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":-134,"y":99},{"text":"út","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":64,"xoff":768,"yoff":264,"x1":32,"y1":31,"x0":-32,"y0":-25,"hasText":true,"x":10,"y":-56},{"text":"ár","size":30,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":60,"xoff":832,"yoff":264,"x1":32,"y1":29,"x0":-32,"y0":-24,"hasText":true,"x":-76,"y":-73},{"text":"adóalany","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":896,"yoff":264,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":-290,"y":-158},{"text":"elszámolás","size":29,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1024,"yoff":264,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":202,"y":35},{"text":"mezőgazdaság","size":27,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":54,"xoff":1184,"yoff":264,"x1":96,"y1":26,"x0":-96,"y0":-21,"hasText":true,"x":281,"y":-16},{"text":"adóbevallás","size":27,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":1376,"yoff":264,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":-128,"y":5},{"text":"adóalap","size":26,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1536,"yoff":264,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":215,"y":-39},{"text":"belföld","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1632,"yoff":264,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-315,"y":6},{"text":"mérleg","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":1728,"yoff":264,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":293,"y":-125},{"text":"adóelőleg","size":25,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":1824,"yoff":264,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":178,"y":61},{"text":"megtérítés","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":0,"yoff":334,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":279,"y":10},{"text":"vagyon","size":25,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":128,"yoff":334,"x1":48,"y1":24,"x0":-48,"y0":-15,"hasText":true,"x":288,"y":-68},{"text":"kiadás","size":5,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":224,"yoff":334,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-229,"y":3},{"text":"kifizető","size":3,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":256,"yoff":334,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":31,"y":23},{"text":"szja","size":3,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":288,"yoff":334,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-229,"y":20},{"text":"magánszemély","size":1,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":320,"yoff":334,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-129,"y":-14},{"text":"vállalkozó","size":1,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":352,"yoff":334,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":47,"y":-90}]},{"name":"igazságügyi rendszer és felügyelet","major_topic":[12],"words":[{"text":"ügyész","size":80,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":169,"y":17,"width":288,"height":160,"xoff":0,"yoff":0,"x1":144,"y1":79,"x0":-144,"y0":-61,"hasText":true},{"text":"bűncselekmény","size":72,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":480,"height":144,"xoff":288,"yoff":0,"x1":240,"y1":71,"x0":-240,"y0":-55,"hasText":true,"x":-187,"y":-95},{"text":"tárgyalás","size":56,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":112,"xoff":768,"yoff":0,"x1":128,"y1":55,"x0":-128,"y0":-44,"hasText":true,"x":138,"y":-46},{"text":"nemzetköz","size":45,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":90,"xoff":1024,"yoff":0,"x1":112,"y1":44,"x0":-112,"y0":-35,"hasText":true,"x":-220,"y":-150},{"text":"btk","size":36,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":72,"xoff":1248,"yoff":0,"x1":48,"y1":35,"x0":-48,"y0":-28,"hasText":true,"x":-195,"y":117},{"text":"nyomozás","size":34,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":1344,"yoff":0,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":244,"y":39},{"text":"védő","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":1504,"yoff":0,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":175,"y":97},{"text":"tanú","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":1600,"yoff":0,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":136,"y":-80},{"text":"indítvány","size":33,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":1696,"yoff":0,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":-103,"y":56},{"text":"convent","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1856,"yoff":0,"x1":64,"y1":31,"x0":-64,"y0":-23,"hasText":true,"x":-36,"y":-16},{"text":"vámáru","size":32,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":0,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-28,"y":10},{"text":"közraktár","size":31,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":128,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-124,"y":95},{"text":"áru","size":31,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":62,"xoff":288,"yoff":160,"x1":32,"y1":30,"x0":-32,"y0":-24,"hasText":true,"x":-53,"y":36},{"text":"büntetés","size":31,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":352,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":13,"y":61},{"text":"szabadságvesztés","size":30,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":60,"xoff":480,"yoff":160,"x1":128,"y1":29,"x0":-128,"y0":-24,"hasText":true,"x":-201,"y":-70},{"text":"fellebbezés","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":736,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-32,"y":-62},{"text":"kiadatás","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":896,"yoff":160,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":-138,"y":-42},{"text":"lég","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":58,"xoff":1024,"yoff":160,"x1":32,"y1":28,"x0":-32,"y0":-23,"hasText":true,"x":-230,"y":-46},{"text":"cselekmény","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1088,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-85,"y":119},{"text":"külföld","size":27,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1248,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":50,"y":-92},{"text":"büntetőeljárás","size":26,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":1344,"yoff":160,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":135,"y":67},{"text":"vádlot","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1504,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-176,"y":-20},{"text":"vámkezelés","size":26,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":1600,"yoff":160,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":185,"y":-106},{"text":"nyomozó","size":26,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1760,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":255,"y":61},{"text":"megkereső","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1888,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":150,"y":-129},{"text":"szakértő","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":0,"yoff":222,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":0,"y":-43},{"text":"európ","size":23,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":96,"yoff":222,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-277,"y":-51},{"text":"polgár","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":192,"yoff":222,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-95,"y":-141},{"text":"bizonyítás","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":288,"yoff":222,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":-165,"y":0},{"text":"költség","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":416,"yoff":222,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":236,"y":-82},{"text":"elsőfokú","size":21,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":512,"yoff":222,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-248,"y":104},{"text":"okirat","size":20,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":608,"yoff":222,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":49,"y":-29},{"text":"bíróság","size":19,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":672,"yoff":222,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-204,"y":134},{"text":"határidő","size":19,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":768,"yoff":222,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":111,"y":86},{"text":"agreemen","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":864,"yoff":222,"x1":48,"y1":18,"x0":-48,"y0":-12,"hasText":true,"x":106,"y":99},{"text":"authorities","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":960,"yoff":222,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":241,"y":-128},{"text":"egyezmény","size":4,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1056,"yoff":222,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-242,"y":38},{"text":"megkereset","size":3,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1088,"yoff":222,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":41,"y":95},{"text":"másodfokú","size":2,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1120,"yoff":222,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-115,"y":4},{"text":"irat","size":0,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1152,"yoff":222,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":122,"y":7}]},{"name":"vállalkozások és pénzintézetek","major_topic":[15],"words":[{"text":"biztosítás","size":80,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-48,"y":28,"width":352,"height":160,"xoff":0,"yoff":0,"x1":176,"y1":79,"x0":-176,"y0":-61,"hasText":true},{"text":"pénztár","size":78,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":156,"xoff":352,"yoff":0,"x1":144,"y1":77,"x0":-144,"y0":-60,"hasText":true,"x":56,"y":91},{"text":"értékpapír","size":73,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":146,"xoff":640,"yoff":0,"x1":176,"y1":72,"x0":-176,"y0":-56,"hasText":true,"x":53,"y":-37},{"text":"részvénytársaság","size":68,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":512,"height":136,"xoff":992,"yoff":0,"x1":256,"y1":67,"x0":-256,"y0":-52,"hasText":true,"x":63,"y":-99},{"text":"vezető","size":66,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":132,"xoff":1504,"yoff":0,"x1":112,"y1":65,"x0":-112,"y0":-50,"hasText":true,"x":-199,"y":79},{"text":"felügyelet","size":65,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":130,"xoff":1728,"yoff":0,"x1":144,"y1":64,"x0":-144,"y0":-49,"hasText":true,"x":-250,"y":-60},{"text":"külföld","size":63,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":126,"xoff":0,"yoff":160,"x1":112,"y1":62,"x0":-112,"y0":-48,"hasText":true,"x":239,"y":2},{"text":"közgyűlés","size":58,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":116,"xoff":224,"yoff":160,"x1":128,"y1":57,"x0":-128,"y0":-45,"hasText":true,"x":83,"y":139},{"text":"könyvvizsgáló","size":56,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":112,"xoff":480,"yoff":160,"x1":176,"y1":55,"x0":-176,"y0":-44,"hasText":true,"x":-94,"y":-155},{"text":"hitelintéz","size":55,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":110,"xoff":832,"yoff":160,"x1":112,"y1":54,"x0":-112,"y0":-42,"hasText":true,"x":-141,"y":125},{"text":"alapító","size":49,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":98,"xoff":1056,"yoff":160,"x1":80,"y1":48,"x0":-80,"y0":-39,"hasText":true,"x":206,"y":45},{"text":"részesedés","size":46,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":92,"xoff":1216,"yoff":160,"x1":128,"y1":45,"x0":-128,"y0":-36,"hasText":true,"x":-287,"y":35},{"text":"vagyon","size":43,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":1472,"yoff":160,"x1":80,"y1":42,"x0":-80,"y0":-25,"hasText":true,"x":265,"y":-54},{"text":"intézmény","size":39,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":78,"xoff":1632,"yoff":160,"x1":96,"y1":38,"x0":-96,"y0":-32,"hasText":true,"x":-237,"y":-117},{"text":"felszámolás","size":38,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":76,"xoff":0,"yoff":276,"x1":112,"y1":37,"x0":-112,"y0":-29,"hasText":true,"x":248,"y":104},{"text":"alapszabály","size":38,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":76,"xoff":224,"yoff":276,"x1":112,"y1":37,"x0":-112,"y0":-29,"hasText":true,"x":154,"y":-152},{"text":"igazgatóság","size":38,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":76,"xoff":448,"yoff":276,"x1":112,"y1":37,"x0":-112,"y0":-29,"hasText":true,"x":-43,"y":169},{"text":"fióktelep","size":38,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":76,"xoff":672,"yoff":276,"x1":80,"y1":37,"x0":-80,"y0":-29,"hasText":true,"x":-91,"y":-202},{"text":"tőké","size":38,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":76,"xoff":832,"yoff":276,"x1":48,"y1":37,"x0":-48,"y0":-29,"hasText":true,"x":-81,"y":65},{"text":"részvényes","size":37,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":928,"yoff":276,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":345,"y":36},{"text":"tulajdonos","size":37,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":1120,"yoff":276,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":361,"y":67},{"text":"felügyelő","size":36,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":1312,"yoff":276,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":-248,"y":-11},{"text":"forgal","size":36,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":1472,"yoff":276,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":128,"y":4},{"text":"kockázat","size":35,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":1600,"yoff":276,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":107,"y":179},{"text":"székhely","size":35,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":1760,"yoff":276,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":27,"y":-208},{"text":"cégbíróság","size":34,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":68,"xoff":0,"yoff":352,"x1":96,"y1":33,"x0":-96,"y0":-27,"hasText":true,"x":359,"y":-84},{"text":"okirat","size":33,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":192,"yoff":352,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":349,"y":-24},{"text":"bíróság","size":33,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":288,"yoff":352,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":-184,"y":153},{"text":"tőke","size":32,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":416,"yoff":352,"x1":48,"y1":31,"x0":-48,"y0":-25,"hasText":true,"x":358,"y":-54},{"text":"társaság","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":512,"yoff":352,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-124,"y":-34},{"text":"gazdaság","size":13,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":608,"yoff":352,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":216,"y":-84},{"text":"vállalkozás","size":11,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":672,"yoff":352,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":-39,"y":-24},{"text":"pénzügy","size":11,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":736,"yoff":352,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":-250,"y":123},{"text":"befektetés","size":10,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":800,"yoff":352,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":69,"y":42},{"text":"biztosító","size":8,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":864,"yoff":352,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":24,"y":-141},{"text":"követelés","size":4,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":928,"yoff":352,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-116,"y":-111}]},{"name":"külkereskedelem","major_topic":[18],"words":[{"text":"származó","size":80,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-188,"y":-19,"width":352,"height":160,"xoff":0,"yoff":0,"x1":176,"y1":79,"x0":-176,"y0":-61,"hasText":true},{"text":"vámhatóság","size":46,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":92,"xoff":352,"yoff":0,"x1":128,"y1":45,"x0":-128,"y0":-36,"hasText":true,"x":-217,"y":71},{"text":"mennyiség","size":42,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":84,"xoff":608,"yoff":0,"x1":112,"y1":41,"x0":-112,"y0":-33,"hasText":true,"x":9,"y":-82},{"text":"adóraktár","size":36,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":832,"yoff":0,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":-142,"y":-66},{"text":"vtsz","size":34,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":68,"xoff":992,"yoff":0,"x1":48,"y1":33,"x0":-48,"y0":-24,"hasText":true,"x":-58,"y":-111},{"text":"terméktől","size":32,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1088,"yoff":0,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-53,"y":5},{"text":"eur","size":32,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":64,"xoff":1248,"yoff":0,"x1":32,"y1":31,"x0":-32,"y0":-19,"hasText":true,"x":151,"y":25},{"text":"természetes","size":30,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1312,"yoff":0,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-114,"y":121},{"text":"ország","size":29,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":1472,"yoff":0,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":83,"y":64},{"text":"anyag","size":28,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1568,"yoff":0,"x1":48,"y1":27,"x0":-48,"y0":-17,"hasText":true,"x":207,"y":64},{"text":"származás","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":1664,"yoff":0,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":45,"y":-27},{"text":"megjegyzés","size":26,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":1824,"yoff":0,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":137,"y":-109},{"text":"árucsoport","size":25,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":0,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":31,"y":-54},{"text":"textilanyag","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":128,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-107,"y":26},{"text":"korlátozás","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":256,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":235,"y":46},{"text":"lábjegyzet","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":384,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-70,"y":91},{"text":"importáló","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":512,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":201,"y":0},{"text":"szintetikus","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":608,"yoff":160,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":61,"y":10},{"text":"osztályozot","size":22,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":736,"yoff":160,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":170,"y":-44},{"text":"exportőr","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":864,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":93,"y":-12},{"text":"szállítás","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":960,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-144,"y":1},{"text":"törökország","size":21,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1056,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":235,"y":20},{"text":"előállítás","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1184,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":169,"y":83},{"text":"kereskedelm","size":20,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":1280,"yoff":160,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":78,"y":27},{"text":"készüle","size":20,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1408,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-210,"y":0},{"text":"állat","size":20,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1504,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":113,"y":-86},{"text":"felhasznál","size":19,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1568,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":137,"y":-69},{"text":"mesterséges","size":19,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":1664,"yoff":160,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":-152,"y":-119},{"text":"személygépkocs","size":18,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":36,"xoff":1792,"yoff":160,"x1":80,"y1":17,"x0":-80,"y0":-14,"hasText":true,"x":25,"y":42},{"text":"alkatrész","size":18,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":0,"yoff":208,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-24,"y":-133},{"text":"vámtarifa","size":14,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":28,"xoff":96,"yoff":208,"x1":48,"y1":13,"x0":-48,"y0":-12,"hasText":true,"x":46,"y":86},{"text":"gyártelep","size":13,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":192,"yoff":208,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":-2,"y":-114},{"text":"jövede","size":10,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":256,"yoff":208,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":210,"y":-19},{"text":"bizonyítvány","size":4,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":320,"yoff":208,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":15,"y":21},{"text":"fonal","size":2,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":352,"yoff":208,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-55,"y":8},{"text":"okmány","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":384,"yoff":208,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-92,"y":71}]},{"name":"ipar és kereskedelem","major_topic":[1,15,18],"words":[{"text":"kereskedelm","size":80,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":187,"y":-45,"width":448,"height":160,"xoff":0,"yoff":0,"x1":224,"y1":79,"x0":-224,"y0":-60,"hasText":true},{"text":"információ","size":75,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":150,"xoff":448,"yoff":0,"x1":176,"y1":74,"x0":-176,"y0":-57,"hasText":true,"x":109,"y":42},{"text":"szál","size":55,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":110,"xoff":800,"yoff":0,"x1":64,"y1":54,"x0":-64,"y0":-42,"hasText":true,"x":60,"y":-92},{"text":"nemzetköz","size":52,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":104,"xoff":928,"yoff":0,"x1":128,"y1":51,"x0":-128,"y0":-40,"hasText":true,"x":-104,"y":-16},{"text":"termék","size":50,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":100,"xoff":1184,"yoff":0,"x1":96,"y1":49,"x0":-96,"y0":-40,"hasText":true,"x":-231,"y":107},{"text":"gat","size":47,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":94,"xoff":1376,"yoff":0,"x1":48,"y1":46,"x0":-48,"y0":-33,"hasText":true,"x":97,"y":75},{"text":"fejlődő","size":46,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":92,"xoff":1472,"yoff":0,"x1":80,"y1":45,"x0":-80,"y0":-36,"hasText":true,"x":-7,"y":91},{"text":"techni","size":45,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":90,"xoff":1632,"yoff":0,"x1":80,"y1":44,"x0":-80,"y0":-35,"hasText":true,"x":176,"y":82},{"text":"wto","size":44,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":88,"xoff":1792,"yoff":0,"x1":48,"y1":43,"x0":-48,"y0":-30,"hasText":true,"x":-99,"y":116},{"text":"áru","size":43,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":86,"xoff":1888,"yoff":0,"x1":48,"y1":42,"x0":-48,"y0":-35,"hasText":true,"x":251,"y":80},{"text":"vám","size":40,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":80,"xoff":0,"yoff":160,"x1":48,"y1":39,"x0":-48,"y0":-32,"hasText":true,"x":179,"y":115},{"text":"tömeg","size":40,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":96,"yoff":160,"x1":64,"y1":39,"x0":-64,"y0":-29,"hasText":true,"x":-94,"y":-103},{"text":"mns","size":40,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":80,"xoff":224,"yoff":160,"x1":48,"y1":39,"x0":-48,"y0":-23,"hasText":true,"x":-108,"y":-50},{"text":"fonal","size":40,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":320,"yoff":160,"x1":64,"y1":39,"x0":-64,"y0":-31,"hasText":true,"x":86,"y":-2},{"text":"lábjegyzet","size":37,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":448,"yoff":160,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":321,"y":45},{"text":"vizsgálóbizottság","size":37,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":74,"xoff":640,"yoff":160,"x1":144,"y1":36,"x0":-144,"y0":-29,"hasText":true,"x":-202,"y":63},{"text":"korlátozás","size":32,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":928,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-103,"y":13},{"text":"szintetikus","size":32,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1088,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-206,"y":33},{"text":"szöv","size":31,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":62,"xoff":1248,"yoff":160,"x1":48,"y1":30,"x0":-48,"y0":-23,"hasText":true,"x":155,"y":-20},{"text":"cikkely","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":1344,"yoff":160,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":230,"y":-17},{"text":"piac","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":56,"xoff":1472,"yoff":160,"x1":32,"y1":27,"x0":-32,"y0":-23,"hasText":true,"x":173,"y":-106},{"text":"vevő","size":28,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1536,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":-5,"y":-114},{"text":"mennyiség","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":1632,"yoff":160,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":-127,"y":-81},{"text":"származás","size":26,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1792,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-138,"y":137},{"text":"mesterséges","size":26,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":0,"yoff":240,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":262,"y":-112},{"text":"exportőr","size":25,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":160,"yoff":240,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":-13,"y":117},{"text":"értékelés","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":288,"yoff":240,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":-195,"y":-59},{"text":"gazdaság","size":25,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":416,"yoff":240,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":-145,"y":-133},{"text":"termelő","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":544,"yoff":240,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-187,"y":-98},{"text":"kár","size":24,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":640,"yoff":240,"x1":32,"y1":23,"x0":-32,"y0":-20,"hasText":true,"x":-284,"y":26},{"text":"szabvány","size":24,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":704,"yoff":240,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-235,"y":131},{"text":"költség","size":24,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":832,"yoff":240,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":301,"y":-6},{"text":"felülvizsgálat","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":928,"yoff":240,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":289,"y":99},{"text":"egyezmény","size":12,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":1056,"yoff":240,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-196,"y":6},{"text":"ország","size":11,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":1120,"yoff":240,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":-60,"y":-61},{"text":"támogatás","size":6,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":12,"xoff":1184,"yoff":240,"x1":16,"y1":5,"x0":-16,"y0":-6,"hasText":true,"x":179,"y":-1},{"text":"konzultáció","size":3,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1216,"yoff":240,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":2,"y":-107},{"text":"belföld","size":2,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1248,"yoff":240,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":87,"y":91}]},{"name":"vállalkozások","major_topic":[15],"words":[{"text":"vállalkozás","size":80,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":50,"y":-29,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"létesítmény","size":79,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":416,"height":158,"xoff":384,"yoff":0,"x1":208,"y1":78,"x0":-208,"y0":-60,"hasText":true,"x":-144,"y":-92},{"text":"nemzetköz","size":74,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":148,"xoff":800,"yoff":0,"x1":176,"y1":73,"x0":-176,"y0":-55,"hasText":true,"x":218,"y":-110},{"text":"információ","size":71,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":142,"xoff":1152,"yoff":0,"x1":176,"y1":70,"x0":-176,"y0":-55,"hasText":true,"x":258,"y":26},{"text":"telephely","size":65,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":130,"xoff":1504,"yoff":0,"x1":144,"y1":64,"x0":-144,"y0":-49,"hasText":true,"x":-64,"y":-156},{"text":"biztonság","size":64,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":128,"xoff":0,"yoff":160,"x1":144,"y1":63,"x0":-144,"y0":-49,"hasText":true,"x":8,"y":22},{"text":"jövedel","size":59,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":118,"xoff":288,"yoff":160,"x1":112,"y1":58,"x0":-112,"y0":-44,"hasText":true,"x":77,"y":102},{"text":"európ","size":58,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":116,"xoff":512,"yoff":160,"x1":96,"y1":57,"x0":-96,"y0":-45,"hasText":true,"x":281,"y":-63},{"text":"adóztatható","size":57,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":114,"xoff":704,"yoff":160,"x1":144,"y1":56,"x0":-144,"y0":-44,"hasText":true,"x":282,"y":72},{"text":"beruházás","size":53,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":106,"xoff":992,"yoff":160,"x1":128,"y1":52,"x0":-128,"y0":-41,"hasText":true,"x":-211,"y":-24},{"text":"belföld","size":50,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":100,"xoff":1248,"yoff":160,"x1":80,"y1":49,"x0":-80,"y0":-39,"hasText":true,"x":-235,"y":24},{"text":"nyereség","size":50,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":100,"xoff":1408,"yoff":160,"x1":112,"y1":49,"x0":-112,"y0":-40,"hasText":true,"x":-261,"y":-155},{"text":"fegyveres","size":49,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":1632,"yoff":160,"x1":112,"y1":48,"x0":-112,"y0":-37,"hasText":true,"x":-40,"y":58},{"text":"bíró","size":48,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":96,"xoff":1856,"yoff":160,"x1":64,"y1":47,"x0":-64,"y0":-37,"hasText":true,"x":-141,"y":16},{"text":"illetőségű","size":47,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":94,"xoff":0,"yoff":278,"x1":112,"y1":46,"x0":-112,"y0":-37,"hasText":true,"x":259,"y":110},{"text":"származó","size":47,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":94,"xoff":224,"yoff":278,"x1":112,"y1":46,"x0":-112,"y0":-37,"hasText":true,"x":-242,"y":62},{"text":"választottbíróság","size":46,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":92,"xoff":448,"yoff":278,"x1":176,"y1":45,"x0":-176,"y0":-36,"hasText":true,"x":-275,"y":99},{"text":"erő","size":45,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":90,"xoff":800,"yoff":278,"x1":48,"y1":44,"x0":-48,"y0":-36,"hasText":true,"x":241,"y":-23},{"text":"út","size":43,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":86,"xoff":896,"yoff":278,"x1":32,"y1":42,"x0":-32,"y0":-35,"hasText":true,"x":-281,"y":-55},{"text":"ország","size":42,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":960,"yoff":278,"x1":80,"y1":41,"x0":-80,"y0":-33,"hasText":true,"x":62,"y":135},{"text":"vegyifegyver","size":39,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":78,"xoff":1120,"yoff":278,"x1":112,"y1":38,"x0":-112,"y0":-31,"hasText":true,"x":146,"y":-163},{"text":"társaság","size":37,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":1344,"yoff":278,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":24,"y":-207},{"text":"megsemmisítés","size":36,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":72,"xoff":1504,"yoff":278,"x1":128,"y1":35,"x0":-128,"y0":-28,"hasText":true,"x":289,"y":144},{"text":"katon","size":34,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":68,"xoff":1760,"yoff":278,"x1":48,"y1":33,"x0":-48,"y0":-27,"hasText":true,"x":-204,"y":-200},{"text":"techni","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":1856,"yoff":278,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":112,"y":-77},{"text":"mag","size":32,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":0,"yoff":372,"x1":48,"y1":31,"x0":-48,"y0":-19,"hasText":true,"x":75,"y":56},{"text":"ellenőrző","size":31,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":96,"yoff":372,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-184,"y":-66},{"text":"adóztatás","size":31,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":256,"yoff":372,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":217,"y":174},{"text":"gazdaság","size":30,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":416,"yoff":372,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":304,"y":-172},{"text":"üzlet","size":29,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":576,"yoff":372,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":-329,"y":-70},{"text":"titkárság","size":29,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":672,"yoff":372,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":141,"y":-198},{"text":"vagyon","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":800,"yoff":372,"x1":64,"y1":28,"x0":-64,"y0":-17,"hasText":true,"x":-42,"y":89},{"text":"védelm","size":28,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":928,"yoff":372,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":-345,"y":32},{"text":"egyezmény","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1024,"yoff":372,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":247,"y":-196},{"text":"szerződő","size":5,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":1152,"yoff":372,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-16,"y":95},{"text":"beruházó","size":3,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1184,"yoff":372,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-52,"y":-105},{"text":"kisebbség","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1216,"yoff":372,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":65,"y":-98},{"text":"állampolgár","size":2,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1248,"yoff":372,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":215,"y":-121}]},{"name":"államigazgatás és fegyveres testületek","major_topic":[12,16,20],"words":[{"text":"katon","size":80,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":32,"y":86,"width":224,"height":160,"xoff":0,"yoff":0,"x1":112,"y1":79,"x0":-112,"y0":-60,"hasText":true},{"text":"vezető","size":69,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":138,"xoff":224,"yoff":0,"x1":112,"y1":68,"x0":-112,"y0":-53,"hasText":true,"x":-26,"y":-41},{"text":"szabadalm","size":65,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":130,"xoff":448,"yoff":0,"x1":160,"y1":64,"x0":-160,"y0":-49,"hasText":true,"x":-236,"y":-29},{"text":"állomány","size":52,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":104,"xoff":768,"yoff":0,"x1":112,"y1":51,"x0":-112,"y0":-41,"hasText":true,"x":-21,"y":2},{"text":"ügyészség","size":51,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":102,"xoff":992,"yoff":0,"x1":128,"y1":50,"x0":-128,"y0":-40,"hasText":true,"x":230,"y":48},{"text":"beosztás","size":44,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":88,"xoff":1248,"yoff":0,"x1":96,"y1":43,"x0":-96,"y0":-35,"hasText":true,"x":221,"y":96},{"text":"kamar","size":43,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":1440,"yoff":0,"x1":80,"y1":42,"x0":-80,"y0":-33,"hasText":true,"x":14,"y":113},{"text":"igazságügy","size":40,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":80,"xoff":1600,"yoff":0,"x1":112,"y1":39,"x0":-112,"y0":-32,"hasText":true,"x":38,"y":147},{"text":"nemzetbiztonság","size":40,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":80,"xoff":0,"yoff":160,"x1":144,"y1":39,"x0":-144,"y0":-32,"hasText":true,"x":-66,"y":-132},{"text":"képviselő","size":35,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":288,"yoff":160,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":128,"y":-96},{"text":"közgyűlés","size":32,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":448,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-107,"y":51},{"text":"irod","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":608,"yoff":160,"x1":48,"y1":31,"x0":-48,"y0":-25,"hasText":true,"x":-69,"y":79},{"text":"hegyközség","size":30,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":704,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":138,"y":4},{"text":"alkalmazot","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":864,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":195,"y":-71},{"text":"jelölt","size":29,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":1024,"yoff":160,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":126,"y":-21},{"text":"hadköteles","size":28,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":1120,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":211,"y":-27},{"text":"minősítés","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1280,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":239,"y":-108},{"text":"fizetés","size":27,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1408,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":260,"y":119},{"text":"fegyveres","size":26,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1504,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-98,"y":98},{"text":"legfőbb","size":26,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1632,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":243,"y":6},{"text":"önkormányzat","size":26,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":1728,"yoff":160,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":-179,"y":-7},{"text":"közigazgatás","size":26,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":0,"yoff":230,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":160,"y":116},{"text":"határidő","size":26,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":160,"yoff":230,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-91,"y":125},{"text":"bor","size":25,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":256,"yoff":230,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":73,"y":-61},{"text":"főváros","size":24,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":320,"yoff":230,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-112,"y":20},{"text":"polgár","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":416,"yoff":230,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-215,"y":14},{"text":"megbízatás","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":512,"yoff":230,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-2,"y":-101},{"text":"hatáskör","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":640,"yoff":230,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":79,"y":39},{"text":"szolgálat","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":736,"yoff":230,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-223,"y":37},{"text":"bíróság","size":13,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":832,"yoff":230,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":-80,"y":138},{"text":"választás","size":10,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":896,"yoff":230,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":-169,"y":23},{"text":"fegyelm","size":9,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":960,"yoff":230,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":127,"y":73},{"text":"hivatásos","size":6,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":12,"xoff":1024,"yoff":230,"x1":16,"y1":5,"x0":-16,"y0":-6,"hasText":true,"x":71,"y":11},{"text":"munkáltató","size":3,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1056,"yoff":230,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":107,"y":-79},{"text":"alapszabály","size":3,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1088,"yoff":230,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-223,"y":-67},{"text":"parancsn","size":2,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1120,"yoff":230,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-1,"y":-30},{"text":"kinevezés","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1152,"yoff":230,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":225,"y":-127}]},{"name":"oktatás","major_topic":[6],"words":[{"text":"iskol","size":80,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-159,"y":-53,"width":192,"height":160,"xoff":0,"yoff":0,"x1":96,"y1":79,"x0":-96,"y0":-60,"hasText":true},{"text":"polgár","size":70,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":140,"xoff":192,"yoff":0,"x1":112,"y1":69,"x0":-112,"y0":-53,"hasText":true,"x":-157,"y":-115},{"text":"támogatás","size":66,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":132,"xoff":416,"yoff":0,"x1":160,"y1":65,"x0":-160,"y0":-51,"hasText":true,"x":39,"y":76},{"text":"tanuló","size":60,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":120,"xoff":736,"yoff":0,"x1":96,"y1":59,"x0":-96,"y0":-47,"hasText":true,"x":107,"y":24},{"text":"jogviszony","size":52,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":104,"xoff":928,"yoff":0,"x1":128,"y1":51,"x0":-128,"y0":-40,"hasText":true,"x":-59,"y":-4},{"text":"képzés","size":51,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":102,"xoff":1184,"yoff":0,"x1":96,"y1":50,"x0":-96,"y0":-40,"hasText":true,"x":151,"y":-109},{"text":"szülő","size":51,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":102,"xoff":1376,"yoff":0,"x1":80,"y1":50,"x0":-80,"y0":-39,"hasText":true,"x":43,"y":-35},{"text":"szolgálat","size":49,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":1536,"yoff":0,"x1":112,"y1":48,"x0":-112,"y0":-39,"hasText":true,"x":-170,"y":89},{"text":"nevelés","size":48,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":96,"xoff":1760,"yoff":0,"x1":96,"y1":47,"x0":-96,"y0":-37,"hasText":true,"x":-29,"y":118},{"text":"közoktatás","size":46,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":92,"xoff":0,"yoff":160,"x1":112,"y1":45,"x0":-112,"y0":-36,"hasText":true,"x":-195,"y":45},{"text":"felsőoktatás","size":46,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":92,"xoff":224,"yoff":160,"x1":128,"y1":45,"x0":-128,"y0":-36,"hasText":true,"x":-334,"y":-73},{"text":"főváros","size":43,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":480,"yoff":160,"x1":80,"y1":42,"x0":-80,"y0":-35,"hasText":true,"x":-1,"y":-75},{"text":"egészségügy","size":42,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":84,"xoff":640,"yoff":160,"x1":128,"y1":41,"x0":-128,"y0":-33,"hasText":true,"x":203,"y":-55},{"text":"vezető","size":41,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":82,"xoff":896,"yoff":160,"x1":80,"y1":40,"x0":-80,"y0":-33,"hasText":true,"x":16,"y":-111},{"text":"önkormányzat","size":41,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":82,"xoff":1056,"yoff":160,"x1":128,"y1":40,"x0":-128,"y0":-33,"hasText":true,"x":32,"y":149},{"text":"oktatás","size":40,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":80,"xoff":1312,"yoff":160,"x1":80,"y1":39,"x0":-80,"y0":-32,"hasText":true,"x":205,"y":-150},{"text":"foglalkoztatás","size":38,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":76,"xoff":1472,"yoff":160,"x1":112,"y1":37,"x0":-112,"y0":-29,"hasText":true,"x":27,"y":-151},{"text":"szakképzés","size":37,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":1696,"yoff":160,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":50,"y":-182},{"text":"társadalombiztosítás","size":36,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":72,"xoff":0,"yoff":252,"x1":160,"y1":35,"x0":-160,"y0":-28,"hasText":true,"x":202,"y":105},{"text":"öregség","size":36,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":320,"yoff":252,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":280,"y":-118},{"text":"munkavállaló","size":36,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":72,"xoff":480,"yoff":252,"x1":112,"y1":35,"x0":-112,"y0":-28,"hasText":true,"x":-11,"y":178},{"text":"munkáltató","size":35,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":704,"yoff":252,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":-234,"y":-23},{"text":"hallgató","size":35,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":896,"yoff":252,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":-186,"y":125},{"text":"keret","size":34,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":68,"xoff":1024,"yoff":252,"x1":48,"y1":33,"x0":-48,"y0":-27,"hasText":true,"x":-216,"y":-155},{"text":"rokkantság","size":34,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":68,"xoff":1120,"yoff":252,"x1":96,"y1":33,"x0":-96,"y0":-27,"hasText":true,"x":221,"y":133},{"text":"baleset","size":33,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":1312,"yoff":252,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":223,"y":-26},{"text":"hozzájárulás","size":31,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":62,"xoff":1440,"yoff":252,"x1":96,"y1":30,"x0":-96,"y0":-24,"hasText":true,"x":171,"y":177},{"text":"foglalkozás","size":30,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1632,"yoff":252,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-170,"y":164},{"text":"köztisztviselő","size":29,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":58,"xoff":1792,"yoff":252,"x1":96,"y1":28,"x0":-96,"y0":-23,"hasText":true,"x":240,"y":72},{"text":"szociális","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":0,"yoff":324,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":-208,"y":2},{"text":"család","size":29,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":128,"yoff":324,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":-3,"y":33},{"text":"munkanélkül","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":224,"yoff":324,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":-23,"y":203},{"text":"biztosítot","size":28,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":384,"yoff":324,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":218,"y":48},{"text":"óvod","size":27,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":512,"yoff":324,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":297,"y":42},{"text":"segély","size":27,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":608,"yoff":324,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":132,"y":-24},{"text":"gyerm","size":11,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":704,"yoff":324,"x1":32,"y1":10,"x0":-32,"y0":-8,"hasText":true,"x":-161,"y":56},{"text":"intézmény","size":1,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":768,"yoff":324,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":202,"y":108},{"text":"nyugdíj","size":0,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":800,"yoff":324,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":205,"y":93},{"text":"munkaügy","size":0,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":832,"yoff":324,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-151,"y":21}]},{"name":"mezőgazdaság, természet és egészség","major_topic":[3,4,7,21],"words":[{"text":"egészségügy","size":80,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":218,"y":74,"width":448,"height":160,"xoff":0,"yoff":0,"x1":224,"y1":79,"x0":-224,"y0":-61,"hasText":true},{"text":"védelm","size":79,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":158,"xoff":448,"yoff":0,"x1":144,"y1":78,"x0":-144,"y0":-60,"hasText":true,"x":85,"y":-32},{"text":"védet","size":62,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":124,"xoff":736,"yoff":0,"x1":96,"y1":61,"x0":-96,"y0":-48,"hasText":true,"x":-53,"y":-87},{"text":"anyag","size":57,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":114,"xoff":928,"yoff":0,"x1":96,"y1":56,"x0":-96,"y0":-32,"hasText":true,"x":-90,"y":-51},{"text":"település","size":48,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":96,"xoff":1120,"yoff":0,"x1":96,"y1":47,"x0":-96,"y0":-37,"hasText":true,"x":-180,"y":89},{"text":"beteg","size":48,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":96,"xoff":1312,"yoff":0,"x1":80,"y1":47,"x0":-80,"y0":-36,"hasText":true,"x":-215,"y":-70},{"text":"vadászat","size":48,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":96,"xoff":1472,"yoff":0,"x1":96,"y1":47,"x0":-96,"y0":-37,"hasText":true,"x":-224,"y":31},{"text":"terv","size":44,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":88,"xoff":1664,"yoff":0,"x1":48,"y1":43,"x0":-48,"y0":-30,"hasText":true,"x":-201,"y":-7},{"text":"tulajdonos","size":42,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":84,"xoff":1760,"yoff":0,"x1":112,"y1":41,"x0":-112,"y0":-32,"hasText":true,"x":132,"y":12},{"text":"testül","size":40,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":0,"yoff":160,"x1":64,"y1":39,"x0":-64,"y0":-31,"hasText":true,"x":194,"y":105},{"text":"önkormányzat","size":38,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":76,"xoff":128,"yoff":160,"x1":128,"y1":37,"x0":-128,"y0":-29,"hasText":true,"x":-227,"y":-107},{"text":"műsorszolgáltatás","size":38,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":76,"xoff":384,"yoff":160,"x1":144,"y1":37,"x0":-144,"y0":-29,"hasText":true,"x":328,"y":-16},{"text":"fogyasztó","size":35,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":672,"yoff":160,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":68,"y":113},{"text":"kutatás","size":34,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":832,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":-72,"y":-136},{"text":"erdő","size":33,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":960,"yoff":160,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":49,"y":-105},{"text":"létesítmény","size":33,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":66,"xoff":1056,"yoff":160,"x1":96,"y1":32,"x0":-96,"y0":-25,"hasText":true,"x":-32,"y":-10},{"text":"erdészet","size":32,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1248,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-165,"y":120},{"text":"természetes","size":31,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":62,"xoff":1376,"yoff":160,"x1":96,"y1":30,"x0":-96,"y0":-24,"hasText":true,"x":187,"y":-92},{"text":"építés","size":29,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":1568,"yoff":160,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":-17,"y":84},{"text":"műsorszolgáltató","size":28,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":56,"xoff":1664,"yoff":160,"x1":112,"y1":27,"x0":-112,"y0":-23,"hasText":true,"x":325,"y":10},{"text":"forgal","size":27,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1888,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-33,"y":60},{"text":"területfejlesztés","size":26,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":52,"xoff":0,"yoff":236,"x1":96,"y1":25,"x0":-96,"y0":-21,"hasText":true,"x":-320,"y":53},{"text":"nemzetköz","size":26,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":192,"yoff":236,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-62,"y":12},{"text":"szolgáltató","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":320,"yoff":236,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":137,"y":-118},{"text":"műszak","size":26,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":448,"yoff":236,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-257,"y":110},{"text":"fejlesztés","size":25,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":544,"yoff":236,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":153,"y":-143},{"text":"bírság","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":672,"yoff":236,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-219,"y":-47},{"text":"ember","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":768,"yoff":236,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-162,"y":-130},{"text":"költség","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":864,"yoff":236,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-77,"y":111},{"text":"környezetvédelm","size":4,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":960,"yoff":236,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-168,"y":-47},{"text":"hozzájárulás","size":3,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":992,"yoff":236,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":199,"y":29},{"text":"halászat","size":3,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1024,"yoff":236,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":242,"y":99},{"text":"állat","size":3,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1056,"yoff":236,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":58,"y":-18},{"text":"természetvédelm","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1088,"yoff":236,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-203,"y":-102}]},{"name":"költségvetési kiadások","major_topic":[1],"words":[{"text":"hozzájárulás","size":80,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-116,"y":-44,"width":448,"height":160,"xoff":0,"yoff":0,"x1":224,"y1":79,"x0":-224,"y0":-61,"hasText":true},{"text":"minisztériu","size":68,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":136,"xoff":448,"yoff":0,"x1":160,"y1":67,"x0":-160,"y0":-52,"hasText":true,"x":61,"y":19},{"text":"béralap","size":63,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":126,"xoff":768,"yoff":0,"x1":112,"y1":62,"x0":-112,"y0":-49,"hasText":true,"x":187,"y":-39},{"text":"forin","size":63,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":126,"xoff":992,"yoff":0,"x1":80,"y1":62,"x0":-80,"y0":-48,"hasText":true,"x":87,"y":-120},{"text":"kiadás","size":62,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":124,"xoff":1152,"yoff":0,"x1":112,"y1":61,"x0":-112,"y0":-48,"hasText":true,"x":-84,"y":-107},{"text":"kezelésű","size":60,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":120,"xoff":1376,"yoff":0,"x1":128,"y1":59,"x0":-128,"y0":-47,"hasText":true,"x":-261,"y":-106},{"text":"költségvetés","size":54,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":108,"xoff":1632,"yoff":0,"x1":160,"y1":53,"x0":-160,"y0":-42,"hasText":true,"x":-165,"y":101},{"text":"oktatás","size":53,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":106,"xoff":0,"yoff":160,"x1":96,"y1":52,"x0":-96,"y0":-41,"hasText":true,"x":21,"y":61},{"text":"kormányzat","size":50,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":100,"xoff":192,"yoff":160,"x1":128,"y1":49,"x0":-128,"y0":-40,"hasText":true,"x":226,"y":-90},{"text":"pénzeszközátvétel","size":47,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":384,"height":94,"xoff":448,"yoff":160,"x1":192,"y1":46,"x0":-192,"y0":-37,"hasText":true,"x":-50,"y":144},{"text":"hitel","size":45,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":90,"xoff":832,"yoff":160,"x1":64,"y1":44,"x0":-64,"y0":-35,"hasText":true,"x":18,"y":106},{"text":"fejlesztés","size":45,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":90,"xoff":960,"yoff":160,"x1":96,"y1":44,"x0":-96,"y0":-36,"hasText":true,"x":-165,"y":8},{"text":"igazgatás","size":44,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":88,"xoff":1152,"yoff":160,"x1":96,"y1":43,"x0":-96,"y0":-35,"hasText":true,"x":-136,"y":-162},{"text":"iskol","size":42,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":84,"xoff":1344,"yoff":160,"x1":64,"y1":41,"x0":-64,"y0":-32,"hasText":true,"x":-188,"y":58},{"text":"terhelő","size":42,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1472,"yoff":160,"x1":80,"y1":41,"x0":-80,"y0":-33,"hasText":true,"x":208,"y":-131},{"text":"átadás","size":42,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1632,"yoff":160,"x1":80,"y1":41,"x0":-80,"y0":-33,"hasText":true,"x":156,"y":61},{"text":"építés","size":39,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":78,"xoff":1792,"yoff":160,"x1":64,"y1":38,"x0":-64,"y0":-32,"hasText":true,"x":102,"y":100},{"text":"támogatás","size":37,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":0,"yoff":260,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":267,"y":-1},{"text":"járulék","size":37,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":74,"xoff":192,"yoff":260,"x1":64,"y1":36,"x0":-64,"y0":-29,"hasText":true,"x":-262,"y":133},{"text":"normatív","size":36,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":320,"yoff":260,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":-39,"y":173},{"text":"munkaadó","size":35,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":480,"yoff":260,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":298,"y":33},{"text":"szociális","size":35,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":672,"yoff":260,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":-286,"y":32},{"text":"alapítvány","size":35,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":832,"yoff":260,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":-311,"y":-9},{"text":"kincstár","size":32,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":992,"yoff":260,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":320,"y":-60},{"text":"intézmény","size":29,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1120,"yoff":260,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-358,"y":-79},{"text":"település","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1280,"yoff":260,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-103,"y":49},{"text":"társadalombiztosítás","size":20,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":40,"xoff":1408,"yoff":260,"x1":96,"y1":19,"x0":-96,"y0":-16,"hasText":true,"x":241,"y":80},{"text":"járule","size":18,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":1600,"yoff":260,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":69,"y":-23},{"text":"felhalmozás","size":17,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":1664,"yoff":260,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":313,"y":-34},{"text":"juttatás","size":15,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":1760,"yoff":260,"x1":32,"y1":14,"x0":-32,"y0":-13,"hasText":true,"x":44,"y":160},{"text":"előirányzat","size":12,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":1824,"yoff":260,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-101,"y":19},{"text":"felújítás","size":12,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":1888,"yoff":260,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-252,"y":56},{"text":"önkormányzat","size":12,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":24,"xoff":0,"yoff":334,"x1":48,"y1":11,"x0":-48,"y0":-10,"hasText":true,"x":276,"y":52},{"text":"rekonstrukció","size":5,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":10,"xoff":96,"yoff":334,"x1":32,"y1":4,"x0":-32,"y0":-5,"hasText":true,"x":-48,"y":26},{"text":"kórház","size":3,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":160,"yoff":334,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-228,"y":63},{"text":"beruházás","size":2,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":192,"yoff":334,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":242,"y":102},{"text":"város","size":2,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":224,"yoff":334,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-42,"y":-2}]}]},{"id":"1998-2002","topics":[{"name":"igazságügyi rendszer és felügyelet","major_topic":[12],"words":[{"text":"pénzügy","size":80,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":217,"y":65,"width":320,"height":160,"xoff":0,"yoff":0,"x1":160,"y1":79,"x0":-160,"y0":-61,"hasText":true},{"text":"bűncselekmény","size":71,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":480,"height":142,"xoff":320,"yoff":0,"x1":240,"y1":70,"x0":-240,"y0":-55,"hasText":true,"x":260,"y":4},{"text":"ügyész","size":67,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":134,"xoff":800,"yoff":0,"x1":112,"y1":66,"x0":-112,"y0":-52,"hasText":true,"x":-42,"y":98},{"text":"értékpapír","size":67,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":134,"xoff":1024,"yoff":0,"x1":160,"y1":66,"x0":-160,"y0":-52,"hasText":true,"x":-151,"y":-31},{"text":"vállalkozás","size":57,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":114,"xoff":1344,"yoff":0,"x1":144,"y1":56,"x0":-144,"y0":-44,"hasText":true,"x":175,"y":-110},{"text":"felügyelet","size":54,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":108,"xoff":1632,"yoff":0,"x1":128,"y1":53,"x0":-128,"y0":-41,"hasText":true,"x":217,"y":-68},{"text":"szolgáltató","size":54,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":108,"xoff":0,"yoff":160,"x1":128,"y1":53,"x0":-128,"y0":-42,"hasText":true,"x":56,"y":-156},{"text":"konzul","size":51,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":102,"xoff":256,"yoff":160,"x1":80,"y1":50,"x0":-80,"y0":-39,"hasText":true,"x":23,"y":-77},{"text":"tárgyalás","size":43,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":86,"xoff":416,"yoff":160,"x1":96,"y1":42,"x0":-96,"y0":-35,"hasText":true,"x":-119,"y":-95},{"text":"szabadságvesztés","size":42,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":84,"xoff":608,"yoff":160,"x1":176,"y1":41,"x0":-176,"y0":-33,"hasText":true,"x":315,"y":-157},{"text":"vezető","size":34,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":960,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":16,"y":-118},{"text":"nyomozás","size":32,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1088,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":382,"y":-59},{"text":"hpt","size":31,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":62,"xoff":1248,"yoff":160,"x1":32,"y1":30,"x0":-32,"y0":-24,"hasText":true,"x":146,"y":103},{"text":"vétel","size":30,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":1312,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-197,"y":96},{"text":"forgal","size":30,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":1408,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":153,"y":-42},{"text":"büntetés","size":30,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":1504,"yoff":160,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":-272,"y":106},{"text":"irat","size":28,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":56,"xoff":1632,"yoff":160,"x1":32,"y1":27,"x0":-32,"y0":-23,"hasText":true,"x":-4,"y":-50},{"text":"kibocsátó","size":27,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1696,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":68,"y":-52},{"text":"végzés","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1824,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-31,"y":15},{"text":"büntetőeljárás","size":26,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":0,"yoff":262,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":-138,"y":5},{"text":"út","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":160,"yoff":262,"x1":32,"y1":25,"x0":-32,"y0":-21,"hasText":true,"x":14,"y":30},{"text":"társaság","size":26,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":224,"yoff":262,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":18,"y":120},{"text":"nyomozó","size":26,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":352,"yoff":262,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-89,"y":-133},{"text":"cselekmény","size":25,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":480,"yoff":262,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":144,"y":126},{"text":"intézmény","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":640,"yoff":262,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":39,"y":59},{"text":"hitelintéz","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":768,"yoff":262,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":-81,"y":133},{"text":"alapkezelő","size":25,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":896,"yoff":262,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":344,"y":-111},{"text":"európ","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1024,"yoff":262,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-105,"y":49},{"text":"székhely","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1120,"yoff":262,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-170,"y":65},{"text":"indítvány","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1216,"yoff":262,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":209,"y":103},{"text":"tulajdonos","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1344,"yoff":262,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-125,"y":28},{"text":"bíróság","size":20,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1472,"yoff":262,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":290,"y":-50},{"text":"befektetés","size":15,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":1568,"yoff":262,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":-41,"y":40},{"text":"külföld","size":3,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1664,"yoff":262,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-74,"y":-25},{"text":"szabálysértés","size":3,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1696,"yoff":262,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":190,"y":109},{"text":"tanú","size":3,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1728,"yoff":262,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-156,"y":-16},{"text":"elszámolóház","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1760,"yoff":262,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":239,"y":-42},{"text":"btk","size":0,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1792,"yoff":262,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":175,"y":89}]},{"name":"nemzetközi egyezmények","major_topic":[18,19],"words":[{"text":"egyezmény","size":80,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":146,"y":-43,"width":416,"height":160,"xoff":0,"yoff":0,"x1":208,"y1":79,"x0":-208,"y0":-61,"hasText":true},{"text":"stat","size":68,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":136,"xoff":416,"yoff":0,"x1":80,"y1":67,"x0":-80,"y0":-46,"hasText":true,"x":-49,"y":81},{"text":"convent","size":64,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":128,"xoff":576,"yoff":0,"x1":128,"y1":63,"x0":-128,"y0":-43,"hasText":true,"x":-6,"y":33},{"text":"európ","size":46,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":92,"xoff":832,"yoff":0,"x1":80,"y1":45,"x0":-80,"y0":-36,"hasText":true,"x":91,"y":84},{"text":"agreemen","size":45,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":90,"xoff":992,"yoff":0,"x1":112,"y1":44,"x0":-112,"y0":-26,"hasText":true,"x":234,"y":3},{"text":"europ","size":40,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":1216,"yoff":0,"x1":64,"y1":39,"x0":-64,"y0":-23,"hasText":true,"x":182,"y":-92},{"text":"ország","size":33,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":1344,"yoff":0,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":-197,"y":-103},{"text":"treaty","size":33,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":1472,"yoff":0,"x1":48,"y1":32,"x0":-48,"y0":-23,"hasText":true,"x":134,"y":47},{"text":"energy","size":33,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":1568,"yoff":0,"x1":64,"y1":32,"x0":-64,"y0":-19,"hasText":true,"x":93,"y":-101},{"text":"international","size":31,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":62,"xoff":1696,"yoff":0,"x1":96,"y1":30,"x0":-96,"y0":-24,"hasText":true,"x":-215,"y":102},{"text":"informat","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1888,"yoff":0,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":217,"y":-117},{"text":"council","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":0,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":229,"y":119},{"text":"general","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":96,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-140,"y":54},{"text":"accordanc","size":27,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":224,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-221,"y":-56},{"text":"protocol","size":26,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":352,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":134,"y":-130},{"text":"charter","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":448,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":39,"y":53},{"text":"nemzetköz","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":544,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":99,"y":123},{"text":"unit","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":672,"yoff":160,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":-210,"y":-37},{"text":"committe","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":736,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-220,"y":14},{"text":"access","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":832,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-14,"hasText":true,"x":-1,"y":97},{"text":"nyelv","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":928,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-44,"y":-56},{"text":"national","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":992,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-249,"y":-123},{"text":"measures","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1088,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-14,"hasText":true,"x":9,"y":-92},{"text":"letét","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":1184,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":127,"y":27},{"text":"member","size":21,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1248,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-161,"y":-17},{"text":"governmen","size":21,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1344,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-13,"hasText":true,"x":-167,"y":74},{"text":"persons","size":20,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1472,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-12,"hasText":true,"x":104,"y":-27},{"text":"főtitkár","size":20,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1568,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":155,"y":104},{"text":"anyag","size":20,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1664,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-12,"hasText":true,"x":-81,"y":-9},{"text":"appropriat","size":20,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1728,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":34,"y":-121},{"text":"ratificat","size":19,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1824,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":112,"y":-5},{"text":"okmány","size":18,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1920,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":193,"y":58},{"text":"contracting","size":9,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":0,"yoff":216,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":72,"y":-89},{"text":"parties","size":7,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":14,"xoff":64,"yoff":216,"x1":16,"y1":6,"x0":-16,"y0":-6,"hasText":true,"x":45,"y":-20},{"text":"csatlakozás","size":1,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":96,"yoff":216,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-143,"y":-57},{"text":"presen","size":1,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":128,"yoff":216,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":47,"y":58},{"text":"territory","size":0,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":160,"yoff":216,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-120,"y":81},{"text":"szerződő","size":0,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":192,"yoff":216,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":132,"y":-52}]},{"name":"vállalkozások és közlekedés","major_topic":[10,15],"words":[{"text":"adóztatható","size":80,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-111,"y":-80,"width":416,"height":160,"xoff":0,"yoff":0,"x1":208,"y1":79,"x0":-208,"y0":-61,"hasText":true},{"text":"szerződő","size":78,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":156,"xoff":416,"yoff":0,"x1":160,"y1":77,"x0":-160,"y0":-60,"hasText":true,"x":226,"y":9},{"text":"származó","size":71,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":142,"xoff":736,"yoff":0,"x1":160,"y1":70,"x0":-160,"y0":-55,"hasText":true,"x":-33,"y":3},{"text":"társaság","size":67,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":134,"xoff":1056,"yoff":0,"x1":144,"y1":66,"x0":-144,"y0":-52,"hasText":true,"x":-29,"y":72},{"text":"adóztatás","size":53,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":106,"xoff":1344,"yoff":0,"x1":128,"y1":52,"x0":-128,"y0":-41,"hasText":true,"x":-170,"y":-143},{"text":"nemzetköz","size":48,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":96,"xoff":1600,"yoff":0,"x1":128,"y1":47,"x0":-128,"y0":-36,"hasText":true,"x":-197,"y":-39},{"text":"osztale","size":48,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":96,"xoff":1856,"yoff":0,"x1":80,"y1":47,"x0":-80,"y0":-36,"hasText":true,"x":140,"y":52},{"text":"üzlet","size":47,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":94,"xoff":0,"yoff":160,"x1":64,"y1":46,"x0":-64,"y0":-36,"hasText":true,"x":-77,"y":118},{"text":"vagyon","size":45,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":90,"xoff":128,"yoff":160,"x1":80,"y1":44,"x0":-80,"y0":-26,"hasText":true,"x":-220,"y":-12},{"text":"jogdíj","size":43,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":86,"xoff":288,"yoff":160,"x1":64,"y1":42,"x0":-64,"y0":-34,"hasText":true,"x":-6,"y":-140},{"text":"fizet","size":41,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":82,"xoff":416,"yoff":160,"x1":48,"y1":40,"x0":-48,"y0":-32,"hasText":true,"x":216,"y":93},{"text":"tekintendő","size":39,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":78,"xoff":512,"yoff":160,"x1":96,"y1":38,"x0":-96,"y0":-31,"hasText":true,"x":14,"y":-175},{"text":"bázis","size":38,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":76,"xoff":704,"yoff":160,"x1":64,"y1":37,"x0":-64,"y0":-29,"hasText":true,"x":97,"y":-82},{"text":"kereskedelm","size":38,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":76,"xoff":832,"yoff":160,"x1":112,"y1":37,"x0":-112,"y0":-29,"hasText":true,"x":-240,"y":26},{"text":"út","size":37,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":74,"xoff":1056,"yoff":160,"x1":32,"y1":36,"x0":-32,"y0":-29,"hasText":true,"x":232,"y":-121},{"text":"járműv","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":1120,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":-163,"y":108},{"text":"ingatl","size":32,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":1248,"yoff":160,"x1":48,"y1":31,"x0":-48,"y0":-25,"hasText":true,"x":-320,"y":-12},{"text":"akár","size":31,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":62,"xoff":1344,"yoff":160,"x1":48,"y1":30,"x0":-48,"y0":-24,"hasText":true,"x":66,"y":-58},{"text":"mag","size":31,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":62,"xoff":1440,"yoff":160,"x1":48,"y1":30,"x0":-48,"y0":-18,"hasText":true,"x":-29,"y":30},{"text":"chart","size":30,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":1536,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-70,"y":-54},{"text":"hajó","size":27,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":54,"xoff":1632,"yoff":160,"x1":32,"y1":26,"x0":-32,"y0":-21,"hasText":true,"x":199,"y":-110},{"text":"állampolgár","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":1696,"yoff":160,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":259,"y":32},{"text":"adózás","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":1856,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-168,"y":60},{"text":"kamat","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":0,"yoff":250,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":17,"y":95},{"text":"jövedelm","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":96,"yoff":250,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":100,"y":-120},{"text":"egyezmény","size":16,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":192,"yoff":250,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":-78,"y":132},{"text":"vállalkozás","size":13,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":26,"xoff":288,"yoff":250,"x1":48,"y1":12,"x0":-48,"y0":-12,"hasText":true,"x":114,"y":84},{"text":"belföld","size":11,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":384,"yoff":250,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":209,"y":109},{"text":"illetőségű","size":10,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":448,"yoff":250,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":240,"y":-78},{"text":"telephely","size":10,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":512,"yoff":250,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":202,"y":-40},{"text":"nyereség","size":9,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":576,"yoff":250,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":96,"y":66},{"text":"bíró","size":5,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":640,"yoff":250,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-178,"y":88},{"text":"térítés","size":2,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":672,"yoff":250,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-25,"y":88},{"text":"lég","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":704,"yoff":250,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-107,"y":64}]},{"name":"ipar és kereskedelem","major_topic":[1,15,18],"words":[{"text":"származó","size":80,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-211,"y":-41,"width":352,"height":160,"xoff":0,"yoff":0,"x1":176,"y1":79,"x0":-176,"y0":-61,"hasText":true},{"text":"osztályozot","size":68,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":136,"xoff":352,"yoff":0,"x1":176,"y1":67,"x0":-176,"y0":-52,"hasText":true,"x":140,"y":7},{"text":"beszámoló","size":53,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":106,"xoff":704,"yoff":0,"x1":128,"y1":52,"x0":-128,"y0":-41,"hasText":true,"x":177,"y":-47},{"text":"terméktől","size":49,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":960,"yoff":0,"x1":112,"y1":48,"x0":-112,"y0":-39,"hasText":true,"x":-174,"y":-94},{"text":"lábjegyzet","size":49,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":1184,"yoff":0,"x1":112,"y1":48,"x0":-112,"y0":-39,"hasText":true,"x":49,"y":46},{"text":"mérleg","size":46,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":92,"xoff":1408,"yoff":0,"x1":80,"y1":45,"x0":-80,"y0":-36,"hasText":true,"x":217,"y":45},{"text":"szál","size":46,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":92,"xoff":1568,"yoff":0,"x1":64,"y1":45,"x0":-64,"y0":-36,"hasText":true,"x":-192,"y":68},{"text":"textilanyag","size":40,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":80,"xoff":1696,"yoff":0,"x1":96,"y1":39,"x0":-96,"y0":-31,"hasText":true,"x":-87,"y":-5},{"text":"ország","size":39,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":78,"xoff":1888,"yoff":0,"x1":64,"y1":38,"x0":-64,"y0":-32,"hasText":true,"x":126,"y":74},{"text":"vállalkozás","size":38,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":0,"yoff":160,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":-115,"y":-134},{"text":"megjegyzés","size":35,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":192,"yoff":160,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":20,"y":-89},{"text":"gazdaság","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":384,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-14,"y":-37},{"text":"anyag","size":28,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":544,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-17,"hasText":true,"x":-3,"y":-117},{"text":"árucsoport","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":640,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":-10,"y":74},{"text":"természetes","size":27,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":800,"yoff":160,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":-134,"y":31},{"text":"állat","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":960,"yoff":160,"x1":32,"y1":25,"x0":-32,"y0":-21,"hasText":true,"x":-217,"y":-123},{"text":"részesedés","size":26,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":1024,"yoff":160,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":180,"y":105},{"text":"kimutatn","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1184,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":220,"y":83},{"text":"bevezető","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1312,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-304,"y":-109},{"text":"konszolidál","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1440,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":85,"y":-118},{"text":"vállalkozó","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":1568,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":-219,"y":9},{"text":"vtsz","size":25,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":1696,"yoff":160,"x1":32,"y1":24,"x0":-32,"y0":-18,"hasText":true,"x":62,"y":90},{"text":"eredmény","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1760,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":156,"y":-91},{"text":"ráfordítás","size":23,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1888,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-211,"y":-17},{"text":"felhasználható","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":0,"yoff":230,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":-261,"y":35},{"text":"okmány","size":23,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":160,"yoff":230,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-108,"y":97},{"text":"költség","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":256,"yoff":230,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-1,"y":96},{"text":"pénzügy","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":352,"yoff":230,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-16,"y":-61},{"text":"egyszerűsítet","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":448,"yoff":230,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":51,"y":117},{"text":"származás","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":576,"yoff":230,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":-211,"y":90},{"text":"előállítás","size":20,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":704,"yoff":230,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-305,"y":1},{"text":"vámtarifa","size":14,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":28,"xoff":800,"yoff":230,"x1":48,"y1":13,"x0":-48,"y0":-12,"hasText":true,"x":221,"y":-34},{"text":"gyártelep","size":12,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":896,"yoff":230,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":183,"y":-112},{"text":"üzlet","size":4,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":960,"yoff":230,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-129,"y":-89},{"text":"társaság","size":3,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":992,"yoff":230,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":94,"y":-43},{"text":"től","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1024,"yoff":230,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":113,"y":-113}]},{"name":"költségvetés, adó","major_topic":[1],"words":[{"text":"vállalkozó","size":80,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-56,"y":44,"width":352,"height":160,"xoff":0,"yoff":0,"x1":176,"y1":79,"x0":-176,"y0":-61,"hasText":true},{"text":"biztosítás","size":79,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":158,"xoff":352,"yoff":0,"x1":176,"y1":78,"x0":-176,"y0":-60,"hasText":true,"x":206,"y":110},{"text":"köztisztviselő","size":74,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":416,"height":148,"xoff":704,"yoff":0,"x1":208,"y1":73,"x0":-208,"y0":-56,"hasText":true,"x":-171,"y":-19},{"text":"pénztár","size":72,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":144,"xoff":1120,"yoff":0,"x1":128,"y1":71,"x0":-128,"y0":-55,"hasText":true,"x":108,"y":-40},{"text":"szolgáltató","size":67,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":134,"xoff":1376,"yoff":0,"x1":160,"y1":66,"x0":-160,"y0":-52,"hasText":true,"x":-197,"y":-76},{"text":"biztosító","size":65,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":130,"xoff":1696,"yoff":0,"x1":128,"y1":64,"x0":-128,"y0":-51,"hasText":true,"x":-105,"y":121},{"text":"adóév","size":64,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":128,"xoff":0,"yoff":160,"x1":96,"y1":63,"x0":-96,"y0":-49,"hasText":true,"x":22,"y":-96},{"text":"munkáltató","size":60,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":120,"xoff":192,"yoff":160,"x1":144,"y1":59,"x0":-144,"y0":-47,"hasText":true,"x":42,"y":-146},{"text":"gazdaság","size":58,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":116,"xoff":480,"yoff":160,"x1":128,"y1":57,"x0":-128,"y0":-45,"hasText":true,"x":191,"y":19},{"text":"jogviszony","size":57,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":114,"xoff":736,"yoff":160,"x1":144,"y1":56,"x0":-144,"y0":-43,"hasText":true,"x":12,"y":162},{"text":"társaság","size":53,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":106,"xoff":1024,"yoff":160,"x1":112,"y1":52,"x0":-112,"y0":-41,"hasText":true,"x":-163,"y":-131},{"text":"adózó","size":53,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":106,"xoff":1248,"yoff":160,"x1":80,"y1":52,"x0":-80,"y0":-41,"hasText":true,"x":173,"y":-98},{"text":"szja","size":51,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":102,"xoff":1408,"yoff":160,"x1":64,"y1":50,"x0":-64,"y0":-39,"hasText":true,"x":3,"y":-194},{"text":"jöt","size":50,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":100,"xoff":1536,"yoff":160,"x1":48,"y1":49,"x0":-48,"y0":-39,"hasText":true,"x":47,"y":88},{"text":"vámhatóság","size":49,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":98,"xoff":1632,"yoff":160,"x1":144,"y1":48,"x0":-144,"y0":-39,"hasText":true,"x":-315,"y":21},{"text":"jövedel","size":49,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":98,"xoff":0,"yoff":280,"x1":96,"y1":48,"x0":-96,"y0":-37,"hasText":true,"x":-261,"y":62},{"text":"forint","size":47,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":94,"xoff":192,"yoff":280,"x1":64,"y1":46,"x0":-64,"y0":-36,"hasText":true,"x":-143,"y":166},{"text":"vállalkozás","size":46,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":92,"xoff":320,"yoff":280,"x1":112,"y1":45,"x0":-112,"y0":-36,"hasText":true,"x":220,"y":151},{"text":"adóhatóság","size":46,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":92,"xoff":544,"yoff":280,"x1":128,"y1":45,"x0":-128,"y0":-36,"hasText":true,"x":-301,"y":105},{"text":"vezető","size":44,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":88,"xoff":800,"yoff":280,"x1":80,"y1":43,"x0":-80,"y0":-34,"hasText":true,"x":-88,"y":-181},{"text":"engedélyes","size":44,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":88,"xoff":960,"yoff":280,"x1":112,"y1":43,"x0":-112,"y0":-35,"hasText":true,"x":-240,"y":-179},{"text":"határidő","size":42,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1184,"yoff":280,"x1":80,"y1":41,"x0":-80,"y0":-33,"hasText":true,"x":249,"y":-140},{"text":"belföld","size":42,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1344,"yoff":280,"x1":80,"y1":41,"x0":-80,"y0":-32,"hasText":true,"x":-305,"y":-122},{"text":"fizetés","size":40,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":1504,"yoff":280,"x1":64,"y1":39,"x0":-64,"y0":-32,"hasText":true,"x":174,"y":53},{"text":"támogatás","size":38,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":1632,"yoff":280,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":-115,"y":-217},{"text":"külföld","size":37,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":74,"xoff":1824,"yoff":280,"x1":64,"y1":36,"x0":-64,"y0":-29,"hasText":true,"x":-370,"y":56},{"text":"adóraktár","size":36,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":0,"yoff":374,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":299,"y":-46},{"text":"hírközlés","size":35,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":160,"yoff":374,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":323,"y":-15},{"text":"felügyel","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":320,"yoff":374,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":349,"y":47},{"text":"származó","size":33,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":448,"yoff":374,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":361,"y":18},{"text":"ár","size":33,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":66,"xoff":608,"yoff":374,"x1":32,"y1":32,"x0":-32,"y0":-25,"hasText":true,"x":-48,"y":-66},{"text":"piac","size":33,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":672,"yoff":374,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":77,"y":-198},{"text":"tulajdon","size":32,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":768,"yoff":374,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":281,"y":-114},{"text":"beszerzés","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":896,"yoff":374,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-386,"y":-155},{"text":"hálózat","size":32,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1056,"yoff":374,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-112,"y":72},{"text":"magánszemély","size":7,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":14,"xoff":1184,"yoff":374,"x1":32,"y1":6,"x0":-32,"y0":-6,"hasText":true,"x":-153,"y":-69},{"text":"költség","size":4,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1248,"yoff":374,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-70,"y":-6}]},{"name":"államigazgatás és fegyveres testületek","major_topic":[12,16,20],"words":[{"text":"intézmény","size":80,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-195,"y":-114,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"képzés","size":63,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":126,"xoff":384,"yoff":0,"x1":112,"y1":62,"x0":-112,"y0":-49,"hasText":true,"x":97,"y":7},{"text":"katon","size":53,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":106,"xoff":608,"yoff":0,"x1":80,"y1":52,"x0":-80,"y0":-40,"hasText":true,"x":205,"y":-115},{"text":"beosztás","size":53,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":106,"xoff":768,"yoff":0,"x1":112,"y1":52,"x0":-112,"y0":-41,"hasText":true,"x":-167,"y":27},{"text":"vezető","size":46,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":92,"xoff":992,"yoff":0,"x1":80,"y1":45,"x0":-80,"y0":-36,"hasText":true,"x":-95,"y":58},{"text":"felsőoktatás","size":39,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":78,"xoff":1152,"yoff":0,"x1":112,"y1":38,"x0":-112,"y0":-32,"hasText":true,"x":63,"y":-43},{"text":"építés","size":36,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":1376,"yoff":0,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":-25,"y":-10},{"text":"település","size":35,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":1504,"yoff":0,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":-88,"y":110},{"text":"kulturális","size":33,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":1664,"yoff":0,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":12,"y":-133},{"text":"oktatás","size":31,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":1824,"yoff":0,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":-153,"y":-88},{"text":"főiskol","size":30,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":0,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-189,"y":-5},{"text":"minősítet","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":96,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":9,"y":48},{"text":"honvédség","size":28,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":224,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":207,"y":-44},{"text":"terv","size":26,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":384,"yoff":160,"x1":32,"y1":25,"x0":-32,"y0":-19,"hasText":true,"x":85,"y":40},{"text":"hivatásos","size":25,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":448,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":157,"y":51},{"text":"parancsn","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":576,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-14,"hasText":true,"x":-52,"y":-82},{"text":"iskol","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":704,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":19,"y":69},{"text":"illetmény","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":768,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":88,"y":-77},{"text":"rendfokozat","size":22,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":864,"yoff":160,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":-121,"y":-62},{"text":"védet","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":992,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":240,"y":98},{"text":"ftv","size":21,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":1056,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":92,"y":59},{"text":"jogkör","size":21,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":1120,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":-231,"y":62},{"text":"kar","size":20,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1184,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-19,"y":-107},{"text":"tanulmány","size":20,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1248,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":13,"y":24},{"text":"fegyveres","size":19,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1344,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-145,"y":-49},{"text":"út","size":19,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":38,"xoff":1440,"yoff":160,"x1":16,"y1":18,"x0":-16,"y0":-16,"hasText":true,"x":182,"y":-27},{"text":"fegyelm","size":19,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1472,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-97,"y":81},{"text":"elismerés","size":18,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1568,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-104,"y":-15},{"text":"honvédelm","size":18,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1664,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-112,"y":-30},{"text":"külföld","size":18,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":1760,"yoff":160,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":216,"y":73},{"text":"besorolás","size":18,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1824,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-66,"y":-46},{"text":"felnőttképzés","size":18,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":36,"xoff":0,"yoff":216,"x1":64,"y1":17,"x0":-64,"y0":-14,"hasText":true,"x":17,"y":84},{"text":"bővítés","size":18,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":128,"yoff":216,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":133,"y":-92},{"text":"régészet","size":17,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":192,"yoff":216,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":-88,"y":130},{"text":"szolgálat","size":15,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":288,"yoff":216,"x1":32,"y1":14,"x0":-32,"y0":-13,"hasText":true,"x":141,"y":65},{"text":"állomány","size":9,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":352,"yoff":216,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":160,"y":-68},{"text":"kérelmező","size":3,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":416,"yoff":216,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-121,"y":118},{"text":"rekonstrukció","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":448,"yoff":216,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-50,"y":-97},{"text":"önkormányzat","size":2,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":480,"yoff":216,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":41,"y":-86},{"text":"tagáll","size":1,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":512,"yoff":216,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":86,"y":-13}]},{"name":"szociálpolitika","major_topic":[5,13],"words":[{"text":"intézmény","size":80,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-119,"y":-23,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"gyerm","size":77,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":154,"xoff":384,"yoff":0,"x1":128,"y1":76,"x0":-128,"y0":-43,"hasText":true,"x":-233,"y":-85},{"text":"végrehajtó","size":74,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":148,"xoff":640,"yoff":0,"x1":176,"y1":73,"x0":-176,"y0":-56,"hasText":true,"x":41,"y":51},{"text":"külföld","size":45,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":90,"xoff":992,"yoff":0,"x1":80,"y1":44,"x0":-80,"y0":-35,"hasText":true,"x":172,"y":-78},{"text":"szociális","size":43,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":86,"xoff":1152,"yoff":0,"x1":96,"y1":42,"x0":-96,"y0":-35,"hasText":true,"x":-241,"y":-130},{"text":"harc","size":41,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":82,"xoff":1344,"yoff":0,"x1":48,"y1":40,"x0":-48,"y0":-32,"hasText":true,"x":26,"y":87},{"text":"képviselő","size":38,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":1440,"yoff":0,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":165,"y":-7},{"text":"főváros","size":35,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":1632,"yoff":0,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":-122,"y":-135},{"text":"szülő","size":33,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":1760,"yoff":0,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":-107,"y":-108},{"text":"hagyományos","size":31,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":62,"xoff":0,"yoff":160,"x1":96,"y1":30,"x0":-96,"y0":-24,"hasText":true,"x":-212,"y":9},{"text":"páncélozot","size":30,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":192,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-230,"y":48},{"text":"ellenőrző","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":352,"yoff":160,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":15,"y":117},{"text":"idegenrendészet","size":27,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":54,"xoff":480,"yoff":160,"x1":96,"y1":26,"x0":-96,"y0":-21,"hasText":true,"x":122,"y":-56},{"text":"vezető","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":672,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":246,"y":72},{"text":"vht","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":768,"yoff":160,"x1":32,"y1":25,"x0":-32,"y0":-21,"hasText":true,"x":-32,"y":-83},{"text":"település","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":832,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":227,"y":36},{"text":"nevelés","size":25,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":960,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":81,"y":-80},{"text":"nevelőszülő","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1056,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":90,"y":-114},{"text":"keret","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":1184,"yoff":160,"x1":32,"y1":23,"x0":-32,"y0":-20,"hasText":true,"x":57,"y":-5},{"text":"csopor","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1248,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-15,"hasText":true,"x":228,"y":89},{"text":"család","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1344,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":254,"y":-81},{"text":"fegyelm","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1440,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-91,"y":-76},{"text":"támogatás","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":1536,"yoff":160,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":126,"y":100},{"text":"közjegyző","size":22,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1664,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-314,"y":-47},{"text":"szt","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1760,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-17,"hasText":true,"x":-286,"y":-16},{"text":"csökkentés","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":1824,"yoff":160,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":-86,"y":73},{"text":"közlekedés","size":20,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":0,"yoff":220,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":107,"y":80},{"text":"típus","size":20,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":128,"yoff":220,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-57,"y":95},{"text":"gyámhivatal","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":192,"yoff":220,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":-202,"y":65},{"text":"védelm","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":320,"yoff":220,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":181,"y":-117},{"text":"gondozás","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":416,"yoff":220,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-37,"y":-6},{"text":"adós","size":19,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":512,"yoff":220,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":191,"y":-39},{"text":"önkormányzat","size":19,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":576,"yoff":220,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":208,"y":-134},{"text":"bíróság","size":5,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":704,"yoff":220,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":5,"y":0},{"text":"helikopter","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":736,"yoff":220,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-3,"y":-120},{"text":"jogviszony","size":2,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":768,"yoff":220,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-183,"y":-38},{"text":"gyvt","size":2,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":800,"yoff":220,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":142,"y":56},{"text":"szolgálat","size":1,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":832,"yoff":220,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-154,"y":54},{"text":"techn","size":0,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":864,"yoff":220,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":11,"y":106}]},{"name":"mezőgazdaság, természet és egészség","major_topic":[3,4,7,21],"words":[{"text":"beruházás","size":80,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":200,"y":49,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"egészségügy","size":71,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":416,"height":142,"xoff":384,"yoff":0,"x1":208,"y1":70,"x0":-208,"y0":-55,"hasText":true,"x":-126,"y":-81},{"text":"beruházó","size":62,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":124,"xoff":800,"yoff":0,"x1":144,"y1":61,"x0":-144,"y0":-48,"hasText":true,"x":-61,"y":-16},{"text":"veszélyes","size":58,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":116,"xoff":1088,"yoff":0,"x1":128,"y1":57,"x0":-128,"y0":-45,"hasText":true,"x":105,"y":95},{"text":"alapszabály","size":47,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":94,"xoff":1344,"yoff":0,"x1":128,"y1":46,"x0":-128,"y0":-37,"hasText":true,"x":221,"y":-72},{"text":"közgyűlés","size":47,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":94,"xoff":1600,"yoff":0,"x1":112,"y1":46,"x0":-112,"y0":-37,"hasText":true,"x":299,"y":104},{"text":"bíróság","size":42,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1824,"yoff":0,"x1":80,"y1":41,"x0":-80,"y0":-33,"hasText":true,"x":-95,"y":19},{"text":"kamar","size":39,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":78,"xoff":0,"yoff":160,"x1":64,"y1":38,"x0":-64,"y0":-31,"hasText":true,"x":97,"y":-101},{"text":"hullade","size":39,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":128,"yoff":160,"x1":80,"y1":38,"x0":-80,"y0":-31,"hasText":true,"x":109,"y":-38},{"text":"információ","size":38,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":288,"yoff":160,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":-217,"y":90},{"text":"szövetkez","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":480,"yoff":160,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":207,"y":-13},{"text":"biztonság","size":31,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":672,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-240,"y":42},{"text":"készítmény","size":31,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":832,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":301,"y":-37},{"text":"nemzetköz","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":992,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":2,"y":118},{"text":"település","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":1152,"yoff":160,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":19,"y":-133},{"text":"környezetvédelm","size":29,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":58,"xoff":1280,"yoff":160,"x1":112,"y1":28,"x0":-112,"y0":-23,"hasText":true,"x":192,"y":-125},{"text":"orvos","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1504,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-17,"hasText":true,"x":-175,"y":-122},{"text":"europol","size":28,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1600,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":243,"y":-149},{"text":"keret","size":26,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1728,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-99,"y":-54},{"text":"tulajdon","size":26,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1824,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-236,"y":17},{"text":"szolgáltató","size":26,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":0,"yoff":238,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":144,"y":-153},{"text":"növényvédő","size":25,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":128,"yoff":238,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-21,"y":53},{"text":"védelm","size":24,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":288,"yoff":238,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-200,"y":-43},{"text":"minisztériu","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":384,"yoff":238,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":176,"y":127},{"text":"forgal","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":512,"yoff":238,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-195,"y":-20},{"text":"vezető","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":608,"yoff":238,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-114,"y":41},{"text":"takarmány","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":704,"yoff":238,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-174,"y":-140},{"text":"tisztségviselő","size":23,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":832,"yoff":238,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":-68,"y":-157},{"text":"természetes","size":23,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":992,"yoff":238,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-199,"y":-159},{"text":"út","size":22,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":44,"xoff":1120,"yoff":238,"x1":16,"y1":21,"x0":-16,"y0":-19,"hasText":true,"x":-31,"y":-60},{"text":"fejlesztés","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1152,"yoff":238,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-279,"y":-126},{"text":"önkormányzat","size":21,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1248,"yoff":238,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":357,"y":-13},{"text":"elnökség","size":21,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1376,"yoff":238,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":77,"y":-77},{"text":"szer","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":1472,"yoff":238,"x1":32,"y1":20,"x0":-32,"y0":-13,"hasText":true,"x":-141,"y":-65},{"text":"gazdaság","size":10,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":1536,"yoff":238,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":182,"y":-44},{"text":"anyag","size":9,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":18,"xoff":1600,"yoff":238,"x1":16,"y1":8,"x0":-16,"y0":-7,"hasText":true,"x":-31,"y":86},{"text":"európ","size":4,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1632,"yoff":238,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-12,"y":72}]},{"name":"közlekedés és munkaügy","major_topic":[5,10,18],"words":[{"text":"főigazgató","size":80,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-233,"y":-107,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"ország","size":60,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":120,"xoff":384,"yoff":0,"x1":112,"y1":59,"x0":-112,"y0":-47,"hasText":true,"x":-194,"y":-8},{"text":"információ","size":50,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":100,"xoff":608,"yoff":0,"x1":128,"y1":49,"x0":-128,"y0":-40,"hasText":true,"x":84,"y":-28},{"text":"egyezmény","size":49,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":98,"xoff":864,"yoff":0,"x1":128,"y1":48,"x0":-128,"y0":-39,"hasText":true,"x":-111,"y":87},{"text":"út","size":46,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":92,"xoff":1120,"yoff":0,"x1":32,"y1":45,"x0":-32,"y0":-36,"hasText":true,"x":-49,"y":8},{"text":"konferenc","size":45,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":90,"xoff":1184,"yoff":0,"x1":112,"y1":44,"x0":-112,"y0":-35,"hasText":true,"x":-87,"y":-68},{"text":"biztosítás","size":41,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":82,"xoff":1408,"yoff":0,"x1":96,"y1":40,"x0":-96,"y0":-33,"hasText":true,"x":-124,"y":34},{"text":"államhatár","size":38,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":1600,"yoff":0,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":87,"y":-93},{"text":"cikkely","size":36,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":1792,"yoff":0,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":-249,"y":22},{"text":"műszak","size":36,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":0,"yoff":160,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":-10,"y":-124},{"text":"főtitkár","size":35,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":160,"yoff":160,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":60,"y":2},{"text":"hajózás","size":35,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":288,"yoff":160,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":-63,"y":-34},{"text":"ratifikáció","size":34,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":416,"yoff":160,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":217,"y":-6},{"text":"okmány","size":33,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":576,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":7,"y":28},{"text":"megkereset","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":66,"xoff":704,"yoff":160,"x1":96,"y1":32,"x0":-96,"y0":-25,"hasText":true,"x":242,"y":100},{"text":"munkáltató","size":32,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":896,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":196,"y":-69},{"text":"letét","size":32,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":1056,"yoff":160,"x1":48,"y1":31,"x0":-48,"y0":-25,"hasText":true,"x":65,"y":-59},{"text":"segítség","size":32,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1152,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-225,"y":-51},{"text":"hivatalos","size":31,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":1280,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":-320,"y":-32},{"text":"végrehajtó","size":30,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1408,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-22,"y":-160},{"text":"üléssz","size":30,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":1568,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-247,"y":-79},{"text":"megkereső","size":29,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1664,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":233,"y":26},{"text":"mentés","size":29,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":1824,"yoff":160,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":-33,"y":-97},{"text":"módosító","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":0,"yoff":230,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":-148,"y":58},{"text":"lajstromozás","size":27,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":128,"yoff":230,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":115,"y":-127},{"text":"úszólétesítmény","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":54,"xoff":288,"yoff":230,"x1":96,"y1":26,"x0":-96,"y0":-21,"hasText":true,"x":41,"y":58},{"text":"víz","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":54,"xoff":480,"yoff":230,"x1":32,"y1":26,"x0":-32,"y0":-21,"hasText":true,"x":232,"y":-94},{"text":"nemzetköz","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":544,"yoff":230,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":166,"y":80},{"text":"szerződő","size":14,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":28,"xoff":672,"yoff":230,"x1":32,"y1":13,"x0":-32,"y0":-12,"hasText":true,"x":247,"y":113},{"text":"munkaügy","size":12,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":736,"yoff":230,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-109,"y":98},{"text":"munkavállaló","size":12,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":24,"xoff":800,"yoff":230,"x1":48,"y1":11,"x0":-48,"y0":-10,"hasText":true,"x":216,"y":-58},{"text":"tagállam","size":7,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":14,"xoff":896,"yoff":230,"x1":16,"y1":6,"x0":-16,"y0":-6,"hasText":true,"x":136,"y":57},{"text":"biztonság","size":4,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":928,"yoff":230,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-73,"y":-128},{"text":"foglalkoztatás","size":3,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":960,"yoff":230,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-16,"y":120},{"text":"anyag","size":3,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":992,"yoff":230,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":95,"y":-69},{"text":"orvos","size":3,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1024,"yoff":230,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-223,"y":77},{"text":"vétel","size":2,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1056,"yoff":230,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":101,"y":-116},{"text":"felmondás","size":0,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1088,"yoff":230,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":246,"y":66}]},{"name":"költségvetési kiadások","major_topic":[1,3,6,13],"words":[{"text":"önkormányzat","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":43,"y":69,"width":480,"height":160,"xoff":0,"yoff":0,"x1":240,"y1":79,"x0":-240,"y0":-61,"hasText":true},{"text":"hozzájárulás","size":71,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":384,"height":142,"xoff":480,"yoff":0,"x1":192,"y1":70,"x0":-192,"y0":-55,"hasText":true,"x":214,"y":8},{"text":"felújítás","size":65,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":130,"xoff":864,"yoff":0,"x1":128,"y1":64,"x0":-128,"y0":-51,"hasText":true,"x":-109,"y":-110},{"text":"előirányzat","size":61,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":122,"xoff":1120,"yoff":0,"x1":144,"y1":60,"x0":-144,"y0":-47,"hasText":true,"x":-5,"y":-61},{"text":"kiadás","size":47,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":94,"xoff":1408,"yoff":0,"x1":80,"y1":46,"x0":-80,"y0":-37,"hasText":true,"x":145,"y":114},{"text":"költségvetés","size":37,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":74,"xoff":1568,"yoff":0,"x1":112,"y1":36,"x0":-112,"y0":-29,"hasText":true,"x":-72,"y":6},{"text":"forint","size":37,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":74,"xoff":1792,"yoff":0,"x1":48,"y1":36,"x0":-48,"y0":-29,"hasText":true,"x":-57,"y":-23},{"text":"oktatás","size":36,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":1888,"yoff":0,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":38,"y":99},{"text":"szociális","size":32,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":0,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":261,"y":93},{"text":"támogatás","size":31,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":128,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":62,"y":-105},{"text":"normatív","size":26,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":288,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-102,"y":90},{"text":"minisztériu","size":25,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":416,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":29,"y":121},{"text":"progr","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":544,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-15,"hasText":true,"x":-46,"y":109},{"text":"egészségbiztosítás","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":46,"xoff":640,"yoff":160,"x1":96,"y1":22,"x0":-96,"y0":-18,"hasText":true,"x":15,"y":140},{"text":"pénzügy","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":832,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-190,"y":85},{"text":"igazgatás","size":22,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":928,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":133,"y":-41},{"text":"iskol","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1024,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-141,"y":-88},{"text":"egészségügy","size":21,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1088,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":259,"y":112},{"text":"színház","size":21,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1216,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":18,"y":-24},{"text":"hitel","size":21,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":1312,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":-34,"y":92},{"text":"város","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1376,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-121,"y":-25},{"text":"tanuló","size":20,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1440,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":174,"y":-61},{"text":"intézmény","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1504,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":163,"y":-101},{"text":"felhalmozás","size":19,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":1600,"yoff":160,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":-2,"y":-153},{"text":"település","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1728,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-199,"y":64},{"text":"kezelésű","size":18,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1824,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":155,"y":-79},{"text":"kincstár","size":17,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1920,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":-188,"y":-93},{"text":"fedezet","size":17,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":0,"yoff":222,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":217,"y":-81},{"text":"beruházás","size":15,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":64,"yoff":222,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":191,"y":128},{"text":"juttatás","size":11,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":160,"yoff":222,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":1,"y":-132},{"text":"terhelő","size":9,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":224,"yoff":222,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":-216,"y":-108},{"text":"munkaadó","size":9,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":288,"yoff":222,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":130,"y":-124},{"text":"járulék","size":9,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":352,"yoff":222,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":-173,"y":-13},{"text":"fejlesztés","size":3,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":416,"yoff":222,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-114,"y":-56},{"text":"közoktatás","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":448,"yoff":222,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":231,"y":12},{"text":"nyugdíjbiztosítás","size":1,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":480,"yoff":222,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-3,"y":60},{"text":"társadalombiztosítás","size":0,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":512,"yoff":222,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":181,"y":115}]}]},{"id":"2002-2006","topics":[{"name":"oktatásügy és önkormányzatok","major_topic":[6,2],"words":[{"text":"képzés","size":80,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-67,"y":122,"width":288,"height":160,"xoff":0,"yoff":0,"x1":144,"y1":79,"x0":-144,"y0":-61,"hasText":true},{"text":"támogatás","size":65,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":130,"xoff":288,"yoff":0,"x1":160,"y1":64,"x0":-160,"y0":-51,"hasText":true,"x":230,"y":32},{"text":"oktatás","size":62,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":124,"xoff":608,"yoff":0,"x1":112,"y1":61,"x0":-112,"y0":-48,"hasText":true,"x":125,"y":-35},{"text":"iskol","size":60,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":120,"xoff":832,"yoff":0,"x1":80,"y1":59,"x0":-80,"y0":-45,"hasText":true,"x":-241,"y":88},{"text":"jogviszony","size":60,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":120,"xoff":992,"yoff":0,"x1":144,"y1":59,"x0":-144,"y0":-45,"hasText":true,"x":-27,"y":58},{"text":"munkáltató","size":52,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":104,"xoff":1280,"yoff":0,"x1":128,"y1":51,"x0":-128,"y0":-41,"hasText":true,"x":-7,"y":12},{"text":"vezető","size":50,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":100,"xoff":1536,"yoff":0,"x1":80,"y1":49,"x0":-80,"y0":-39,"hasText":true,"x":-91,"y":-20},{"text":"szolgálat","size":49,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":1696,"yoff":0,"x1":112,"y1":48,"x0":-112,"y0":-39,"hasText":true,"x":118,"y":103},{"text":"foglalkoztatás","size":47,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":94,"xoff":0,"yoff":160,"x1":144,"y1":46,"x0":-144,"y0":-37,"hasText":true,"x":-226,"y":-51},{"text":"tanuló","size":46,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":92,"xoff":288,"yoff":160,"x1":80,"y1":45,"x0":-80,"y0":-36,"hasText":true,"x":261,"y":-23},{"text":"képviselő","size":39,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":78,"xoff":448,"yoff":160,"x1":96,"y1":38,"x0":-96,"y0":-32,"hasText":true,"x":-32,"y":-71},{"text":"szakértő","size":37,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":640,"yoff":160,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":-202,"y":18},{"text":"munkaügy","size":34,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":800,"yoff":160,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":-23,"y":148},{"text":"keret","size":33,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":960,"yoff":160,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":-135,"y":-93},{"text":"önkormányzat","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":66,"xoff":1056,"yoff":160,"x1":112,"y1":32,"x0":-112,"y0":-25,"hasText":true,"x":223,"y":-84},{"text":"kisebbség","size":31,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":1280,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-211,"y":-21},{"text":"hivatásos","size":30,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1440,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":173,"y":59},{"text":"tanulmány","size":30,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1600,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-319,"y":2},{"text":"szakképzés","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1760,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-234,"y":116},{"text":"szabadalm","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":0,"yoff":252,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-233,"y":-88},{"text":"munkakör","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":160,"yoff":252,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":335,"y":-66},{"text":"gazdaság","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":320,"yoff":252,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-228,"y":-116},{"text":"gyerm","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":448,"yoff":252,"x1":48,"y1":24,"x0":-48,"y0":-15,"hasText":true,"x":81,"y":122},{"text":"bíróság","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":544,"yoff":252,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":74,"y":-88},{"text":"fenntartó","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":640,"yoff":252,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":-92,"y":-121},{"text":"munkaviszony","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":48,"xoff":768,"yoff":252,"x1":80,"y1":23,"x0":-80,"y0":-20,"hasText":true,"x":225,"y":-111},{"text":"közoktatás","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":928,"yoff":252,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-354,"y":-23},{"text":"kamar","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1056,"yoff":252,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":13,"y":-32},{"text":"fejlesztés","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1152,"yoff":252,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-7,"y":-110},{"text":"tudományos","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":1280,"yoff":252,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":-40,"y":168},{"text":"költségvetés","size":21,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1408,"yoff":252,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-201,"y":36},{"text":"fegyelm","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1536,"yoff":252,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-171,"y":138},{"text":"intézmény","size":15,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":1632,"yoff":252,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":-328,"y":-96},{"text":"felsőoktatás","size":11,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":1728,"yoff":252,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":233,"y":-70},{"text":"hallgató","size":5,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":1792,"yoff":252,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-70,"y":68},{"text":"munkavállaló","size":4,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1824,"yoff":252,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":216,"y":78},{"text":"állomány","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1856,"yoff":252,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":77,"y":-21},{"text":"munkavégzés","size":2,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1888,"yoff":252,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":146,"y":38}]},{"name":"önkomrányzatok és beruházások","major_topic":[15,2],"words":[{"text":"felhasznál","size":80,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":142,"y":57,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"település","size":77,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":154,"xoff":384,"yoff":0,"x1":160,"y1":76,"x0":-160,"y0":-58,"hasText":true,"x":-209,"y":98},{"text":"kisebbség","size":75,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":150,"xoff":704,"yoff":0,"x1":176,"y1":74,"x0":-176,"y0":-57,"hasText":true,"x":10,"y":-10},{"text":"engedélyes","size":64,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":128,"xoff":1056,"yoff":0,"x1":160,"y1":63,"x0":-160,"y0":-49,"hasText":true,"x":125,"y":-67},{"text":"közüzem","size":51,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":102,"xoff":1376,"yoff":0,"x1":112,"y1":50,"x0":-112,"y0":-39,"hasText":true,"x":-128,"y":39},{"text":"vámtarifa","size":51,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":102,"xoff":1600,"yoff":0,"x1":144,"y1":50,"x0":-144,"y0":-40,"hasText":true,"x":204,"y":-117},{"text":"gyártelep","size":48,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":96,"xoff":0,"yoff":160,"x1":112,"y1":47,"x0":-112,"y0":-37,"hasText":true,"x":-94,"y":-70},{"text":"terv","size":48,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":96,"xoff":224,"yoff":160,"x1":64,"y1":47,"x0":-64,"y0":-33,"hasText":true,"x":-164,"y":-30},{"text":"főú","size":47,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":94,"xoff":352,"yoff":160,"x1":48,"y1":46,"x0":-48,"y0":-37,"hasText":true,"x":54,"y":-120},{"text":"lakás","size":37,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":74,"xoff":448,"yoff":160,"x1":64,"y1":36,"x0":-64,"y0":-29,"hasText":true,"x":-215,"y":-70},{"text":"külképviselet","size":35,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":70,"xoff":576,"yoff":160,"x1":112,"y1":34,"x0":-112,"y0":-28,"hasText":true,"x":-99,"y":-109},{"text":"termék","size":33,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":800,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":-30,"y":95},{"text":"szavazás","size":33,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":928,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":172,"y":83},{"text":"tulajdonos","size":32,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1088,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-201,"y":-4},{"text":"fejlesztés","size":31,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":1248,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":72,"y":104},{"text":"irod","size":31,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":62,"xoff":1408,"yoff":160,"x1":48,"y1":30,"x0":-48,"y0":-24,"hasText":true,"x":172,"y":6},{"text":"védet","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":1504,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":220,"y":-157},{"text":"származó","size":28,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1600,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-252,"y":-101},{"text":"energ","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1728,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-17,"hasText":true,"x":-23,"y":-140},{"text":"európ","size":27,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1824,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-34,"y":8},{"text":"út","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":1920,"yoff":160,"x1":32,"y1":25,"x0":-32,"y0":-21,"hasText":true,"x":-207,"y":-36},{"text":"osztályozot","size":26,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":0,"yoff":256,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":209,"y":-27},{"text":"természetes","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":128,"yoff":256,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-278,"y":-44},{"text":"gazdaság","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":288,"yoff":256,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":280,"y":-50},{"text":"földgáz","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":416,"yoff":256,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-111,"y":-140},{"text":"vezete","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":512,"yoff":256,"x1":48,"y1":23,"x0":-48,"y0":-18,"hasText":true,"x":-33,"y":64},{"text":"képviselő","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":608,"yoff":256,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":308,"y":-26},{"text":"műszak","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":736,"yoff":256,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":32,"y":-104},{"text":"ingatl","size":22,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":832,"yoff":256,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-213,"y":-125},{"text":"anyag","size":13,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":896,"yoff":256,"x1":32,"y1":12,"x0":-32,"y0":-9,"hasText":true,"x":229,"y":-9},{"text":"választás","size":11,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":960,"yoff":256,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":46,"y":79},{"text":"előállítás","size":8,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":1024,"yoff":256,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":183,"y":105},{"text":"ár","size":8,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":16,"xoff":1088,"yoff":256,"x1":16,"y1":7,"x0":-16,"y0":-8,"hasText":true,"x":-131,"y":-98},{"text":"fogyasztó","size":6,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":12,"xoff":1120,"yoff":256,"x1":16,"y1":5,"x0":-16,"y0":-6,"hasText":true,"x":161,"y":90},{"text":"önkormányzat","size":5,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":10,"xoff":1152,"yoff":256,"x1":32,"y1":4,"x0":-32,"y0":-5,"hasText":true,"x":200,"y":-110},{"text":"építés","size":2,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1216,"yoff":256,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-11,"y":35},{"text":"térség","size":0,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1248,"yoff":256,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":28,"y":-57},{"text":"környezetvédelm","size":0,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1280,"yoff":256,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":65,"y":10}]},{"name":"nemzetközi közlekedés és gazdasági kapcsolatok","major_topic":[10,18],"words":[{"text":"contracting","size":80,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-30,"y":-18,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-60,"hasText":true},{"text":"megfigyelő","size":50,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":100,"xoff":384,"yoff":0,"x1":128,"y1":49,"x0":-128,"y0":-39,"hasText":true,"x":-6,"y":27},{"text":"customs","size":40,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":80,"xoff":640,"yoff":0,"x1":80,"y1":39,"x0":-80,"y0":-28,"hasText":true,"x":-108,"y":53},{"text":"observat","size":39,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":800,"yoff":0,"x1":80,"y1":38,"x0":-80,"y0":-31,"hasText":true,"x":126,"y":-64},{"text":"repülés","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":76,"xoff":960,"yoff":0,"x1":80,"y1":37,"x0":-80,"y0":-29,"hasText":true,"x":-136,"y":-66},{"text":"parties","size":37,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":74,"xoff":1120,"yoff":0,"x1":64,"y1":36,"x0":-64,"y0":-29,"hasText":true,"x":-47,"y":86},{"text":"goods","size":36,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":1248,"yoff":0,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":-147,"y":8},{"text":"territory","size":34,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":1376,"yoff":0,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":-143,"y":81},{"text":"stat","size":34,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":68,"xoff":1504,"yoff":0,"x1":48,"y1":33,"x0":-48,"y0":-24,"hasText":true,"x":-3,"y":61},{"text":"beruházás","size":31,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":1600,"yoff":0,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-115,"y":-100},{"text":"spp","size":31,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":62,"xoff":1760,"yoff":0,"x1":48,"y1":30,"x0":-48,"y0":-18,"hasText":true,"x":-210,"y":-63},{"text":"fligh","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":1856,"yoff":0,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":-209,"y":-8},{"text":"accordanc","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":0,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":84,"y":44},{"text":"fuvarozó","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":128,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-13,"y":116},{"text":"nemzetköz","size":24,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":224,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":229,"y":-40},{"text":"beruházó","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":352,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":42,"y":81},{"text":"szerződő","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":480,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":207,"y":89},{"text":"függele","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":576,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":224,"y":-6},{"text":"carrier","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":672,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-126,"y":103},{"text":"repülőgép","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":768,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":229,"y":-68},{"text":"áru","size":20,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":864,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-160,"y":-124},{"text":"agreemen","size":20,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":928,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-12,"hasText":true,"x":161,"y":-93},{"text":"republic","size":18,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1024,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-28,"y":-65},{"text":"ghán","size":18,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":1120,"yoff":160,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":40,"y":61},{"text":"műszer","size":17,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1184,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":224,"y":-87},{"text":"fuvarozás","size":17,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":1248,"yoff":160,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":-140,"y":24},{"text":"international","size":17,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":1344,"yoff":160,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":143,"y":28},{"text":"carn","size":17,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1440,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-11,"hasText":true,"x":81,"y":61},{"text":"visszafogadás","size":16,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":32,"xoff":1504,"yoff":160,"x1":64,"y1":15,"x0":-64,"y0":-13,"hasText":true,"x":106,"y":-109},{"text":"érzékelő","size":16,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":1632,"yoff":160,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":-43,"y":-80},{"text":"carriag","size":16,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":32,"xoff":1728,"yoff":160,"x1":32,"y1":15,"x0":-32,"y0":-13,"hasText":true,"x":184,"y":-117},{"text":"faj","size":15,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":30,"xoff":1792,"yoff":160,"x1":16,"y1":14,"x0":-16,"y0":-13,"hasText":true,"x":-5,"y":130},{"text":"megkereső","size":15,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":1824,"yoff":160,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":196,"y":-26},{"text":"les","size":15,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":30,"xoff":1920,"yoff":160,"x1":16,"y1":14,"x0":-16,"y0":-13,"hasText":true,"x":211,"y":16},{"text":"egyezmény","size":8,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":1952,"yoff":160,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":-190,"y":54},{"text":"convent","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":0,"yoff":208,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":226,"y":-21},{"text":"annex","size":2,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":32,"yoff":208,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":242,"y":-59},{"text":"aircraf","size":2,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":64,"yoff":208,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-104,"y":-50},{"text":"behozatal","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":96,"yoff":208,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-225,"y":-125}]},{"name":"szociálpolitika","major_topic":[5,13],"words":[{"text":"irányelv","size":80,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-118,"y":-83,"width":288,"height":160,"xoff":0,"yoff":0,"x1":144,"y1":79,"x0":-144,"y0":-61,"hasText":true},{"text":"haszonhúzó","size":79,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":416,"height":158,"xoff":288,"yoff":0,"x1":208,"y1":78,"x0":-208,"y0":-60,"hasText":true,"x":171,"y":-80},{"text":"kifizető","size":77,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":154,"xoff":704,"yoff":0,"x1":128,"y1":76,"x0":-128,"y0":-58,"hasText":true,"x":-37,"y":-17},{"text":"gyerm","size":66,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":132,"xoff":960,"yoff":0,"x1":112,"y1":65,"x0":-112,"y0":-37,"hasText":true,"x":179,"y":-42},{"text":"társulás","size":63,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":126,"xoff":1184,"yoff":0,"x1":128,"y1":62,"x0":-128,"y0":-49,"hasText":true,"x":-70,"y":34},{"text":"intézmény","size":58,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":116,"xoff":1440,"yoff":0,"x1":144,"y1":57,"x0":-144,"y0":-45,"hasText":true,"x":36,"y":85},{"text":"nyugdíj","size":58,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":116,"xoff":1728,"yoff":0,"x1":112,"y1":57,"x0":-112,"y0":-45,"hasText":true,"x":190,"y":6},{"text":"szt","size":57,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":114,"xoff":0,"yoff":160,"x1":64,"y1":56,"x0":-64,"y0":-38,"hasText":true,"x":285,"y":-40},{"text":"jogalany","size":53,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":106,"xoff":128,"yoff":160,"x1":112,"y1":52,"x0":-112,"y0":-40,"hasText":true,"x":125,"y":-137},{"text":"település","size":52,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":104,"xoff":352,"yoff":160,"x1":112,"y1":51,"x0":-112,"y0":-41,"hasText":true,"x":265,"y":49},{"text":"egyezmény","size":49,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":98,"xoff":576,"yoff":160,"x1":128,"y1":48,"x0":-128,"y0":-39,"hasText":true,"x":-64,"y":-145},{"text":"információ","size":47,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":94,"xoff":832,"yoff":160,"x1":112,"y1":46,"x0":-112,"y0":-37,"hasText":true,"x":-165,"y":88},{"text":"forrásadó","size":45,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":90,"xoff":1056,"yoff":160,"x1":96,"y1":44,"x0":-96,"y0":-36,"hasText":true,"x":-218,"y":-42},{"text":"európ","size":45,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":90,"xoff":1248,"yoff":160,"x1":64,"y1":44,"x0":-64,"y0":-36,"hasText":true,"x":-210,"y":39},{"text":"támogatás","size":44,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":88,"xoff":1376,"yoff":160,"x1":112,"y1":43,"x0":-112,"y0":-35,"hasText":true,"x":11,"y":121},{"text":"illetőség","size":43,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":86,"xoff":1600,"yoff":160,"x1":96,"y1":42,"x0":-96,"y0":-35,"hasText":true,"x":-232,"y":-3},{"text":"jövedel","size":43,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":1792,"yoff":160,"x1":80,"y1":42,"x0":-80,"y0":-33,"hasText":true,"x":209,"y":89},{"text":"jogosultság","size":43,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":86,"xoff":0,"yoff":266,"x1":112,"y1":42,"x0":-112,"y0":-35,"hasText":true,"x":-167,"y":126},{"text":"család","size":39,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":78,"xoff":224,"yoff":266,"x1":64,"y1":38,"x0":-64,"y0":-32,"hasText":true,"x":-275,"y":-88},{"text":"megtakarítás","size":37,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":74,"xoff":352,"yoff":266,"x1":112,"y1":36,"x0":-112,"y0":-29,"hasText":true,"x":194,"y":125},{"text":"kamatkifizetés","size":37,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":74,"xoff":576,"yoff":266,"x1":128,"y1":36,"x0":-128,"y0":-29,"hasText":true,"x":-364,"y":38},{"text":"kistérség","size":34,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":832,"yoff":266,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":7,"y":151},{"text":"származó","size":34,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":992,"yoff":266,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":1,"y":-185},{"text":"biztosítás","size":32,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1152,"yoff":266,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":274,"y":-141},{"text":"pes","size":32,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":1312,"yoff":266,"x1":48,"y1":31,"x0":-48,"y0":-19,"hasText":true,"x":290,"y":77},{"text":"tagáll","size":30,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":1408,"yoff":266,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":69,"y":7},{"text":"tax","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":60,"xoff":1504,"yoff":266,"x1":32,"y1":29,"x0":-32,"y0":-22,"hasText":true,"x":-275,"y":109},{"text":"követelés","size":30,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1568,"yoff":266,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-226,"y":-144},{"text":"adóztatás","size":28,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1728,"yoff":266,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-127,"y":-174},{"text":"önkormányzat","size":28,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":56,"xoff":0,"yoff":344,"x1":96,"y1":27,"x0":-96,"y0":-23,"hasText":true,"x":277,"y":150},{"text":"vállalkozás","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":192,"yoff":344,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":-321,"y":64},{"text":"segély","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":352,"yoff":344,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":99,"y":-191},{"text":"gyvt","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":448,"yoff":344,"x1":32,"y1":23,"x0":-32,"y0":-18,"hasText":true,"x":40,"y":46},{"text":"vas","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":512,"yoff":344,"x1":32,"y1":23,"x0":-32,"y0":-15,"hasText":true,"x":282,"y":100},{"text":"többcélú","size":24,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":576,"yoff":344,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":130,"y":38},{"text":"szerződő","size":15,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":672,"yoff":344,"x1":32,"y1":14,"x0":-32,"y0":-13,"hasText":true,"x":353,"y":-65},{"text":"szociális","size":11,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":736,"yoff":344,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":-63,"y":-6}]},{"name":"egészségügy és közlekedés","major_topic":[3,1],"words":[{"text":"vasút","size":80,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":87,"y":65,"width":224,"height":160,"xoff":0,"yoff":0,"x1":112,"y1":79,"x0":-112,"y0":-61,"hasText":true},{"text":"elektronikus","size":63,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":126,"xoff":224,"yoff":0,"x1":176,"y1":62,"x0":-176,"y0":-48,"hasText":true,"x":-173,"y":29},{"text":"európ","size":61,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":122,"xoff":576,"yoff":0,"x1":96,"y1":60,"x0":-96,"y0":-47,"hasText":true,"x":108,"y":113},{"text":"szolgálat","size":60,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":120,"xoff":768,"yoff":0,"x1":128,"y1":59,"x0":-128,"y0":-47,"hasText":true,"x":252,"y":-77},{"text":"nemzetköz","size":55,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":110,"xoff":1024,"yoff":0,"x1":144,"y1":54,"x0":-144,"y0":-41,"hasText":true,"x":-81,"y":-56},{"text":"közlekedés","size":44,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":88,"xoff":1312,"yoff":0,"x1":112,"y1":43,"x0":-112,"y0":-35,"hasText":true,"x":162,"y":3},{"text":"hírközlés","size":41,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":82,"xoff":1536,"yoff":0,"x1":96,"y1":40,"x0":-96,"y0":-33,"hasText":true,"x":-194,"y":-94},{"text":"biztonság","size":40,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":80,"xoff":1728,"yoff":0,"x1":96,"y1":39,"x0":-96,"y0":-32,"hasText":true,"x":275,"y":130},{"text":"védelm","size":39,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":0,"yoff":160,"x1":80,"y1":38,"x0":-80,"y0":-32,"hasText":true,"x":-8,"y":90},{"text":"katon","size":36,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":160,"yoff":160,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":206,"y":55},{"text":"anyag","size":33,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":288,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-19,"hasText":true,"x":221,"y":24},{"text":"forgal","size":30,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":416,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-102,"y":63},{"text":"információ","size":29,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":512,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":13,"y":-13},{"text":"keret","size":27,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":672,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-32,"y":57},{"text":"egyezmény","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":768,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-115,"y":91},{"text":"közszolgáltatás","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":896,"yoff":160,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":95,"y":-37},{"text":"gyógyszer","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1056,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":102,"y":-77},{"text":"hatáskör","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1184,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-81,"y":-32},{"text":"társaság","size":23,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1280,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":6,"y":10},{"text":"külföld","size":23,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1376,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":191,"y":-33},{"text":"bűncselekmény","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":44,"xoff":1472,"yoff":160,"x1":80,"y1":21,"x0":-80,"y0":-19,"hasText":true,"x":238,"y":77},{"text":"hálózat","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1632,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":122,"y":-92},{"text":"út","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":44,"xoff":1728,"yoff":160,"x1":16,"y1":21,"x0":-16,"y0":-19,"hasText":true,"x":-200,"y":-56},{"text":"költség","size":22,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1760,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":247,"y":-36},{"text":"hozzáférés","size":21,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1856,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":18,"y":-97},{"text":"segítség","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":0,"yoff":232,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-180,"y":123},{"text":"súlyos","size":21,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":96,"yoff":232,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-215,"y":47},{"text":"gazdaság","size":21,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":192,"yoff":232,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-171,"y":62},{"text":"tagállam","size":21,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":288,"yoff":232,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-161,"y":-34},{"text":"honvédelm","size":20,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":384,"yoff":232,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":-246,"y":-76},{"text":"lég","size":20,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":512,"yoff":232,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-11,"y":107},{"text":"fogyasztó","size":20,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":576,"yoff":232,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-78,"y":-115},{"text":"állat","size":20,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":672,"yoff":232,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-11,"y":28},{"text":"vezető","size":19,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":736,"yoff":232,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":242,"y":95},{"text":"szolgáltató","size":12,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":800,"yoff":232,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-9,"y":-40},{"text":"egészségügy","size":9,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":864,"yoff":232,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":-242,"y":-59},{"text":"europol","size":3,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":928,"yoff":232,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-254,"y":17},{"text":"előfizető","size":3,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":960,"yoff":232,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-135,"y":-8},{"text":"polgár","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":992,"yoff":232,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-227,"y":85},{"text":"veszélyes","size":1,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1024,"yoff":232,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":89,"y":-33}]},{"name":"költségvetési kiadások","major_topic":[1,3,6,13],"words":[{"text":"hozzájárulás","size":80,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":12,"y":-17,"width":448,"height":160,"xoff":0,"yoff":0,"x1":224,"y1":79,"x0":-224,"y0":-61,"hasText":true},{"text":"előirányzat","size":72,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":144,"xoff":448,"yoff":0,"x1":176,"y1":71,"x0":-176,"y0":-55,"hasText":true,"x":-51,"y":-124},{"text":"kiadás","size":62,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":124,"xoff":800,"yoff":0,"x1":112,"y1":61,"x0":-112,"y0":-48,"hasText":true,"x":267,"y":-66},{"text":"költségvetés","size":53,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":106,"xoff":1024,"yoff":0,"x1":144,"y1":52,"x0":-144,"y0":-41,"hasText":true,"x":-43,"y":76},{"text":"felújítás","size":52,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":104,"xoff":1312,"yoff":0,"x1":96,"y1":51,"x0":-96,"y0":-41,"hasText":true,"x":132,"y":119},{"text":"fejlesztés","size":50,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":100,"xoff":1504,"yoff":0,"x1":112,"y1":49,"x0":-112,"y0":-40,"hasText":true,"x":106,"y":-83},{"text":"támogatás","size":48,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":96,"xoff":1728,"yoff":0,"x1":112,"y1":47,"x0":-112,"y0":-37,"hasText":true,"x":-127,"y":-83},{"text":"forint","size":40,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":0,"yoff":160,"x1":64,"y1":39,"x0":-64,"y0":-31,"hasText":true,"x":228,"y":87},{"text":"oktatás","size":35,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":128,"yoff":160,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":277,"y":-36},{"text":"kormányzat","size":35,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":256,"yoff":160,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":-77,"y":15},{"text":"szociális","size":34,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":448,"yoff":160,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":-218,"y":67},{"text":"kölcsön","size":33,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":608,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":142,"y":-126},{"text":"normatív","size":32,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":736,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":145,"y":-154},{"text":"program","size":31,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":896,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-18,"hasText":true,"x":229,"y":49},{"text":"tanuló","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":1024,"yoff":160,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":-232,"y":-117},{"text":"város","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":1120,"yoff":160,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":29,"y":20},{"text":"település","size":27,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1216,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":241,"y":-116},{"text":"felhalmozás","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":1344,"yoff":160,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-167,"y":35},{"text":"minisztériu","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1504,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-214,"y":91},{"text":"intézmény","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1632,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-225,"y":-64},{"text":"elszámolás","size":23,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1760,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":130,"y":3},{"text":"színház","size":21,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1888,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-227,"y":-46},{"text":"iskol","size":20,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":0,"yoff":230,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-31,"y":104},{"text":"egészségügy","size":20,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":64,"yoff":230,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":-209,"y":-3},{"text":"tárgyév","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":192,"yoff":230,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-17,"y":36},{"text":"közoktatás","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":288,"yoff":230,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":99,"y":-174},{"text":"jogcímcsopor","size":18,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":36,"xoff":384,"yoff":230,"x1":64,"y1":17,"x0":-64,"y0":-14,"hasText":true,"x":10,"y":-170},{"text":"főváros","size":18,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":512,"yoff":230,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-7,"y":-80},{"text":"beruházás","size":15,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":608,"yoff":230,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":-243,"y":116},{"text":"juttatás","size":12,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":704,"yoff":230,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-75,"y":89},{"text":"munkaadó","size":11,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":768,"yoff":230,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":240,"y":98},{"text":"járulék","size":11,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":832,"yoff":230,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":-150,"y":92},{"text":"terhelő","size":1,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":896,"yoff":230,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":135,"y":-11},{"text":"kezelésű","size":1,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":928,"yoff":230,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":232,"y":31},{"text":"önkormányzat","size":0,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":960,"yoff":230,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":39,"y":49}]},{"name":"vállalkozások és pénzintézetek","major_topic":[15],"words":[{"text":"felügyelet","size":80,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":176,"y":-41,"width":352,"height":160,"xoff":0,"yoff":0,"x1":176,"y1":79,"x0":-176,"y0":-60,"hasText":true},{"text":"európ","size":70,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":140,"xoff":352,"yoff":0,"x1":112,"y1":69,"x0":-112,"y0":-53,"hasText":true,"x":-40,"y":-47},{"text":"gazdaság","size":61,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":122,"xoff":576,"yoff":0,"x1":144,"y1":60,"x0":-144,"y0":-47,"hasText":true,"x":34,"y":6},{"text":"tpt","size":58,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":116,"xoff":864,"yoff":0,"x1":48,"y1":57,"x0":-48,"y0":-40,"hasText":true,"x":62,"y":48},{"text":"részvénytársaság","size":56,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":416,"height":112,"xoff":960,"yoff":0,"x1":208,"y1":55,"x0":-208,"y0":-44,"hasText":true,"x":90,"y":-117},{"text":"vezető","size":45,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":90,"xoff":1376,"yoff":0,"x1":80,"y1":44,"x0":-80,"y0":-36,"hasText":true,"x":200,"y":7},{"text":"értékpapír","size":45,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":90,"xoff":1536,"yoff":0,"x1":112,"y1":44,"x0":-112,"y0":-36,"hasText":true,"x":-237,"y":-43},{"text":"székhely","size":42,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":84,"xoff":1760,"yoff":0,"x1":96,"y1":41,"x0":-96,"y0":-33,"hasText":true,"x":-163,"y":-119},{"text":"szolgáltató","size":40,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":80,"xoff":0,"yoff":160,"x1":96,"y1":39,"x0":-96,"y0":-32,"hasText":true,"x":184,"y":43},{"text":"cégbíróság","size":35,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":192,"yoff":160,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":-43,"y":48},{"text":"elektronikus","size":32,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":64,"xoff":384,"yoff":160,"x1":96,"y1":31,"x0":-96,"y0":-25,"hasText":true,"x":-188,"y":38},{"text":"részvényes","size":32,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":64,"xoff":576,"yoff":160,"x1":96,"y1":31,"x0":-96,"y0":-25,"hasText":true,"x":-149,"y":5},{"text":"bíróság","size":32,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":768,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":158,"y":73},{"text":"szabadalm","size":32,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":896,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-217,"y":106},{"text":"alapszabály","size":32,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":64,"xoff":1056,"yoff":160,"x1":96,"y1":31,"x0":-96,"y0":-25,"hasText":true,"x":-179,"y":-79},{"text":"forgal","size":32,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":1248,"yoff":160,"x1":48,"y1":31,"x0":-48,"y0":-25,"hasText":true,"x":291,"y":10},{"text":"részesedés","size":28,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":1344,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":-31,"y":84},{"text":"út","size":27,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":54,"xoff":1504,"yoff":160,"x1":32,"y1":26,"x0":-32,"y0":-21,"hasText":true,"x":-139,"y":84},{"text":"könyvvizsgáló","size":27,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":1568,"yoff":160,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":36,"y":114},{"text":"hpt","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":1728,"yoff":160,"x1":32,"y1":25,"x0":-32,"y0":-21,"hasText":true,"x":152,"y":-94},{"text":"külföld","size":26,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1792,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-55,"y":-88},{"text":"vagyon","size":25,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":1888,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-15,"hasText":true,"x":239,"y":63},{"text":"fióktelep","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":0,"yoff":230,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-122,"y":-21},{"text":"hozzájárulás","size":24,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":48,"xoff":96,"yoff":230,"x1":80,"y1":23,"x0":-80,"y0":-20,"hasText":true,"x":-123,"y":-153},{"text":"beszámoló","size":24,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":256,"yoff":230,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":74,"y":-162},{"text":"igazgatóság","size":23,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":384,"yoff":230,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":225,"y":100},{"text":"tőke","size":23,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":512,"yoff":230,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":286,"y":-11},{"text":"végzés","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":576,"yoff":230,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":201,"y":-97},{"text":"okirat","size":22,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":672,"yoff":230,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":53,"y":88},{"text":"társaság","size":13,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":736,"yoff":230,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":-29,"y":-31},{"text":"befektetés","size":10,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":800,"yoff":230,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":-19,"y":17},{"text":"vállalkozás","size":9,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":864,"yoff":230,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":-105,"y":105},{"text":"pénzügy","size":9,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":928,"yoff":230,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":71,"y":-90},{"text":"biztosító","size":9,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":992,"yoff":230,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":-152,"y":-105},{"text":"biztosítás","size":5,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":1056,"yoff":230,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-81,"y":90},{"text":"kockázat","size":3,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1088,"yoff":230,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-73,"y":-42},{"text":"közgyűlés","size":0,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1120,"yoff":230,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-72,"y":-115}]},{"name":"adó és vállalkozások","major_topic":[1,15],"words":[{"text":"magánszemély","size":80,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":200,"y":64,"width":512,"height":160,"xoff":0,"yoff":0,"x1":256,"y1":79,"x0":-256,"y0":-61,"hasText":true},{"text":"adózó","size":79,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":158,"xoff":512,"yoff":0,"x1":128,"y1":78,"x0":-128,"y0":-60,"hasText":true,"x":-129,"y":124},{"text":"szerződő","size":72,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":144,"xoff":768,"yoff":0,"x1":160,"y1":71,"x0":-160,"y0":-55,"hasText":true,"x":-2,"y":17},{"text":"adóév","size":71,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":142,"xoff":1088,"yoff":0,"x1":112,"y1":70,"x0":-112,"y0":-55,"hasText":true,"x":-256,"y":-107},{"text":"belföld","size":53,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":106,"xoff":1312,"yoff":0,"x1":96,"y1":52,"x0":-96,"y0":-40,"hasText":true,"x":-159,"y":58},{"text":"vállalkozó","size":53,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":106,"xoff":1504,"yoff":0,"x1":128,"y1":52,"x0":-128,"y0":-41,"hasText":true,"x":-232,"y":-48},{"text":"jövedel","size":52,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":104,"xoff":1760,"yoff":0,"x1":96,"y1":51,"x0":-96,"y0":-40,"hasText":true,"x":-48,"y":-79},{"text":"adóalany","size":43,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":86,"xoff":0,"yoff":160,"x1":96,"y1":42,"x0":-96,"y0":-35,"hasText":true,"x":36,"y":109},{"text":"vámhatóság","size":41,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":82,"xoff":192,"yoff":160,"x1":112,"y1":40,"x0":-112,"y0":-33,"hasText":true,"x":-56,"y":-124},{"text":"illetőségű","size":38,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":416,"yoff":160,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":-46,"y":-31},{"text":"társaság","size":38,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":76,"xoff":608,"yoff":160,"x1":80,"y1":37,"x0":-80,"y0":-29,"hasText":true,"x":86,"y":-42},{"text":"adóraktár","size":35,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":768,"yoff":160,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":-120,"y":153},{"text":"bevallás","size":34,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":928,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":213,"y":0},{"text":"származó","size":33,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":1056,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":-182,"y":4},{"text":"pénztár","size":32,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1216,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-255,"y":-22},{"text":"szja","size":32,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":1344,"yoff":160,"x1":48,"y1":31,"x0":-48,"y0":-25,"hasText":true,"x":242,"y":-49},{"text":"telephely","size":32,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1440,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":158,"y":-72},{"text":"támogatás","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1600,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-273,"y":99},{"text":"adózás","size":30,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":1760,"yoff":160,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":-1,"y":134},{"text":"fizetés","size":30,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":1888,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-267,"y":29},{"text":"költség","size":26,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":0,"yoff":242,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":145,"y":90},{"text":"egyezmény","size":25,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":96,"yoff":242,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-85,"y":174},{"text":"munkáltató","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":256,"yoff":242,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-280,"y":55},{"text":"forint","size":24,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":384,"yoff":242,"x1":32,"y1":23,"x0":-32,"y0":-20,"hasText":true,"x":63,"y":137},{"text":"forgalm","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":448,"yoff":242,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":183,"y":-32},{"text":"engedélyes","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":544,"yoff":242,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":85,"y":-102},{"text":"gazdaság","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":672,"yoff":242,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-159,"y":-28},{"text":"adókötelezettség","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":44,"xoff":800,"yoff":242,"x1":80,"y1":21,"x0":-80,"y0":-19,"hasText":true,"x":-315,"y":0},{"text":"adómentes","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":960,"yoff":242,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":149,"y":116},{"text":"üzlet","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1088,"yoff":242,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-322,"y":-21},{"text":"jöt","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1152,"yoff":242,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":193,"y":95},{"text":"post","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":1216,"yoff":242,"x1":32,"y1":20,"x0":-32,"y0":-16,"hasText":true,"x":-46,"y":35},{"text":"vagyon","size":21,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1280,"yoff":242,"x1":48,"y1":20,"x0":-48,"y0":-13,"hasText":true,"x":232,"y":109},{"text":"nyereség","size":19,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1376,"yoff":242,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-161,"y":-90},{"text":"adóhatóság","size":9,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":1472,"yoff":242,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":213,"y":-98},{"text":"vállalkozás","size":4,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1536,"yoff":242,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":125,"y":95},{"text":"kifizető","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1568,"yoff":242,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":234,"y":95}]},{"name":"nemzetközi egyezmények","major_topic":[18,19],"words":[{"text":"stat","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":66,"y":34,"width":192,"height":160,"xoff":0,"yoff":0,"x1":96,"y1":79,"x0":-96,"y0":-54,"hasText":true},{"text":"parties","size":62,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":124,"xoff":192,"yoff":0,"x1":112,"y1":61,"x0":-112,"y0":-47,"hasText":true,"x":132,"y":-54},{"text":"szerződő","size":45,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":90,"xoff":416,"yoff":0,"x1":96,"y1":44,"x0":-96,"y0":-36,"hasText":true,"x":197,"y":3},{"text":"nemzetköz","size":43,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":86,"xoff":608,"yoff":0,"x1":112,"y1":42,"x0":-112,"y0":-33,"hasText":true,"x":-5,"y":69},{"text":"europ","size":42,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":84,"xoff":832,"yoff":0,"x1":64,"y1":41,"x0":-64,"y0":-24,"hasText":true,"x":-137,"y":66},{"text":"contracting","size":41,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":82,"xoff":960,"yoff":0,"x1":112,"y1":40,"x0":-112,"y0":-32,"hasText":true,"x":110,"y":96},{"text":"európ","size":40,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":1184,"yoff":0,"x1":64,"y1":39,"x0":-64,"y0":-32,"hasText":true,"x":-33,"y":34},{"text":"international","size":40,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":80,"xoff":1312,"yoff":0,"x1":112,"y1":39,"x0":-112,"y0":-31,"hasText":true,"x":244,"y":-90},{"text":"accordanc","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1536,"yoff":0,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-186,"y":94},{"text":"measures","size":26,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1696,"yoff":0,"x1":64,"y1":25,"x0":-64,"y0":-16,"hasText":true,"x":-31,"y":-5},{"text":"protocol","size":26,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1824,"yoff":0,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-192,"y":41},{"text":"council","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":1920,"yoff":0,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":194,"y":24},{"text":"applicat","size":23,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":0,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":222,"y":71},{"text":"informat","size":23,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":96,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":56,"y":-98},{"text":"paten","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":192,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-16,"hasText":true,"x":199,"y":42},{"text":"bűncselekmény","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":40,"xoff":256,"yoff":160,"x1":80,"y1":19,"x0":-80,"y0":-16,"hasText":true,"x":-140,"y":-14},{"text":"member","size":18,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":416,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-209,"y":-122},{"text":"főtitkár","size":18,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":512,"yoff":160,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":-84,"y":-54},{"text":"szabadalm","size":18,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":576,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":14,"y":-22},{"text":"appropriat","size":17,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":672,"yoff":160,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":84,"y":111},{"text":"reques","size":17,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":768,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-11,"hasText":true,"x":104,"y":47},{"text":"access","size":17,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":832,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-11,"hasText":true,"x":106,"y":63},{"text":"general","size":17,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":896,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":-70,"y":-73},{"text":"authorities","size":17,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":960,"yoff":160,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":16,"y":-64},{"text":"offic","size":17,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1056,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":-43,"y":-22},{"text":"agreemen","size":17,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":1120,"yoff":160,"x1":48,"y1":16,"x0":-48,"y0":-11,"hasText":true,"x":210,"y":-41},{"text":"letét","size":17,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1216,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":116,"y":-39},{"text":"establish","size":16,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":1280,"yoff":160,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":-14,"y":113},{"text":"anyag","size":16,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":32,"xoff":1376,"yoff":160,"x1":32,"y1":15,"x0":-32,"y0":-10,"hasText":true,"x":-216,"y":-88},{"text":"authority","size":16,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":1440,"yoff":160,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":-10,"y":83},{"text":"ratificat","size":16,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":32,"xoff":1536,"yoff":160,"x1":32,"y1":15,"x0":-32,"y0":-13,"hasText":true,"x":117,"y":-25},{"text":"presen","size":15,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":1600,"yoff":160,"x1":32,"y1":14,"x0":-32,"y0":-10,"hasText":true,"x":-4,"y":-79},{"text":"national","size":15,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":1664,"yoff":160,"x1":32,"y1":14,"x0":-32,"y0":-13,"hasText":true,"x":149,"y":115},{"text":"territory","size":15,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":1728,"yoff":160,"x1":32,"y1":14,"x0":-32,"y0":-13,"hasText":true,"x":-50,"y":-88},{"text":"csatlakozás","size":15,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":1792,"yoff":160,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":239,"y":87},{"text":"committe","size":15,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":1888,"yoff":160,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":-216,"y":107},{"text":"apply","size":14,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":28,"xoff":0,"yoff":206,"x1":32,"y1":13,"x0":-32,"y0":-12,"hasText":true,"x":171,"y":68},{"text":"convent","size":10,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":64,"yoff":206,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":-132,"y":-103},{"text":"pers","size":1,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":128,"yoff":206,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-179,"y":5},{"text":"egyezmény","size":0,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":160,"yoff":206,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-166,"y":-3}]},{"name":"igazságügyi rendszer és felügyelet","major_topic":[12],"words":[{"text":"közbeszerzés","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-50,"y":58,"width":480,"height":160,"xoff":0,"yoff":0,"x1":240,"y1":79,"x0":-240,"y0":-61,"hasText":true},{"text":"ajánlatkérő","size":70,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":140,"xoff":480,"yoff":0,"x1":176,"y1":69,"x0":-176,"y0":-53,"hasText":true,"x":224,"y":-6},{"text":"egyezmény","size":66,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":132,"xoff":832,"yoff":0,"x1":176,"y1":65,"x0":-176,"y0":-51,"hasText":true,"x":135,"y":-118},{"text":"csatlakozás","size":60,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":120,"xoff":1184,"yoff":0,"x1":160,"y1":59,"x0":-160,"y0":-47,"hasText":true,"x":-213,"y":-92},{"text":"tagállam","size":54,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":108,"xoff":1504,"yoff":0,"x1":112,"y1":53,"x0":-112,"y0":-42,"hasText":true,"x":-73,"y":-26},{"text":"román","size":53,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":106,"xoff":1728,"yoff":0,"x1":96,"y1":52,"x0":-96,"y0":-41,"hasText":true,"x":-226,"y":-48},{"text":"támogatás","size":46,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":92,"xoff":0,"yoff":160,"x1":112,"y1":45,"x0":-112,"y0":-36,"hasText":true,"x":249,"y":32},{"text":"határidő","size":43,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":224,"yoff":160,"x1":80,"y1":42,"x0":-80,"y0":-35,"hasText":true,"x":-200,"y":104},{"text":"unió","size":43,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":86,"xoff":384,"yoff":160,"x1":64,"y1":42,"x0":-64,"y0":-35,"hasText":true,"x":-62,"y":12},{"text":"hirdetmény","size":36,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":72,"xoff":512,"yoff":160,"x1":96,"y1":35,"x0":-96,"y0":-28,"hasText":true,"x":-184,"y":133},{"text":"bulgár","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":704,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":-198,"y":-16},{"text":"ország","size":32,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":832,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-63,"y":94},{"text":"ügyfél","size":32,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":960,"yoff":160,"x1":48,"y1":31,"x0":-48,"y0":-25,"hasText":true,"x":-46,"y":-110},{"text":"ajánlattevő","size":32,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1056,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":239,"y":-61},{"text":"út","size":31,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":62,"xoff":1216,"yoff":160,"x1":32,"y1":30,"x0":-32,"y0":-24,"hasText":true,"x":90,"y":116},{"text":"bűncselekmény","size":29,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":58,"xoff":1280,"yoff":160,"x1":112,"y1":28,"x0":-112,"y0":-23,"hasText":true,"x":209,"y":-170},{"text":"igazságügy","size":29,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1504,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":81,"y":85},{"text":"irat","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":54,"xoff":1664,"yoff":160,"x1":32,"y1":26,"x0":-32,"y0":-21,"hasText":true,"x":-91,"y":117},{"text":"ügyész","size":26,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1728,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-273,"y":-24},{"text":"királyság","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1824,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":67,"y":-51},{"text":"fellebbezés","size":24,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":0,"yoff":246,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":192,"y":-87},{"text":"közigazgatás","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":128,"yoff":246,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":25,"y":-3},{"text":"megkereset","size":22,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":256,"yoff":246,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":89,"y":-73},{"text":"gazdaság","size":21,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":384,"yoff":246,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":307,"y":-88},{"text":"nemzetköz","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":480,"yoff":246,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-168,"y":153},{"text":"végzés","size":20,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":608,"yoff":246,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-124,"y":-65},{"text":"hivatalos","size":20,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":704,"yoff":246,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-295,"y":70},{"text":"btk","size":20,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":800,"yoff":246,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-75,"y":-72},{"text":"pénzügy","size":20,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":864,"yoff":246,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-118,"y":-140},{"text":"kbt","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":960,"yoff":246,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":-20,"y":123},{"text":"nyilatkozat","size":19,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1024,"yoff":246,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":141,"y":110},{"text":"európ","size":11,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":22,"xoff":1120,"yoff":246,"x1":16,"y1":10,"x0":-16,"y0":-10,"hasText":true,"x":63,"y":-34},{"text":"irányelv","size":4,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1152,"yoff":246,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-128,"y":88},{"text":"tárgyalás","size":2,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1184,"yoff":246,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-71,"y":-14},{"text":"költség","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1216,"yoff":246,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":12,"y":-56},{"text":"ajánlattétel","size":2,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1248,"yoff":246,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-15,"y":-22},{"text":"lábjegyzet","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1280,"yoff":246,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":118,"y":-95},{"text":"bíróság","size":1,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1312,"yoff":246,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":122,"y":37}]}]},{"id":"2006-2010","topics":[{"name":"szállítás és veszélyes anyagok","major_topic":[7,1],"words":[{"text":"szállítás","size":80,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-93,"y":-70,"width":320,"height":160,"xoff":0,"yoff":0,"x1":160,"y1":79,"x0":-160,"y0":-61,"hasText":true},{"text":"folyékony","size":78,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":156,"xoff":320,"yoff":0,"x1":176,"y1":77,"x0":-176,"y0":-60,"hasText":true,"x":-247,"y":67},{"text":"szilár","size":58,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":116,"xoff":672,"yoff":0,"x1":80,"y1":57,"x0":-80,"y0":-45,"hasText":true,"x":-2,"y":114},{"text":"csomagolás","size":54,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":108,"xoff":832,"yoff":0,"x1":144,"y1":53,"x0":-144,"y0":-42,"hasText":true,"x":58,"y":-131},{"text":"osztály","size":51,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":102,"xoff":1120,"yoff":0,"x1":96,"y1":50,"x0":-96,"y0":-40,"hasText":true,"x":241,"y":-32},{"text":"veszélyes","size":49,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":1312,"yoff":0,"x1":112,"y1":48,"x0":-112,"y0":-39,"hasText":true,"x":-48,"y":155},{"text":"mérgező","size":48,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":96,"xoff":1536,"yoff":0,"x1":96,"y1":47,"x0":-96,"y0":-37,"hasText":true,"x":-206,"y":-31},{"text":"gyúlékony","size":47,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":94,"xoff":1728,"yoff":0,"x1":112,"y1":46,"x0":-112,"y0":-37,"hasText":true,"x":26,"y":-28},{"text":"gáz","size":37,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":74,"xoff":0,"yoff":160,"x1":48,"y1":36,"x0":-48,"y0":-29,"hasText":true,"x":154,"y":42},{"text":"víz","size":34,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":68,"xoff":96,"yoff":160,"x1":32,"y1":33,"x0":-32,"y0":-27,"hasText":true,"x":-108,"y":-28},{"text":"rakománytartály","size":34,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":68,"xoff":160,"yoff":160,"x1":128,"y1":33,"x0":-128,"y0":-27,"hasText":true,"x":-216,"y":0},{"text":"kevere","size":33,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":416,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":180,"y":-62},{"text":"szerves","size":31,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":544,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-18,"hasText":true,"x":28,"y":32},{"text":"maró","size":30,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":672,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":90,"y":-56},{"text":"típusú","size":30,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":768,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":164,"y":-105},{"text":"≤","size":30,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":60,"xoff":864,"yoff":160,"x1":32,"y1":29,"x0":-32,"y0":-20,"hasText":true,"x":48,"y":57},{"text":"tömeg","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":928,"yoff":160,"x1":48,"y1":28,"x0":-48,"y0":-21,"hasText":true,"x":65,"y":0},{"text":"replac","size":27,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1024,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":62,"y":-101},{"text":"tétel","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":1120,"yoff":160,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":115,"y":-81},{"text":"follows","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":1184,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-235,"y":89},{"text":"anyag","size":23,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1280,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-14,"hasText":true,"x":162,"y":101},{"text":"tartány","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1376,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-90,"y":76},{"text":"kpa","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":1472,"yoff":160,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":-92,"y":38},{"text":"lenn","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1536,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-15,"y":69},{"text":"áru","size":22,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1600,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-146,"y":-118},{"text":"táblázat","size":21,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1664,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":144,"y":-25},{"text":"bizonyítvány","size":20,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":1760,"yoff":160,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":167,"y":-8},{"text":"material","size":19,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1888,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":118,"y":19},{"text":"nyomás","size":19,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":0,"yoff":228,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-84,"y":-4},{"text":"konténer","size":18,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":96,"yoff":228,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-197,"y":107},{"text":"csoport","size":18,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":192,"yoff":228,"x1":48,"y1":17,"x0":-48,"y0":-13,"hasText":true,"x":-177,"y":19},{"text":"con","size":18,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":288,"yoff":228,"x1":32,"y1":17,"x0":-32,"y0":-11,"hasText":true,"x":-86,"y":88},{"text":"hőmérséklet","size":17,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":352,"yoff":228,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":221,"y":-130},{"text":"mnn","size":8,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":16,"xoff":448,"yoff":228,"x1":16,"y1":7,"x0":-16,"y0":-6,"hasText":true,"x":-142,"y":10},{"text":"hajó","size":5,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":480,"yoff":228,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-37,"y":-8},{"text":"tox","size":3,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":512,"yoff":228,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-23,"y":30},{"text":"tartály","size":3,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":544,"yoff":228,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-19,"y":73},{"text":"megjegyzés","size":3,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":576,"yoff":228,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-116,"y":82},{"text":"küldeménydarab","size":3,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":608,"yoff":228,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":185,"y":-83},{"text":"amen","size":2,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":640,"yoff":228,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":60,"y":63}]},{"name":"adók","major_topic":[1],"words":[{"text":"adóhatóság","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-190,"y":47,"width":416,"height":160,"xoff":0,"yoff":0,"x1":208,"y1":79,"x0":-208,"y0":-61,"hasText":true},{"text":"munkáltató","size":61,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":122,"xoff":416,"yoff":0,"x1":144,"y1":60,"x0":-144,"y0":-47,"hasText":true,"x":102,"y":102},{"text":"támogatás","size":57,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":114,"xoff":704,"yoff":0,"x1":144,"y1":56,"x0":-144,"y0":-44,"hasText":true,"x":-191,"y":-16},{"text":"vállalkozó","size":57,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":114,"xoff":992,"yoff":0,"x1":128,"y1":56,"x0":-128,"y0":-44,"hasText":true,"x":-44,"y":-70},{"text":"vezető","size":52,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":104,"xoff":1248,"yoff":0,"x1":96,"y1":51,"x0":-96,"y0":-41,"hasText":true,"x":59,"y":53},{"text":"magánszemély","size":51,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":102,"xoff":1440,"yoff":0,"x1":176,"y1":50,"x0":-176,"y0":-40,"hasText":true,"x":63,"y":-20},{"text":"adóév","size":51,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":102,"xoff":1792,"yoff":0,"x1":80,"y1":50,"x0":-80,"y0":-40,"hasText":true,"x":215,"y":-86},{"text":"adózó","size":50,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":100,"xoff":0,"yoff":160,"x1":80,"y1":49,"x0":-80,"y0":-40,"hasText":true,"x":179,"y":39},{"text":"jogviszony","size":48,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":96,"xoff":160,"yoff":160,"x1":112,"y1":47,"x0":-112,"y0":-36,"hasText":true,"x":67,"y":-116},{"text":"egészségügy","size":48,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":96,"xoff":384,"yoff":160,"x1":144,"y1":47,"x0":-144,"y0":-37,"hasText":true,"x":-241,"y":-112},{"text":"szolgálat","size":39,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":672,"yoff":160,"x1":80,"y1":38,"x0":-80,"y0":-32,"hasText":true,"x":301,"y":38},{"text":"foglalkoztatás","size":36,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":72,"xoff":832,"yoff":160,"x1":112,"y1":35,"x0":-112,"y0":-28,"hasText":true,"x":-74,"y":-154},{"text":"adóalany","size":32,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1056,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":117,"y":-63},{"text":"képzés","size":32,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1216,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-184,"y":-55},{"text":"egészségbiztosítás","size":30,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":60,"xoff":1344,"yoff":160,"x1":128,"y1":29,"x0":-128,"y0":-24,"hasText":true,"x":-127,"y":-183},{"text":"gazdaság","size":30,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1600,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":54,"y":9},{"text":"munkavállaló","size":28,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":1760,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":-285,"y":-83},{"text":"gyógyszer","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":0,"yoff":256,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-299,"y":-167},{"text":"elektronikus","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":128,"yoff":256,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":225,"y":-132},{"text":"bevallás","size":27,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":288,"yoff":256,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-324,"y":-57},{"text":"társadalombiztosítás","size":26,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":52,"xoff":416,"yoff":256,"x1":112,"y1":25,"x0":-112,"y0":-21,"hasText":true,"x":279,"y":-61},{"text":"felsőoktatás","size":26,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":640,"yoff":256,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":39,"y":126},{"text":"járule","size":25,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":800,"yoff":256,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":229,"y":-5},{"text":"jövedel","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":896,"yoff":256,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":263,"y":65},{"text":"vámhatóság","size":24,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":992,"yoff":256,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":79,"y":-154},{"text":"jogosultság","size":24,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1120,"yoff":256,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-407,"y":-99},{"text":"keret","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":1248,"yoff":256,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":-195,"y":70},{"text":"költség","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1312,"yoff":256,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":246,"y":-42},{"text":"mezőgazdaság","size":23,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":1408,"yoff":256,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":64,"y":-184},{"text":"külföld","size":22,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1568,"yoff":256,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-256,"y":-144},{"text":"nyugdíj","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1664,"yoff":256,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-62,"y":-119},{"text":"szja","size":21,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":1760,"yoff":256,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":174,"y":58},{"text":"fizetés","size":21,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1824,"yoff":256,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-174,"y":-83},{"text":"tárgyév","size":21,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1920,"yoff":256,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":256,"y":93},{"text":"út","size":21,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":42,"xoff":0,"yoff":310,"x1":16,"y1":20,"x0":-16,"y0":-17,"hasText":true,"x":46,"y":-50},{"text":"társaság","size":3,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":32,"yoff":310,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-202,"y":84},{"text":"szt","size":2,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":64,"yoff":310,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":148,"y":10},{"text":"juttatás","size":2,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":96,"yoff":310,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-89,"y":-116}]},{"name":"igazságügyi rendszer és felügyelet","major_topic":[12],"words":[{"text":"elektronikus","size":80,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":30,"y":-65,"width":416,"height":160,"xoff":0,"yoff":0,"x1":208,"y1":79,"x0":-208,"y0":-60,"hasText":true},{"text":"vezető","size":62,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":124,"xoff":416,"yoff":0,"x1":112,"y1":61,"x0":-112,"y0":-48,"hasText":true,"x":-18,"y":6},{"text":"gazdaság","size":60,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":120,"xoff":640,"yoff":0,"x1":144,"y1":59,"x0":-144,"y0":-47,"hasText":true,"x":135,"y":-126},{"text":"közigazgatás","size":59,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":118,"xoff":928,"yoff":0,"x1":176,"y1":58,"x0":-176,"y0":-45,"hasText":true,"x":-118,"y":-127},{"text":"bűncselekmény","size":58,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":384,"height":116,"xoff":1280,"yoff":0,"x1":192,"y1":57,"x0":-192,"y0":-45,"hasText":true,"x":-5,"y":100},{"text":"közjegyző","size":58,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":116,"xoff":1664,"yoff":0,"x1":128,"y1":57,"x0":-128,"y0":-45,"hasText":true,"x":244,"y":-20},{"text":"határidő","size":55,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":110,"xoff":0,"yoff":160,"x1":112,"y1":54,"x0":-112,"y0":-42,"hasText":true,"x":-126,"y":52},{"text":"végzés","size":54,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":108,"xoff":224,"yoff":160,"x1":96,"y1":53,"x0":-96,"y0":-42,"hasText":true,"x":-168,"y":2},{"text":"európ","size":54,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":108,"xoff":416,"yoff":160,"x1":80,"y1":53,"x0":-80,"y0":-42,"hasText":true,"x":61,"y":141},{"text":"igazságügy","size":51,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":102,"xoff":576,"yoff":160,"x1":128,"y1":50,"x0":-128,"y0":-40,"hasText":true,"x":94,"y":47},{"text":"polgár","size":48,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":96,"xoff":832,"yoff":160,"x1":80,"y1":47,"x0":-80,"y0":-37,"hasText":true,"x":-213,"y":-86},{"text":"út","size":46,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":92,"xoff":992,"yoff":160,"x1":32,"y1":45,"x0":-32,"y0":-36,"hasText":true,"x":73,"y":-10},{"text":"szolgálat","size":46,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":92,"xoff":1056,"yoff":160,"x1":96,"y1":45,"x0":-96,"y0":-36,"hasText":true,"x":287,"y":-69},{"text":"vagyon","size":43,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":1248,"yoff":160,"x1":80,"y1":42,"x0":-80,"y0":-25,"hasText":true,"x":-237,"y":82},{"text":"társaság","size":41,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":82,"xoff":1408,"yoff":160,"x1":80,"y1":40,"x0":-80,"y0":-33,"hasText":true,"x":321,"y":-106},{"text":"nemzetköz","size":41,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":82,"xoff":1568,"yoff":160,"x1":112,"y1":40,"x0":-112,"y0":-32,"hasText":true,"x":255,"y":88},{"text":"vállalkozás","size":40,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":80,"xoff":1792,"yoff":160,"x1":112,"y1":39,"x0":-112,"y0":-32,"hasText":true,"x":-93,"y":138},{"text":"gyerm","size":40,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":0,"yoff":268,"x1":64,"y1":39,"x0":-64,"y0":-23,"hasText":true,"x":-266,"y":-52},{"text":"törvényerejű","size":40,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":80,"xoff":128,"yoff":268,"x1":112,"y1":39,"x0":-112,"y0":-32,"hasText":true,"x":-269,"y":117},{"text":"természetes","size":40,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":80,"xoff":352,"yoff":268,"x1":112,"y1":39,"x0":-112,"y0":-32,"hasText":true,"x":-40,"y":-175},{"text":"költség","size":39,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":576,"yoff":268,"x1":80,"y1":38,"x0":-80,"y0":-32,"hasText":true,"x":256,"y":45},{"text":"jogerős","size":39,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":736,"yoff":268,"x1":80,"y1":38,"x0":-80,"y0":-31,"hasText":true,"x":211,"y":123},{"text":"btk","size":38,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":76,"xoff":896,"yoff":268,"x1":48,"y1":37,"x0":-48,"y0":-29,"hasText":true,"x":269,"y":-141},{"text":"képviselő","size":38,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":992,"yoff":268,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":366,"y":16},{"text":"egészségügy","size":38,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":76,"xoff":1184,"yoff":268,"x1":112,"y1":37,"x0":-112,"y0":-29,"hasText":true,"x":150,"y":-182},{"text":"egyezmény","size":37,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":1408,"yoff":268,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":-122,"y":169},{"text":"engedélyes","size":37,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":1600,"yoff":268,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":5,"y":-208},{"text":"hiány","size":37,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":74,"xoff":1792,"yoff":268,"x1":64,"y1":36,"x0":-64,"y0":-29,"hasText":true,"x":-250,"y":44},{"text":"követelés","size":36,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":0,"yoff":348,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":-52,"y":-35},{"text":"felhasználó","size":36,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":72,"xoff":160,"yoff":348,"x1":96,"y1":35,"x0":-96,"y0":-28,"hasText":true,"x":-213,"y":-176},{"text":"kereskedelm","size":35,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":352,"yoff":348,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":-166,"y":-209},{"text":"közlekedés","size":35,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":544,"yoff":348,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":400,"y":54},{"text":"bűnügy","size":35,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":736,"yoff":348,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":138,"y":-220},{"text":"hozzájárulás","size":34,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":68,"xoff":864,"yoff":348,"x1":96,"y1":33,"x0":-96,"y0":-27,"hasText":true,"x":63,"y":175},{"text":"irat","size":34,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":68,"xoff":1056,"yoff":348,"x1":32,"y1":33,"x0":-32,"y0":-27,"hasText":true,"x":117,"y":5},{"text":"lábjegyzet","size":33,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":1120,"yoff":348,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":-308,"y":-19},{"text":"bíróság","size":18,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1280,"yoff":348,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":67,"y":-47},{"text":"szakértő","size":8,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":1376,"yoff":348,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":68,"y":-114},{"text":"kihirdetéséről","size":4,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1440,"yoff":348,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-152,"y":64},{"text":"szülő","size":3,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1472,"yoff":348,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-24,"y":105}]},{"name":"nemzetközi egyezmények","major_topic":[18,19],"words":[{"text":"convent","size":80,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":201,"y":-125,"width":288,"height":160,"xoff":0,"yoff":0,"x1":144,"y1":79,"x0":-144,"y0":-54,"hasText":true},{"text":"contracting","size":71,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":142,"xoff":288,"yoff":0,"x1":176,"y1":70,"x0":-176,"y0":-53,"hasText":true,"x":4,"y":-82},{"text":"agreemen","size":46,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":92,"xoff":640,"yoff":0,"x1":112,"y1":45,"x0":-112,"y0":-26,"hasText":true,"x":154,"y":12},{"text":"europ","size":44,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":88,"xoff":864,"yoff":0,"x1":64,"y1":43,"x0":-64,"y0":-25,"hasText":true,"x":194,"y":-75},{"text":"nemzetköz","size":43,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":86,"xoff":992,"yoff":0,"x1":112,"y1":42,"x0":-112,"y0":-33,"hasText":true,"x":-224,"y":86},{"text":"international","size":42,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":84,"xoff":1216,"yoff":0,"x1":128,"y1":41,"x0":-128,"y0":-32,"hasText":true,"x":201,"y":-15},{"text":"protocol","size":40,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":80,"xoff":1472,"yoff":0,"x1":80,"y1":39,"x0":-80,"y0":-31,"hasText":true,"x":-46,"y":0},{"text":"accordanc","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":1632,"yoff":0,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":232,"y":35},{"text":"európ","size":36,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":1824,"yoff":0,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":-206,"y":-96},{"text":"informat","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":0,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":34,"y":-152},{"text":"member","size":29,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":128,"yoff":160,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":-235,"y":41},{"text":"measures","size":28,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":256,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-17,"hasText":true,"x":67,"y":91},{"text":"general","size":23,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":384,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-210,"y":105},{"text":"persons","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":480,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-14,"hasText":true,"x":246,"y":55},{"text":"applicat","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":576,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-59,"y":18},{"text":"including","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":672,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":9,"y":-134},{"text":"appropriat","size":21,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":768,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":61,"y":-22},{"text":"apply","size":21,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":864,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":-246,"y":-60},{"text":"national","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":928,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-193,"y":-55},{"text":"paten","size":19,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":1024,"yoff":160,"x1":32,"y1":18,"x0":-32,"y0":-15,"hasText":true,"x":249,"y":-62},{"text":"thes","size":19,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":1088,"yoff":160,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":218,"y":-108},{"text":"access","size":18,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":1152,"yoff":160,"x1":32,"y1":17,"x0":-32,"y0":-11,"hasText":true,"x":-236,"y":-84},{"text":"damag","size":17,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1216,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":135,"y":42},{"text":"committe","size":17,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":1280,"yoff":160,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":186,"y":-43},{"text":"fun","size":17,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":34,"xoff":1376,"yoff":160,"x1":16,"y1":16,"x0":-16,"y0":-14,"hasText":true,"x":-103,"y":-24},{"text":"rights","size":17,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1408,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":-160,"y":-78},{"text":"reques","size":16,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":32,"xoff":1472,"yoff":160,"x1":32,"y1":15,"x0":-32,"y0":-10,"hasText":true,"x":166,"y":-61},{"text":"szabadalm","size":16,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":1536,"yoff":160,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":-83,"y":-123},{"text":"entry","size":15,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":1632,"yoff":160,"x1":32,"y1":14,"x0":-32,"y0":-12,"hasText":true,"x":-134,"y":-126},{"text":"rules","size":15,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":1696,"yoff":160,"x1":32,"y1":14,"x0":-32,"y0":-13,"hasText":true,"x":-212,"y":123},{"text":"unit","size":15,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":30,"xoff":1760,"yoff":160,"x1":16,"y1":14,"x0":-16,"y0":-13,"hasText":true,"x":190,"y":-112},{"text":"stat","size":11,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":22,"xoff":1792,"yoff":160,"x1":16,"y1":10,"x0":-16,"y0":-10,"hasText":true,"x":-173,"y":53},{"text":"egyezmény","size":10,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":1824,"yoff":160,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":-199,"y":133},{"text":"szerződő","size":8,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":1888,"yoff":160,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":-217,"y":-75},{"text":"parties","size":6,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":12,"xoff":1952,"yoff":160,"x1":16,"y1":5,"x0":-16,"y0":-6,"hasText":true,"x":155,"y":-106},{"text":"annex","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1984,"yoff":160,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-238,"y":-78},{"text":"council","size":1,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":0,"yoff":218,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":222,"y":-47},{"text":"információ","size":0,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":32,"yoff":218,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-89,"y":-38},{"text":"thos","size":0,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":64,"yoff":218,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-66,"y":6}]},{"name":"vállalkozások és pénzintézetek","major_topic":[15],"words":[{"text":"felügyelet","size":80,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":156,"y":-2,"width":352,"height":160,"xoff":0,"yoff":0,"x1":176,"y1":79,"x0":-176,"y0":-60,"hasText":true},{"text":"intézmény","size":70,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":140,"xoff":352,"yoff":0,"x1":160,"y1":69,"x0":-160,"y0":-53,"hasText":true,"x":-178,"y":-23},{"text":"könyvvizsgáló","size":62,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":384,"height":124,"xoff":672,"yoff":0,"x1":192,"y1":61,"x0":-192,"y0":-48,"hasText":true,"x":-57,"y":-89},{"text":"európ","size":54,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":108,"xoff":1056,"yoff":0,"x1":80,"y1":53,"x0":-80,"y0":-42,"hasText":true,"x":-162,"y":70},{"text":"társaság","size":49,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":1216,"yoff":0,"x1":112,"y1":48,"x0":-112,"y0":-39,"hasText":true,"x":-314,"y":-81},{"text":"egészségügy","size":48,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":96,"xoff":1440,"yoff":0,"x1":144,"y1":47,"x0":-144,"y0":-37,"hasText":true,"x":-110,"y":22},{"text":"vasút","size":47,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":94,"xoff":1728,"yoff":0,"x1":64,"y1":46,"x0":-64,"y0":-37,"hasText":true,"x":152,"y":-107},{"text":"vezető","size":42,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1856,"yoff":0,"x1":80,"y1":41,"x0":-80,"y0":-33,"hasText":true,"x":180,"y":-61},{"text":"fizetés","size":41,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":82,"xoff":0,"yoff":160,"x1":80,"y1":40,"x0":-80,"y0":-33,"hasText":true,"x":268,"y":34},{"text":"ügyfél","size":36,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":160,"yoff":160,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":-268,"y":11},{"text":"foglalkoztató","size":36,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":72,"xoff":288,"yoff":160,"x1":112,"y1":35,"x0":-112,"y0":-28,"hasText":true,"x":320,"y":-74},{"text":"viszontbiztosító","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":66,"xoff":512,"yoff":160,"x1":112,"y1":32,"x0":-112,"y0":-25,"hasText":true,"x":4,"y":-138},{"text":"székhely","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":736,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":57,"y":31},{"text":"irányelv","size":32,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":896,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-355,"y":-55},{"text":"hpt","size":31,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":62,"xoff":1024,"yoff":160,"x1":32,"y1":30,"x0":-32,"y0":-24,"hasText":true,"x":-72,"y":-69},{"text":"tpt","size":30,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":60,"xoff":1088,"yoff":160,"x1":32,"y1":29,"x0":-32,"y0":-22,"hasText":true,"x":140,"y":39},{"text":"közbeszerzés","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":58,"xoff":1152,"yoff":160,"x1":96,"y1":28,"x0":-96,"y0":-23,"hasText":true,"x":-23,"y":55},{"text":"hitelintéz","size":28,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1344,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":149,"y":68},{"text":"gazdaság","size":28,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1472,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-362,"y":-15},{"text":"kockázat","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1600,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":55,"y":82},{"text":"elektronikus","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":1728,"yoff":160,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":-59,"y":90},{"text":"részesedés","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":0,"yoff":232,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":256,"y":-104},{"text":"végzés","size":25,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":160,"yoff":232,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":79,"y":-68},{"text":"szabályzat","size":25,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":256,"yoff":232,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":43,"y":-167},{"text":"ebp","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":384,"yoff":232,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":72,"y":60},{"text":"közszolgáltatás","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":48,"xoff":448,"yoff":232,"x1":80,"y1":23,"x0":-80,"y0":-20,"hasText":true,"x":-285,"y":44},{"text":"piac","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":608,"yoff":232,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":-60,"y":108},{"text":"vállalkozás","size":13,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":26,"xoff":672,"yoff":232,"x1":48,"y1":12,"x0":-48,"y0":-12,"hasText":true,"x":261,"y":-125},{"text":"befektetés","size":12,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":768,"yoff":232,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-200,"y":-12},{"text":"szolgáltató","size":10,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":832,"yoff":232,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":-114,"y":-12},{"text":"pénzügy","size":10,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":896,"yoff":232,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":-81,"y":-124},{"text":"biztosító","size":5,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":960,"yoff":232,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-199,"y":77},{"text":"pénzforgalm","size":4,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":992,"yoff":232,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-30,"y":108},{"text":"biztosítás","size":3,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1024,"yoff":232,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":10,"y":35},{"text":"tájékoztatás","size":3,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1056,"yoff":232,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":115,"y":72},{"text":"kam","size":2,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1088,"yoff":232,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":8,"y":11},{"text":"nyugdíjszolgáltató","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1120,"yoff":232,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-141,"y":25},{"text":"keret","size":2,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1152,"yoff":232,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":180,"y":-66},{"text":"tőke","size":0,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1184,"yoff":232,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":179,"y":-52}]},{"name":"Európai Unió és közlekedés","major_topic":[10,19],"words":[{"text":"tagállam","size":80,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":35,"y":-97,"width":320,"height":160,"xoff":0,"yoff":0,"x1":160,"y1":79,"x0":-160,"y0":-61,"hasText":true},{"text":"erdő","size":42,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":84,"xoff":320,"yoff":0,"x1":64,"y1":41,"x0":-64,"y0":-33,"hasText":true,"x":195,"y":-8},{"text":"nemzetköz","size":40,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":80,"xoff":448,"yoff":0,"x1":96,"y1":39,"x0":-96,"y0":-31,"hasText":true,"x":82,"y":17},{"text":"közlekedés","size":36,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":72,"xoff":640,"yoff":0,"x1":96,"y1":35,"x0":-96,"y0":-28,"hasText":true,"x":28,"y":83},{"text":"terv","size":35,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":70,"xoff":832,"yoff":0,"x1":48,"y1":34,"x0":-48,"y0":-26,"hasText":true,"x":-170,"y":-57},{"text":"térség","size":35,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":928,"yoff":0,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":145,"y":86},{"text":"fuvarozó","size":35,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":1056,"yoff":0,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":69,"y":-67},{"text":"légitársaság","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1216,"yoff":0,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-108,"y":-17},{"text":"nabucc","size":28,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1376,"yoff":0,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":61,"y":-15},{"text":"hatáskör","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1472,"yoff":0,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":32,"y":114},{"text":"védelm","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1600,"yoff":0,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":-116,"y":25},{"text":"parlamen","size":27,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1696,"yoff":0,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":241,"y":12},{"text":"vasút","size":27,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1824,"yoff":0,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":115,"y":-144},{"text":"közlöny","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1920,"yoff":0,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":65,"y":-44},{"text":"biztonság","size":26,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":0,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":205,"y":-103},{"text":"műszak","size":26,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":128,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-25,"y":-144},{"text":"keret","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":224,"yoff":160,"x1":32,"y1":23,"x0":-32,"y0":-20,"hasText":true,"x":105,"y":106},{"text":"légiközlekedés","size":23,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":288,"yoff":160,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":190,"y":-64},{"text":"bíróság","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":448,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":145,"y":-39},{"text":"település","size":22,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":544,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-28,"y":-58},{"text":"övezet","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":640,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-18,"hasText":true,"x":189,"y":-84},{"text":"erdészet","size":22,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":736,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-103,"y":-45},{"text":"gazdaság","size":22,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":832,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-127,"y":-85},{"text":"működéséről","size":22,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":928,"yoff":160,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":-235,"y":-36},{"text":"fuvarozás","size":21,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1056,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-217,"y":-10},{"text":"utas","size":20,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1152,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-15,"hasText":true,"x":65,"y":130},{"text":"aktus","size":20,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1216,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-142,"y":107},{"text":"carrier","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":1280,"yoff":160,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":-50,"y":124},{"text":"európ","size":17,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1344,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":-48,"y":97},{"text":"polgár","size":17,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1408,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":-5,"y":50},{"text":"carriag","size":17,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1472,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":226,"y":95},{"text":"szabadság","size":16,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":1536,"yoff":160,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":213,"y":-42},{"text":"albekezdés","size":16,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":1632,"yoff":160,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":115,"y":54},{"text":"főú","size":3,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1728,"yoff":160,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":63,"y":90},{"text":"társul","size":2,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1760,"yoff":160,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":150,"y":-54},{"text":"unió","size":1,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1792,"yoff":160,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":118,"y":26},{"text":"királyság","size":1,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1824,"yoff":160,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":99,"y":122},{"text":"építés","size":1,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1856,"yoff":160,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":189,"y":-12}]},{"name":"Európai Unió és jogok","major_topic":[19],"words":[{"text":"tagállam","size":80,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-17,"y":110,"width":320,"height":160,"xoff":0,"yoff":0,"x1":160,"y1":79,"x0":-160,"y0":-61,"hasText":true},{"text":"élettárs","size":76,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":152,"xoff":320,"yoff":0,"x1":144,"y1":75,"x0":-144,"y0":-58,"hasText":true,"x":92,"y":170},{"text":"svájc","size":70,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":140,"xoff":608,"yoff":0,"x1":96,"y1":69,"x0":-96,"y0":-53,"hasText":true,"x":-34,"y":-7},{"text":"okmány","size":63,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":126,"xoff":800,"yoff":0,"x1":128,"y1":62,"x0":-128,"y0":-49,"hasText":true,"x":122,"y":64},{"text":"irányelv","size":63,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":126,"xoff":1056,"yoff":0,"x1":112,"y1":62,"x0":-112,"y0":-49,"hasText":true,"x":105,"y":-80},{"text":"unió","size":58,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":116,"xoff":1280,"yoff":0,"x1":80,"y1":57,"x0":-80,"y0":-45,"hasText":true,"x":-211,"y":105},{"text":"államhatár","size":54,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":108,"xoff":1440,"yoff":0,"x1":128,"y1":53,"x0":-128,"y0":-42,"hasText":true,"x":168,"y":14},{"text":"elismerés","size":49,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":1696,"yoff":0,"x1":112,"y1":48,"x0":-112,"y0":-39,"hasText":true,"x":-59,"y":45},{"text":"schengen","size":48,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":96,"xoff":0,"yoff":160,"x1":112,"y1":47,"x0":-112,"y0":-36,"hasText":true,"x":258,"y":-115},{"text":"királyság","size":46,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":92,"xoff":224,"yoff":160,"x1":96,"y1":45,"x0":-96,"y0":-36,"hasText":true,"x":217,"y":-29},{"text":"országbel","size":45,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":90,"xoff":416,"yoff":160,"x1":112,"y1":44,"x0":-112,"y0":-36,"hasText":true,"x":210,"y":109},{"text":"út","size":43,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":86,"xoff":640,"yoff":160,"x1":32,"y1":42,"x0":-32,"y0":-35,"hasText":true,"x":-27,"y":148},{"text":"állampolgárság","size":41,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":82,"xoff":704,"yoff":160,"x1":144,"y1":40,"x0":-144,"y0":-33,"hasText":true,"x":307,"y":-66},{"text":"családtag","size":39,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":78,"xoff":992,"yoff":160,"x1":96,"y1":38,"x0":-96,"y0":-32,"hasText":true,"x":292,"y":42},{"text":"anyakönyv","size":38,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":1184,"yoff":160,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":367,"y":73},{"text":"beutazás","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":76,"xoff":1376,"yoff":160,"x1":80,"y1":37,"x0":-80,"y0":-29,"hasText":true,"x":-148,"y":145},{"text":"gazdaság","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":1536,"yoff":160,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":-201,"y":-118},{"text":"air","size":37,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":74,"xoff":1728,"yoff":160,"x1":32,"y1":36,"x0":-32,"y0":-29,"hasText":true,"x":-223,"y":70},{"text":"nemzetköz","size":37,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":1792,"yoff":160,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":-199,"y":14},{"text":"születés","size":37,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":0,"yoff":252,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":-94,"y":-47},{"text":"csatlakozás","size":36,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":72,"xoff":160,"yoff":252,"x1":96,"y1":35,"x0":-96,"y0":-28,"hasText":true,"x":355,"y":3},{"text":"idegenrendészet","size":36,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":72,"xoff":352,"yoff":252,"x1":128,"y1":35,"x0":-128,"y0":-28,"hasText":true,"x":354,"y":142},{"text":"menekültügy","size":34,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":68,"xoff":608,"yoff":252,"x1":96,"y1":33,"x0":-96,"y0":-27,"hasText":true,"x":323,"y":172},{"text":"kapcsol","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":800,"yoff":252,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":-43,"y":-88},{"text":"tisztviselő","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":928,"yoff":252,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-166,"y":-89},{"text":"nyilatkozat","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1088,"yoff":252,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":360,"y":113},{"text":"mozgás","size":31,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":1248,"yoff":252,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":-146,"y":-21},{"text":"aktus","size":31,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":62,"xoff":1376,"yoff":252,"x1":48,"y1":30,"x0":-48,"y0":-24,"hasText":true,"x":-180,"y":44},{"text":"kérelmező","size":31,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":1472,"yoff":252,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-280,"y":39},{"text":"házasság","size":31,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":1632,"yoff":252,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":215,"y":197},{"text":"szerződő","size":30,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":1792,"yoff":252,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":-205,"y":-58},{"text":"teherviselő","size":30,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":0,"yoff":324,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-65,"y":-117},{"text":"európ","size":19,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":160,"yoff":324,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":-62,"y":64},{"text":"egyezmény","size":10,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":224,"yoff":324,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":-251,"y":-87},{"text":"konzul","size":4,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":288,"yoff":324,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":20,"y":60},{"text":"diplomáci","size":2,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":320,"yoff":324,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-20,"y":2},{"text":"biztosítás","size":0,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":352,"yoff":324,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-124,"y":-7}]},{"name":"költségvetési kiadások","major_topic":[1],"words":[{"text":"hozzájárulás","size":80,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-49,"y":-37,"width":448,"height":160,"xoff":0,"yoff":0,"x1":224,"y1":79,"x0":-224,"y0":-61,"hasText":true},{"text":"előirányzat","size":59,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":118,"xoff":448,"yoff":0,"x1":144,"y1":58,"x0":-144,"y0":-45,"hasText":true,"x":15,"y":33},{"text":"kiadás","size":51,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":102,"xoff":736,"yoff":0,"x1":80,"y1":50,"x0":-80,"y0":-40,"hasText":true,"x":210,"y":-5},{"text":"társulás","size":51,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":102,"xoff":896,"yoff":0,"x1":96,"y1":50,"x0":-96,"y0":-40,"hasText":true,"x":-132,"y":121},{"text":"költségvetés","size":49,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":98,"xoff":1088,"yoff":0,"x1":144,"y1":48,"x0":-144,"y0":-39,"hasText":true,"x":256,"y":36},{"text":"támogatás","size":48,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":96,"xoff":1376,"yoff":0,"x1":112,"y1":47,"x0":-112,"y0":-37,"hasText":true,"x":141,"y":111},{"text":"oktatás","size":44,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":88,"xoff":1600,"yoff":0,"x1":80,"y1":43,"x0":-80,"y0":-35,"hasText":true,"x":-159,"y":51},{"text":"település","size":43,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":86,"xoff":1760,"yoff":0,"x1":96,"y1":42,"x0":-96,"y0":-35,"hasText":true,"x":-275,"y":92},{"text":"tanuló","size":41,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":82,"xoff":0,"yoff":160,"x1":64,"y1":40,"x0":-64,"y0":-33,"hasText":true,"x":-172,"y":16},{"text":"szociális","size":37,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":128,"yoff":160,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":181,"y":73},{"text":"kistérség","size":35,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":288,"yoff":160,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":-53,"y":80},{"text":"felújítás","size":34,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":448,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":208,"y":139},{"text":"iskol","size":30,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":576,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-99,"y":-2},{"text":"program","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":672,"yoff":160,"x1":64,"y1":28,"x0":-64,"y0":-17,"hasText":true,"x":-78,"y":-99},{"text":"normatív","size":29,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":800,"yoff":160,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":-4,"y":106},{"text":"többcélú","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":928,"yoff":160,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":70,"y":73},{"text":"közoktatás","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":1056,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":74,"y":-11},{"text":"forint","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1216,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":-146,"y":77},{"text":"minisztériu","size":25,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":1312,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":147,"y":-106},{"text":"jogcímcsopor","size":25,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":1440,"yoff":160,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-226,"y":-20},{"text":"nevelés","size":25,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":1600,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-244,"y":117},{"text":"elszámolás","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1696,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":222,"y":-46},{"text":"kölcsön","size":24,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1824,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-119,"y":-117},{"text":"intézmény","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":0,"yoff":234,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":93,"y":133},{"text":"város","size":21,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":128,"yoff":234,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":68,"y":-98},{"text":"kisebbség","size":20,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":192,"yoff":234,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-167,"y":-90},{"text":"tartale","size":19,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":288,"yoff":234,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":263,"y":111},{"text":"felhalmozás","size":18,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":36,"xoff":352,"yoff":234,"x1":64,"y1":17,"x0":-64,"y0":-14,"hasText":true,"x":-34,"y":49},{"text":"önkormányzat","size":11,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":22,"xoff":480,"yoff":234,"x1":48,"y1":10,"x0":-48,"y0":-10,"hasText":true,"x":-18,"y":-16},{"text":"beruházás","size":9,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":576,"yoff":234,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":87,"y":44},{"text":"terhelő","size":8,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":16,"xoff":640,"yoff":234,"x1":16,"y1":7,"x0":-16,"y0":-8,"hasText":true,"x":61,"y":0},{"text":"munkaadó","size":8,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":672,"yoff":234,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":-238,"y":-2},{"text":"járulék","size":8,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":16,"xoff":736,"yoff":234,"x1":16,"y1":7,"x0":-16,"y0":-8,"hasText":true,"x":-18,"y":-27},{"text":"fejlesztés","size":5,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":768,"yoff":234,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":103,"y":-83},{"text":"kormányzat","size":2,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":800,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":17,"y":74},{"text":"juttatás","size":0,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":832,"yoff":234,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-28,"y":-120}]},{"name":"külkereskedelem","major_topic":[18],"words":[{"text":"mezőgazdaság","size":80,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-191,"y":117,"width":512,"height":160,"xoff":0,"yoff":0,"x1":256,"y1":79,"x0":-256,"y0":-61,"hasText":true},{"text":"bor","size":78,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":156,"xoff":512,"yoff":0,"x1":80,"y1":77,"x0":-80,"y0":-59,"hasText":true,"x":-89,"y":-19},{"text":"származó","size":59,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":118,"xoff":672,"yoff":0,"x1":128,"y1":58,"x0":-128,"y0":-45,"hasText":true,"x":114,"y":-43},{"text":"tömegszázale","size":58,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":116,"xoff":928,"yoff":0,"x1":176,"y1":57,"x0":-176,"y0":-45,"hasText":true,"x":57,"y":-89},{"text":"textíl","size":54,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":108,"xoff":1280,"yoff":0,"x1":80,"y1":53,"x0":-80,"y0":-42,"hasText":true,"x":89,"y":97},{"text":"kizárv","size":46,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":92,"xoff":1440,"yoff":0,"x1":80,"y1":45,"x0":-80,"y0":-36,"hasText":true,"x":143,"y":54},{"text":"ipar","size":43,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":86,"xoff":1600,"yoff":0,"x1":48,"y1":42,"x0":-48,"y0":-33,"hasText":true,"x":-291,"y":151},{"text":"montenegró","size":36,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":72,"xoff":1696,"yoff":0,"x1":96,"y1":35,"x0":-96,"y0":-28,"hasText":true,"x":13,"y":51},{"text":"termékétől","size":35,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":0,"yoff":160,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":-162,"y":-102},{"text":"boszn","size":34,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":192,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":131,"y":-20},{"text":"hercegovin","size":34,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":68,"xoff":320,"yoff":160,"x1":96,"y1":33,"x0":-96,"y0":-27,"hasText":true,"x":20,"y":-10},{"text":"ország","size":32,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":512,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":75,"y":126},{"text":"árucsopor","size":27,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":640,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":239,"y":-23},{"text":"európ","size":27,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":768,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":240,"y":-89},{"text":"min","size":26,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":864,"yoff":160,"x1":32,"y1":25,"x0":-32,"y0":-21,"hasText":true,"x":159,"y":78},{"text":"fonal","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":928,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-182,"y":-30},{"text":"lábjegyzet","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":1024,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":189,"y":101},{"text":"földrajz","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":1152,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":148,"y":2},{"text":"pays","size":24,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":1248,"yoff":160,"x1":32,"y1":23,"x0":-32,"y0":-15,"hasText":true,"x":-150,"y":134},{"text":"kereskedelm","size":23,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1312,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":174,"y":127},{"text":"megjegyzés","size":23,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1440,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-211,"y":-8},{"text":"társulás","size":23,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1568,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":55,"y":21},{"text":"anyag","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":1664,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-13,"hasText":true,"x":-90,"y":132},{"text":"természetes","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1728,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-132,"y":55},{"text":"szállítás","size":21,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1856,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":253,"y":-50},{"text":"jelzés","size":21,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":1952,"yoff":160,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":-4,"y":11},{"text":"járműv","size":21,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":0,"yoff":228,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":210,"y":3},{"text":"hal","size":21,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":96,"yoff":228,"x1":32,"y1":20,"x0":-32,"y0":-17,"hasText":true,"x":-77,"y":26},{"text":"növény","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":160,"yoff":228,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-19,"y":-68},{"text":"stabilizációs","size":20,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":256,"yoff":228,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":212,"y":22},{"text":"hozzáadás","size":20,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":384,"yoff":228,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":-226,"y":50},{"text":"származás","size":20,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":512,"yoff":228,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":-83,"y":7},{"text":"előállítás","size":14,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":28,"xoff":640,"yoff":228,"x1":32,"y1":13,"x0":-32,"y0":-12,"hasText":true,"x":204,"y":74},{"text":"vámtarifa","size":10,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":704,"yoff":228,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":66,"y":1},{"text":"gyártelep","size":8,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":768,"yoff":228,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":113,"y":15},{"text":"gazdaság","size":2,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":832,"yoff":228,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":12,"y":99},{"text":"felhasznál","size":1,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":864,"yoff":228,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-79,"y":-121}]},{"name":"szállításügyi nemzetközi egyezmények","major_topic":[10],"words":[{"text":"dans","size":80,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":197,"y":-38,"width":224,"height":160,"xoff":0,"yoff":0,"x1":112,"y1":79,"x0":-112,"y0":-60,"hasText":true},{"text":"pour","size":79,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":158,"xoff":224,"yoff":0,"x1":96,"y1":78,"x0":-96,"y0":-44,"hasText":true,"x":-10,"y":69},{"text":"mnn","size":67,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":134,"xoff":416,"yoff":0,"x1":80,"y1":66,"x0":-80,"y0":-38,"hasText":true,"x":74,"y":-67},{"text":"folyékony","size":60,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":120,"xoff":576,"yoff":0,"x1":128,"y1":59,"x0":-128,"y0":-47,"hasText":true,"x":-79,"y":-102},{"text":"tox","size":59,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":118,"xoff":832,"yoff":0,"x1":64,"y1":58,"x0":-64,"y0":-40,"hasText":true,"x":90,"y":53},{"text":"son","size":55,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":110,"xoff":960,"yoff":0,"x1":64,"y1":54,"x0":-64,"y0":-31,"hasText":true,"x":158,"y":65},{"text":"doiven","size":54,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":108,"xoff":1088,"yoff":0,"x1":96,"y1":53,"x0":-96,"y0":-41,"hasText":true,"x":-118,"y":-12},{"text":"pas","size":54,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":108,"xoff":1280,"yoff":0,"x1":64,"y1":53,"x0":-64,"y0":-31,"hasText":true,"x":207,"y":97},{"text":"matières","size":53,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":106,"xoff":1408,"yoff":0,"x1":112,"y1":52,"x0":-112,"y0":-41,"hasText":true,"x":216,"y":30},{"text":"par","size":53,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":106,"xoff":1632,"yoff":0,"x1":64,"y1":52,"x0":-64,"y0":-30,"hasText":true,"x":156,"y":-4},{"text":"nsa","size":52,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":104,"xoff":1760,"yoff":0,"x1":64,"y1":51,"x0":-64,"y0":-30,"hasText":true,"x":-32,"y":-70},{"text":"aux","size":48,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":96,"xoff":1888,"yoff":0,"x1":64,"y1":47,"x0":-64,"y0":-27,"hasText":true,"x":82,"y":82},{"text":"cargais","size":44,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":88,"xoff":0,"yoff":160,"x1":80,"y1":43,"x0":-80,"y0":-33,"hasText":true,"x":-134,"y":38},{"text":"szilár","size":43,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":86,"xoff":160,"yoff":160,"x1":64,"y1":42,"x0":-64,"y0":-35,"hasText":true,"x":-220,"y":-27},{"text":"mérgező","size":42,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":84,"xoff":288,"yoff":160,"x1":96,"y1":41,"x0":-96,"y0":-33,"hasText":true,"x":194,"y":-99},{"text":"hajó","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":76,"xoff":480,"yoff":160,"x1":48,"y1":37,"x0":-48,"y0":-29,"hasText":true,"x":-23,"y":-25},{"text":"avec","size":38,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":76,"xoff":576,"yoff":160,"x1":48,"y1":37,"x0":-48,"y0":-22,"hasText":true,"x":300,"y":-77},{"text":"szállítás","size":37,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":672,"yoff":160,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":44,"y":2},{"text":"gyúlékony","size":36,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":72,"xoff":832,"yoff":160,"x1":96,"y1":35,"x0":-96,"y0":-28,"hasText":true,"x":-14,"y":118},{"text":"liqu","size":34,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":68,"xoff":1024,"yoff":160,"x1":48,"y1":33,"x0":-48,"y0":-27,"hasText":true,"x":-139,"y":-54},{"text":"oui","size":32,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":64,"xoff":1120,"yoff":160,"x1":32,"y1":31,"x0":-32,"y0":-25,"hasText":true,"x":-223,"y":59},{"text":"gaz","size":28,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":56,"xoff":1184,"yoff":160,"x1":32,"y1":27,"x0":-32,"y0":-17,"hasText":true,"x":-185,"y":8},{"text":"moins","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1248,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-115,"y":107},{"text":"osztály","size":26,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1344,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-57,"y":8},{"text":"citernes","size":25,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":1440,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":47,"y":-28},{"text":"class","size":24,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":1536,"yoff":160,"x1":32,"y1":23,"x0":-32,"y0":-20,"hasText":true,"x":213,"y":-16},{"text":"≤","size":23,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":46,"xoff":1600,"yoff":160,"x1":16,"y1":22,"x0":-16,"y0":-16,"hasText":true,"x":91,"y":-23},{"text":"sol","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1632,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-228,"y":-7},{"text":"maró","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1696,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-40,"y":-137},{"text":"plus","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1760,"yoff":160,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-215,"y":-107},{"text":"contenan","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1824,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-17,"hasText":true,"x":208,"y":124},{"text":"szerves","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1920,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-13,"hasText":true,"x":5,"y":22},{"text":"sur","size":21,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":42,"xoff":0,"yoff":246,"x1":32,"y1":20,"x0":-32,"y0":-13,"hasText":true,"x":-207,"y":28},{"text":"anyag","size":11,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":64,"yoff":246,"x1":32,"y1":10,"x0":-32,"y0":-8,"hasText":true,"x":207,"y":61},{"text":"être","size":10,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":20,"xoff":128,"yoff":246,"x1":16,"y1":9,"x0":-16,"y0":-9,"hasText":true,"x":-47,"y":21},{"text":"transpor","size":4,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":160,"yoff":246,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":102,"y":87},{"text":"voir","size":3,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":192,"yoff":246,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-239,"y":-23},{"text":"non","size":3,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":224,"yoff":246,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":84,"y":32},{"text":"les","size":2,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":256,"yoff":246,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-52,"y":118}]}]},{"id":"2010-2014","topics":[{"name":"nemzetközi szállítás","major_topic":[10],"words":[{"text":"európ","size":80,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":130,"y":92,"width":256,"height":160,"xoff":0,"yoff":0,"x1":128,"y1":79,"x0":-128,"y0":-61,"hasText":true},{"text":"hajó","size":73,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":146,"xoff":256,"yoff":0,"x1":96,"y1":72,"x0":-96,"y0":-56,"hasText":true,"x":63,"y":-20},{"text":"lég","size":58,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":116,"xoff":448,"yoff":0,"x1":64,"y1":57,"x0":-64,"y0":-45,"hasText":true,"x":-12,"y":20},{"text":"nemzetköz","size":55,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":110,"xoff":576,"yoff":0,"x1":144,"y1":54,"x0":-144,"y0":-41,"hasText":true,"x":114,"y":-77},{"text":"training","size":49,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":98,"xoff":864,"yoff":0,"x1":96,"y1":48,"x0":-96,"y0":-37,"hasText":true,"x":175,"y":-119},{"text":"tengerész","size":47,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":94,"xoff":1056,"yoff":0,"x1":112,"y1":46,"x0":-112,"y0":-37,"hasText":true,"x":202,"y":137},{"text":"biztonság","size":45,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":90,"xoff":1280,"yoff":0,"x1":96,"y1":44,"x0":-96,"y0":-36,"hasText":true,"x":120,"y":27},{"text":"ship","size":45,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":90,"xoff":1472,"yoff":0,"x1":64,"y1":44,"x0":-64,"y0":-35,"hasText":true,"x":249,"y":98},{"text":"tagállam","size":43,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":86,"xoff":1600,"yoff":0,"x1":96,"y1":42,"x0":-96,"y0":-35,"hasText":true,"x":-115,"y":-35},{"text":"képzés","size":42,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1792,"yoff":0,"x1":80,"y1":41,"x0":-80,"y0":-33,"hasText":true,"x":-166,"y":19},{"text":"szerződő","size":37,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":0,"yoff":160,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":-64,"y":-71},{"text":"egyezmény","size":36,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":72,"xoff":160,"yoff":160,"x1":96,"y1":35,"x0":-96,"y0":-28,"hasText":true,"x":193,"y":-53},{"text":"seafarers","size":34,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":352,"yoff":160,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":38,"y":114},{"text":"információ","size":32,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":512,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":53,"y":140},{"text":"approv","size":32,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":672,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-19,"hasText":true,"x":-48,"y":42},{"text":"társaság","size":32,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":800,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":195,"y":167},{"text":"jóváhagyot","size":31,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":928,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-251,"y":-37},{"text":"fuvarozó","size":31,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":1088,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":-52,"y":76},{"text":"competenc","size":30,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1216,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-22,"hasText":true,"x":43,"y":163},{"text":"par","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":58,"xoff":1376,"yoff":160,"x1":32,"y1":28,"x0":-32,"y0":-17,"hasText":true,"x":-83,"y":95},{"text":"certificat","size":28,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1440,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-172,"y":-91},{"text":"gazdaság","size":27,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1568,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-153,"y":46},{"text":"unió","size":26,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":1696,"yoff":160,"x1":32,"y1":25,"x0":-32,"y0":-21,"hasText":true,"x":-190,"y":97},{"text":"kereskedelm","size":26,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":1760,"yoff":160,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":261,"y":23},{"text":"colu","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":1920,"yoff":160,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":236,"y":47},{"text":"safety","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":0,"yoff":232,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":20,"y":50},{"text":"ismeret","size":24,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":96,"yoff":232,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":162,"y":-29},{"text":"knowledg","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":192,"yoff":232,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-88,"y":-6},{"text":"királyság","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":288,"yoff":232,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":213,"y":-8},{"text":"bizonyítvány","size":20,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":384,"yoff":232,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":-47,"y":-105},{"text":"appropriat","size":20,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":512,"yoff":232,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":193,"y":185},{"text":"védelm","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":608,"yoff":232,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":130,"y":-3},{"text":"procedures","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":704,"yoff":232,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":109,"y":42},{"text":"les","size":4,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":832,"yoff":232,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":59,"y":32},{"text":"alkalmasság","size":4,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":864,"yoff":232,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-151,"y":-7},{"text":"ország","size":2,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":896,"yoff":232,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":241,"y":-84},{"text":"equipmen","size":2,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":928,"yoff":232,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-237,"y":114},{"text":"szolgálat","size":2,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":960,"yoff":232,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":37,"y":58},{"text":"értékelés","size":2,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":992,"yoff":232,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":173,"y":-45}]},{"name":"államigazgatás és fegyveres testületek","major_topic":[12,16,20],"words":[{"text":"vezető","size":80,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-187,"y":46,"width":256,"height":160,"xoff":0,"yoff":0,"x1":128,"y1":79,"x0":-128,"y0":-61,"hasText":true},{"text":"állomány","size":77,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":154,"xoff":256,"yoff":0,"x1":160,"y1":76,"x0":-160,"y0":-58,"hasText":true,"x":-114,"y":-89},{"text":"kormánytisztviselő","size":73,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":576,"height":146,"xoff":576,"yoff":0,"x1":288,"y1":72,"x0":-288,"y0":-56,"hasText":true,"x":-41,"y":-16},{"text":"hivatásos","size":57,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":114,"xoff":1152,"yoff":0,"x1":128,"y1":56,"x0":-128,"y0":-44,"hasText":true,"x":-204,"y":91},{"text":"katon","size":50,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":100,"xoff":1408,"yoff":0,"x1":80,"y1":49,"x0":-80,"y0":-39,"hasText":true,"x":-291,"y":-96},{"text":"munkakör","size":46,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":92,"xoff":1568,"yoff":0,"x1":112,"y1":45,"x0":-112,"y0":-35,"hasText":true,"x":103,"y":21},{"text":"illetmény","size":42,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":84,"xoff":1792,"yoff":0,"x1":96,"y1":41,"x0":-96,"y0":-33,"hasText":true,"x":81,"y":55},{"text":"beosztás","size":42,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":84,"xoff":0,"yoff":160,"x1":96,"y1":41,"x0":-96,"y0":-33,"hasText":true,"x":-287,"y":125},{"text":"honvédség","size":40,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":80,"xoff":192,"yoff":160,"x1":112,"y1":39,"x0":-112,"y0":-32,"hasText":true,"x":-6,"y":114},{"text":"fegyelm","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":76,"xoff":416,"yoff":160,"x1":80,"y1":37,"x0":-80,"y0":-29,"hasText":true,"x":70,"y":-99},{"text":"közigazgatás","size":37,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":74,"xoff":576,"yoff":160,"x1":112,"y1":36,"x0":-112,"y0":-29,"hasText":true,"x":-24,"y":-149},{"text":"foglalkoztatás","size":35,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":70,"xoff":800,"yoff":160,"x1":112,"y1":34,"x0":-112,"y0":-28,"hasText":true,"x":-88,"y":141},{"text":"munkaviszony","size":34,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":68,"xoff":1024,"yoff":160,"x1":112,"y1":33,"x0":-112,"y0":-27,"hasText":true,"x":-377,"y":-12},{"text":"jogkör","size":34,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":1248,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":-326,"y":-67},{"text":"munkavégzés","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":64,"xoff":1376,"yoff":160,"x1":96,"y1":31,"x0":-96,"y0":-25,"hasText":true,"x":185,"y":84},{"text":"közszolgálat","size":30,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":60,"xoff":1568,"yoff":160,"x1":96,"y1":29,"x0":-96,"y0":-24,"hasText":true,"x":-358,"y":18},{"text":"kormányzat","size":29,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1760,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":269,"y":-30},{"text":"felmentés","size":28,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":0,"yoff":240,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-40,"y":59},{"text":"kinevezés","size":27,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":128,"yoff":240,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-20,"y":81},{"text":"szabadság","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":256,"yoff":240,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-38,"y":16},{"text":"gyakorló","size":26,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":384,"yoff":240,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-191,"y":-65},{"text":"ügyészség","size":26,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":512,"yoff":240,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":173,"y":-73},{"text":"nav","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":640,"yoff":240,"x1":32,"y1":24,"x0":-32,"y0":-15,"hasText":true,"x":-176,"y":108},{"text":"spp","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":704,"yoff":240,"x1":32,"y1":23,"x0":-32,"y0":-15,"hasText":true,"x":-136,"y":108},{"text":"nyugdíj","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":768,"yoff":240,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":119,"y":103},{"text":"államigazgatás","size":22,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":44,"xoff":864,"yoff":240,"x1":80,"y1":21,"x0":-80,"y0":-19,"hasText":true,"x":211,"y":52},{"text":"egészségügy","size":21,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1024,"yoff":240,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-392,"y":-43},{"text":"pénzügyőr","size":20,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":1152,"yoff":240,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":249,"y":-8},{"text":"pótle","size":20,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1280,"yoff":240,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":-253,"y":-76},{"text":"közalkalmazott","size":20,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":40,"xoff":1344,"yoff":240,"x1":80,"y1":19,"x0":-80,"y0":-16,"hasText":true,"x":80,"y":-129},{"text":"jogosultság","size":19,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":1504,"yoff":240,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":232,"y":28},{"text":"öregség","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1632,"yoff":240,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-95,"y":-62},{"text":"igazgatás","size":19,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1728,"yoff":240,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":38,"y":-74},{"text":"államtitkár","size":19,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1824,"yoff":240,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-39,"y":159},{"text":"jogállás","size":19,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1920,"yoff":240,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":229,"y":9},{"text":"szolgálat","size":17,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":0,"yoff":294,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":-150,"y":-139},{"text":"jogviszony","size":12,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":96,"yoff":294,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-214,"y":-4},{"text":"munkáltató","size":10,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":160,"yoff":294,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":-147,"y":58},{"text":"munkavállaló","size":5,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":10,"xoff":224,"yoff":294,"x1":32,"y1":4,"x0":-32,"y0":-5,"hasText":true,"x":276,"y":2}]},{"name":"informatika","major_topic":[17],"words":[{"text":"szolgáltató","size":80,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-167,"y":102,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"elektronikus","size":66,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":132,"xoff":384,"yoff":0,"x1":176,"y1":65,"x0":-176,"y0":-49,"hasText":true,"x":31,"y":153},{"text":"gazdaság","size":48,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":96,"xoff":736,"yoff":0,"x1":112,"y1":47,"x0":-112,"y0":-37,"hasText":true,"x":-113,"y":40},{"text":"közbeszerzés","size":46,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":92,"xoff":960,"yoff":0,"x1":144,"y1":45,"x0":-144,"y0":-36,"hasText":true,"x":216,"y":37},{"text":"határidő","size":44,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":88,"xoff":1248,"yoff":0,"x1":96,"y1":43,"x0":-96,"y0":-35,"hasText":true,"x":-34,"y":-40},{"text":"felhasználó","size":44,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":88,"xoff":1440,"yoff":0,"x1":112,"y1":43,"x0":-112,"y0":-35,"hasText":true,"x":-99,"y":0},{"text":"közszolgáltatás","size":43,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":86,"xoff":1664,"yoff":0,"x1":144,"y1":42,"x0":-144,"y0":-35,"hasText":true,"x":-58,"y":-93},{"text":"mezőgazdaság","size":43,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":86,"xoff":0,"yoff":160,"x1":144,"y1":42,"x0":-144,"y0":-35,"hasText":true,"x":154,"y":-32},{"text":"post","size":39,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":78,"xoff":288,"yoff":160,"x1":48,"y1":38,"x0":-48,"y0":-28,"hasText":true,"x":67,"y":-66},{"text":"bírság","size":38,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":76,"xoff":384,"yoff":160,"x1":64,"y1":37,"x0":-64,"y0":-29,"hasText":true,"x":41,"y":17},{"text":"biztonság","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":512,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":54,"y":66},{"text":"költség","size":32,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":672,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-263,"y":51},{"text":"ajánlatkérő","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":800,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":1,"y":-129},{"text":"végzés","size":31,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":960,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":-242,"y":132},{"text":"egyetemes","size":31,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":1088,"yoff":160,"x1":80,"y1":30,"x0":-80,"y0":-22,"hasText":true,"x":-222,"y":158},{"text":"ügyfél","size":31,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":62,"xoff":1248,"yoff":160,"x1":48,"y1":30,"x0":-48,"y0":-24,"hasText":true,"x":194,"y":-113},{"text":"keret","size":29,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":1344,"yoff":160,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":125,"y":-5},{"text":"vállalkozás","size":29,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1440,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-201,"y":186},{"text":"engedélyes","size":28,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":1600,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":184,"y":73},{"text":"természetes","size":27,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":1760,"yoff":160,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":53,"y":93},{"text":"támogatás","size":27,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":0,"yoff":238,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":210,"y":1},{"text":"tulajdonos","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":128,"yoff":238,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":230,"y":96},{"text":"védelm","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":256,"yoff":238,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-229,"y":6},{"text":"hírközlés","size":26,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":352,"yoff":238,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-150,"y":-34},{"text":"médiaszolgáltató","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":50,"xoff":480,"yoff":238,"x1":96,"y1":24,"x0":-96,"y0":-20,"hasText":true,"x":280,"y":119},{"text":"bíróság","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":672,"yoff":238,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-332,"y":127},{"text":"igazgatás","size":25,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":768,"yoff":238,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":121,"y":-97},{"text":"terv","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":896,"yoff":238,"x1":32,"y1":24,"x0":-32,"y0":-18,"hasText":true,"x":26,"y":40},{"text":"út","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":960,"yoff":238,"x1":32,"y1":23,"x0":-32,"y0":-20,"hasText":true,"x":107,"y":-74},{"text":"pályázat","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1024,"yoff":238,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-177,"y":-59},{"text":"település","size":23,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1120,"yoff":238,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-245,"y":25},{"text":"szakértő","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1216,"yoff":238,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":171,"y":-67},{"text":"közszolgálat","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1312,"yoff":238,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-132,"y":-128},{"text":"európ","size":5,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":1440,"yoff":238,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-90,"y":55},{"text":"médiaszolgáltatás","size":3,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":6,"xoff":1472,"yoff":238,"x1":32,"y1":2,"x0":-32,"y0":-3,"hasText":true,"x":107,"y":-122},{"text":"médiatanács","size":3,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1536,"yoff":238,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":25,"y":-88},{"text":"hullade","size":3,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1568,"yoff":238,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":216,"y":54},{"text":"hulladékgazdálkodás","size":2,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1600,"yoff":238,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":35,"y":20}]},{"name":"Európai Unió","major_topic":[19],"words":[{"text":"európ","size":80,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-33,"y":85,"width":256,"height":160,"xoff":0,"yoff":0,"x1":128,"y1":79,"x0":-128,"y0":-61,"hasText":true},{"text":"tagállam","size":61,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":122,"xoff":256,"yoff":0,"x1":128,"y1":60,"x0":-128,"y0":-47,"hasText":true,"x":-179,"y":-35},{"text":"egyezmény","size":60,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":120,"xoff":512,"yoff":0,"x1":160,"y1":59,"x0":-160,"y0":-47,"hasText":true,"x":-187,"y":123},{"text":"council","size":55,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":110,"xoff":832,"yoff":0,"x1":96,"y1":54,"x0":-96,"y0":-41,"hasText":true,"x":-132,"y":-2},{"text":"parties","size":55,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":110,"xoff":1024,"yoff":0,"x1":96,"y1":54,"x0":-96,"y0":-41,"hasText":true,"x":157,"y":90},{"text":"csatlakozás","size":54,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":108,"xoff":1216,"yoff":0,"x1":144,"y1":53,"x0":-144,"y0":-42,"hasText":true,"x":-153,"y":-87},{"text":"convent","size":54,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":108,"xoff":1504,"yoff":0,"x1":112,"y1":53,"x0":-112,"y0":-37,"hasText":true,"x":-209,"y":85},{"text":"nemzetköz","size":51,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":102,"xoff":1728,"yoff":0,"x1":128,"y1":50,"x0":-128,"y0":-39,"hasText":true,"x":61,"y":-15},{"text":"irod","size":49,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":98,"xoff":0,"yoff":160,"x1":64,"y1":48,"x0":-64,"y0":-37,"hasText":true,"x":-40,"y":38},{"text":"selec","size":49,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":98,"xoff":128,"yoff":160,"x1":80,"y1":48,"x0":-80,"y0":-37,"hasText":true,"x":61,"y":25},{"text":"agreemen","size":44,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":88,"xoff":288,"yoff":160,"x1":112,"y1":43,"x0":-112,"y0":-25,"hasText":true,"x":264,"y":49},{"text":"unió","size":41,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":82,"xoff":512,"yoff":160,"x1":48,"y1":40,"x0":-48,"y0":-33,"hasText":true,"x":94,"y":58},{"text":"választópolgár","size":40,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":80,"xoff":608,"yoff":160,"x1":128,"y1":39,"x0":-128,"y0":-32,"hasText":true,"x":71,"y":-62},{"text":"international","size":39,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":78,"xoff":864,"yoff":160,"x1":112,"y1":38,"x0":-112,"y0":-31,"hasText":true,"x":67,"y":-95},{"text":"protocol","size":38,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":76,"xoff":1088,"yoff":160,"x1":80,"y1":37,"x0":-80,"y0":-29,"hasText":true,"x":-183,"y":-129},{"text":"conferenc","size":37,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":1248,"yoff":160,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":-147,"y":34},{"text":"members","size":35,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":1440,"yoff":160,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":116,"y":124},{"text":"kulturális","size":33,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":1600,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":25,"y":-127},{"text":"europ","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":1760,"yoff":160,"x1":48,"y1":31,"x0":-48,"y0":-19,"hasText":true,"x":240,"y":-80},{"text":"értekezlet","size":32,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1856,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":-304,"y":-121},{"text":"accordanc","size":31,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":0,"yoff":258,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":144,"y":-127},{"text":"alapokmány","size":31,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":62,"xoff":160,"yoff":258,"x1":96,"y1":30,"x0":-96,"y0":-24,"hasText":true,"x":139,"y":149},{"text":"stat","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":58,"xoff":352,"yoff":258,"x1":32,"y1":28,"x0":-32,"y0":-21,"hasText":true,"x":-34,"y":110},{"text":"ország","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":416,"yoff":258,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":-253,"y":-4},{"text":"cultural","size":29,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":512,"yoff":258,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":9,"y":133},{"text":"republic","size":28,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":640,"yoff":258,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-71,"y":-132},{"text":"telecommunicat","size":28,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":56,"xoff":768,"yoff":258,"x1":96,"y1":27,"x0":-96,"y0":-23,"hasText":true,"x":263,"y":121},{"text":"szavazás","size":27,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":960,"yoff":258,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-171,"y":-159},{"text":"közgyűlés","size":27,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1088,"yoff":258,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-51,"y":-164},{"text":"főtitkár","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1216,"yoff":258,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":40,"y":-155},{"text":"unit","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":1312,"yoff":258,"x1":32,"y1":23,"x0":-32,"y0":-20,"hasText":true,"x":126,"y":7},{"text":"boar","size":24,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":1376,"yoff":258,"x1":32,"y1":23,"x0":-32,"y0":-20,"hasText":true,"x":-31,"y":4},{"text":"meghatalmazott","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":1440,"yoff":258,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":-274,"y":52},{"text":"constitut","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1600,"yoff":258,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":158,"y":23},{"text":"access","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1696,"yoff":258,"x1":48,"y1":22,"x0":-48,"y0":-14,"hasText":true,"x":23,"y":148},{"text":"örökség","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1792,"yoff":258,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-257,"y":17},{"text":"választás","size":14,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":28,"xoff":1888,"yoff":258,"x1":32,"y1":13,"x0":-32,"y0":-12,"hasText":true,"x":-117,"y":137},{"text":"horvátország","size":4,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1952,"yoff":258,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-176,"y":5}]},{"name":"közigazgatás","major_topic":[20],"words":[{"text":"nemzetiség","size":80,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-234,"y":-24,"width":416,"height":160,"xoff":0,"yoff":0,"x1":208,"y1":79,"x0":-208,"y0":-61,"hasText":true},{"text":"főváros","size":69,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":138,"xoff":416,"yoff":0,"x1":128,"y1":68,"x0":-128,"y0":-53,"hasText":true,"x":-16,"y":-77},{"text":"út","size":60,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":120,"xoff":672,"yoff":0,"x1":48,"y1":59,"x0":-48,"y0":-47,"hasText":true,"x":-230,"y":-70},{"text":"közigazgatás","size":49,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":98,"xoff":768,"yoff":0,"x1":144,"y1":48,"x0":-144,"y0":-39,"hasText":true,"x":-222,"y":34},{"text":"alaptörvény","size":44,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":88,"xoff":1056,"yoff":0,"x1":112,"y1":43,"x0":-112,"y0":-35,"hasText":true,"x":11,"y":19},{"text":"vezető","size":42,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1280,"yoff":0,"x1":80,"y1":41,"x0":-80,"y0":-33,"hasText":true,"x":-20,"y":114},{"text":"település","size":42,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":84,"xoff":1440,"yoff":0,"x1":96,"y1":41,"x0":-96,"y0":-33,"hasText":true,"x":194,"y":82},{"text":"megbízatás","size":40,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":80,"xoff":1632,"yoff":0,"x1":112,"y1":39,"x0":-112,"y0":-32,"hasText":true,"x":87,"y":-31},{"text":"térség","size":40,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":1856,"yoff":0,"x1":64,"y1":39,"x0":-64,"y0":-32,"hasText":true,"x":244,"y":6},{"text":"választás","size":34,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":0,"yoff":160,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":-233,"y":80},{"text":"budapes","size":34,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":160,"yoff":160,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":-48,"y":56},{"text":"utc","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":66,"xoff":320,"yoff":160,"x1":32,"y1":32,"x0":-32,"y0":-23,"hasText":true,"x":194,"y":-26},{"text":"alkotmánybíróság","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":54,"xoff":384,"yoff":160,"x1":112,"y1":26,"x0":-112,"y0":-21,"hasText":true,"x":-27,"y":80},{"text":"jogállás","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":608,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":218,"y":-52},{"text":"biztos","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":704,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":159,"y":-5},{"text":"polgármester","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":800,"yoff":160,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":236,"y":46},{"text":"tulajdon","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":960,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-15,"y":-58},{"text":"obh","size":23,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":1056,"yoff":160,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":-168,"y":56},{"text":"államigazgatás","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":44,"xoff":1120,"yoff":160,"x1":80,"y1":21,"x0":-80,"y0":-19,"hasText":true,"x":-209,"y":-1},{"text":"kormányhivatal","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":44,"xoff":1280,"yoff":160,"x1":80,"y1":21,"x0":-80,"y0":-19,"hasText":true,"x":177,"y":25},{"text":"államtitkár","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1440,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-155,"y":-90},{"text":"minisztereln","size":21,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1568,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-355,"y":-4},{"text":"elektronikus","size":20,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":1696,"yoff":160,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":-6,"y":-14},{"text":"európ","size":19,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":1824,"yoff":160,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":-147,"y":-72},{"text":"munkaügy","size":18,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1888,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-163,"y":95},{"text":"kúr","size":18,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":0,"yoff":228,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":-16,"y":-35},{"text":"főú","size":18,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":64,"yoff":228,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":141,"y":54},{"text":"kerület","size":18,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":128,"yoff":228,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":32,"y":52},{"text":"összeférhetetlenség","size":17,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":34,"xoff":192,"yoff":228,"x1":80,"y1":16,"x0":-80,"y0":-14,"hasText":true,"x":206,"y":-74},{"text":"nemzetköz","size":17,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":352,"yoff":228,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":-59,"y":-131},{"text":"képviselőt","size":17,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":34,"xoff":448,"yoff":228,"x1":48,"y1":16,"x0":-48,"y0":-14,"hasText":true,"x":97,"y":-16},{"text":"kezdeményezés","size":17,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":34,"xoff":544,"yoff":228,"x1":64,"y1":16,"x0":-64,"y0":-14,"hasText":true,"x":247,"y":97},{"text":"bíróság","size":15,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":672,"yoff":228,"x1":32,"y1":14,"x0":-32,"y0":-13,"hasText":true,"x":-122,"y":-6},{"text":"önkormányzat","size":8,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":736,"yoff":228,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":-282,"y":-76},{"text":"ülés","size":3,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":800,"yoff":228,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":37,"y":30},{"text":"hatáskör","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":832,"yoff":228,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-98,"y":10}]},{"name":"kereskedelem","major_topic":[15,18],"words":[{"text":"származó","size":80,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-113,"y":48,"width":352,"height":160,"xoff":0,"yoff":0,"x1":176,"y1":79,"x0":-176,"y0":-61,"hasText":true},{"text":"tömegszázale","size":47,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":94,"xoff":352,"yoff":0,"x1":144,"y1":46,"x0":-144,"y0":-37,"hasText":true,"x":206,"y":-55},{"text":"exportőr","size":42,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":84,"xoff":640,"yoff":0,"x1":96,"y1":41,"x0":-96,"y0":-33,"hasText":true,"x":-91,"y":-9},{"text":"lábjegyzet","size":40,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":80,"xoff":832,"yoff":0,"x1":96,"y1":39,"x0":-96,"y0":-32,"hasText":true,"x":-161,"y":-109},{"text":"vtsz","size":39,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":78,"xoff":1024,"yoff":0,"x1":48,"y1":38,"x0":-48,"y0":-28,"hasText":true,"x":239,"y":84},{"text":"ország","size":34,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":1120,"yoff":0,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":232,"y":-25},{"text":"termékétől","size":33,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":1248,"yoff":0,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":16,"y":-68},{"text":"anyag","size":32,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1408,"yoff":0,"x1":64,"y1":31,"x0":-64,"y0":-19,"hasText":true,"x":101,"y":-97},{"text":"bor","size":29,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":58,"xoff":1536,"yoff":0,"x1":32,"y1":28,"x0":-32,"y0":-23,"hasText":true,"x":223,"y":43},{"text":"számlanyilatkozat","size":27,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":54,"xoff":1600,"yoff":0,"x1":112,"y1":26,"x0":-112,"y0":-21,"hasText":true,"x":-178,"y":-34},{"text":"árucsoport","size":26,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1824,"yoff":0,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":209,"y":104},{"text":"származás","size":26,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":0,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":73,"y":-14},{"text":"természetes","size":25,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":128,"yoff":160,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-23,"y":74},{"text":"szállítás","size":25,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":288,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":102,"y":14},{"text":"friss","size":25,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":416,"yoff":160,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":-198,"y":69},{"text":"európ","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":480,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-151,"y":-60},{"text":"társulás","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":576,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":167,"y":80},{"text":"bizonyítvány","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":48,"xoff":672,"yoff":160,"x1":80,"y1":23,"x0":-80,"y0":-20,"hasText":true,"x":183,"y":126},{"text":"előállítás","size":23,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":832,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":111,"y":99},{"text":"terméktől","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":928,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":282,"y":59},{"text":"előállítot","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1024,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":190,"y":-83},{"text":"vámhatóság","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":1120,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-230,"y":-4},{"text":"izrael","size":20,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1248,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":142,"y":-38},{"text":"készítmény","size":20,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":1312,"yoff":160,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":246,"y":15},{"text":"felhasználható","size":19,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":1440,"yoff":160,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":-203,"y":-76},{"text":"olaj","size":19,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":1568,"yoff":160,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":175,"y":-20},{"text":"fonal","size":18,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":1632,"yoff":160,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":-272,"y":14},{"text":"gyártelep","size":14,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":28,"xoff":1696,"yoff":160,"x1":32,"y1":13,"x0":-32,"y0":-12,"hasText":true,"x":-222,"y":-96},{"text":"megjegyzés","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1760,"yoff":160,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":201,"y":87},{"text":"szerb","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1792,"yoff":160,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":233,"y":110},{"text":"hozzáadás","size":2,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1824,"yoff":160,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-34,"y":-35},{"text":"okmány","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1856,"yoff":160,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-221,"y":-28},{"text":"készüle","size":2,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1888,"yoff":160,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-81,"y":-35},{"text":"vámtarifa","size":0,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1920,"yoff":160,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-230,"y":108},{"text":"növény","size":0,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1952,"yoff":160,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":62,"y":64}]},{"name":"igazságügy és rendvédelem","major_topic":[12],"words":[{"text":"elítél","size":80,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":66,"y":33,"width":224,"height":160,"xoff":0,"yoff":0,"x1":112,"y1":79,"x0":-112,"y0":-61,"hasText":true},{"text":"bűntett","size":73,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":146,"xoff":224,"yoff":0,"x1":128,"y1":72,"x0":-128,"y0":-56,"hasText":true,"x":176,"y":-30},{"text":"rendőrség","size":72,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":144,"xoff":480,"yoff":0,"x1":160,"y1":71,"x0":-160,"y0":-55,"hasText":true,"x":-43,"y":-95},{"text":"elektronikus","size":62,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":124,"xoff":800,"yoff":0,"x1":160,"y1":61,"x0":-160,"y0":-47,"hasText":true,"x":138,"y":88},{"text":"nemzetköz","size":60,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":120,"xoff":1120,"yoff":0,"x1":144,"y1":59,"x0":-144,"y0":-45,"hasText":true,"x":-127,"y":22},{"text":"ügyész","size":60,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":120,"xoff":1408,"yoff":0,"x1":112,"y1":59,"x0":-112,"y0":-47,"hasText":true,"x":-174,"y":70},{"text":"visszaélés","size":58,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":116,"xoff":1632,"yoff":0,"x1":144,"y1":57,"x0":-144,"y0":-45,"hasText":true,"x":-82,"y":-26},{"text":"tagállam","size":57,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":114,"xoff":0,"yoff":160,"x1":112,"y1":56,"x0":-112,"y0":-44,"hasText":true,"x":241,"y":15},{"text":"közlekedés","size":52,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":104,"xoff":224,"yoff":160,"x1":128,"y1":51,"x0":-128,"y0":-41,"hasText":true,"x":61,"y":131},{"text":"elkövetet","size":50,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":100,"xoff":480,"yoff":160,"x1":112,"y1":49,"x0":-112,"y0":-39,"hasText":true,"x":172,"y":-91},{"text":"büntetendő","size":47,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":94,"xoff":704,"yoff":160,"x1":128,"y1":46,"x0":-128,"y0":-37,"hasText":true,"x":112,"y":171},{"text":"állampolgár","size":46,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":92,"xoff":960,"yoff":160,"x1":128,"y1":45,"x0":-128,"y0":-36,"hasText":true,"x":-211,"y":110},{"text":"elkövetés","size":44,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":88,"xoff":1216,"yoff":160,"x1":96,"y1":43,"x0":-96,"y0":-35,"hasText":true,"x":-252,"y":-97},{"text":"út","size":43,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":86,"xoff":1408,"yoff":160,"x1":32,"y1":42,"x0":-32,"y0":-35,"hasText":true,"x":-267,"y":56},{"text":"anyakönyv","size":42,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":84,"xoff":1472,"yoff":160,"x1":112,"y1":41,"x0":-112,"y0":-32,"hasText":true,"x":-256,"y":-66},{"text":"vétség","size":40,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":1696,"yoff":160,"x1":64,"y1":39,"x0":-64,"y0":-32,"hasText":true,"x":-106,"y":145},{"text":"büntetésvégrehajtás","size":38,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":76,"xoff":0,"yoff":264,"x1":160,"y1":37,"x0":-160,"y0":-29,"hasText":true,"x":329,"y":123},{"text":"büntetőeljárás","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":76,"xoff":320,"yoff":264,"x1":128,"y1":37,"x0":-128,"y0":-29,"hasText":true,"x":-292,"y":-23},{"text":"személyszállítás","size":37,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":74,"xoff":576,"yoff":264,"x1":128,"y1":36,"x0":-128,"y0":-29,"hasText":true,"x":-362,"y":15},{"text":"biztonság","size":36,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":832,"yoff":264,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":282,"y":45},{"text":"közút","size":35,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":70,"xoff":992,"yoff":264,"x1":48,"y1":34,"x0":-48,"y0":-28,"hasText":true,"x":-34,"y":59},{"text":"elzárás","size":34,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":1088,"yoff":264,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":-103,"y":-63},{"text":"szolgálat","size":34,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":1216,"yoff":264,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":-227,"y":145},{"text":"fiatalkorú","size":33,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":1376,"yoff":264,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":-155,"y":-137},{"text":"felügyelet","size":32,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1536,"yoff":264,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":289,"y":154},{"text":"anyag","size":32,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1696,"yoff":264,"x1":64,"y1":31,"x0":-64,"y0":-19,"hasText":true,"x":22,"y":-73},{"text":"bírság","size":32,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1824,"yoff":264,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":310,"y":-25},{"text":"bűnügy","size":32,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":0,"yoff":340,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-154,"y":172},{"text":"bűncselekmény","size":18,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":36,"xoff":128,"yoff":340,"x1":64,"y1":17,"x0":-64,"y0":-14,"hasText":true,"x":-311,"y":73},{"text":"bíróság","size":16,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":32,"xoff":256,"yoff":340,"x1":32,"y1":15,"x0":-32,"y0":-13,"hasText":true,"x":-345,"y":-52},{"text":"szabálysértés","size":14,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":28,"xoff":320,"yoff":340,"x1":48,"y1":13,"x0":-48,"y0":-12,"hasText":true,"x":-67,"y":81},{"text":"szabadságvesztés","size":13,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":26,"xoff":416,"yoff":340,"x1":64,"y1":12,"x0":-64,"y0":-12,"hasText":true,"x":-266,"y":-134},{"text":"európ","size":6,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":12,"xoff":544,"yoff":340,"x1":16,"y1":5,"x0":-16,"y0":-6,"hasText":true,"x":-187,"y":-128},{"text":"közérdekű","size":5,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":576,"yoff":340,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-241,"y":116},{"text":"vasút","size":4,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":608,"yoff":340,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":74,"y":-115},{"text":"elkövető","size":3,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":640,"yoff":340,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":37,"y":-65},{"text":"btk","size":1,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":672,"yoff":340,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":9,"y":2}]},{"name":"nemzetközi egyezmények","major_topic":[18,19],"words":[{"text":"agreemen","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-225,"y":-13,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-45,"hasText":true},{"text":"convent","size":63,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":126,"xoff":384,"yoff":0,"x1":128,"y1":62,"x0":-128,"y0":-43,"hasText":true,"x":-166,"y":80},{"text":"competen","size":56,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":112,"xoff":640,"yoff":0,"x1":128,"y1":55,"x0":-128,"y0":-38,"hasText":true,"x":-150,"y":32},{"text":"parties","size":51,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":102,"xoff":896,"yoff":0,"x1":96,"y1":50,"x0":-96,"y0":-39,"hasText":true,"x":48,"y":-107},{"text":"belföld","size":45,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":90,"xoff":1088,"yoff":0,"x1":80,"y1":44,"x0":-80,"y0":-35,"hasText":true,"x":-70,"y":-97},{"text":"illetőségű","size":43,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":86,"xoff":1248,"yoff":0,"x1":96,"y1":42,"x0":-96,"y0":-35,"hasText":true,"x":-130,"y":116},{"text":"tax","size":42,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":84,"xoff":1440,"yoff":0,"x1":48,"y1":41,"x0":-48,"y0":-29,"hasText":true,"x":-88,"y":-59},{"text":"residen","size":42,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1536,"yoff":0,"x1":80,"y1":41,"x0":-80,"y0":-32,"hasText":true,"x":-264,"y":113},{"text":"territory","size":42,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":84,"xoff":1696,"yoff":0,"x1":80,"y1":41,"x0":-80,"y0":-32,"hasText":true,"x":-14,"y":-7},{"text":"nemzetköz","size":39,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":78,"xoff":0,"yoff":160,"x1":96,"y1":38,"x0":-96,"y0":-31,"hasText":true,"x":7,"y":73},{"text":"vállalkozás","size":39,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":78,"xoff":192,"yoff":160,"x1":96,"y1":38,"x0":-96,"y0":-32,"hasText":true,"x":127,"y":-73},{"text":"incom","size":39,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":78,"xoff":384,"yoff":160,"x1":64,"y1":38,"x0":-64,"y0":-31,"hasText":true,"x":11,"y":-53},{"text":"hungary","size":38,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":76,"xoff":512,"yoff":160,"x1":80,"y1":37,"x0":-80,"y0":-29,"hasText":true,"x":90,"y":103},{"text":"authority","size":34,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":68,"xoff":672,"yoff":160,"x1":80,"y1":33,"x0":-80,"y0":-27,"hasText":true,"x":-168,"y":144},{"text":"national","size":34,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":832,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":60,"y":132},{"text":"accordanc","size":33,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":960,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":61,"y":22},{"text":"enterpris","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":1120,"yoff":160,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":127,"y":47},{"text":"információ","size":29,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1248,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-172,"y":-59},{"text":"international","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1408,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":160,"y":74},{"text":"apply","size":28,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1568,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":-154,"y":-92},{"text":"permanen","size":28,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":1664,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-17,"hasText":true,"x":204,"y":108},{"text":"adó","size":28,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":56,"xoff":1792,"yoff":160,"x1":32,"y1":27,"x0":-32,"y0":-23,"hasText":true,"x":131,"y":-49},{"text":"tir","size":27,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":54,"xoff":1856,"yoff":160,"x1":32,"y1":26,"x0":-32,"y0":-21,"hasText":true,"x":-243,"y":-59},{"text":"jövedel","size":26,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1920,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":211,"y":44},{"text":"telephely","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":0,"yoff":238,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":90,"y":-4},{"text":"nyereség","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":128,"yoff":238,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":172,"y":17},{"text":"establishmen","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":48,"xoff":256,"yoff":238,"x1":80,"y1":23,"x0":-80,"y0":-20,"hasText":true,"x":143,"y":-28},{"text":"szerződő","size":23,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":416,"yoff":238,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-34,"y":47},{"text":"persons","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":544,"yoff":238,"x1":48,"y1":21,"x0":-48,"y0":-14,"hasText":true,"x":-21,"y":90},{"text":"security","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":640,"yoff":238,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-284,"y":20},{"text":"plac","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":736,"yoff":238,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":-274,"y":-71},{"text":"protect","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":800,"yoff":238,"x1":48,"y1":20,"x0":-48,"y0":-16,"hasText":true,"x":4,"y":108},{"text":"including","size":20,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":896,"yoff":238,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":251,"y":-4},{"text":"stat","size":16,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":32,"xoff":992,"yoff":238,"x1":32,"y1":15,"x0":-32,"y0":-12,"hasText":true,"x":-40,"y":110},{"text":"egyezmény","size":13,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":26,"xoff":1056,"yoff":238,"x1":48,"y1":12,"x0":-48,"y0":-12,"hasText":true,"x":143,"y":-108},{"text":"authorities","size":3,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1152,"yoff":238,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-64,"y":-53},{"text":"purpos","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1184,"yoff":238,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":72,"y":49},{"text":"contracting","size":1,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1216,"yoff":238,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-52,"y":-56},{"text":"informat","size":0,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1248,"yoff":238,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":213,"y":119}]},{"name":"költségvetési kiadások","major_topic":[1],"words":[{"text":"egészségügy","size":80,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":72,"y":-12,"width":448,"height":160,"xoff":0,"yoff":0,"x1":224,"y1":79,"x0":-224,"y0":-61,"hasText":true},{"text":"felhalmozás","size":76,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":416,"height":152,"xoff":448,"yoff":0,"x1":208,"y1":75,"x0":-208,"y0":-58,"hasText":true,"x":142,"y":53},{"text":"juttatás","size":64,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":128,"xoff":864,"yoff":0,"x1":112,"y1":63,"x0":-112,"y0":-49,"hasText":true,"x":116,"y":104},{"text":"hozzájárulás","size":60,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":120,"xoff":1088,"yoff":0,"x1":176,"y1":59,"x0":-176,"y0":-47,"hasText":true,"x":-113,"y":103},{"text":"képzés","size":59,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":118,"xoff":1440,"yoff":0,"x1":112,"y1":58,"x0":-112,"y0":-45,"hasText":true,"x":172,"y":-88},{"text":"szociális","size":56,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":112,"xoff":1664,"yoff":0,"x1":112,"y1":55,"x0":-112,"y0":-44,"hasText":true,"x":328,"y":-58},{"text":"település","size":51,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":102,"xoff":0,"yoff":160,"x1":112,"y1":50,"x0":-112,"y0":-40,"hasText":true,"x":-128,"y":49},{"text":"járulék","size":49,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":98,"xoff":224,"yoff":160,"x1":80,"y1":48,"x0":-80,"y0":-39,"hasText":true,"x":-92,"y":150},{"text":"munkaadó","size":48,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":96,"xoff":384,"yoff":160,"x1":112,"y1":47,"x0":-112,"y0":-37,"hasText":true,"x":-309,"y":51},{"text":"egyház","size":47,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":94,"xoff":608,"yoff":160,"x1":96,"y1":46,"x0":-96,"y0":-37,"hasText":true,"x":143,"y":-137},{"text":"tanuló","size":47,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":94,"xoff":800,"yoff":160,"x1":80,"y1":46,"x0":-80,"y0":-37,"hasText":true,"x":257,"y":91},{"text":"fejlesztés","size":42,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":84,"xoff":960,"yoff":160,"x1":96,"y1":41,"x0":-96,"y0":-33,"hasText":true,"x":-251,"y":13},{"text":"előirányzat","size":41,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":82,"xoff":1152,"yoff":160,"x1":112,"y1":40,"x0":-112,"y0":-33,"hasText":true,"x":-144,"y":-61},{"text":"felsőoktatás","size":41,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":82,"xoff":1376,"yoff":160,"x1":112,"y1":40,"x0":-112,"y0":-33,"hasText":true,"x":-16,"y":-96},{"text":"iskol","size":40,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":80,"xoff":1600,"yoff":160,"x1":48,"y1":39,"x0":-48,"y0":-31,"hasText":true,"x":300,"y":-15},{"text":"oktatás","size":34,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":1696,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":14,"y":145},{"text":"adó","size":32,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":64,"xoff":1824,"yoff":160,"x1":48,"y1":31,"x0":-48,"y0":-25,"hasText":true,"x":73,"y":-70},{"text":"nevelés","size":30,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":0,"yoff":258,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":-168,"y":-26},{"text":"társulás","size":30,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":128,"yoff":258,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":20,"y":-130},{"text":"szakképzés","size":28,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":256,"yoff":258,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":181,"y":129},{"text":"államháztartás","size":27,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":54,"xoff":416,"yoff":258,"x1":96,"y1":26,"x0":-96,"y0":-21,"hasText":true,"x":336,"y":-104},{"text":"kiadás","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":608,"yoff":258,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":252,"y":-130},{"text":"hallgató","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":704,"yoff":258,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-249,"y":-24},{"text":"keret","size":24,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":800,"yoff":258,"x1":32,"y1":23,"x0":-32,"y0":-20,"hasText":true,"x":216,"y":-59},{"text":"költségvetés","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":864,"yoff":258,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-279,"y":-51},{"text":"forint","size":23,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":992,"yoff":258,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":-277,"y":99},{"text":"főváros","size":23,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1056,"yoff":258,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-186,"y":129},{"text":"felújítás","size":22,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1152,"yoff":258,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":102,"y":-171},{"text":"város","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":1248,"yoff":258,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":142,"y":-61},{"text":"intézmény","size":20,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1312,"yoff":258,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":120,"y":147},{"text":"önkormányzat","size":10,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":20,"xoff":1408,"yoff":258,"x1":48,"y1":9,"x0":-48,"y0":-9,"hasText":true,"x":82,"y":119},{"text":"terhelő","size":5,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":1504,"yoff":258,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-232,"y":-125},{"text":"beruházás","size":4,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1536,"yoff":258,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-210,"y":62},{"text":"gyerm","size":4,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1568,"yoff":258,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-30,"y":51},{"text":"fenntartó","size":4,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1600,"yoff":258,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-144,"y":-16},{"text":"támogatás","size":3,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1632,"yoff":258,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":65,"y":63},{"text":"progr","size":3,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1664,"yoff":258,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-38,"y":107}]},{"name":"vállalkozások és pénzintézetek","major_topic":[15],"words":[{"text":"társaság","size":80,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":231,"y":66,"width":320,"height":160,"xoff":0,"yoff":0,"x1":160,"y1":79,"x0":-160,"y0":-61,"hasText":true},{"text":"vállalkozás","size":76,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":384,"height":152,"xoff":320,"yoff":0,"x1":192,"y1":75,"x0":-192,"y0":-58,"hasText":true,"x":180,"y":-69},{"text":"felügyelet","size":68,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":136,"xoff":704,"yoff":0,"x1":144,"y1":67,"x0":-144,"y0":-51,"hasText":true,"x":-93,"y":-88},{"text":"intézmény","size":65,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":130,"xoff":992,"yoff":0,"x1":160,"y1":64,"x0":-160,"y0":-51,"hasText":true,"x":-16,"y":44},{"text":"bíróság","size":57,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":114,"xoff":1312,"yoff":0,"x1":112,"y1":56,"x0":-112,"y0":-44,"hasText":true,"x":-261,"y":-53},{"text":"adóhatóság","size":51,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":102,"xoff":1536,"yoff":0,"x1":144,"y1":50,"x0":-144,"y0":-40,"hasText":true,"x":-259,"y":-8},{"text":"vezető","size":47,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":94,"xoff":1824,"yoff":0,"x1":80,"y1":46,"x0":-80,"y0":-37,"hasText":true,"x":6,"y":83},{"text":"fizetés","size":43,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":0,"yoff":160,"x1":80,"y1":42,"x0":-80,"y0":-35,"hasText":true,"x":-18,"y":-50},{"text":"gazdaság","size":42,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":84,"xoff":160,"yoff":160,"x1":96,"y1":41,"x0":-96,"y0":-33,"hasText":true,"x":-305,"y":-98},{"text":"európ","size":39,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":78,"xoff":352,"yoff":160,"x1":64,"y1":38,"x0":-64,"y0":-32,"hasText":true,"x":-132,"y":-40},{"text":"vagyon","size":37,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":74,"xoff":480,"yoff":160,"x1":64,"y1":36,"x0":-64,"y0":-22,"hasText":true,"x":93,"y":-1},{"text":"követelés","size":36,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":608,"yoff":160,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":167,"y":-24},{"text":"adózó","size":34,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":768,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":44,"y":111},{"text":"mnb","size":34,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":68,"xoff":896,"yoff":160,"x1":48,"y1":33,"x0":-48,"y0":-27,"hasText":true,"x":-194,"y":71},{"text":"határidő","size":31,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":992,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":-85,"y":-9},{"text":"könyvvizsgáló","size":31,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":62,"xoff":1120,"yoff":160,"x1":96,"y1":30,"x0":-96,"y0":-24,"hasText":true,"x":207,"y":95},{"text":"elektronikus","size":31,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":62,"xoff":1312,"yoff":160,"x1":96,"y1":30,"x0":-96,"y0":-24,"hasText":true,"x":225,"y":16},{"text":"felszámolás","size":28,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":1504,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":48,"y":-137},{"text":"információ","size":27,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1664,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":21,"y":-25},{"text":"út","size":25,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":1792,"yoff":160,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":-63,"y":73},{"text":"alapkezelő","size":25,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":1856,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":-234,"y":17},{"text":"végzés","size":25,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":0,"yoff":244,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-180,"y":118},{"text":"költség","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":96,"yoff":244,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":159,"y":-128},{"text":"vállalkozó","size":24,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":192,"yoff":244,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":238,"y":-117},{"text":"jogviszony","size":24,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":320,"yoff":244,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-98,"y":121},{"text":"kockázat","size":23,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":448,"yoff":244,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":273,"y":-18},{"text":"magánszemély","size":23,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":544,"yoff":244,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":-25,"y":142},{"text":"hozzájárulás","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":704,"yoff":244,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":161,"y":-152},{"text":"ptk","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":44,"xoff":832,"yoff":244,"x1":32,"y1":21,"x0":-32,"y0":-19,"hasText":true,"x":270,"y":-40},{"text":"természetes","size":21,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":896,"yoff":244,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-196,"y":36},{"text":"pénzügy","size":12,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":1024,"yoff":244,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":94,"y":79},{"text":"hitelintéz","size":4,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1088,"yoff":244,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":41,"y":-49},{"text":"biztosító","size":4,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":1120,"yoff":244,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":247,"y":-56},{"text":"biztosítás","size":3,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1152,"yoff":244,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":102,"y":-62},{"text":"pénzforgalm","size":3,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1184,"yoff":244,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":44,"y":-112},{"text":"értékpapír","size":3,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1216,"yoff":244,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":35,"y":-11},{"text":"székhely","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1248,"yoff":244,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-250,"y":-86},{"text":"befektetés","size":1,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1280,"yoff":244,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-212,"y":-36}]}]},{"id":"2014-2018","topics":[{"name":"költségvetési kiadások","major_topic":[1],"words":[{"text":"beruházás","size":80,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-176,"y":-96,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"juttatás","size":77,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":154,"xoff":384,"yoff":0,"x1":144,"y1":76,"x0":-144,"y0":-58,"hasText":true,"x":-204,"y":40},{"text":"település","size":74,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":148,"xoff":672,"yoff":0,"x1":160,"y1":73,"x0":-160,"y0":-56,"hasText":true,"x":-157,"y":-38},{"text":"fejlesztés","size":63,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":126,"xoff":992,"yoff":0,"x1":144,"y1":62,"x0":-144,"y0":-49,"hasText":true,"x":-146,"y":90},{"text":"terhelő","size":60,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":120,"xoff":1280,"yoff":0,"x1":112,"y1":59,"x0":-112,"y0":-47,"hasText":true,"x":-18,"y":37},{"text":"járulék","size":56,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":112,"xoff":1504,"yoff":0,"x1":96,"y1":55,"x0":-96,"y0":-44,"hasText":true,"x":53,"y":-12},{"text":"munkaadó","size":56,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":112,"xoff":1696,"yoff":0,"x1":144,"y1":55,"x0":-144,"y0":-44,"hasText":true,"x":-161,"y":-161},{"text":"előirányzat","size":51,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":102,"xoff":0,"yoff":160,"x1":128,"y1":50,"x0":-128,"y0":-40,"hasText":true,"x":195,"y":-71},{"text":"csop","size":45,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":90,"xoff":256,"yoff":160,"x1":64,"y1":44,"x0":-64,"y0":-26,"hasText":true,"x":30,"y":-57},{"text":"fenntartó","size":43,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":86,"xoff":384,"yoff":160,"x1":96,"y1":42,"x0":-96,"y0":-35,"hasText":true,"x":-132,"y":129},{"text":"adósságrendezés","size":39,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":78,"xoff":576,"yoff":160,"x1":144,"y1":38,"x0":-144,"y0":-32,"hasText":true,"x":245,"y":94},{"text":"felújítás","size":39,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":864,"yoff":160,"x1":80,"y1":38,"x0":-80,"y0":-32,"hasText":true,"x":16,"y":76},{"text":"nemzetiség","size":37,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":1024,"yoff":160,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":24,"y":-142},{"text":"jogcímcsopor","size":37,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":74,"xoff":1216,"yoff":160,"x1":112,"y1":36,"x0":-112,"y0":-29,"hasText":true,"x":60,"y":-174},{"text":"ellátott","size":34,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":1440,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":63,"y":-107},{"text":"program","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":1568,"yoff":160,"x1":64,"y1":32,"x0":-64,"y0":-19,"hasText":true,"x":175,"y":-38},{"text":"budapes","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":66,"xoff":1696,"yoff":160,"x1":80,"y1":32,"x0":-80,"y0":-25,"hasText":true,"x":164,"y":-119},{"text":"nevelés","size":31,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":1856,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":-68,"y":-10},{"text":"tanuló","size":30,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":0,"yoff":250,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-319,"y":-71},{"text":"gyermek","size":29,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":96,"yoff":250,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":234,"y":61},{"text":"köznevelés","size":28,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":224,"yoff":250,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":38,"y":106},{"text":"oktatás","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":384,"yoff":250,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":185,"y":39},{"text":"kiadás","size":26,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":480,"yoff":250,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-211,"y":-12},{"text":"költségvetés","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":576,"yoff":250,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":61,"y":124},{"text":"intézmény","size":12,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":704,"yoff":250,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":131,"y":59},{"text":"önkormányzat","size":12,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":24,"xoff":768,"yoff":250,"x1":48,"y1":11,"x0":-48,"y0":-10,"hasText":true,"x":12,"y":-91},{"text":"felhalmozás","size":9,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":864,"yoff":250,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":-154,"y":52},{"text":"hozzájárulás","size":9,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":928,"yoff":250,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":257,"y":37},{"text":"támogatás","size":4,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":992,"yoff":250,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":4,"y":-5},{"text":"államháztartás","size":3,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1024,"yoff":250,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-62,"y":-51},{"text":"forint","size":3,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1056,"yoff":250,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":169,"y":-101},{"text":"szociális","size":1,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1088,"yoff":250,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":246,"y":-27}]},{"name":"igazságügy és vállalkozások","major_topic":[12,15],"words":[{"text":"közigazgatás","size":80,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-138,"y":79,"width":448,"height":160,"xoff":0,"yoff":0,"x1":224,"y1":79,"x0":-224,"y0":-61,"hasText":true},{"text":"közbeszerzés","size":75,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":448,"height":150,"xoff":448,"yoff":0,"x1":224,"y1":74,"x0":-224,"y0":-57,"hasText":true,"x":7,"y":-37},{"text":"ajánlatkérő","size":71,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":142,"xoff":896,"yoff":0,"x1":176,"y1":70,"x0":-176,"y0":-55,"hasText":true,"x":70,"y":-95},{"text":"európ","size":70,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":140,"xoff":1248,"yoff":0,"x1":112,"y1":69,"x0":-112,"y0":-53,"hasText":true,"x":-222,"y":3},{"text":"szakértő","size":62,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":124,"xoff":1472,"yoff":0,"x1":128,"y1":61,"x0":-128,"y0":-48,"hasText":true,"x":-51,"y":15},{"text":"határidő","size":61,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":122,"xoff":1728,"yoff":0,"x1":112,"y1":60,"x0":-112,"y0":-47,"hasText":true,"x":-38,"y":133},{"text":"ügyvéd","size":55,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":110,"xoff":0,"yoff":160,"x1":96,"y1":54,"x0":-96,"y0":-42,"hasText":true,"x":-173,"y":-93},{"text":"bíróság","size":55,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":110,"xoff":192,"yoff":160,"x1":112,"y1":54,"x0":-112,"y0":-42,"hasText":true,"x":14,"y":-151},{"text":"ügyintézés","size":51,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":102,"xoff":416,"yoff":160,"x1":128,"y1":50,"x0":-128,"y0":-40,"hasText":true,"x":160,"y":5},{"text":"statiszti","size":46,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":92,"xoff":672,"yoff":160,"x1":96,"y1":45,"x0":-96,"y0":-35,"hasText":true,"x":-61,"y":170},{"text":"fegyelm","size":41,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":82,"xoff":864,"yoff":160,"x1":80,"y1":40,"x0":-80,"y0":-32,"hasText":true,"x":-250,"y":-51},{"text":"vezető","size":39,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":78,"xoff":1024,"yoff":160,"x1":64,"y1":38,"x0":-64,"y0":-31,"hasText":true,"x":97,"y":40},{"text":"gazdaság","size":38,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":1152,"yoff":160,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":-371,"y":13},{"text":"út","size":36,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":72,"xoff":1344,"yoff":160,"x1":32,"y1":35,"x0":-32,"y0":-28,"hasText":true,"x":-249,"y":33},{"text":"igazságügy","size":34,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":68,"xoff":1408,"yoff":160,"x1":96,"y1":33,"x0":-96,"y0":-27,"hasText":true,"x":128,"y":69},{"text":"igazolás","size":32,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":1600,"yoff":160,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":-132,"y":-136},{"text":"beszerzés","size":32,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1728,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":266,"y":-67},{"text":"jogerős","size":31,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":62,"xoff":1888,"yoff":160,"x1":64,"y1":30,"x0":-64,"y0":-24,"hasText":true,"x":100,"y":136},{"text":"igazolvány","size":30,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":0,"yoff":270,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":215,"y":97},{"text":"felsőoktatás","size":30,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":160,"yoff":270,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":-317,"y":-85},{"text":"bizalm","size":30,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":320,"yoff":270,"x1":48,"y1":29,"x0":-48,"y0":-24,"hasText":true,"x":-105,"y":-168},{"text":"kérelmező","size":29,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":416,"yoff":270,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-205,"y":115},{"text":"jogviszony","size":28,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":576,"yoff":270,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":-247,"y":-136},{"text":"polgár","size":27,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":736,"yoff":270,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":253,"y":-94},{"text":"természetes","size":26,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":832,"yoff":270,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":-357,"y":-19},{"text":"állampolgár","size":26,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":992,"yoff":270,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":-192,"y":141},{"text":"parlament","size":26,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1152,"yoff":270,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":53,"y":167},{"text":"képzés","size":26,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1280,"yoff":270,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":232,"y":28},{"text":"személyazonosító","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":48,"xoff":1376,"yoff":270,"x1":96,"y1":23,"x0":-96,"y0":-20,"hasText":true,"x":227,"y":126},{"text":"hatáskör","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1568,"yoff":270,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":131,"y":-153},{"text":"szolgáltató","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1664,"yoff":270,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":2,"y":-195},{"text":"bírság","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1792,"yoff":270,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":116,"y":94},{"text":"végzés","size":24,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":1888,"yoff":270,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-302,"y":105},{"text":"elektronikus","size":13,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":26,"xoff":0,"yoff":330,"x1":48,"y1":12,"x0":-48,"y0":-12,"hasText":true,"x":237,"y":72},{"text":"ügyfél","size":7,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":14,"xoff":96,"yoff":330,"x1":16,"y1":6,"x0":-16,"y0":-6,"hasText":true,"x":236,"y":38},{"text":"ajánlattevő","size":3,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":128,"yoff":330,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-185,"y":120},{"text":"igazgatás","size":2,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":160,"yoff":330,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":147,"y":-63},{"text":"kamar","size":0,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":192,"yoff":330,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-91,"y":22}]},{"name":"vállalkozások és pénzintézetek","major_topic":[15],"words":[{"text":"vállalkozás","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":44,"y":-36,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"mnb","size":64,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":128,"xoff":384,"yoff":0,"x1":80,"y1":63,"x0":-80,"y0":-48,"hasText":true,"x":110,"y":13},{"text":"fogyasztó","size":52,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":104,"xoff":544,"yoff":0,"x1":112,"y1":51,"x0":-112,"y0":-41,"hasText":true,"x":-95,"y":-121},{"text":"szolgáltató","size":48,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":96,"xoff":768,"yoff":0,"x1":112,"y1":47,"x0":-112,"y0":-37,"hasText":true,"x":145,"y":60},{"text":"viszontbiztosító","size":47,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":94,"xoff":992,"yoff":0,"x1":160,"y1":46,"x0":-160,"y0":-37,"hasText":true,"x":-47,"y":-163},{"text":"európ","size":43,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":86,"xoff":1312,"yoff":0,"x1":64,"y1":42,"x0":-64,"y0":-35,"hasText":true,"x":239,"y":-121},{"text":"feladatkör","size":41,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":82,"xoff":1440,"yoff":0,"x1":96,"y1":40,"x0":-96,"y0":-32,"hasText":true,"x":74,"y":-112},{"text":"vezető","size":41,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":82,"xoff":1632,"yoff":0,"x1":80,"y1":40,"x0":-80,"y0":-33,"hasText":true,"x":9,"y":4},{"text":"könyvvizsgáló","size":40,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":80,"xoff":0,"yoff":160,"x1":128,"y1":39,"x0":-128,"y0":-32,"hasText":true,"x":-76,"y":37},{"text":"hitelező","size":39,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":256,"yoff":160,"x1":80,"y1":38,"x0":-80,"y0":-31,"hasText":true,"x":259,"y":-84},{"text":"követelés","size":35,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":416,"yoff":160,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":-134,"y":-83},{"text":"biztosításközvetítő","size":35,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":70,"xoff":576,"yoff":160,"x1":144,"y1":34,"x0":-144,"y0":-28,"hasText":true,"x":211,"y":-157},{"text":"hitelintéz","size":35,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":70,"xoff":864,"yoff":160,"x1":80,"y1":34,"x0":-80,"y0":-28,"hasText":true,"x":-103,"y":4},{"text":"integrációs","size":34,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":68,"xoff":1024,"yoff":160,"x1":96,"y1":33,"x0":-96,"y0":-27,"hasText":true,"x":-22,"y":79},{"text":"ügyfél","size":34,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":68,"xoff":1216,"yoff":160,"x1":64,"y1":33,"x0":-64,"y0":-27,"hasText":true,"x":-242,"y":-112},{"text":"székhely","size":32,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":64,"xoff":1344,"yoff":160,"x1":80,"y1":31,"x0":-80,"y0":-25,"hasText":true,"x":73,"y":99},{"text":"szövetkezet","size":29,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1504,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-264,"y":-81},{"text":"elszámolás","size":28,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":1664,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":-172,"y":-40},{"text":"piac","size":27,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":54,"xoff":1824,"yoff":160,"x1":32,"y1":26,"x0":-32,"y0":-21,"hasText":true,"x":-32,"y":-99},{"text":"terv","size":26,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":52,"xoff":1888,"yoff":160,"x1":32,"y1":25,"x0":-32,"y0":-19,"hasText":true,"x":-150,"y":-64},{"text":"pénzforgalm","size":26,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":52,"xoff":0,"yoff":238,"x1":80,"y1":25,"x0":-80,"y0":-21,"hasText":true,"x":-282,"y":-59},{"text":"információ","size":26,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":160,"yoff":238,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-202,"y":81},{"text":"irányelv","size":25,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":288,"yoff":238,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":-215,"y":-15},{"text":"hpt","size":25,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":384,"yoff":238,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":-203,"y":13},{"text":"tagáll","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":448,"yoff":238,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":111,"y":-90},{"text":"fióktelep","size":24,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":544,"yoff":238,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-230,"y":-142},{"text":"részesedés","size":24,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":640,"yoff":238,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":211,"y":21},{"text":"kockázat","size":23,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":768,"yoff":238,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-320,"y":-105},{"text":"üzlet","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":864,"yoff":238,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":170,"y":-102},{"text":"biztosító","size":13,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":928,"yoff":238,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":209,"y":-13},{"text":"intézmény","size":9,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":992,"yoff":238,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":-33,"y":-23},{"text":"befektetés","size":8,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":1056,"yoff":238,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":12,"y":-97},{"text":"felügyelet","size":8,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":16,"xoff":1120,"yoff":238,"x1":32,"y1":7,"x0":-32,"y0":-8,"hasText":true,"x":274,"y":-75},{"text":"tájékoztatás","size":3,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":1184,"yoff":238,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":73,"y":-31},{"text":"szerződő","size":2,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1216,"yoff":238,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":167,"y":-81},{"text":"pénzügy","size":1,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":1248,"yoff":238,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-178,"y":101},{"text":"szanálás","size":0,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1280,"yoff":238,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-101,"y":34},{"text":"fizetés","size":0,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":1312,"yoff":238,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":197,"y":32}]},{"name":"kereskedelem és oktatás","major_topic":[6,15,18],"words":[{"text":"financial","size":80,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":70,"y":4,"width":320,"height":160,"xoff":0,"yoff":0,"x1":160,"y1":79,"x0":-160,"y0":-60,"hasText":true},{"text":"előállítás","size":77,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":154,"xoff":320,"yoff":0,"x1":160,"y1":76,"x0":-160,"y0":-59,"hasText":true,"x":153,"y":-58},{"text":"jogalany","size":69,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":138,"xoff":640,"yoff":0,"x1":144,"y1":68,"x0":-144,"y0":-52,"hasText":true,"x":-70,"y":-87},{"text":"vámtarifa","size":55,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":110,"xoff":928,"yoff":0,"x1":160,"y1":54,"x0":-160,"y0":-42,"hasText":true,"x":88,"y":-129},{"text":"felhasznál","size":55,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":110,"xoff":1248,"yoff":0,"x1":128,"y1":54,"x0":-128,"y0":-42,"hasText":true,"x":329,"y":-117},{"text":"institut","size":52,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":104,"xoff":1504,"yoff":0,"x1":96,"y1":51,"x0":-96,"y0":-40,"hasText":true,"x":157,"y":92},{"text":"ár","size":52,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":104,"xoff":1696,"yoff":0,"x1":48,"y1":51,"x0":-48,"y0":-41,"hasText":true,"x":-64,"y":-45},{"text":"jelentő","size":50,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":100,"xoff":1792,"yoff":0,"x1":80,"y1":49,"x0":-80,"y0":-39,"hasText":true,"x":197,"y":-173},{"text":"gyártelep","size":47,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":94,"xoff":0,"yoff":160,"x1":112,"y1":46,"x0":-112,"y0":-37,"hasText":true,"x":201,"y":47},{"text":"képzés","size":45,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":90,"xoff":224,"yoff":160,"x1":80,"y1":44,"x0":-80,"y0":-36,"hasText":true,"x":73,"y":-173},{"text":"szakképzés","size":45,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":90,"xoff":384,"yoff":160,"x1":128,"y1":44,"x0":-128,"y0":-36,"hasText":true,"x":-146,"y":-7},{"text":"reporting","size":44,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":88,"xoff":640,"yoff":160,"x1":96,"y1":43,"x0":-96,"y0":-33,"hasText":true,"x":-152,"y":-138},{"text":"számlatulajdonos","size":37,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":74,"xoff":832,"yoff":160,"x1":144,"y1":36,"x0":-144,"y0":-29,"hasText":true,"x":-111,"y":-174},{"text":"entity","size":33,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":1120,"yoff":160,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":-83,"y":21},{"text":"банка","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":60,"xoff":1216,"yoff":160,"x1":48,"y1":29,"x0":-48,"y0":-25,"hasText":true,"x":26,"y":26},{"text":"jelentendő","size":29,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":1312,"yoff":160,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":-142,"y":-46},{"text":"boar","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":1472,"yoff":160,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":-49,"y":46},{"text":"kormányzótanács","size":23,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":46,"xoff":1568,"yoff":160,"x1":96,"y1":22,"x0":-96,"y0":-18,"hasText":true,"x":247,"y":111},{"text":"szakképesítés","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":46,"xoff":1760,"yoff":160,"x1":80,"y1":22,"x0":-80,"y0":-18,"hasText":true,"x":258,"y":-37},{"text":"governors","size":22,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1920,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-14,"hasText":true,"x":69,"y":43},{"text":"joghatóság","size":22,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":0,"yoff":250,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":47,"y":89},{"text":"holder","size":20,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":128,"yoff":250,"x1":32,"y1":19,"x0":-32,"y0":-16,"hasText":true,"x":81,"y":-207},{"text":"reportabl","size":20,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":192,"yoff":250,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-95,"y":122},{"text":"libanon","size":20,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":288,"yoff":250,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":53,"y":65},{"text":"szerződő","size":20,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":384,"yoff":250,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":238,"y":-14},{"text":"hungar","size":19,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":480,"yoff":250,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":221,"y":8},{"text":"termékétől","size":19,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":544,"yoff":250,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-21,"y":64},{"text":"felnőttképzés","size":18,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":36,"xoff":640,"yoff":250,"x1":64,"y1":17,"x0":-64,"y0":-14,"hasText":true,"x":307,"y":6},{"text":"államokbel","size":18,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":768,"yoff":250,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-239,"y":124},{"text":"pénzügy","size":13,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":864,"yoff":250,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":104,"y":20},{"text":"intézmény","size":10,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":928,"yoff":250,"x1":32,"y1":9,"x0":-32,"y0":-9,"hasText":true,"x":306,"y":-59},{"text":"anyag","size":10,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":20,"xoff":992,"yoff":250,"x1":32,"y1":9,"x0":-32,"y0":-7,"hasText":true,"x":87,"y":-44},{"text":"származó","size":2,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1056,"yoff":250,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":78,"y":-103},{"text":"accounts","size":2,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1088,"yoff":250,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":81,"y":8},{"text":"bank","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1120,"yoff":250,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":130,"y":81},{"text":"ország","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":1152,"yoff":250,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-75,"y":59}]},{"name":"költségvetés és adók","major_topic":[1],"words":[{"text":"adózó","size":80,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":124,"y":24,"width":256,"height":160,"xoff":0,"yoff":0,"x1":128,"y1":79,"x0":-128,"y0":-61,"hasText":true},{"text":"állomány","size":68,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":136,"xoff":256,"yoff":0,"x1":144,"y1":67,"x0":-144,"y0":-52,"hasText":true,"x":244,"y":-50},{"text":"jogviszony","size":64,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":128,"xoff":544,"yoff":0,"x1":160,"y1":63,"x0":-160,"y0":-48,"hasText":true,"x":-154,"y":-74},{"text":"vámhatóság","size":63,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":352,"height":126,"xoff":864,"yoff":0,"x1":176,"y1":62,"x0":-176,"y0":-49,"hasText":true,"x":-211,"y":-124},{"text":"hivatásos","size":59,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":118,"xoff":1216,"yoff":0,"x1":128,"y1":58,"x0":-128,"y0":-45,"hasText":true,"x":223,"y":93},{"text":"támogatás","size":51,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":102,"xoff":1472,"yoff":0,"x1":128,"y1":50,"x0":-128,"y0":-40,"hasText":true,"x":17,"y":77},{"text":"vasút","size":48,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":96,"xoff":1728,"yoff":0,"x1":64,"y1":47,"x0":-64,"y0":-37,"hasText":true,"x":245,"y":131},{"text":"adóév","size":46,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":92,"xoff":1856,"yoff":0,"x1":80,"y1":45,"x0":-80,"y0":-36,"hasText":true,"x":-202,"y":23},{"text":"fizetés","size":43,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":0,"yoff":160,"x1":80,"y1":42,"x0":-80,"y0":-35,"hasText":true,"x":-23,"y":-6},{"text":"társaság","size":37,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":160,"yoff":160,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":-220,"y":120},{"text":"munkáltató","size":35,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":70,"xoff":320,"yoff":160,"x1":96,"y1":34,"x0":-96,"y0":-28,"hasText":true,"x":163,"y":-103},{"text":"beosztás","size":30,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":512,"yoff":160,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":124,"y":-132},{"text":"illetmény","size":25,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":640,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":-211,"y":45},{"text":"elektronikus","size":25,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":768,"yoff":160,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":160,"y":47},{"text":"közlekedés","size":23,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":928,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-151,"y":-18},{"text":"pénzügy","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1056,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-171,"y":-53},{"text":"határidő","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1152,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-246,"y":-13},{"text":"bevallás","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1248,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-91,"y":-51},{"text":"vállalkozó","size":22,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1344,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":95,"y":108},{"text":"vállalkozás","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1440,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":52,"y":-38},{"text":"nav","size":20,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":40,"xoff":1568,"yoff":160,"x1":32,"y1":19,"x0":-32,"y0":-12,"hasText":true,"x":119,"y":-62},{"text":"magánszemély","size":20,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":40,"xoff":1632,"yoff":160,"x1":80,"y1":19,"x0":-80,"y0":-16,"hasText":true,"x":-73,"y":94},{"text":"európ","size":19,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":1792,"yoff":160,"x1":32,"y1":18,"x0":-32,"y0":-16,"hasText":true,"x":173,"y":111},{"text":"igazolás","size":19,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1856,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-247,"y":-44},{"text":"költség","size":19,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":0,"yoff":234,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-140,"y":46},{"text":"természetes","size":19,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":96,"yoff":234,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":106,"y":126},{"text":"forint","size":18,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":224,"yoff":234,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":4,"y":-116},{"text":"besorolás","size":18,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":288,"yoff":234,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":0,"y":27},{"text":"eredmény","size":18,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":384,"yoff":234,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-1,"y":11},{"text":"kormánytisztviselő","size":17,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":34,"xoff":480,"yoff":234,"x1":64,"y1":16,"x0":-64,"y0":-14,"hasText":true,"x":-147,"y":69},{"text":"szolgálat","size":12,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":24,"xoff":608,"yoff":234,"x1":32,"y1":11,"x0":-32,"y0":-10,"hasText":true,"x":-275,"y":17},{"text":"adóhatóság","size":6,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":12,"xoff":672,"yoff":234,"x1":32,"y1":5,"x0":-32,"y0":-6,"hasText":true,"x":-233,"y":-112},{"text":"vezető","size":4,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":8,"xoff":736,"yoff":234,"x1":16,"y1":3,"x0":-16,"y0":-4,"hasText":true,"x":-243,"y":-61},{"text":"munkakör","size":2,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":768,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":110,"y":-24},{"text":"adózás","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":800,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":203,"y":-71},{"text":"bírság","size":1,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":832,"yoff":234,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-27,"y":-81},{"text":"keret","size":1,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":864,"yoff":234,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-182,"y":47},{"text":"út","size":1,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":896,"yoff":234,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":10,"y":-2},{"text":"rendvédelm","size":0,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":928,"yoff":234,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":-98,"y":-125}]},{"name":"külkereskedelem és beruházások","major_topic":[18],"words":[{"text":"európ","size":80,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":100,"y":51,"width":256,"height":160,"xoff":0,"yoff":0,"x1":128,"y1":79,"x0":-128,"y0":-61,"hasText":true},{"text":"beszerzés","size":65,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":130,"xoff":256,"yoff":0,"x1":160,"y1":64,"x0":-160,"y0":-51,"hasText":true,"x":46,"y":-49},{"text":"nemzetköz","size":64,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":320,"height":128,"xoff":576,"yoff":0,"x1":160,"y1":63,"x0":-160,"y0":-48,"hasText":true,"x":256,"y":101},{"text":"unió","size":53,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":106,"xoff":896,"yoff":0,"x1":64,"y1":52,"x0":-64,"y0":-41,"hasText":true,"x":-66,"y":4},{"text":"gazdaság","size":49,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":98,"xoff":1024,"yoff":0,"x1":112,"y1":48,"x0":-112,"y0":-39,"hasText":true,"x":-165,"y":-79},{"text":"fejlesztés","size":46,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":92,"xoff":1248,"yoff":0,"x1":96,"y1":45,"x0":-96,"y0":-36,"hasText":true,"x":117,"y":-12},{"text":"szolgáltató","size":42,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":84,"xoff":1440,"yoff":0,"x1":112,"y1":41,"x0":-112,"y0":-33,"hasText":true,"x":-25,"y":-124},{"text":"műszak","size":39,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":1664,"yoff":0,"x1":80,"y1":38,"x0":-80,"y0":-31,"hasText":true,"x":69,"y":89},{"text":"biztonság","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":76,"xoff":1824,"yoff":0,"x1":96,"y1":37,"x0":-96,"y0":-29,"hasText":true,"x":265,"y":-16},{"text":"kereskedelm","size":38,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":76,"xoff":0,"yoff":160,"x1":112,"y1":37,"x0":-112,"y0":-29,"hasText":true,"x":-77,"y":39},{"text":"létesítmény","size":37,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":224,"yoff":160,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":277,"y":-46},{"text":"ár","size":33,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":66,"xoff":416,"yoff":160,"x1":32,"y1":32,"x0":-32,"y0":-25,"hasText":true,"x":114,"y":116},{"text":"keret","size":33,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":480,"yoff":160,"x1":48,"y1":32,"x0":-48,"y0":-25,"hasText":true,"x":-34,"y":-93},{"text":"információ","size":30,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":576,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":43,"y":118},{"text":"építés","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":736,"yoff":160,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":-18,"y":88},{"text":"bírság","size":27,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":832,"yoff":160,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-80,"y":61},{"text":"beruházás","size":27,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":928,"yoff":160,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":-119,"y":-27},{"text":"ajánlattevő","size":26,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":52,"xoff":1056,"yoff":160,"x1":64,"y1":25,"x0":-64,"y0":-21,"hasText":true,"x":-179,"y":-57},{"text":"energeti","size":26,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":52,"xoff":1184,"yoff":160,"x1":48,"y1":25,"x0":-48,"y0":-21,"hasText":true,"x":-89,"y":93},{"text":"engedélyes","size":25,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":50,"xoff":1280,"yoff":160,"x1":80,"y1":24,"x0":-80,"y0":-20,"hasText":true,"x":-84,"y":-156},{"text":"védelm","size":25,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":50,"xoff":1440,"yoff":160,"x1":48,"y1":24,"x0":-48,"y0":-20,"hasText":true,"x":213,"y":-121},{"text":"tulajdonos","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":1536,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":220,"y":-79},{"text":"irányelv","size":23,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1664,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":-143,"y":-4},{"text":"bíró","size":23,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":1760,"yoff":160,"x1":32,"y1":22,"x0":-32,"y0":-18,"hasText":true,"x":17,"y":-87},{"text":"választot","size":23,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1824,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":39,"y":137},{"text":"szállítás","size":22,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1920,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-203,"y":108},{"text":"közszolgáltatás","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":44,"xoff":0,"yoff":234,"x1":80,"y1":21,"x0":-80,"y0":-19,"hasText":true,"x":-175,"y":-122},{"text":"vadászat","size":22,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":160,"yoff":234,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":136,"y":-122},{"text":"üzemeltetés","size":21,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":256,"yoff":234,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-224,"y":-31},{"text":"megállap","size":21,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":384,"yoff":234,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-217,"y":-6},{"text":"határidő","size":21,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":480,"yoff":234,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":209,"y":4},{"text":"előmozdítás","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":576,"yoff":234,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":-172,"y":126},{"text":"hálózat","size":20,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":704,"yoff":234,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-246,"y":93},{"text":"felhasználó","size":3,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":800,"yoff":234,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-250,"y":-24},{"text":"egyetemes","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":832,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-163,"y":110},{"text":"elektronikus","size":2,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":864,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":195,"y":-100},{"text":"vállalkozás","size":2,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":896,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-113,"y":73},{"text":"csatlakozás","size":2,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":928,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":127,"y":-60},{"text":"anyag","size":2,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":960,"yoff":234,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-160,"y":78}]},{"name":"kereskedelem","major_topic":[15,18],"words":[{"text":"vámhatóság","size":80,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":16,"y":15,"width":416,"height":160,"xoff":0,"yoff":0,"x1":208,"y1":79,"x0":-208,"y0":-61,"hasText":true},{"text":"materials","size":70,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":140,"xoff":416,"yoff":0,"x1":144,"y1":69,"x0":-144,"y0":-52,"hasText":true,"x":5,"y":74},{"text":"jövede","size":64,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":128,"xoff":704,"yoff":0,"x1":112,"y1":63,"x0":-112,"y0":-48,"hasText":true,"x":-125,"y":-102},{"text":"manufactu","size":55,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":110,"xoff":928,"yoff":0,"x1":128,"y1":54,"x0":-128,"y0":-41,"hasText":true,"x":-81,"y":-47},{"text":"produc","size":52,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":104,"xoff":1184,"yoff":0,"x1":96,"y1":51,"x0":-96,"y0":-40,"hasText":true,"x":21,"y":-90},{"text":"termék","size":50,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":100,"xoff":1376,"yoff":0,"x1":96,"y1":49,"x0":-96,"y0":-40,"hasText":true,"x":227,"y":-91},{"text":"heading","size":43,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":86,"xoff":1568,"yoff":0,"x1":80,"y1":42,"x0":-80,"y0":-33,"hasText":true,"x":-242,"y":40},{"text":"áru","size":41,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":82,"xoff":1728,"yoff":0,"x1":48,"y1":40,"x0":-48,"y0":-33,"hasText":true,"x":-190,"y":74},{"text":"valu","size":40,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":80,"xoff":1824,"yoff":0,"x1":48,"y1":39,"x0":-48,"y0":-31,"hasText":true,"x":-209,"y":-23},{"text":"európ","size":40,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":80,"xoff":0,"yoff":160,"x1":64,"y1":39,"x0":-64,"y0":-32,"hasText":true,"x":-3,"y":105},{"text":"pric","size":36,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":72,"xoff":128,"yoff":160,"x1":48,"y1":35,"x0":-48,"y0":-28,"hasText":true,"x":27,"y":-131},{"text":"clothing","size":30,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":224,"yoff":160,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":-208,"y":5},{"text":"fuvarozás","size":30,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":352,"yoff":160,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":87,"y":-64},{"text":"régészet","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":512,"yoff":160,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":126,"y":97},{"text":"adóraktár","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":640,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":-257,"y":-52},{"text":"engedélyes","size":27,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":768,"yoff":160,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":-274,"y":70},{"text":"unió","size":25,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":50,"xoff":928,"yoff":160,"x1":32,"y1":24,"x0":-32,"y0":-20,"hasText":true,"x":-146,"y":-139},{"text":"fuvarozó","size":24,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":992,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":-91,"y":98},{"text":"emg","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":46,"xoff":1088,"yoff":160,"x1":32,"y1":22,"x0":-32,"y0":-14,"hasText":true,"x":-147,"y":55},{"text":"classif","size":23,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":46,"xoff":1152,"yoff":160,"x1":48,"y1":22,"x0":-48,"y0":-18,"hasText":true,"x":222,"y":6},{"text":"származó","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1248,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":165,"y":49},{"text":"including","size":22,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":44,"xoff":1344,"yoff":160,"x1":48,"y1":21,"x0":-48,"y0":-19,"hasText":true,"x":-187,"y":113},{"text":"szállítás","size":21,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":42,"xoff":1440,"yoff":160,"x1":48,"y1":20,"x0":-48,"y0":-17,"hasText":true,"x":-75,"y":123},{"text":"mezőgazdaság","size":20,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":40,"xoff":1536,"yoff":160,"x1":80,"y1":19,"x0":-80,"y0":-16,"hasText":true,"x":91,"y":120},{"text":"műemle","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1696,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":-77,"y":32},{"text":"okmány","size":20,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":1792,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":94,"y":-47},{"text":"vámigazgatás","size":19,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":38,"xoff":1888,"yoff":160,"x1":64,"y1":18,"x0":-64,"y0":-16,"hasText":true,"x":193,"y":-70},{"text":"груза","size":19,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":38,"xoff":0,"yoff":232,"x1":32,"y1":18,"x0":-32,"y0":-12,"hasText":true,"x":172,"y":113},{"text":"textiles","size":18,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":64,"yoff":232,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":-22,"y":-128},{"text":"feltárás","size":18,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":128,"yoff":232,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":-224,"y":-76},{"text":"anyag","size":18,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":192,"yoff":232,"x1":32,"y1":17,"x0":-32,"y0":-11,"hasText":true,"x":-142,"y":72},{"text":"works","size":17,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":256,"yoff":232,"x1":32,"y1":16,"x0":-32,"y0":-15,"hasText":true,"x":215,"y":23},{"text":"за","size":16,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":32,"xoff":320,"yoff":232,"x1":16,"y1":15,"x0":-16,"y0":-10,"hasText":true,"x":202,"y":-14},{"text":"exportőr","size":16,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":352,"yoff":232,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":122,"y":-94},{"text":"motor","size":15,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":448,"yoff":232,"x1":32,"y1":14,"x0":-32,"y0":-12,"hasText":true,"x":-139,"y":39},{"text":"fabrics","size":14,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":28,"xoff":512,"yoff":232,"x1":32,"y1":13,"x0":-32,"y0":-12,"hasText":true,"x":-10,"y":118},{"text":"vámkódex","size":3,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":576,"yoff":232,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-143,"y":81},{"text":"délafr","size":2,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":608,"yoff":232,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":-32,"y":-123}]},{"name":"igazságügy","major_topic":[12],"words":[{"text":"ügyészség","size":80,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-104,"y":33,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-61,"hasText":true},{"text":"bűncselekmény","size":67,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":448,"height":134,"xoff":384,"yoff":0,"x1":224,"y1":66,"x0":-224,"y0":-52,"hasText":true,"x":-19,"y":109},{"text":"büntetőeljárás","size":66,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":416,"height":132,"xoff":832,"yoff":0,"x1":208,"y1":65,"x0":-208,"y0":-51,"hasText":true,"x":-216,"y":-92},{"text":"nyomozó","size":61,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":122,"xoff":1248,"yoff":0,"x1":128,"y1":60,"x0":-128,"y0":-47,"hasText":true,"x":138,"y":-104},{"text":"végzés","size":61,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":122,"xoff":1504,"yoff":0,"x1":112,"y1":60,"x0":-112,"y0":-47,"hasText":true,"x":88,"y":-14},{"text":"tagállam","size":55,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":110,"xoff":1728,"yoff":0,"x1":112,"y1":54,"x0":-112,"y0":-42,"hasText":true,"x":141,"y":40},{"text":"út","size":54,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":108,"xoff":0,"yoff":160,"x1":48,"y1":53,"x0":-48,"y0":-42,"hasText":true,"x":-48,"y":-14},{"text":"tárgyalás","size":54,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":108,"xoff":96,"yoff":160,"x1":112,"y1":53,"x0":-112,"y0":-42,"hasText":true,"x":266,"y":5},{"text":"európ","size":53,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":106,"xoff":320,"yoff":160,"x1":80,"y1":52,"x0":-80,"y0":-41,"hasText":true,"x":225,"y":-39},{"text":"cselekmény","size":53,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":106,"xoff":480,"yoff":160,"x1":144,"y1":52,"x0":-144,"y0":-41,"hasText":true,"x":-94,"y":-145},{"text":"elektronikus","size":50,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":288,"height":100,"xoff":768,"yoff":160,"x1":144,"y1":49,"x0":-144,"y0":-39,"hasText":true,"x":350,"y":-97},{"text":"határidő","size":44,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":88,"xoff":1056,"yoff":160,"x1":96,"y1":43,"x0":-96,"y0":-35,"hasText":true,"x":-145,"y":-33},{"text":"mezőhegyes","size":43,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":256,"height":86,"xoff":1248,"yoff":160,"x1":128,"y1":42,"x0":-128,"y0":-34,"hasText":true,"x":56,"y":-63},{"text":"bizonyítás","size":41,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":82,"xoff":1504,"yoff":160,"x1":96,"y1":40,"x0":-96,"y0":-33,"hasText":true,"x":-299,"y":-54},{"text":"külterül","size":39,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":78,"xoff":1696,"yoff":160,"x1":80,"y1":38,"x0":-80,"y0":-31,"hasText":true,"x":-97,"y":70},{"text":"bűnügy","size":38,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":76,"xoff":1856,"yoff":160,"x1":80,"y1":37,"x0":-80,"y0":-29,"hasText":true,"x":283,"y":47},{"text":"irat","size":38,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":76,"xoff":0,"yoff":268,"x1":48,"y1":37,"x0":-48,"y0":-29,"hasText":true,"x":1,"y":-96},{"text":"igazságügy","size":37,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":74,"xoff":96,"yoff":268,"x1":96,"y1":36,"x0":-96,"y0":-29,"hasText":true,"x":-101,"y":139},{"text":"képviselő","size":37,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":288,"yoff":268,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":349,"y":-49},{"text":"bíróság","size":36,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":72,"xoff":448,"yoff":268,"x1":64,"y1":35,"x0":-64,"y0":-28,"hasText":true,"x":-305,"y":-19},{"text":"jogerős","size":32,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":64,"xoff":576,"yoff":268,"x1":64,"y1":31,"x0":-64,"y0":-25,"hasText":true,"x":217,"y":115},{"text":"szabálysértés","size":31,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":62,"xoff":704,"yoff":268,"x1":96,"y1":30,"x0":-96,"y0":-24,"hasText":true,"x":261,"y":81},{"text":"tanú","size":31,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":62,"xoff":896,"yoff":268,"x1":48,"y1":30,"x0":-48,"y0":-24,"hasText":true,"x":-252,"y":61},{"text":"nyomozás","size":29,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":58,"xoff":992,"yoff":268,"x1":80,"y1":28,"x0":-80,"y0":-23,"hasText":true,"x":93,"y":-147},{"text":"btk","size":29,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":58,"xoff":1152,"yoff":268,"x1":32,"y1":28,"x0":-32,"y0":-23,"hasText":true,"x":222,"y":-70},{"text":"ítél","size":29,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":58,"xoff":1216,"yoff":268,"x1":32,"y1":28,"x0":-32,"y0":-23,"hasText":true,"x":68,"y":65},{"text":"büntetés","size":29,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":58,"xoff":1280,"yoff":268,"x1":64,"y1":28,"x0":-64,"y0":-23,"hasText":true,"x":-314,"y":21},{"text":"külföld","size":28,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":56,"xoff":1408,"yoff":268,"x1":48,"y1":27,"x0":-48,"y0":-23,"hasText":true,"x":16,"y":133},{"text":"kézbesítés","size":27,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":54,"xoff":1504,"yoff":268,"x1":64,"y1":26,"x0":-64,"y0":-21,"hasText":true,"x":36,"y":155},{"text":"meghallgatás","size":27,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":54,"xoff":1632,"yoff":268,"x1":80,"y1":26,"x0":-80,"y0":-21,"hasText":true,"x":-353,"y":50},{"text":"védő","size":27,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1792,"yoff":268,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-79,"y":-69},{"text":"titkos","size":27,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":54,"xoff":1888,"yoff":268,"x1":48,"y1":26,"x0":-48,"y0":-21,"hasText":true,"x":-249,"y":-141},{"text":"fellebbezés","size":5,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":1984,"yoff":268,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":109,"y":116},{"text":"indítvány","size":3,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":0,"yoff":342,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-206,"y":-22},{"text":"polgár","size":3,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":32,"yoff":342,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":15,"y":43},{"text":"adós","size":3,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":64,"yoff":342,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-208,"y":38},{"text":"költség","size":3,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":96,"yoff":342,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":173,"y":61},{"text":"szakértő","size":2,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":128,"yoff":342,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":178,"y":89}]},{"name":"mezőgazdaság, ipar és szociálpolitika","major_topic":[1,4,5,13,21],"words":[{"text":"egészségügy","size":80,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-164,"y":51,"width":448,"height":160,"xoff":0,"yoff":0,"x1":224,"y1":79,"x0":-224,"y0":-61,"hasText":true},{"text":"cpc","size":62,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":124,"xoff":448,"yoff":0,"x1":64,"y1":61,"x0":-64,"y0":-35,"hasText":true,"x":-117,"y":-37},{"text":"európ","size":48,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":96,"xoff":576,"yoff":0,"x1":80,"y1":47,"x0":-80,"y0":-37,"hasText":true,"x":54,"y":-18},{"text":"korlátozás","size":43,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":86,"xoff":736,"yoff":0,"x1":112,"y1":42,"x0":-112,"y0":-35,"hasText":true,"x":208,"y":48},{"text":"erdészet","size":37,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":74,"xoff":960,"yoff":0,"x1":80,"y1":36,"x0":-80,"y0":-29,"hasText":true,"x":-231,"y":-84},{"text":"gazdaság","size":36,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":1120,"yoff":0,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":144,"y":113},{"text":"járásbíróság","size":30,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1280,"yoff":0,"x1":80,"y1":29,"x0":-80,"y0":-24,"hasText":true,"x":209,"y":-68},{"text":"szállítás","size":30,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":1440,"yoff":0,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":-235,"y":-59},{"text":"külföld","size":29,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":58,"xoff":1568,"yoff":0,"x1":48,"y1":28,"x0":-48,"y0":-23,"hasText":true,"x":145,"y":-37},{"text":"állampolgárság","size":29,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":58,"xoff":1664,"yoff":0,"x1":96,"y1":28,"x0":-96,"y0":-23,"hasText":true,"x":-145,"y":88},{"text":"főú","size":28,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":56,"xoff":1856,"yoff":0,"x1":32,"y1":27,"x0":-32,"y0":-23,"hasText":true,"x":-17,"y":92},{"text":"kötelezettségvállalás","size":26,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":52,"xoff":0,"yoff":160,"x1":112,"y1":25,"x0":-112,"y0":-21,"hasText":true,"x":-25,"y":114},{"text":"lábjegyzet","size":25,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":50,"xoff":224,"yoff":160,"x1":64,"y1":24,"x0":-64,"y0":-20,"hasText":true,"x":21,"y":-53},{"text":"jogkezelés","size":24,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":352,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-49,"y":-7},{"text":"biztosítás","size":24,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":480,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":232,"y":-42},{"text":"gyermekgondozás","size":23,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":46,"xoff":608,"yoff":160,"x1":96,"y1":22,"x0":-96,"y0":-18,"hasText":true,"x":95,"y":77},{"text":"jogosultság","size":22,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":800,"yoff":160,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":152,"y":-16},{"text":"út","size":22,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":44,"xoff":928,"yoff":160,"x1":16,"y1":21,"x0":-16,"y0":-19,"hasText":true,"x":209,"y":-16},{"text":"gyógyszer","size":22,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":44,"xoff":960,"yoff":160,"x1":64,"y1":21,"x0":-64,"y0":-19,"hasText":true,"x":129,"y":-93},{"text":"természetes","size":21,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":42,"xoff":1088,"yoff":160,"x1":64,"y1":20,"x0":-64,"y0":-17,"hasText":true,"x":77,"y":47},{"text":"államigazgatás","size":21,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":42,"xoff":1216,"yoff":160,"x1":80,"y1":20,"x0":-80,"y0":-17,"hasText":true,"x":-73,"y":-87},{"text":"kereskedelm","size":20,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":40,"xoff":1376,"yoff":160,"x1":64,"y1":19,"x0":-64,"y0":-16,"hasText":true,"x":27,"y":-104},{"text":"erdőgazdálkodás","size":20,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":40,"xoff":1504,"yoff":160,"x1":80,"y1":19,"x0":-80,"y0":-16,"hasText":true,"x":-101,"y":131},{"text":"igazgatás","size":19,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1664,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-154,"y":-115},{"text":"társaság","size":19,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":38,"xoff":1760,"yoff":160,"x1":48,"y1":18,"x0":-48,"y0":-16,"hasText":true,"x":-188,"y":-37},{"text":"bíróság","size":17,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":1856,"yoff":160,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":-216,"y":-115},{"text":"engedélyezés","size":17,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":34,"xoff":0,"yoff":210,"x1":64,"y1":16,"x0":-64,"y0":-14,"hasText":true,"x":80,"y":19},{"text":"uniós","size":17,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":34,"xoff":128,"yoff":210,"x1":32,"y1":16,"x0":-32,"y0":-14,"hasText":true,"x":-168,"y":-72},{"text":"erdőgazdálkodó","size":16,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":32,"xoff":192,"yoff":210,"x1":64,"y1":15,"x0":-64,"y0":-13,"hasText":true,"x":203,"y":0},{"text":"szülő","size":16,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":32,"xoff":320,"yoff":210,"x1":32,"y1":15,"x0":-32,"y0":-13,"hasText":true,"x":-69,"y":-113},{"text":"közút","size":15,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":384,"yoff":210,"x1":32,"y1":14,"x0":-32,"y0":-13,"hasText":true,"x":226,"y":63},{"text":"tulajdonos","size":15,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":448,"yoff":210,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":107,"y":-61},{"text":"foglalkoztatás","size":15,"color":{"alpha":0.7,"hue":47,"saturation":0.94,"lightness":0.66},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":544,"yoff":210,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":217,"y":77},{"text":"jogkezelő","size":5,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":640,"yoff":210,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":148,"y":21},{"text":"szolgáltató","size":3,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":672,"yoff":210,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":22,"y":6},{"text":"ország","size":1,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":704,"yoff":210,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":224,"y":37}]},{"name":"nemzetközi egyezmények","major_topic":[18,19],"words":[{"text":"agreemen","size":80,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"x":-13,"y":64,"width":384,"height":160,"xoff":0,"yoff":0,"x1":192,"y1":79,"x0":-192,"y0":-45,"hasText":true},{"text":"parties","size":61,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":224,"height":122,"xoff":384,"yoff":0,"x1":112,"y1":60,"x0":-112,"y0":-45,"hasText":true,"x":-237,"y":63},{"text":"convent","size":45,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":90,"xoff":608,"yoff":0,"x1":96,"y1":44,"x0":-96,"y0":-32,"hasText":true,"x":93,"y":115},{"text":"security","size":36,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":72,"xoff":800,"yoff":0,"x1":80,"y1":35,"x0":-80,"y0":-28,"hasText":true,"x":-21,"y":-16},{"text":"accordanc","size":36,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":192,"height":72,"xoff":960,"yoff":0,"x1":96,"y1":35,"x0":-96,"y0":-28,"hasText":true,"x":231,"y":121},{"text":"national","size":35,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":70,"xoff":1152,"yoff":0,"x1":64,"y1":34,"x0":-64,"y0":-28,"hasText":true,"x":85,"y":-76},{"text":"hungary","size":33,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":66,"xoff":1280,"yoff":0,"x1":64,"y1":32,"x0":-64,"y0":-25,"hasText":true,"x":185,"y":81},{"text":"pers","size":33,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":66,"xoff":1408,"yoff":0,"x1":48,"y1":32,"x0":-48,"y0":-19,"hasText":true,"x":171,"y":-55},{"text":"minősítet","size":31,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":62,"xoff":1504,"yoff":0,"x1":80,"y1":30,"x0":-80,"y0":-24,"hasText":true,"x":-1,"y":18},{"text":"governmen","size":30,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":60,"xoff":1664,"yoff":0,"x1":80,"y1":29,"x0":-80,"y0":-18,"hasText":true,"x":-123,"y":18},{"text":"authority","size":30,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":60,"xoff":1824,"yoff":0,"x1":64,"y1":29,"x0":-64,"y0":-24,"hasText":true,"x":7,"y":-45},{"text":"territory","size":28,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":56,"xoff":0,"yoff":160,"x1":64,"y1":27,"x0":-64,"y0":-23,"hasText":true,"x":211,"y":-34},{"text":"authorities","size":28,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":160,"height":56,"xoff":128,"yoff":160,"x1":80,"y1":27,"x0":-80,"y0":-23,"hasText":true,"x":237,"y":61},{"text":"classif","size":24,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":48,"xoff":288,"yoff":160,"x1":48,"y1":23,"x0":-48,"y0":-20,"hasText":true,"x":77,"y":-105},{"text":"nemzetköz","size":24,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":48,"xoff":384,"yoff":160,"x1":64,"y1":23,"x0":-64,"y0":-20,"hasText":true,"x":-79,"y":-98},{"text":"tax","size":24,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":48,"xoff":512,"yoff":160,"x1":32,"y1":23,"x0":-32,"y0":-18,"hasText":true,"x":-133,"y":94},{"text":"légitársaság","size":23,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":576,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":93,"y":-19},{"text":"international","size":23,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":128,"height":46,"xoff":704,"yoff":160,"x1":64,"y1":22,"x0":-64,"y0":-18,"hasText":true,"x":-57,"y":-79},{"text":"belföld","size":20,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":40,"xoff":832,"yoff":160,"x1":48,"y1":19,"x0":-48,"y0":-16,"hasText":true,"x":191,"y":23},{"text":"member","size":18,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":928,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":86,"y":-58},{"text":"illetőségű","size":18,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1024,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":-194,"y":-41},{"text":"incom","size":18,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":36,"xoff":1120,"yoff":160,"x1":32,"y1":17,"x0":-32,"y0":-14,"hasText":true,"x":-58,"y":105},{"text":"services","size":18,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1184,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-14,"hasText":true,"x":17,"y":-105},{"text":"request","size":18,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":36,"xoff":1280,"yoff":160,"x1":48,"y1":17,"x0":-48,"y0":-13,"hasText":true,"x":-157,"y":113},{"text":"regulations","size":16,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":1376,"yoff":160,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":-227,"y":-14},{"text":"including","size":16,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":32,"xoff":1472,"yoff":160,"x1":48,"y1":15,"x0":-48,"y0":-13,"hasText":true,"x":-90,"y":-4},{"text":"apply","size":16,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":32,"xoff":1568,"yoff":160,"x1":32,"y1":15,"x0":-32,"y0":-13,"hasText":true,"x":-189,"y":-74},{"text":"vállalkozás","size":15,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":96,"height":30,"xoff":1632,"yoff":160,"x1":48,"y1":14,"x0":-48,"y0":-13,"hasText":true,"x":99,"y":82},{"text":"purpos","size":15,"color":{"alpha":0.7,"hue":48,"saturation":0.18,"lightness":0.67},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":30,"xoff":1728,"yoff":160,"x1":32,"y1":14,"x0":-32,"y0":-10,"hasText":true,"x":141,"y":127},{"text":"adó","size":15,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":30,"xoff":1792,"yoff":160,"x1":16,"y1":14,"x0":-16,"y0":-13,"hasText":true,"x":66,"y":-43},{"text":"szerződő","size":13,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":26,"xoff":1824,"yoff":160,"x1":32,"y1":12,"x0":-32,"y0":-12,"hasText":true,"x":-243,"y":17},{"text":"contracting","size":11,"color":{"alpha":0.7,"hue":7,"saturation":0.84,"lightness":0.59},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":22,"xoff":1888,"yoff":160,"x1":32,"y1":10,"x0":-32,"y0":-10,"hasText":true,"x":-198,"y":74},{"text":"egyezmény","size":9,"color":{"alpha":0.7,"hue":54,"saturation":0.5,"lightness":0.57},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":64,"height":18,"xoff":1952,"yoff":160,"x1":32,"y1":8,"x0":-32,"y0":-9,"hasText":true,"x":255,"y":90},{"text":"informat","size":5,"color":{"alpha":0.7,"hue":44,"saturation":0.79,"lightness":0.64},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":10,"xoff":0,"yoff":216,"x1":16,"y1":4,"x0":-16,"y0":-5,"hasText":true,"x":-247,"y":27},{"text":"biztonság","size":3,"color":{"alpha":0.7,"hue":108,"saturation":0.13,"lightness":0.22},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":6,"xoff":32,"yoff":216,"x1":16,"y1":2,"x0":-16,"y0":-3,"hasText":true,"x":-210,"y":15},{"text":"competen","size":2,"color":{"alpha":0.7,"hue":4,"saturation":0.13,"lightness":0.46},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":4,"xoff":64,"yoff":216,"x1":16,"y1":1,"x0":-16,"y0":-2,"hasText":true,"x":203,"y":85},{"text":"residen","size":1,"color":{"alpha":0.7,"hue":79,"saturation":0.11,"lightness":0.44},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":96,"yoff":216,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":-133,"y":-77},{"text":"információ","size":1,"color":{"alpha":0.7,"hue":349,"saturation":0.3,"lightness":0.36},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":2,"xoff":128,"yoff":216,"x1":16,"y1":0,"x0":-16,"y0":-1,"hasText":true,"x":144,"y":83},{"text":"stat","size":0,"color":{"alpha":0.7,"hue":350,"saturation":0.62,"lightness":0.24},"font":"Arial Narrow","style":"normal","weight":"normal","rotate":0,"padding":1,"width":32,"height":0,"xoff":160,"yoff":216,"x1":16,"y1":-1,"x0":-16,"y0":0,"hasText":true,"x":85,"y":-91}]}]}]\n    ';
var $author$project$Wordcloud$CloudPeriod = F2(
	function (id, topics) {
		return {aw: id, f: topics};
	});
var $author$project$Wordcloud$CloudTopic = F5(
	function (name, fadeIn, fadeOut, major_topic, cloud) {
		return {G: cloud, ak: fadeIn, al: fadeOut, ap: major_topic, s: name};
	});
var $author$project$Wordcloud$PrettyWord = function (text) {
	return function (size) {
		return function (font) {
			return function (style) {
				return function (weight) {
					return function (rotate) {
						return function (padding) {
							return function (x) {
								return function (y) {
									return function (color) {
										return function (startState) {
											return function (endState) {
												return {H: color, aj: endState, by: font, bG: padding, N: rotate, o: size, aq: startState, bJ: style, ar: text, bO: weight, t: x, u: y};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Wordcloud$HSLA = F4(
	function (hue, saturation, lightness, alpha) {
		return {Y: alpha, _: hue, aa: lightness, ac: saturation};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Wordcloud$decodeHSLA = function () {
	var normalize = function (a) {
		return $elm$json$Json$Decode$succeed(a / 360);
	};
	var decHue = A2($elm$json$Json$Decode$andThen, normalize, $elm$json$Json$Decode$float);
	return A5(
		$elm$json$Json$Decode$map4,
		$author$project$Wordcloud$HSLA,
		A2($elm$json$Json$Decode$field, 'hue', decHue),
		A2($elm$json$Json$Decode$field, 'saturation', $elm$json$Json$Decode$float),
		A2($elm$json$Json$Decode$field, 'lightness', $elm$json$Json$Decode$float),
		A2($elm$json$Json$Decode$field, 'alpha', $elm$json$Json$Decode$float));
}();
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded = A2($elm$core$Basics$composeR, $elm$json$Json$Decode$succeed, $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom);
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Wordcloud$decodePrettyWord = A2(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
	$elm$core$Maybe$Nothing,
	A2(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
		$elm$core$Maybe$Nothing,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'color',
			$author$project$Wordcloud$decodeHSLA,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'y',
				$elm$json$Json$Decode$float,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'x',
					$elm$json$Json$Decode$float,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'padding',
						$elm$json$Json$Decode$int,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'rotate',
							$elm$json$Json$Decode$float,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'weight',
								$elm$json$Json$Decode$string,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'style',
									$elm$json$Json$Decode$string,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'font',
										$elm$json$Json$Decode$string,
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'size',
											$elm$json$Json$Decode$float,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'text',
												$elm$json$Json$Decode$string,
												$elm$json$Json$Decode$succeed($author$project$Wordcloud$PrettyWord)))))))))))));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Wordcloud$decodeCloud = $elm$json$Json$Decode$list($author$project$Wordcloud$decodePrettyWord);
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Wordcloud$decodeCloudTopic = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Wordcloud$CloudTopic,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$succeed(true),
	$elm$json$Json$Decode$succeed(true),
	A2(
		$elm$json$Json$Decode$field,
		'major_topic',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
	A2($elm$json$Json$Decode$field, 'words', $author$project$Wordcloud$decodeCloud));
var $author$project$Wordcloud$decodeCloudPeriod = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Wordcloud$CloudPeriod,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'topics',
		$elm$json$Json$Decode$list($author$project$Wordcloud$decodeCloudTopic)));
var $author$project$Wordcloud$decodeCloudPeriods = $elm$json$Json$Decode$list($author$project$Wordcloud$decodeCloudPeriod);
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Wordcloud$emptyCloudPeriod = {aw: '', f: _List_Nil};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Wordcloud$remainCheck = F2(
	function (current, next) {
		var remains = function (a) {
			return A2(
				$elm$core$List$member,
				a.s,
				A2(
					$elm$core$List$map,
					function ($) {
						return $.s;
					},
					next.f));
		};
		var check = function (a) {
			var _v0 = remains(a);
			if (_v0) {
				return _Utils_update(
					a,
					{al: false});
			} else {
				return a;
			}
		};
		return _Utils_update(
			current,
			{
				f: A2($elm$core$List$map, check, current.f)
			});
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$Basics$not = _Basics_not;
var $elm_community$list_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$findIndex = $elm_community$list_extra$List$Extra$findIndexHelp(0);
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm_community$list_extra$List$Extra$splitAt = F2(
	function (n, xs) {
		return _Utils_Tuple2(
			A2($elm$core$List$take, n, xs),
			A2($elm$core$List$drop, n, xs));
	});
var $elm_community$list_extra$List$Extra$splitWhen = F2(
	function (predicate, list) {
		return A2(
			$elm$core$Maybe$map,
			function (i) {
				return A2($elm_community$list_extra$List$Extra$splitAt, i, list);
			},
			A2($elm_community$list_extra$List$Extra$findIndex, predicate, list));
	});
var $author$project$Wordcloud$reorderPeriod = F2(
	function (current, list) {
		var previous = function () {
			if (list.b) {
				var x = list.a;
				var xs = list.b;
				return x;
			} else {
				return current;
			}
		}();
		var newcomer = function (a) {
			return !A2(
				$elm$core$List$member,
				a.s,
				A2(
					$elm$core$List$map,
					function ($) {
						return $.s;
					},
					previous.f));
		};
		var newcomers = A2($elm$core$List$filter, newcomer, current.f);
		var justRemainers = function (a) {
			var _v3 = A2(
				$elm$core$List$filter,
				function (b) {
					return _Utils_eq(b.s, a.s);
				},
				current.f);
			if (_v3.b) {
				var x = _v3.a;
				return $elm$core$Maybe$Just(
					_Utils_update(
						x,
						{ak: false}));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var remainerList = A2($elm$core$List$map, justRemainers, previous.f);
		var integrateInto = F2(
			function (a, bs) {
				var _v0 = A2(
					$elm_community$list_extra$List$Extra$splitWhen,
					function (x) {
						return _Utils_eq(x, $elm$core$Maybe$Nothing);
					},
					bs);
				if (!_v0.$) {
					var _v1 = _v0.a;
					var xs = _v1.a;
					var ys = _v1.b;
					if (ys.b) {
						var z = ys.a;
						var zs = ys.b;
						return _Utils_ap(
							xs,
							A2(
								$elm$core$List$cons,
								$elm$core$Maybe$Just(a),
								zs));
					} else {
						return xs;
					}
				} else {
					return bs;
				}
			});
		return A2(
			$elm$core$List$cons,
			_Utils_update(
				current,
				{
					f: A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						A3($elm$core$List$foldl, integrateInto, remainerList, newcomers))
				}),
			list);
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Wordcloud$accentDict = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('Á', 'A'),
			_Utils_Tuple2('É', 'E'),
			_Utils_Tuple2('Í', 'I'),
			_Utils_Tuple2('Ó', 'O'),
			_Utils_Tuple2('Ú', 'U'),
			_Utils_Tuple2('Ö', 'O'),
			_Utils_Tuple2('Ő', 'O'),
			_Utils_Tuple2('Ü', 'U'),
			_Utils_Tuple2('Ű', 'U'),
			_Utils_Tuple2('á', 'a'),
			_Utils_Tuple2('é', 'e'),
			_Utils_Tuple2('í', 'i'),
			_Utils_Tuple2('ó', 'o'),
			_Utils_Tuple2('ú', 'u'),
			_Utils_Tuple2('ö', 'o'),
			_Utils_Tuple2('ő', 'o'),
			_Utils_Tuple2('ü', 'u'),
			_Utils_Tuple2('ű', 'u')
		]));
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$String$map = _String_map;
var $author$project$Wordcloud$accentRemove = function (txt) {
	var checkchar = function (a) {
		var _v0 = A2($elm$core$Dict$get, a, $author$project$Wordcloud$accentDict);
		if (!_v0.$) {
			var b = _v0.a;
			return b;
		} else {
			return a;
		}
	};
	return A2($elm$core$String$map, checkchar, txt);
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Wordcloud$sortPeriods = function (list) {
	var sortPeriod = function (a) {
		return _Utils_update(
			a,
			{
				f: A2(
					$elm$core$List$sortBy,
					A2(
						$elm$core$Basics$composeL,
						$author$project$Wordcloud$accentRemove,
						function ($) {
							return $.s;
						}),
					a.f)
			});
	};
	return A2($elm$core$List$map, sortPeriod, list);
};
var $author$project$Wordcloud$reorder = function (raw) {
	var periods = $author$project$Wordcloud$sortPeriods(raw);
	var fadeOutCheck = function (ys) {
		if (ys.b) {
			var z = ys.a;
			var zs = ys.b;
			return A3(
				$elm$core$List$map2,
				$author$project$Wordcloud$remainCheck,
				ys,
				_Utils_ap(
					zs,
					_List_fromArray(
						[$author$project$Wordcloud$emptyCloudPeriod])));
		} else {
			return _List_Nil;
		}
	};
	return fadeOutCheck(
		$elm$core$List$reverse(
			A3($elm$core$List$foldl, $author$project$Wordcloud$reorderPeriod, _List_Nil, periods)));
};
var $author$project$Wordcloud$rawPeriods = function () {
	var _v0 = A2($elm$json$Json$Decode$decodeString, $author$project$Wordcloud$decodeCloudPeriods, $author$project$WordcloudData$dataString);
	if (!_v0.$) {
		var a = _v0.a;
		return $author$project$Wordcloud$reorder(a);
	} else {
		return _List_Nil;
	}
}();
var $author$project$Wordcloud$init = function (_v0) {
	return _Utils_Tuple2(
		{
			Z: true,
			k: A4($author$project$Wordcloud$animSet, 0, 1, $author$project$Wordcloud$animLengthDefault, -1),
			r: 0,
			m: A4($author$project$Wordcloud$animSet, 0, 1, $author$project$Wordcloud$animLengthDefault / 2, 0),
			D: $author$project$Wordcloud$rawPeriods,
			U: 50,
			i: 0
		},
		A2($elm$core$Task$perform, $author$project$Wordcloud$GetViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$Wordcloud$Dt = function (a) {
	return {$: 1, a: a};
};
var $author$project$Wordcloud$Resized = {$: 3};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {az: oldTime, bg: request, bi: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.bg;
		var oldTime = _v0.az;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 1) {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.bi;
		var oldTime = _v0.az;
		var send = function (sub) {
			if (!sub.$) {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 0, a: a};
};
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (!sub.$) {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Delta(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrameDelta = $elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var $elm$browser$Browser$Events$Window = 1;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {a8: pids, bi: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {aM: event, aQ: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.a8,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.aQ;
		var event = _v0.aM;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.bi);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Wordcloud$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onAnimationFrameDelta($author$project$Wordcloud$Dt),
				$elm$browser$Browser$Events$onResize(
				F2(
					function (_v0, _v1) {
						return $author$project$Wordcloud$Resized;
					}))
			]));
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$pi = _Basics_pi;
var $mgold$elm_animation$Animation$defaultEase = function (x) {
	return (1 - $elm$core$Basics$cos($elm$core$Basics$pi * x)) / 2;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $mgold$elm_animation$Animation$dur = F3(
	function (dos, from_, to_) {
		if (!dos.$) {
			var t = dos.a;
			return t;
		} else {
			var s = dos.a;
			return $elm$core$Basics$abs(to_ - from_) / s;
		}
	});
var $mgold$elm_animation$Animation$animate = F2(
	function (clock, _v0) {
		var start = _v0.aD;
		var delay_ = _v0.l;
		var dos = _v0.h;
		var ramp = _v0.z;
		var from_ = _v0.d;
		var to_ = _v0.a;
		var ease_ = _v0.B;
		var duration_ = A3($mgold$elm_animation$Animation$dur, dos, from_, to_);
		var fr = A3($elm$core$Basics$clamp, 0, 1, ((clock - start) - delay_) / duration_);
		var eased = ease_(fr);
		var correction = function () {
			if (ramp.$ === 1) {
				return 0;
			} else {
				var vel = ramp.a;
				var from__ = vel * (clock - start);
				var eased_ = $mgold$elm_animation$Animation$defaultEase(fr);
				return from__ - (from__ * eased_);
			}
		}();
		return (from_ + ((to_ - from_) * eased)) + correction;
	});
var $mgold$elm_animation$Animation$A = $elm$core$Basics$identity;
var $mgold$elm_animation$Animation$AnimRecord = F7(
	function (start, delay_, dos, ramp, ease_, from_, to_) {
		return {l: delay_, h: dos, B: ease_, d: from_, z: ramp, aD: start, a: to_};
	});
var $mgold$elm_animation$Animation$Duration = function (a) {
	return {$: 0, a: a};
};
var $mgold$elm_animation$Animation$defaultDuration = $mgold$elm_animation$Animation$Duration(750);
var $mgold$elm_animation$Animation$animation = function (t) {
	return A7($mgold$elm_animation$Animation$AnimRecord, t, 0, $mgold$elm_animation$Animation$defaultDuration, $elm$core$Maybe$Nothing, $mgold$elm_animation$Animation$defaultEase, 0, 1);
};
var $mgold$elm_animation$Animation$delay = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{l: x});
	});
var $mgold$elm_animation$Animation$duration = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{
				h: $mgold$elm_animation$Animation$Duration(x)
			});
	});
var $mgold$elm_animation$Animation$from = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{d: x, z: $elm$core$Maybe$Nothing});
	});
var $mgold$elm_animation$Animation$to = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{z: $elm$core$Maybe$Nothing, a: x});
	});
var $author$project$Wordcloud$animRender = function (anim) {
	var animation = A2(
		$mgold$elm_animation$Animation$delay,
		anim.A.ah,
		A2(
			$mgold$elm_animation$Animation$duration,
			anim.A.ai,
			A2(
				$mgold$elm_animation$Animation$to,
				anim.A.bl,
				A2(
					$mgold$elm_animation$Animation$from,
					anim.A.aO,
					$mgold$elm_animation$Animation$animation(0)))));
	return A2($mgold$elm_animation$Animation$animate, anim.K, animation);
};
var $author$project$Wordcloud$animRunning = function (anim) {
	return _Utils_cmp(anim.K, anim.A.ai + anim.A.ah) < 0;
};
var $author$project$Wordcloud$animStart = function (anim) {
	return _Utils_update(
		anim,
		{K: 0});
};
var $author$project$Wordcloud$animStop = function (anim) {
	return _Utils_update(
		anim,
		{K: anim.A.ai + anim.A.ah});
};
var $author$project$Wordcloud$animUpdate = F3(
	function (anim, timeDelta, sliderVal) {
		return _Utils_update(
			anim,
			{K: anim.K + ((timeDelta * (1 / 1000)) * (sliderVal / 50))});
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Wordcloud$intersects = F2(
	function (list1, list2) {
		var checker = function (a) {
			return A2($elm$core$List$member, a, list1);
		};
		return A2($elm$core$List$any, checker, list2);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Wordcloud$diffRelevant = F2(
	function (curr, prev) {
		return A2($author$project$Wordcloud$intersects, curr.ap, prev.ap) && (!_Utils_eq(curr.s, prev.s));
	});
var $author$project$Wordcloud$setFrame = F5(
	function (size, rotate, x, y, color) {
		return {H: color, N: rotate, o: size, t: x, u: y};
	});
var $author$project$Wordcloud$diffWord = F3(
	function (previousPeriod, currentTopic, word) {
		var state = function (a) {
			return A5($author$project$Wordcloud$setFrame, a.o, a.N, a.t, a.u, a.H);
		};
		var startSmall = function (a) {
			return A5($author$project$Wordcloud$setFrame, 0, a.N, a.t, a.u, a.H);
		};
		var sameWord = function (a) {
			return _Utils_eq(word.ar, a.ar);
		};
		var relevantPreviousTopics = A2(
			$elm$core$List$filter,
			$author$project$Wordcloud$diffRelevant(currentTopic),
			previousPeriod.f);
		var relevantPreviousWords = $elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.G;
				},
				relevantPreviousTopics));
		var initializeFrom = function (x) {
			return _Utils_update(
				word,
				{
					aj: $elm$core$Maybe$Just(
						state(word)),
					aq: $elm$core$Maybe$Just(
						state(x))
				});
		};
		var _v0 = A2($elm$core$List$filter, sameWord, relevantPreviousWords);
		if (!_v0.b) {
			return _List_fromArray(
				[
					_Utils_update(
					word,
					{
						aj: $elm$core$Maybe$Just(
							state(word)),
						aq: $elm$core$Maybe$Just(
							startSmall(word))
					})
				]);
		} else {
			var xs = _v0;
			return A2($elm$core$List$map, initializeFrom, xs);
		}
	});
var $author$project$Wordcloud$diff = F2(
	function (prev, current) {
		var diffTopic = function (topic) {
			return _Utils_update(
				topic,
				{
					G: $elm$core$List$concat(
						A2(
							$elm$core$List$map,
							A2($author$project$Wordcloud$diffWord, prev, topic),
							topic.G))
				});
		};
		return _Utils_update(
			current,
			{
				f: A2($elm$core$List$map, diffTopic, current.f)
			});
	});
var $author$project$Wordcloud$apply = F2(
	function (f, a) {
		return f(a);
	});
var $author$project$Wordcloud$scaleTo = F3(
	function (factor, center, point) {
		return (factor * point) + center;
	});
var $author$project$Wordcloud$placeWord = F3(
	function (sc, _v0, word) {
		var cx = _v0.a;
		var cy = _v0.b;
		var wy = A2($author$project$Wordcloud$scaleTo, sc, cy);
		var wx = A2($author$project$Wordcloud$scaleTo, sc, cx);
		return _Utils_update(
			word,
			{
				o: word.o * sc,
				t: wx(word.t),
				u: wy(word.u)
			});
	});
var $author$project$Wordcloud$placementMatrix = _List_fromArray(
	[
		_Utils_Tuple2(1 / 8, 1 / 6),
		_Utils_Tuple2(7 / 8, 1 / 6),
		_Utils_Tuple2(1 / 8, 3 / 6),
		_Utils_Tuple2(3 / 8, 3 / 6),
		_Utils_Tuple2(5 / 8, 3 / 6),
		_Utils_Tuple2(7 / 8, 3 / 6),
		_Utils_Tuple2(1 / 8, 5 / 6),
		_Utils_Tuple2(3 / 8, 5 / 6),
		_Utils_Tuple2(5 / 8, 5 / 6),
		_Utils_Tuple2(7 / 8, 5 / 6)
	]);
var $author$project$Wordcloud$placePeriod = F4(
	function (sc, w, h, current) {
		var toCenter = function (_v0) {
			var x = _v0.a;
			var y = _v0.b;
			return _Utils_Tuple2(x * w, y * h);
		};
		var placeTopic = F2(
			function (a, b) {
				return _Utils_update(
					b,
					{
						G: A2(
							$elm$core$List$map,
							A2($author$project$Wordcloud$placeWord, sc, a),
							b.G)
					});
			});
		var centers = A2($elm$core$List$map, toCenter, $author$project$Wordcloud$placementMatrix);
		var placers = A2($elm$core$List$map, placeTopic, centers);
		return _Utils_update(
			current,
			{
				f: A3($elm$core$List$map2, $author$project$Wordcloud$apply, placers, current.f)
			});
	});
var $author$project$Wordcloud$cloudSizeOrig = {an: 500, aF: 1000};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Wordcloud$scale = function (model) {
	return A2($elm$core$Basics$min, model.i / (4 * $author$project$Wordcloud$cloudSizeOrig.aF), model.r / (3.3 * $author$project$Wordcloud$cloudSizeOrig.an));
};
var $author$project$Wordcloud$placePeriods = function (model) {
	var place = A3(
		$author$project$Wordcloud$placePeriod,
		$author$project$Wordcloud$scale(model),
		model.i,
		model.r);
	var folder = F2(
		function (y, done) {
			var _v0 = A2(
				$elm$core$List$drop,
				$elm$core$List$length(done) - 1,
				done);
			if (!_v0.b) {
				return _List_fromArray(
					[
						A2(
						$author$project$Wordcloud$diff,
						$author$project$Wordcloud$emptyCloudPeriod,
						place(y))
					]);
			} else {
				var x = _v0.a;
				return _Utils_ap(
					done,
					_List_fromArray(
						[
							A2(
							$author$project$Wordcloud$diff,
							x,
							place(y))
						]));
			}
		});
	var periods = A3($elm$core$List$foldl, folder, _List_Nil, model.D);
	return _Utils_update(
		model,
		{D: periods});
};
var $author$project$Wordcloud$shift = F2(
	function (n, list) {
		var m = function () {
			var _v0 = n < 0;
			if (_v0) {
				return $elm$core$List$length(list) + n;
			} else {
				return n;
			}
		}();
		return _Utils_ap(
			A2($elm$core$List$drop, m, list),
			A2($elm$core$List$take, m, list));
	});
var $author$project$Wordcloud$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var bool = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Z: bool}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var dt = msg.a;
				if (!model.Z) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var _v1 = $author$project$Wordcloud$animRunning(model.k);
					if (_v1) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: A3($author$project$Wordcloud$animUpdate, model.k, dt, model.U)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v2 = $author$project$Wordcloud$animRunning(model.m);
						if (_v2) {
							var _v3 = function () {
								var _v4 = $author$project$Wordcloud$animRender(model.m) >= 0.97;
								if (_v4) {
									return _Utils_Tuple3(
										$author$project$Wordcloud$animStart(model.k),
										A2($author$project$Wordcloud$shift, 1, model.D),
										$author$project$Wordcloud$animStop(model.m));
								} else {
									return _Utils_Tuple3(
										model.k,
										model.D,
										A3($author$project$Wordcloud$animUpdate, model.m, dt, model.U));
								}
							}();
							var animation = _v3.a;
							var periods = _v3.b;
							var kuss = _v3.c;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{k: animation, m: kuss, D: periods}),
								$elm$core$Platform$Cmd$none);
						} else {
							var _v5 = (model.r > 0) && (model.i > 0);
							if (_v5) {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											m: $author$project$Wordcloud$animStart(model.m)
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						}
					}
				}
			case 2:
				var data = msg.a;
				return _Utils_Tuple2(
					$author$project$Wordcloud$placePeriods(
						_Utils_update(
							model,
							{
								k: $author$project$Wordcloud$animStart(model.k),
								r: data.bm.an,
								i: data.bm.aF
							})),
					$elm$core$Platform$Cmd$none);
			case 3:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: $author$project$Wordcloud$animStop(model.m),
							D: $author$project$Wordcloud$rawPeriods
						}),
					A2($elm$core$Task$perform, $author$project$Wordcloud$GetViewport, $elm$browser$Browser$Dom$getViewport));
			default:
				var value = msg.a;
				var _v6 = $elm$core$String$toInt(value);
				if (!_v6.$) {
					var _int = _v6.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{U: _int}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$Fill = function (a) {
	return {$: 1, a: a};
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$SettingDrawOp = function (a) {
	return {$: 2, a: a};
};
var $joakin$elm_canvas$Canvas$Settings$fill = function (color) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingDrawOp(
		$joakin$elm_canvas$Canvas$Internal$Canvas$Fill(color));
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$Rect = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $joakin$elm_canvas$Canvas$rect = F3(
	function (pos, width, height) {
		return A3($joakin$elm_canvas$Canvas$Internal$Canvas$Rect, pos, width, height);
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$DrawableShapes = function (a) {
	return {$: 1, a: a};
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$NotSpecified = {$: 0};
var $joakin$elm_canvas$Canvas$Internal$Canvas$Renderable = $elm$core$Basics$identity;
var $joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$Stroke = function (a) {
	return {$: 2, a: a};
};
var $joakin$elm_canvas$Canvas$mergeDrawOp = F2(
	function (op1, op2) {
		var _v0 = _Utils_Tuple2(op1, op2);
		_v0$7:
		while (true) {
			switch (_v0.b.$) {
				case 3:
					var _v1 = _v0.b;
					var c = _v1.a;
					var sc = _v1.b;
					return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c, sc);
				case 1:
					switch (_v0.a.$) {
						case 1:
							var c = _v0.b.a;
							return $joakin$elm_canvas$Canvas$Internal$Canvas$Fill(c);
						case 2:
							var c1 = _v0.a.a;
							var c2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c2, c1);
						case 3:
							var _v2 = _v0.a;
							var sc = _v2.b;
							var c2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c2, sc);
						default:
							break _v0$7;
					}
				case 2:
					switch (_v0.a.$) {
						case 2:
							var c = _v0.b.a;
							return $joakin$elm_canvas$Canvas$Internal$Canvas$Stroke(c);
						case 1:
							var c1 = _v0.a.a;
							var c2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c1, c2);
						case 3:
							var _v3 = _v0.a;
							var c = _v3.a;
							var sc2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c, sc2);
						default:
							break _v0$7;
					}
				default:
					if (!_v0.a.$) {
						break _v0$7;
					} else {
						var whatever = _v0.a;
						var _v5 = _v0.b;
						return whatever;
					}
			}
		}
		var _v4 = _v0.a;
		var whatever = _v0.b;
		return whatever;
	});
var $joakin$elm_canvas$Canvas$addSettingsToRenderable = F2(
	function (settings, renderable) {
		var addSetting = F2(
			function (setting, _v1) {
				var r = _v1;
				switch (setting.$) {
					case 0:
						var cmd = setting.a;
						return _Utils_update(
							r,
							{
								w: A2($elm$core$List$cons, cmd, r.w)
							});
					case 1:
						var cmds = setting.a;
						return _Utils_update(
							r,
							{
								w: A3($elm$core$List$foldl, $elm$core$List$cons, r.w, cmds)
							});
					case 3:
						var f = setting.a;
						return _Utils_update(
							r,
							{
								J: f(r.J)
							});
					default:
						var op = setting.a;
						return _Utils_update(
							r,
							{
								I: A2($joakin$elm_canvas$Canvas$mergeDrawOp, r.I, op)
							});
				}
			});
		return A3($elm$core$List$foldl, addSetting, renderable, settings);
	});
var $joakin$elm_canvas$Canvas$shapes = F2(
	function (settings, ss) {
		return A2(
			$joakin$elm_canvas$Canvas$addSettingsToRenderable,
			settings,
			{
				w: _List_Nil,
				I: $joakin$elm_canvas$Canvas$Internal$Canvas$NotSpecified,
				J: $joakin$elm_canvas$Canvas$Internal$Canvas$DrawableShapes(ss)
			});
	});
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$white = A4($avh4$elm_color$Color$RgbaSpace, 255 / 255, 255 / 255, 255 / 255, 1.0);
var $author$project$Wordcloud$clearScreen = function (model) {
	return A2(
		$joakin$elm_canvas$Canvas$shapes,
		_List_fromArray(
			[
				$joakin$elm_canvas$Canvas$Settings$fill($avh4$elm_color$Color$white)
			]),
		_List_fromArray(
			[
				A3(
				$joakin$elm_canvas$Canvas$rect,
				_Utils_Tuple2(0, 0),
				model.i,
				model.r)
			]));
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $elm$core$Basics$round = _Basics_round;
var $author$project$Wordcloud$Animating = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Wordcloud$fontAwe = F3(
	function (attrs, clss, id) {
		return A2(
			$elm$html$Html$span,
			_Utils_ap(
				attrs,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('icon ' + clss)
					])),
			_List_fromArray(
				[
					A3(
					$elm$html$Html$node,
					'i',
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(id)
						]),
					_List_Nil)
				]));
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Wordcloud$butt = function (model) {
	var _v0 = function () {
		var _v1 = model.Z;
		if (_v1) {
			return _Utils_Tuple2(
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Wordcloud$Animating(false))
					]),
				'fa-pause-circle');
		} else {
			return _Utils_Tuple2(
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Wordcloud$Animating(true))
					]),
				'fa-play-circle');
		}
	}();
	var msg = _v0.a;
	var id = _v0.b;
	return A3($author$project$Wordcloud$fontAwe, msg, 'is-large has-text-warning', 'fas fa-3x ' + id);
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Wordcloud$placeForSlider = function (model) {
	var width = (model.i * 1) / 3;
	var top = 32;
	var left = (model.i * 1) / 3;
	var _v0 = (model.i > 0) && (model.r > 0);
	if (_v0) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$Attributes$style,
				'top',
				$elm$core$String$fromFloat(top) + 'px'),
				A2(
				$elm$html$Html$Attributes$style,
				'left',
				$elm$core$String$fromFloat(left) + 'px'),
				A2(
				$elm$html$Html$Attributes$style,
				'width',
				$elm$core$String$fromFloat(width) + 'px'),
				A2($elm$html$Html$Attributes$style, 'position', 'absolute')
			]);
	} else {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'none')
			]);
	}
};
var $author$project$Wordcloud$Slide = function (a) {
	return {$: 4, a: a};
};
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Wordcloud$slider = function (val) {
	return A3(
		$elm$html$Html$node,
		'input',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('slider is-fullwidth is-medium'),
				$elm$html$Html$Attributes$step('1'),
				$elm$html$Html$Attributes$min('0'),
				$elm$html$Html$Attributes$max('100'),
				$elm$html$Html$Attributes$value(
				$elm$core$String$fromInt(val)),
				$elm$html$Html$Attributes$type_('range'),
				A2($elm$html$Html$Attributes$style, 'padding', '8px'),
				$elm$html$Html$Events$onInput($author$project$Wordcloud$Slide)
			]),
		_List_Nil);
};
var $author$project$Wordcloud$sliderWithButts = function (model) {
	return A2(
		$elm$html$Html$div,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$class('has-text-centered'),
			$author$project$Wordcloud$placeForSlider(model)),
		_List_fromArray(
			[
				$author$project$Wordcloud$butt(model),
				$author$project$Wordcloud$slider(model.U)
			]));
};
var $elm$html$Html$canvas = _VirtualDom_node('canvas');
var $joakin$elm_canvas$Canvas$cnvs = A2($elm$html$Html$canvas, _List_Nil, _List_Nil);
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlJson(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$commands = function (list) {
	return A2(
		$elm$html$Html$Attributes$property,
		'cmds',
		A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, list));
};
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$empty = _List_Nil;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn = F2(
	function (name, args) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('function')),
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(name)),
					_Utils_Tuple2(
					'args',
					A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, args))
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$beginPath = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'beginPath', _List_Nil);
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field = F2(
	function (name, value) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('field')),
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(name)),
					_Utils_Tuple2('value', value)
				]));
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle = function (color) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'fillStyle',
		$elm$json$Json$Encode$string(
			$avh4$elm_color$Color$toCssString(color)));
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$clearRect = F4(
	function (x, y, width, height) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'clearRect',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y),
					$elm$json$Json$Encode$float(width),
					$elm$json$Json$Encode$float(height)
				]));
	});
var $joakin$elm_canvas$Canvas$renderClear = F4(
	function (_v0, w, h, cmds) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$elm$core$List$cons,
			A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$clearRect, x, y, w, h),
			cmds);
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arc = F6(
	function (x, y, radius, startAngle, endAngle, anticlockwise) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'arc',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y),
					$elm$json$Json$Encode$float(radius),
					$elm$json$Json$Encode$float(startAngle),
					$elm$json$Json$Encode$float(endAngle),
					$elm$json$Json$Encode$bool(anticlockwise)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$circle = F3(
	function (x, y, r) {
		return A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arc, x, y, r, 0, 2 * $elm$core$Basics$pi, false);
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo = F2(
	function (x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'moveTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$rect = F4(
	function (x, y, w, h) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'rect',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y),
					$elm$json$Json$Encode$float(w),
					$elm$json$Json$Encode$float(h)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arcTo = F5(
	function (x1, y1, x2, y2, radius) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'arcTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x1),
					$elm$json$Json$Encode$float(y1),
					$elm$json$Json$Encode$float(x2),
					$elm$json$Json$Encode$float(y2),
					$elm$json$Json$Encode$float(radius)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$bezierCurveTo = F6(
	function (cp1x, cp1y, cp2x, cp2y, x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'bezierCurveTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(cp1x),
					$elm$json$Json$Encode$float(cp1y),
					$elm$json$Json$Encode$float(cp2x),
					$elm$json$Json$Encode$float(cp2y),
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$lineTo = F2(
	function (x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'lineTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$quadraticCurveTo = F4(
	function (cpx, cpy, x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'quadraticCurveTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(cpx),
					$elm$json$Json$Encode$float(cpy),
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$renderLineSegment = F2(
	function (segment, cmds) {
		switch (segment.$) {
			case 0:
				var _v1 = segment.a;
				var x = _v1.a;
				var y = _v1.b;
				var _v2 = segment.b;
				var x2 = _v2.a;
				var y2 = _v2.b;
				var radius = segment.c;
				return A2(
					$elm$core$List$cons,
					A5($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arcTo, x, y, x2, y2, radius),
					cmds);
			case 1:
				var _v3 = segment.a;
				var cp1x = _v3.a;
				var cp1y = _v3.b;
				var _v4 = segment.b;
				var cp2x = _v4.a;
				var cp2y = _v4.b;
				var _v5 = segment.c;
				var x = _v5.a;
				var y = _v5.b;
				return A2(
					$elm$core$List$cons,
					A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$bezierCurveTo, cp1x, cp1y, cp2x, cp2y, x, y),
					cmds);
			case 2:
				var _v6 = segment.a;
				var x = _v6.a;
				var y = _v6.b;
				return A2(
					$elm$core$List$cons,
					A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$lineTo, x, y),
					cmds);
			case 3:
				var _v7 = segment.a;
				var x = _v7.a;
				var y = _v7.b;
				return A2(
					$elm$core$List$cons,
					A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x, y),
					cmds);
			default:
				var _v8 = segment.a;
				var cpx = _v8.a;
				var cpy = _v8.b;
				var _v9 = segment.b;
				var x = _v9.a;
				var y = _v9.b;
				return A2(
					$elm$core$List$cons,
					A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$quadraticCurveTo, cpx, cpy, x, y),
					cmds);
		}
	});
var $elm$core$Basics$sin = _Basics_sin;
var $joakin$elm_canvas$Canvas$renderShape = F2(
	function (shape, cmds) {
		switch (shape.$) {
			case 0:
				var _v1 = shape.a;
				var x = _v1.a;
				var y = _v1.b;
				var w = shape.b;
				var h = shape.c;
				return A2(
					$elm$core$List$cons,
					A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$rect, x, y, w, h),
					A2(
						$elm$core$List$cons,
						A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x, y),
						cmds));
			case 1:
				var _v2 = shape.a;
				var x = _v2.a;
				var y = _v2.b;
				var r = shape.b;
				return A2(
					$elm$core$List$cons,
					A3($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$circle, x, y, r),
					A2(
						$elm$core$List$cons,
						A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x + r, y),
						cmds));
			case 2:
				var _v3 = shape.a;
				var x = _v3.a;
				var y = _v3.b;
				var segments = shape.b;
				return A3(
					$elm$core$List$foldl,
					$joakin$elm_canvas$Canvas$renderLineSegment,
					A2(
						$elm$core$List$cons,
						A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x, y),
						cmds),
					segments);
			default:
				var _v4 = shape.a;
				var x = _v4.a;
				var y = _v4.b;
				var radius = shape.b;
				var startAngle = shape.c;
				var endAngle = shape.d;
				var anticlockwise = shape.e;
				return A2(
					$elm$core$List$cons,
					A2(
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo,
						x + (radius * $elm$core$Basics$cos(endAngle)),
						y + (radius * $elm$core$Basics$sin(endAngle))),
					A2(
						$elm$core$List$cons,
						A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arc, x, y, radius, startAngle, endAngle, anticlockwise),
						A2(
							$elm$core$List$cons,
							A2(
								$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo,
								x + (radius * $elm$core$Basics$cos(startAngle)),
								y + (radius * $elm$core$Basics$sin(startAngle))),
							cmds)));
		}
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$NonZero = 0;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillRuleToString = function (fillRule) {
	if (!fillRule) {
		return 'nonzero';
	} else {
		return 'evenodd';
	}
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fill = function (fillRule) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
		'fill',
		_List_fromArray(
			[
				$elm$json$Json$Encode$string(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillRuleToString(fillRule))
			]));
};
var $joakin$elm_canvas$Canvas$renderShapeFill = F2(
	function (maybeColor, cmds) {
		return A2(
			$elm$core$List$cons,
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fill(0),
			function () {
				if (!maybeColor.$) {
					var color = maybeColor.a;
					return A2(
						$elm$core$List$cons,
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle(color),
						cmds);
				} else {
					return cmds;
				}
			}());
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$stroke = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'stroke', _List_Nil);
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle = function (color) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'strokeStyle',
		$elm$json$Json$Encode$string(
			$avh4$elm_color$Color$toCssString(color)));
};
var $joakin$elm_canvas$Canvas$renderShapeStroke = F2(
	function (maybeColor, cmds) {
		return A2(
			$elm$core$List$cons,
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$stroke,
			function () {
				if (!maybeColor.$) {
					var color = maybeColor.a;
					return A2(
						$elm$core$List$cons,
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle(color),
						cmds);
				} else {
					return cmds;
				}
			}());
	});
var $joakin$elm_canvas$Canvas$renderShapeDrawOp = F2(
	function (drawOp, cmds) {
		switch (drawOp.$) {
			case 0:
				return A2(
					$joakin$elm_canvas$Canvas$renderShapeStroke,
					$elm$core$Maybe$Nothing,
					A2($joakin$elm_canvas$Canvas$renderShapeFill, $elm$core$Maybe$Nothing, cmds));
			case 1:
				var c = drawOp.a;
				return A2(
					$joakin$elm_canvas$Canvas$renderShapeFill,
					$elm$core$Maybe$Just(c),
					cmds);
			case 2:
				var c = drawOp.a;
				return A2(
					$joakin$elm_canvas$Canvas$renderShapeStroke,
					$elm$core$Maybe$Just(c),
					cmds);
			default:
				var fc = drawOp.a;
				var sc = drawOp.b;
				return A2(
					$joakin$elm_canvas$Canvas$renderShapeStroke,
					$elm$core$Maybe$Just(sc),
					A2(
						$joakin$elm_canvas$Canvas$renderShapeFill,
						$elm$core$Maybe$Just(fc),
						cmds));
		}
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillText = F4(
	function (text, x, y, maybeMaxWidth) {
		if (maybeMaxWidth.$ === 1) {
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'fillText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y)
					]));
		} else {
			var maxWidth = maybeMaxWidth.a;
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'fillText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y),
						$elm$json$Json$Encode$float(maxWidth)
					]));
		}
	});
var $joakin$elm_canvas$Canvas$renderTextFill = F5(
	function (txt, x, y, maybeColor, cmds) {
		return A2(
			$elm$core$List$cons,
			A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillText, txt.ar, x, y, txt.ax),
			function () {
				if (!maybeColor.$) {
					var color = maybeColor.a;
					return A2(
						$elm$core$List$cons,
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle(color),
						cmds);
				} else {
					return cmds;
				}
			}());
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeText = F4(
	function (text, x, y, maybeMaxWidth) {
		if (maybeMaxWidth.$ === 1) {
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'strokeText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y)
					]));
		} else {
			var maxWidth = maybeMaxWidth.a;
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'strokeText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y),
						$elm$json$Json$Encode$float(maxWidth)
					]));
		}
	});
var $joakin$elm_canvas$Canvas$renderTextStroke = F5(
	function (txt, x, y, maybeColor, cmds) {
		return A2(
			$elm$core$List$cons,
			A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeText, txt.ar, x, y, txt.ax),
			function () {
				if (!maybeColor.$) {
					var color = maybeColor.a;
					return A2(
						$elm$core$List$cons,
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle(color),
						cmds);
				} else {
					return cmds;
				}
			}());
	});
var $joakin$elm_canvas$Canvas$renderTextDrawOp = F3(
	function (drawOp, txt, cmds) {
		var _v0 = txt.a9;
		var x = _v0.a;
		var y = _v0.b;
		switch (drawOp.$) {
			case 0:
				return A5(
					$joakin$elm_canvas$Canvas$renderTextStroke,
					txt,
					x,
					y,
					$elm$core$Maybe$Nothing,
					A5($joakin$elm_canvas$Canvas$renderTextFill, txt, x, y, $elm$core$Maybe$Nothing, cmds));
			case 1:
				var c = drawOp.a;
				return A5(
					$joakin$elm_canvas$Canvas$renderTextFill,
					txt,
					x,
					y,
					$elm$core$Maybe$Just(c),
					cmds);
			case 2:
				var c = drawOp.a;
				return A5(
					$joakin$elm_canvas$Canvas$renderTextStroke,
					txt,
					x,
					y,
					$elm$core$Maybe$Just(c),
					cmds);
			default:
				var fc = drawOp.a;
				var sc = drawOp.b;
				return A5(
					$joakin$elm_canvas$Canvas$renderTextStroke,
					txt,
					x,
					y,
					$elm$core$Maybe$Just(sc),
					A5(
						$joakin$elm_canvas$Canvas$renderTextFill,
						txt,
						x,
						y,
						$elm$core$Maybe$Just(fc),
						cmds));
		}
	});
var $joakin$elm_canvas$Canvas$renderText = F3(
	function (drawOp, txt, cmds) {
		return A3($joakin$elm_canvas$Canvas$renderTextDrawOp, drawOp, txt, cmds);
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$drawImage = F9(
	function (sx, sy, sw, sh, dx, dy, dw, dh, imageObj) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'drawImage',
			_List_fromArray(
				[
					imageObj,
					$elm$json$Json$Encode$float(sx),
					$elm$json$Json$Encode$float(sy),
					$elm$json$Json$Encode$float(sw),
					$elm$json$Json$Encode$float(sh),
					$elm$json$Json$Encode$float(dx),
					$elm$json$Json$Encode$float(dy),
					$elm$json$Json$Encode$float(dw),
					$elm$json$Json$Encode$float(dh)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$Texture$drawTexture = F4(
	function (x, y, t, cmds) {
		return A2(
			$elm$core$List$cons,
			function () {
				if (!t.$) {
					var image = t.a;
					return A9($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$drawImage, 0, 0, image.aF, image.an, x, y, image.aF, image.an, image.ao);
				} else {
					var sprite = t.a;
					var image = t.b;
					return A9($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$drawImage, sprite.t, sprite.u, sprite.aF, sprite.an, x, y, sprite.aF, sprite.an, image.ao);
				}
			}(),
			cmds);
	});
var $joakin$elm_canvas$Canvas$renderTexture = F3(
	function (_v0, t, cmds) {
		var x = _v0.a;
		var y = _v0.b;
		return A4($joakin$elm_canvas$Canvas$Internal$Texture$drawTexture, x, y, t, cmds);
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$restore = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'restore', _List_Nil);
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$save = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'save', _List_Nil);
var $joakin$elm_canvas$Canvas$renderDrawable = F3(
	function (drawable, drawOp, cmds) {
		switch (drawable.$) {
			case 0:
				var txt = drawable.a;
				return A3($joakin$elm_canvas$Canvas$renderText, drawOp, txt, cmds);
			case 1:
				var ss = drawable.a;
				return A2(
					$joakin$elm_canvas$Canvas$renderShapeDrawOp,
					drawOp,
					A3(
						$elm$core$List$foldl,
						$joakin$elm_canvas$Canvas$renderShape,
						A2($elm$core$List$cons, $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$beginPath, cmds),
						ss));
			case 2:
				var p = drawable.a;
				var t = drawable.b;
				return A3($joakin$elm_canvas$Canvas$renderTexture, p, t, cmds);
			case 3:
				var p = drawable.a;
				var w = drawable.b;
				var h = drawable.c;
				return A4($joakin$elm_canvas$Canvas$renderClear, p, w, h, cmds);
			default:
				var renderables = drawable.a;
				return A3($joakin$elm_canvas$Canvas$renderGroup, drawOp, renderables, cmds);
		}
	});
var $joakin$elm_canvas$Canvas$renderGroup = F3(
	function (drawOp, renderables, cmds) {
		var cmdsWithDraw = function () {
			switch (drawOp.$) {
				case 0:
					return cmds;
				case 1:
					var c = drawOp.a;
					return A2(
						$elm$core$List$cons,
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle(c),
						cmds);
				case 2:
					var c = drawOp.a;
					return A2(
						$elm$core$List$cons,
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle(c),
						cmds);
				default:
					var fc = drawOp.a;
					var sc = drawOp.b;
					return A2(
						$elm$core$List$cons,
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle(fc),
						A2(
							$elm$core$List$cons,
							$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle(sc),
							cmds));
			}
		}();
		return A3(
			$elm$core$List$foldl,
			$joakin$elm_canvas$Canvas$renderOne(drawOp),
			cmdsWithDraw,
			renderables);
	});
var $joakin$elm_canvas$Canvas$renderOne = F3(
	function (parentDrawOp, _v0, cmds) {
		var commands = _v0.w;
		var drawable = _v0.J;
		var drawOp = _v0.I;
		return A2(
			$elm$core$List$cons,
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$restore,
			A3(
				$joakin$elm_canvas$Canvas$renderDrawable,
				drawable,
				A2($joakin$elm_canvas$Canvas$mergeDrawOp, parentDrawOp, drawOp),
				_Utils_ap(
					commands,
					A2($elm$core$List$cons, $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$save, cmds))));
	});
var $joakin$elm_canvas$Canvas$render = function (entities) {
	return A3(
		$elm$core$List$foldl,
		$joakin$elm_canvas$Canvas$renderOne($joakin$elm_canvas$Canvas$Internal$Canvas$NotSpecified),
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$empty,
		entities);
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $joakin$elm_canvas$Canvas$Internal$Texture$TImage = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $joakin$elm_canvas$Canvas$Internal$Texture$decodeTextureImage = A2(
	$elm$json$Json$Decode$andThen,
	function (image) {
		return A4(
			$elm$json$Json$Decode$map3,
			F3(
				function (tagName, width, height) {
					return (tagName === 'IMG') ? $elm$core$Maybe$Just(
						$joakin$elm_canvas$Canvas$Internal$Texture$TImage(
							{an: height, ao: image, aF: width})) : $elm$core$Maybe$Nothing;
				}),
			A2($elm$json$Json$Decode$field, 'tagName', $elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$field, 'width', $elm$json$Json$Decode$float),
			A2($elm$json$Json$Decode$field, 'height', $elm$json$Json$Decode$float));
	},
	$elm$json$Json$Decode$value);
var $joakin$elm_canvas$Canvas$Internal$Texture$decodeImageLoadEvent = A2($elm$json$Json$Decode$field, 'target', $joakin$elm_canvas$Canvas$Internal$Texture$decodeTextureImage);
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $joakin$elm_canvas$Canvas$renderTextureSource = function (textureSource) {
	var url = textureSource.a;
	var onLoad = textureSource.b;
	return _Utils_Tuple2(
		url,
		A2(
			$elm$html$Html$img,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$src(url),
					A2($elm$html$Html$Attributes$attribute, 'crossorigin', 'anonymous'),
					A2($elm$html$Html$Attributes$style, 'display', 'none'),
					A2(
					$elm$html$Html$Events$on,
					'load',
					A2($elm$json$Json$Decode$map, onLoad, $joakin$elm_canvas$Canvas$Internal$Texture$decodeImageLoadEvent)),
					A2(
					$elm$html$Html$Events$on,
					'error',
					$elm$json$Json$Decode$succeed(
						onLoad($elm$core$Maybe$Nothing)))
				]),
			_List_Nil));
};
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $joakin$elm_canvas$Canvas$toHtmlWith = F3(
	function (options, attrs, entities) {
		return A3(
			$elm$html$Html$Keyed$node,
			'elm-canvas',
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$commands(
					$joakin$elm_canvas$Canvas$render(entities)),
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$height(options.an),
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$width(options.aF),
						attrs))),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('__canvas', $joakin$elm_canvas$Canvas$cnvs),
				A2($elm$core$List$map, $joakin$elm_canvas$Canvas$renderTextureSource, options.bk)));
	});
var $joakin$elm_canvas$Canvas$toHtml = F3(
	function (_v0, attrs, entities) {
		var w = _v0.a;
		var h = _v0.b;
		return A3(
			$joakin$elm_canvas$Canvas$toHtmlWith,
			{an: h, bk: _List_Nil, aF: w},
			attrs,
			entities);
	});
var $author$project$Wordcloud$currentPeriodOf = function (model) {
	var _v0 = model.D;
	if (_v0.b) {
		var x = _v0.a;
		return x;
	} else {
		return $author$project$Wordcloud$emptyCloudPeriod;
	}
};
var $author$project$Wordcloud$faderOpacity = F4(
	function (fadeIn, fadeOut, anim, kuss) {
		var _v0 = $author$project$Wordcloud$animRunning(anim);
		if (_v0) {
			if (fadeIn) {
				return $author$project$Wordcloud$animRender(anim);
			} else {
				return 1;
			}
		} else {
			var _v2 = $author$project$Wordcloud$animRunning(kuss);
			if (_v2) {
				if (fadeOut) {
					return 1 - $author$project$Wordcloud$animRender(kuss);
				} else {
					return 1;
				}
			} else {
				return 1;
			}
		}
	});
var $author$project$Wordcloud$placeForPeriod = function (model) {
	return _Utils_Tuple2(model.i / 2, (7 / 30) * model.r);
};
var $joakin$elm_canvas$Canvas$Settings$Text$Center = 2;
var $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommand = function (a) {
	return {$: 0, a: a};
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$textAlign = function (align) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'textAlign',
		$elm$json$Json$Encode$string(align));
};
var $joakin$elm_canvas$Canvas$Settings$Text$textAlignToString = function (alignment) {
	switch (alignment) {
		case 0:
			return 'left';
		case 1:
			return 'right';
		case 2:
			return 'center';
		case 3:
			return 'start';
		default:
			return 'end';
	}
};
var $joakin$elm_canvas$Canvas$Settings$Text$align = function (alignment) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommand(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$textAlign(
			$joakin$elm_canvas$Canvas$Settings$Text$textAlignToString(alignment)));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$font = function (f) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'font',
		$elm$json$Json$Encode$string(f));
};
var $joakin$elm_canvas$Canvas$Settings$Text$font = function (_v0) {
	var size = _v0.o;
	var family = _v0.am;
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommand(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$font(
			$elm$core$String$fromInt(size) + ('px ' + family)));
};
var $author$project$Wordcloud$fontForTitles = 'Roboto';
var $avh4$elm_color$Color$hsla = F4(
	function (hue, sat, light, alpha) {
		var _v0 = _Utils_Tuple3(hue, sat, light);
		var h = _v0.a;
		var s = _v0.b;
		var l = _v0.c;
		var m2 = (l <= 0.5) ? (l * (s + 1)) : ((l + s) - (l * s));
		var m1 = (l * 2) - m2;
		var hueToRgb = function (h__) {
			var h_ = (h__ < 0) ? (h__ + 1) : ((h__ > 1) ? (h__ - 1) : h__);
			return ((h_ * 6) < 1) ? (m1 + (((m2 - m1) * h_) * 6)) : (((h_ * 2) < 1) ? m2 : (((h_ * 3) < 2) ? (m1 + (((m2 - m1) * ((2 / 3) - h_)) * 6)) : m1));
		};
		var b = hueToRgb(h - (1 / 3));
		var g = hueToRgb(h);
		var r = hueToRgb(h + (1 / 3));
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, alpha);
	});
var $avh4$elm_color$Color$fromHsla = function (_v0) {
	var hue = _v0._;
	var saturation = _v0.ac;
	var lightness = _v0.aa;
	var alpha = _v0.Y;
	return A4($avh4$elm_color$Color$hsla, hue, saturation, lightness, alpha);
};
var $author$project$Wordcloud$opaqueBlack = function (opa) {
	return $avh4$elm_color$Color$fromHsla(
		{Y: opa, _: 0, aa: 0.37, ac: 0});
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$DrawableText = function (a) {
	return {$: 0, a: a};
};
var $joakin$elm_canvas$Canvas$text = F3(
	function (settings, point, str) {
		return A2(
			$joakin$elm_canvas$Canvas$addSettingsToRenderable,
			settings,
			{
				w: _List_Nil,
				I: $joakin$elm_canvas$Canvas$Internal$Canvas$NotSpecified,
				J: $joakin$elm_canvas$Canvas$Internal$Canvas$DrawableText(
					{ax: $elm$core$Maybe$Nothing, a9: point, ar: str})
			});
	});
var $author$project$Wordcloud$viewTopicName = F4(
	function (opa, fsize, _v0, name) {
		var pX = _v0.a;
		var pY = _v0.b;
		return A3(
			$joakin$elm_canvas$Canvas$text,
			_List_fromArray(
				[
					$joakin$elm_canvas$Canvas$Settings$fill(
					$author$project$Wordcloud$opaqueBlack(opa)),
					$joakin$elm_canvas$Canvas$Settings$Text$font(
					{
						am: $author$project$Wordcloud$fontForTitles,
						o: $elm$core$Basics$round(fsize)
					}),
					$joakin$elm_canvas$Canvas$Settings$Text$align(2)
				]),
			_Utils_Tuple2(pX, pY),
			name);
	});
var $joakin$elm_canvas$Canvas$Settings$Text$Middle = 2;
var $joakin$elm_canvas$Canvas$Settings$Text$textBaseLineToString = function (baseLineSetting) {
	switch (baseLineSetting) {
		case 0:
			return 'top';
		case 1:
			return 'hanging';
		case 2:
			return 'middle';
		case 3:
			return 'alphabetic';
		case 4:
			return 'ideographic';
		default:
			return 'bottom';
	}
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$textBaseline = function (baseline) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'textBaseline',
		$elm$json$Json$Encode$string(baseline));
};
var $joakin$elm_canvas$Canvas$Settings$Text$baseLine = function (textBaseLine) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommand(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$textBaseline(
			$joakin$elm_canvas$Canvas$Settings$Text$textBaseLineToString(textBaseLine)));
};
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $author$project$Wordcloud$fontForCloud = '\'Open Sans Condensed\'';
var $author$project$Wordcloud$interpolate = F3(
	function (start, end, animStage) {
		return ((1 - animStage) * start) + (animStage * end);
	});
var $author$project$Wordcloud$interpolateColor = F3(
	function (start, end, animStage) {
		return {
			Y: A3($author$project$Wordcloud$interpolate, end.Y, start.Y, animStage),
			_: A3($author$project$Wordcloud$interpolate, end._, start._, animStage),
			aa: A3($author$project$Wordcloud$interpolate, end.aa, start.aa, animStage),
			ac: A3($author$project$Wordcloud$interpolate, end.ac, start.ac, animStage)
		};
	});
var $joakin$elm_canvas$Canvas$Settings$Advanced$Rotate = function (a) {
	return {$: 0, a: a};
};
var $joakin$elm_canvas$Canvas$Settings$Advanced$rotate = $joakin$elm_canvas$Canvas$Settings$Advanced$Rotate;
var $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommands = function (a) {
	return {$: 1, a: a};
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$rotate = function (angle) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
		'rotate',
		_List_fromArray(
			[
				$elm$json$Json$Encode$float(angle)
			]));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$scale = F2(
	function (x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'scale',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$transform = F6(
	function (a, b, c, d, e, f) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'transform',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(a),
					$elm$json$Json$Encode$float(b),
					$elm$json$Json$Encode$float(c),
					$elm$json$Json$Encode$float(d),
					$elm$json$Json$Encode$float(e),
					$elm$json$Json$Encode$float(f)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$translate = F2(
	function (x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'translate',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Settings$Advanced$transform = function (transforms) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommands(
		A2(
			$elm$core$List$map,
			function (t) {
				switch (t.$) {
					case 0:
						var angle = t.a;
						return $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$rotate(angle);
					case 1:
						var x = t.a;
						var y = t.b;
						return A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$scale, x, y);
					case 2:
						var x = t.a;
						var y = t.b;
						return A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$translate, x, y);
					default:
						var m11 = t.a.aR;
						var m12 = t.a.aS;
						var m21 = t.a.aV;
						var m22 = t.a.aW;
						var dx = t.a.bt;
						var dy = t.a.bu;
						return A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$transform, m11, m12, m21, m22, dx, dy);
				}
			},
			transforms));
};
var $joakin$elm_canvas$Canvas$Settings$Advanced$Translate = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $joakin$elm_canvas$Canvas$Settings$Advanced$translate = $joakin$elm_canvas$Canvas$Settings$Advanced$Translate;
var $author$project$Wordcloud$myRotate = F3(
	function (x, y, deg) {
		return $joakin$elm_canvas$Canvas$Settings$Advanced$transform(
			_List_fromArray(
				[
					A2($joakin$elm_canvas$Canvas$Settings$Advanced$translate, x, y),
					$joakin$elm_canvas$Canvas$Settings$Advanced$rotate(deg),
					A2($joakin$elm_canvas$Canvas$Settings$Advanced$translate, -x, -y)
				]));
	});
var $author$project$Wordcloud$viewWord = F2(
	function (anim, word) {
		var noAnimation = _List_fromArray(
			[
				$joakin$elm_canvas$Canvas$Settings$fill(
				$avh4$elm_color$Color$fromHsla(word.H)),
				$joakin$elm_canvas$Canvas$Settings$Text$font(
				{
					am: $author$project$Wordcloud$fontForCloud,
					o: $elm$core$Basics$round(word.o)
				}),
				$joakin$elm_canvas$Canvas$Settings$Text$align(2),
				$joakin$elm_canvas$Canvas$Settings$Text$baseLine(2),
				A3(
				$author$project$Wordcloud$myRotate,
				word.t,
				word.u,
				$elm$core$Basics$degrees(word.N))
			]);
		var animStage = $author$project$Wordcloud$animRender(anim);
		var _v0 = function () {
			var _v1 = word.aq;
			if (!_v1.$) {
				var start = _v1.a;
				var _v2 = word.aj;
				if (!_v2.$) {
					var end = _v2.a;
					var animY = A3($author$project$Wordcloud$interpolate, start.u, end.u, animStage);
					var animX = A3($author$project$Wordcloud$interpolate, start.t, end.t, animStage);
					return _Utils_Tuple2(
						_List_fromArray(
							[
								$joakin$elm_canvas$Canvas$Settings$fill(
								$avh4$elm_color$Color$fromHsla(
									A3($author$project$Wordcloud$interpolateColor, start.H, end.H, animStage))),
								$joakin$elm_canvas$Canvas$Settings$Text$font(
								{
									am: $author$project$Wordcloud$fontForCloud,
									o: $elm$core$Basics$round(
										A3($author$project$Wordcloud$interpolate, start.o, end.o, animStage))
								}),
								$joakin$elm_canvas$Canvas$Settings$Text$align(2),
								$joakin$elm_canvas$Canvas$Settings$Text$baseLine(2),
								A3(
								$author$project$Wordcloud$myRotate,
								animX,
								animY,
								$elm$core$Basics$degrees(
									A3($author$project$Wordcloud$interpolate, start.N, end.N, animStage)))
							]),
						_Utils_Tuple2(animX, animY));
				} else {
					return _Utils_Tuple2(
						noAnimation,
						_Utils_Tuple2(word.t, word.u));
				}
			} else {
				return _Utils_Tuple2(
					noAnimation,
					_Utils_Tuple2(word.t, word.u));
			}
		}();
		var maybeAnimate = _v0.a;
		var pos = _v0.b;
		return A3($joakin$elm_canvas$Canvas$text, maybeAnimate, pos, word.ar);
	});
var $author$project$Wordcloud$viewCloudTopic = F3(
	function (model, _v0, topic) {
		var cx = _v0.a;
		var cy = _v0.b;
		var opa = A4($author$project$Wordcloud$faderOpacity, topic.ak, topic.al, model.k, model.m);
		var fsize = (12 * model.i) / 1600;
		var animStage = $author$project$Wordcloud$animRender(model.k);
		var _v1 = _Utils_Tuple2(
			cx,
			cy + (($author$project$Wordcloud$scale(model) * $author$project$Wordcloud$cloudSizeOrig.an) * 0.51));
		var x = _v1.a;
		var y = _v1.b;
		return A2(
			$elm$core$List$cons,
			A4(
				$author$project$Wordcloud$viewTopicName,
				opa,
				fsize,
				_Utils_Tuple2(x, y),
				topic.s),
			A2(
				$elm$core$List$map,
				$author$project$Wordcloud$viewWord(model.k),
				topic.G));
	});
var $author$project$Wordcloud$viewPeriodName = F4(
	function (opa, fsize, _v0, txt) {
		var cx = _v0.a;
		var cy = _v0.b;
		return A3(
			$joakin$elm_canvas$Canvas$text,
			_List_fromArray(
				[
					$joakin$elm_canvas$Canvas$Settings$fill(
					$author$project$Wordcloud$opaqueBlack(opa)),
					$joakin$elm_canvas$Canvas$Settings$Text$font(
					{
						am: $author$project$Wordcloud$fontForTitles,
						o: $elm$core$Basics$round(fsize)
					}),
					$joakin$elm_canvas$Canvas$Settings$Text$align(2)
				]),
			_Utils_Tuple2(cx, cy),
			txt);
	});
var $author$project$Wordcloud$viewClouds = function (model) {
	var toViewer = function (a) {
		return A2($author$project$Wordcloud$viewCloudTopic, model, a);
	};
	var toCenter = function (_v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(x * model.i, y * model.r);
	};
	var current = $author$project$Wordcloud$currentPeriodOf(model);
	var periodName = A4(
		$author$project$Wordcloud$viewPeriodName,
		A4($author$project$Wordcloud$faderOpacity, true, true, model.k, model.m),
		(68 * model.i) / 1600,
		$author$project$Wordcloud$placeForPeriod(model),
		current.aw);
	var centers = A2($elm$core$List$map, toCenter, $author$project$Wordcloud$placementMatrix);
	var viewers = A2($elm$core$List$map, toViewer, centers);
	return A2(
		$elm$core$List$append,
		_List_fromArray(
			[periodName]),
		$elm$core$List$concat(
			A3($elm$core$List$map2, $author$project$Wordcloud$apply, viewers, current.f)));
};
var $author$project$Wordcloud$view = function (model) {
	var key = $elm$core$String$fromFloat(model.i) + ('|' + $elm$core$String$fromFloat(model.r));
	return A3(
		$elm$html$Html$Keyed$node,
		'div',
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'align-items', 'center')
			]),
		_List_fromArray(
			[
				_Utils_Tuple2(
				key,
				A3(
					$joakin$elm_canvas$Canvas$toHtml,
					_Utils_Tuple2(
						$elm$core$Basics$round(model.i),
						$elm$core$Basics$round(model.r)),
					_List_Nil,
					A2(
						$elm$core$List$cons,
						$author$project$Wordcloud$clearScreen(model),
						$author$project$Wordcloud$viewClouds(model)))),
				_Utils_Tuple2(
				key,
				$author$project$Wordcloud$sliderWithButts(model))
			]));
};
var $author$project$Wordcloud$main = $elm$browser$Browser$element(
	{bC: $author$project$Wordcloud$init, bK: $author$project$Wordcloud$subscriptions, bM: $author$project$Wordcloud$update, bN: $author$project$Wordcloud$view});
_Platform_export({'Wordcloud':{'init':$author$project$Wordcloud$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));