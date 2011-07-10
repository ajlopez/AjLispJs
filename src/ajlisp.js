
AjLisp = function() {
	function List(first, rest) {
		function getFirst() {
			return first;
		}
		
		function getRest() {
			return rest;
		}
		
		function evaluate(environment) {
			var form = this.first().evaluate(environment);
			return form.apply(this);
		}
		
		function evaluateList(environment) {
			var first = this.first().evaluate(environment);
			var rest = this.rest();
			
			if (rest != null)
				rest = rest.evaluateList(environment);
				
			return new List(first, rest);
		}
		
		this.first = getFirst;
		this.rest = getRest;
		this.evaluate = evaluate;
		this.evaluateList = evaluateList;
		this.isAtom = function() { return false; }
	}
	
	List.prototype.isAtom = function() { return false; }
	List.prototype.isList = function() { return true; }
	
	function Atom(name) {
		function getValue(environment) {
			return environment.getValue(name);
		}
	
		this.evaluate = getValue;
		this.name = function() { return name; };
	}
	
	Atom.prototype.isAtom = function() { return true; }
	Atom.prototype.isList = function() { return false; }
	
	function Form() {
	}
	
	Form.prototype.evaluate = function(environment) { return this; }
	Form.prototype.apply = function(list, environment) 
	{ return this.eval(list.rest().evaluateList(environment), environment); }
	
	function SpecialForm() {
	}
	
	SpecialForm.prototype.evaluate = function(environment) { return this; }
	SpecialForm.prototype.apply = function(list, environment) 
	{ return this.eval(list.rest()); }
		
	function Environment(parent) {
		function getParent() {
			return parent;
		}
		
		function getValue(name) {
			var value = this[name];
			
			if (value == undefined && this.parent() != null)
				return this.parent().getValue(name);
				
			return value;
		}
		
		function setValue(name, value) {
			if (value == undefined)
				return;
				
			this[name] = value;
		}
		
		this.parent = getParent;
		this.getValue = getValue;
		this.setValue = setValue;
	}
	
	function evaluate(x, environment)
	{
		if (x == null || x == undefined)
			return x;
			
		if (x.evaluate != undefined && typeof(x.evaluate) == "function")
			return x.evaluate(environment);
			
		return x;
	}
	
	function isAtom(x) 
	{
		if (x == null || x == undefined)
			return true;
			
		if (x.isAtom != undefined && typeof(x.isAtom) == "function")
			return x.isAtom();
		
		return false;
	}
	
	function isList(x)
	{
		if (x == null)
			return true;
			
		if (x == undefined)
			return false;
			
		if (x.isList != undefined && typeof(x.isList)=="function")
			return x.isList();
		
		return false;
	}
	
	function isNil(x)
	{
		return x == null;
	}
	
	function makeList() 
	{
		var l = arguments.length;
		var result = null;
		
		for (var k=l; k-- > 0; ) 
		{
			result = new List(arguments[k], result);
		}
		
		return result;
	}
	
	var listForm = new Form();
	listForm.eval = function eval(list) 
	{
		return list;
	}
	
	var prognForm = new SpecialForm();
	prognForm.eval = function eval(list, environment)
	{
		var result = null;
		
		while (!isNil(list)) 
		{
			result = evaluate(list.first(), environment);
			list = list.rest();
		}
		
		return result;
	}
	
	var firstForm = new Form();
	firstForm.eval = function eval(list) 
	{
		return list.first();
	}
	
	var restForm = new Form();
	restForm.eval = function eval(list) 
	{
			return list.rest();
	}
		
	var defineForm = new SpecialForm()
	defineForm.eval = function eval(list, env)
	{
		var name = list.first().name();
		var value = evaluate(list.rest().first(), env);
		environment[name] = value;
		return value;
	}

	// Environment
	
	var environment = new Environment();
	
	environment.list = listForm;
	environment.first = firstForm;
	environment.rest = restForm;
	environment.progn = prognForm;
	
	environment.define = defineForm;
	
	return {
		// Classes
		List: List,
		Environment: Environment,
		Atom: Atom,
		
		// Functions
		makeList: makeList,
		isAtom: isAtom,
		isList: isList,
		isNil: isNil,
		
		// Top Environment
		environment: environment
	}
}();

//Object.prototype.evaluate = function() { return this; };

String.prototype.evaluate = function(environment) { return this; };

Number.prototype.evaluate = function(environment) { return this; };

Date.prototype.evaluate = function(environment) { return this; };

