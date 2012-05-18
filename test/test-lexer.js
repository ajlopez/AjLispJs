
var ajlisp = require('../lib/ajlisp');

exports['Process Integer'] = function(test) {
	var lexer = new ajlisp.Lexer("123");
	var token = lexer.nextToken();
	
	test.notEqual(token, null);
	test.equal(token.type, ajlisp.TokenType.Number);
	test.equal(token.value, 123);
	
	test.equal(lexer.nextToken(), null);

	test.done();
}

exports['Process String'] = function(test) {
	var lexer = new ajlisp.Lexer('"foo"');
	var token = lexer.nextToken();
	
	test.notEqual(token, null);
	test.equal(token.type, ajlisp.TokenType.String);
	test.equal(token.value, "foo");
	
	test.equal(lexer.nextToken(), null);

	test.done();
}

exports['Process Atom Name'] = function(test) {
	var lexer = new ajlisp.Lexer('a');
	var token = lexer.nextToken();
	
	test.notEqual(token, null);
	test.equal(token.type, ajlisp.TokenType.Name);
	test.equal(token.value, "a");
	
	test.equal(lexer.nextToken(), null);

	test.done();
}

