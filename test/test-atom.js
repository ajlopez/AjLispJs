
var ajlisp = require('../lib/ajlisp'),
    functions = require('../lib/functions');

exports['Create and Evaluate Atom'] = function(test) {
	var environment = new ajlisp.Environment();
	var one = new ajlisp.Atom("one");
	
	environment.setValue("one", 1);
	test.equal(one.evaluate(environment), 1);
	test.ok(one.isAtom());
	test.equal(one.isList(), false);
	test.ok(functions.isAtom(one));
	test.equal(functions.isList(one), false);
	test.equal(one.asString(), "one");
	test.equal(one.equals(one), true);
	
	var one2 = new ajlisp.Atom("one");
	
	test.equal(one.equals(one2), true);
	
	test.done();
};

exports['Create and Evaluate Dotted Atom'] = function(test) {
	var environment = new ajlisp.Environment();
	var atom = new ajlisp.Atom(".toUpperCase");
	
	test.notEqual(atom.evaluate(environment), null);
	test.equal(atom.asString(), ".toUpperCase");
	test.ok(atom.value);
	test.equal(atom.evaluate(environment), atom.value);
	test.ok(atom.value.eval);
		
	test.done();
};

