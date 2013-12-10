
var lexers = require('../lib/lexers');

var TokenType = lexers.TokenType;

exports['Process Integer'] = function(test) {
	var lexer = lexers.createLexer("123");
	var token = lexer.nextToken();
	
	test.notEqual(token, null);
	test.equal(token.type, TokenType.Number);
	test.equal(token.value, 123);
	
	test.equal(lexer.nextToken(), null);

	test.done();
}

exports['Process String'] = function(test) {
	var lexer = lexers.createLexer('"foo"');
	var token = lexer.nextToken();
	
	test.notEqual(token, null);
	test.equal(token.type, TokenType.String);
	test.equal(token.value, "foo");
	
	test.equal(lexer.nextToken(), null);

	test.done();
}

exports['Process Atom Name'] = function(test) {
	var lexer = lexers.createLexer('a');
	var token = lexer.nextToken();
	
	test.notEqual(token, null);
	test.equal(token.type, TokenType.Name);
	test.equal(token.value, "a");
	
	test.equal(lexer.nextToken(), null);

	test.done();
}

exports['Process Atom Special Name'] = function(test) {
	var lexer = lexers.createLexer('+');
	var token = lexer.nextToken();
	
	test.notEqual(token, null);
	test.equal(token.type, TokenType.Name);
	test.equal(token.value, "+");
	
	test.equal(lexer.nextToken(), null);

	test.done();
}

