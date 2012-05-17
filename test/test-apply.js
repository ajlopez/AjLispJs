
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
