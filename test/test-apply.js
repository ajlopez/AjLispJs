
var ajlisp = require('../lib/ajlisp');

exports['List Form Apply'] = function(test) {
	var list = new ajlisp.List(ajlisp.environment.list, new ajlisp.List(1, null));			
	var result = ajlisp.environment.list.apply(list);
	
	test.equal(result.first(), 1);
	test.equal(result.rest(), null);			
	
	test.done();
};

exports['First Form Apply'] = function(test) {
	var list = ajlisp.makeList(ajlisp.environment.first, ajlisp.makeList(ajlisp.environment.list, 1));
	var result = ajlisp.environment.first.apply(list);			
	
	test.equal(result, 1);
	
	test.done();
};

exports['Rest Form Apply'] = function(test) {
	var list = ajlisp.makeList(ajlisp.environment.rest, ajlisp.makeList(ajlisp.environment.list, 1));
	var result = ajlisp.environment.rest.apply(list);
	
	test.equal(result, null);			
	
	test.done();
};

exports['Closure Form Apply wo/Parameters'] = function(test) {
	var list1 = ajlisp.makeList(ajlisp.environment.define, new ajlisp.Atom("one"), 1);
	var list2 = ajlisp.makeList(ajlisp.environment.define, new ajlisp.Atom("two"), 2);
	var list3 = ajlisp.makeList(ajlisp.environment.define, new ajlisp.Atom("three"), 3);
	var body = ajlisp.makeList(list1, list2, list3);
	var closure = new ajlisp.Closure(null, ajlisp.environment, body);
	
	test.equal(closure.apply(null, ajlisp.environment), 3);
	test.equal(ajlisp.environment.one, 1);
	test.equal(ajlisp.environment.two, 2);
	test.equal(ajlisp.environment.three, 3);
	
	test.done();
};

