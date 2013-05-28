
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

exports['Invoke String Native length'] = function(test) {
	var result = ajlisp.evaluateText('(.length "foo")');
	
	test.equal(result, 3);
	
	test.done();
}

exports['Evaluate global'] = function(test) {
	var result = ajlisp.evaluateText('global');
	
	test.equal(result, global);
	
	test.done();
}

exports['Invoke Require'] = function(test) {
	var result = ajlisp.evaluateText('(.require global "net")');
    var net = require('net');
	
	test.equal(result, net);
	
	test.done();
}

exports['Global in Environment'] = function(test) {
	test.equal(ajlisp.environment.global, global);
	
	test.done();
}

