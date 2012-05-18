
var ajlisp = require('../lib/ajlisp');

function eval(text)
{
	return ajlisp.evaluateText(text);
}

exports['Evaluate List'] = function(test) {
	var result = eval("(list 1 2 3)");
	
	test.ok(result);
	test.ok(result.isList());
	test.equal(result.first(), 1);
	test.equal(result.rest().first(), 2);
	test.equal(result.rest().rest().first(), 3);
	test.equal(result.rest().rest().rest(), null);
	
	test.done();
};

exports['Evaluate First'] = function(test) {
	var result = eval("(first (list 1 2 3))");
	
	test.ok(result);
	test.equal(result, 1);
	
	test.done();
};

exports['Evaluate Rest'] = function(test) {
	var result = eval("(rest (list 1 2 3))");
	
	test.ok(result);
	test.ok(result.isList());
	test.equal(result.first(), 2);
	test.equal(result.rest().first(), 3);
	test.equal(result.rest().rest(), null);
	
	test.done();
};

exports['Evaluate Add'] = function(test) {
	var result = eval("(+ 1 2 3)");
	
	test.ok(result);
	test.equal(result, 6);
	
	test.done();
};

