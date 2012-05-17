
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

exports['Define Form Evaluate'] = function(test) {
	var list = ajlisp.makeList(ajlisp.environment.define, new ajlisp.Atom("one"), 1);
	
	test.equal(list.evaluate(ajlisp.environment), 1);
	test.equal(ajlisp.environment.one, 1);
	
	test.done();
};

exports['Do Form Evaluate'] = function(test) {
	var list1 = ajlisp.makeList(ajlisp.environment.define, new ajlisp.Atom("one"), 1);
	var list2 = ajlisp.makeList(ajlisp.environment.define, new ajlisp.Atom("two"), 2);
	var list3 = ajlisp.makeList(ajlisp.environment.define, new ajlisp.Atom("three"), 3);
	var list = ajlisp.makeList(ajlisp.environment['do'], list1, list2, list3);
	
	test.equal(list.evaluate(ajlisp.environment), 3);
	test.equal(ajlisp.environment.one, 1);
	test.equal(ajlisp.environment.two, 2);
	test.equal(ajlisp.environment.three, 3);
	
	test.done();
};

