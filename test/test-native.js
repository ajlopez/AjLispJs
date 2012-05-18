
var ajlisp = require('../lib/ajlisp');

exports['Invoke String Native toUpperCase'] = function(test) {
	var result = ajlisp.evaluateText('(.toUpperCase "foo")');
	
	test.equal(result, "FOO");
	
	test.done();
}

exports['Invoke String Native slice'] = function(test) {
	var result = ajlisp.evaluateText('(.slice "foo" 1)');
	
	test.equal(result, "oo");
	
	test.done();
}

