
var ajlisp = require('../lib/ajlisp'),
    lists = require('../lib/lists'),
    functions = require('../lib/functions');

exports['Evaluate Number'] = function(test) {
	var environment = new ajlisp.Environment();
	
	test.equal(functions.evaluate(1, environment), 1);
	
	test.done();
};

exports['Evaluate String'] = function(test) {
	var environment = new ajlisp.Environment();
	
	test.equal(functions.evaluate('foo', environment), 'foo');
	
	test.done();
};

exports['Evaluate String'] = function(test) {
	var environment = new ajlisp.Environment();
	
	test.equal(functions.evaluate('foo', environment), 'foo');
	
	test.done();
};

exports['List Form Evaluate'] = function(test) {
	var list = lists.createList(ajlisp.environment.list, lists.createList(1, null));			
	var result = list.evaluate(null);
	
	test.equal(result.first(), 1);
	test.equal(result.rest(), null);
	
	test.done();
};

exports['First Form Evaluate'] = function(test) {
	var list = lists.makeList(ajlisp.environment.first, lists.makeList(ajlisp.environment.list, 1));
	var result = list.evaluate(null);
	
	test.equal(result, 1);
	
	test.done();
};

exports['Rest Form Evaluate'] = function(test) {
	var list = lists.makeList(ajlisp.environment.rest, lists.makeList(ajlisp.environment.list, 1));
	var result = list.evaluate(null);			
	
	test.equal(result, null);			
	
	test.done();
};

exports['Define Form Evaluate'] = function(test) {
	var list = lists.makeList(ajlisp.environment.define, new ajlisp.Atom("one"), 1);
	
	test.equal(list.evaluate(ajlisp.environment), 1);
	test.equal(ajlisp.environment.one, 1);
	
	test.done();
};

exports['Do Form Evaluate'] = function(test) {
	var list1 = lists.makeList(ajlisp.environment.define, new ajlisp.Atom("one"), 1);
	var list2 = lists.makeList(ajlisp.environment.define, new ajlisp.Atom("two"), 2);
	var list3 = lists.makeList(ajlisp.environment.define, new ajlisp.Atom("three"), 3);
	var list = lists.makeList(ajlisp.environment['do'], list1, list2, list3);
	
	test.equal(list.evaluate(ajlisp.environment), 3);
	test.equal(ajlisp.environment.one, 1);
	test.equal(ajlisp.environment.two, 2);
	test.equal(ajlisp.environment.three, 3);
	
	test.done();
};

exports['Closure Form Evaluate with Parameters'] = function(test) {
	var list1 = lists.makeList(ajlisp.environment.define, new ajlisp.Atom("one"), new ajlisp.Atom("a"));
	var list2 = lists.makeList(ajlisp.environment.define, new ajlisp.Atom("two"), new ajlisp.Atom("b"));
	var list3 = lists.makeList(ajlisp.environment.define, new ajlisp.Atom("three"), new ajlisp.Atom("c"));
	var body = lists.makeList(list1, list2, list3);
	var names = lists.makeList(new ajlisp.Atom("a"), new ajlisp.Atom("b"), new ajlisp.Atom("c"));
	var closure = new ajlisp.Closure(names, ajlisp.environment, body);
	var list = lists.makeList(closure,1,2,3);
	
	test.equal(list.evaluate(ajlisp.environment), 3);
	test.equal(ajlisp.environment.one, 1);
	test.equal(ajlisp.environment.two, 2);
	test.equal(ajlisp.environment.three, 3);
	
	test.done();
};

