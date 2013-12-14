
var ajlisp = require('../lib/ajlisp'),
    atoms = require('../lib/atoms'),
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
	var list = lists.makeList(ajlisp.environment.define, atoms.createAtom("one"), 1);
	
	test.equal(list.evaluate(ajlisp.environment), 1);
	test.equal(ajlisp.environment.one, 1);
	
	test.done();
};

exports['Do Form Evaluate'] = function(test) {
	var list1 = lists.makeList(ajlisp.environment.define, atoms.createAtom("one"), 1);
	var list2 = lists.makeList(ajlisp.environment.define, atoms.createAtom("two"), 2);
	var list3 = lists.makeList(ajlisp.environment.define, atoms.createAtom("three"), 3);
	var list = lists.makeList(ajlisp.environment['do'], list1, list2, list3);
	
	test.equal(list.evaluate(ajlisp.environment), 3);
	test.equal(ajlisp.environment.one, 1);
	test.equal(ajlisp.environment.two, 2);
	test.equal(ajlisp.environment.three, 3);
	
	test.done();
};

exports['Closure Form Evaluate with Parameters'] = function(test) {
	var list1 = lists.makeList(ajlisp.environment.define, atoms.createAtom("one"), atoms.createAtom("a"));
	var list2 = lists.makeList(ajlisp.environment.define, atoms.createAtom("two"), atoms.createAtom("b"));
	var list3 = lists.makeList(ajlisp.environment.define, atoms.createAtom("three"), atoms.createAtom("c"));
	var body = lists.makeList(list1, list2, list3);
	var names = lists.makeList(atoms.createAtom("a"), atoms.createAtom("b"), atoms.createAtom("c"));
	var closure = new ajlisp.Closure(names, ajlisp.environment, body);
	var list = lists.makeList(closure,1,2,3);
	
	test.equal(list.evaluate(ajlisp.environment), 3);
	test.equal(ajlisp.environment.one, 1);
	test.equal(ajlisp.environment.two, 2);
	test.equal(ajlisp.environment.three, 3);
	
	test.done();
};

