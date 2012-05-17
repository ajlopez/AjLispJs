
var ajlisp = require('../lib/ajlisp');

exports['Create and Evaluate Atom'] = function(test) {
	var environment = new ajlisp.Environment();
	var one = new ajlisp.Atom("one");
	
	environment.setValue("one", 1);
	test.equal(one.evaluate(environment), 1);
	test.ok(one.isAtom());
	test.equal(one.isList(), false);
	test.ok(ajlisp.isAtom(one));
	test.equal(ajlisp.isList(one), false);
	test.equal(one.asString(), "one");
	test.equal(one.equals(one), true);
	
	var one2 = new ajlisp.Atom("one");
	
	test.equal(one.equals(one2), true);
	
	test.done();
};

