
var ajlisp = require('../lib/ajlisp');

exports['Environment Get Value'] = function(test) {
	var environment = new ajlisp.Environment();
	
	test.equal(environment.parent(), null);
	test.equal(environment.getValue("a"), undefined);
	
	test.done();
};

exports['Environment Set Value'] = function(test) {
	var environment = new ajlisp.Environment();

	environment.setValue("one", 1);
	test.equal(environment.getValue("one"), 1);
	
	test.done();
};

exports['Environment with Parent'] = function(test) {
	var parent = new ajlisp.Environment();
	var environment = new ajlisp.Environment(parent);
	
	test.equal(environment.parent(), parent);
	test.equal(parent.parent(), null);
	test.equal(environment.getValue("a"), undefined);
	
	environment.setValue("one", 1);
	test.equal(environment.getValue("one"), 1);
	parent.setValue("two", 2);
	test.equal(environment.getValue("two"), 2);
	environment.setValue("two", 3);
	test.equal(environment.getValue("two"), 3);
	test.equal(parent.getValue("two"), 2);
	
	test.done();
};

exports['Environment with Parent'] = function(test) {
	var parent = new ajlisp.Environment();
	var environment = new ajlisp.Environment(parent);
	
	test.equal(environment.parent(), parent);
	test.equal(parent.parent(), null);
	test.equal(environment.getValue("a"), undefined);
	test.equal(parent.getValue("a"), undefined);
	
	environment.setValue("one", 1);
	test.equal(environment.getValue("one"), 1);
	parent.setValue("two", 2);
	test.equal(environment.getValue("two"), 2);
	environment.setValue("two", 3);
	test.equal(environment.getValue("two"), 3);
	test.equal(parent.getValue("two"), 2);
	
	test.done();
};

exports['Environment with Parent Set Value'] = function(test) {
	var parent = new ajlisp.Environment();
	var environment = new ajlisp.Environment(parent);
	
	environment.setValue("one", 1);
	test.equal(environment.getValue("one"), 1);
	test.equal(parent.getValue("one"), undefined);
	
	test.done();
};

exports['Environment Set Value in Parent'] = function(test) {
	var parent = new ajlisp.Environment();
	var environment = new ajlisp.Environment(parent);
	
	parent.setValue("one", 1);
	test.equal(environment.getValue("one"), 1);
	test.equal(parent.getValue("one"), 1);
	
	test.done();
};

