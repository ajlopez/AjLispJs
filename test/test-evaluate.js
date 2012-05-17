
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

