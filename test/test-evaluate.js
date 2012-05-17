
var ajlisp = require('../lib/ajlisp');

exports['Evaluate Number'] = function(test) {
	var environment = new ajlisp.Environment();
	
	test.equal(ajlisp.evaluate(1, environment), 1);
	
	test.done();
};

exports['Evaluate String'] = function(test) {
	var environment = new ajlisp.Environment();
	
	test.equal(ajlisp.evaluate('foo', environment), 'foo');
	
	test.done();
};

exports['Evaluate String'] = function(test) {
	var environment = new ajlisp.Environment();
	
	test.equal(ajlisp.evaluate('foo', environment), 'foo');
	
	test.done();
};

exports['List Form Evaluate'] = function(test) {
	var list = new ajlisp.List(ajlisp.environment.list, new ajlisp.List(1, null));			
	var result = list.evaluate(null);
	
	test.equal(result.first(), 1);
	test.equal(result.rest(), null);
	
	test.done();
};

exports['First Form Evaluate'] = function(test) {
	var list = ajlisp.makeList(ajlisp.environment.first, ajlisp.makeList(ajlisp.environment.list, 1));
	var result = list.evaluate(null);
	
	test.equal(result, 1);
	
	test.done();
};

exports['Rest Form Evaluate'] = function(test) {
	var list = ajlisp.makeList(ajlisp.environment.rest, ajlisp.makeList(ajlisp.environment.list, 1));
	var result = list.evaluate(null);			
	
	test.equal(result, null);			
	
	test.done();
};

