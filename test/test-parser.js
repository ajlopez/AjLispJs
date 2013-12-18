
var parsers = require('../lib/parsers');

exports['Parse Integer'] = function(test) {
	var parser = parsers.createParser("123");

	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr, 123);

	test.done();
}

exports['Parse String'] = function(test) {
	var parser = parsers.createParser('"foo"');

	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr, "foo");

	test.done();
}

exports['Parse Atom'] = function(test) {
	var parser = parsers.createParser('a');

	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr.isAtom(), true);
	test.equal(expr.name(), "a");

	test.done();
}

exports['Parse Dotted Atom'] = function(test) {
    var parser = parsers.createParser('.parseInt');
    
	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr.isAtom(), true);
	test.equal(expr.name(), ".parseInt");

	test.done();
}

exports['Parse List'] = function(test) {
	var parser = parsers.createParser('(1 2 3)');

	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr.isList(), true);
	test.equal(expr.asString(), "(1 2 3)");

	test.done();
}

