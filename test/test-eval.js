
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

exports['Evaluate Subtract'] = function(test) {
	var result = eval("(- 1 2 3)");
	
	test.ok(result);
	test.equal(result, -4);
	
	test.done();
};

exports['Evaluate Multiply'] = function(test) {
	var result = eval("(* 1 2 3)");
	
	test.ok(result);
	test.equal(result, 6);
	
	test.done();
};

exports['Evaluate Divide'] = function(test) {
	var result = eval("(/ 1 2)");
	
	test.ok(result);
	test.equal(result, 1/2);
	
	test.done();
};

exports['Evaluate Equals with Integers'] = function(test) {
	test.ok(eval("(= 1 1)"));
	test.ok(!eval("(= 1 2)"));
	
	test.done();
};

exports['Evaluate Equals with Strings'] = function(test) {
	test.ok(eval('(= "foo" "foo")'));
	test.ok(!eval('(= "foo" "bar")'));
	
	test.done();
};

exports['Evaluate Equals with Lists'] = function(test) {
	test.ok(eval("(= '(1 2) '(1 2))"));
	test.ok(!eval("(= '(1 2) '(1 2 3))"));
	
	test.done();
};

exports['Evaluate Less Than with Integers'] = function(test) {
	test.ok(!eval("(< 1 1)"));
	test.ok(eval("(< 1 2)"));
	
	test.done();
};

exports['Evaluate Less Than with Strings'] = function(test) {
	test.ok(!eval('(< "foo" "foo")'));
	test.ok(eval('(< "bar" "foo")'));
	
	test.done();
};

exports['Evaluate Greater Than with Integers'] = function(test) {
	test.ok(!eval("(> 1 1)"));
	test.ok(eval("(> 2 1)"));
	
	test.done();
};

exports['Evaluate Greater Than with Strings'] = function(test) {
	test.ok(!eval('(> "foo" "foo")'));
	test.ok(eval('(> "foo" "bar")'));
	
	test.done();
};

