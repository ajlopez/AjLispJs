
var lists = require('../lib/lists');

exports['Dotted List'] = function(test) {
    var list = lists.createList(1,2);

    test.equal(list.first(), 1);
    test.equal(list.rest(), 2);
    test.equal(list.isAtom(),false);
    test.equal(list.isList(),true);
    test.equal(list.asString(), "(1.2)");
	
	test.done();
};

exports['Compare Dotted Lists'] = function(test) {
    var list = lists.createList(1,2);
	var list2 = lists.createList(1,2);

    test.equal(list.equals(list2), true);
    test.equal(list2.equals(list), true);
	
	test.done();
};

exports['Make List'] = function(test) {
	var list = lists.makeList(1,2,3);
    
    test.ok(list.isList());
    test.equal(list.first(), 1);
    test.equal(list.rest().first(), 2);
    test.equal(list.rest().rest().first(), 3);
	
	test.done();
};

exports['Make List with Nulls'] = function(test) {
	var list = lists.makeList(null, null);
    
    test.ok(list.isList());
    test.equal(list.first(), null);
    test.equal(list.rest().first(), null);
	
	test.done();
};

exports['List as Array'] = function(test) {
	var list = lists.makeList(1,2,3);
    var result = list.asArray();
    
    test.ok(result);
    test.equal(result.length, 3);
    test.equal(result[0], 1);
    test.equal(result[1], 2);
    test.equal(result[2], 3);
	
	test.done();
};

