
var ajlisp = require('../lib/ajlisp');

exports['Parse Integer'] = function(test) {
	var lexer = new ajlisp.Lexer("123");
	var parser = new ajlisp.Parser(lexer);

	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr, 123);

	test.done();
}

exports['Parse String'] = function(test) {
	var lexer = new ajlisp.Lexer('"foo"');
	var parser = new ajlisp.Parser(lexer);

	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr, "foo");

	test.done();
}

exports['Parse Atom'] = function(test) {
	var lexer = new ajlisp.Lexer("a");
	var parser = new ajlisp.Parser(lexer);

	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr.isAtom(), true);
	test.equal(expr.name(), "a");

	test.done();
}

exports['Parse Dotted Atom'] = function(test) {
	var lexer = new ajlisp.Lexer(".parseInt");
	var parser = new ajlisp.Parser(lexer);

	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr.isAtom(), true);
	test.equal(expr.name(), ".parseInt");

	test.done();
}

exports['Parse List'] = function(test) {
	var lexer = new ajlisp.Lexer("(1 2 3)");
	var parser = new ajlisp.Parser(lexer);

	var expr = parser.parse();
	
	test.notEqual(expr, null);
	test.equal(expr.isList(), true);
	test.equal(expr.asString(), "(1 2 3)");

	test.done();
}

