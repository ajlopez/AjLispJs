
AjLispcript = function() {
	function List(first, rest) {
		function getFirst() {
			return first;
		}
		
		function getRest() {
			return rest;
		}
		
		function evaluate(context) {
			var form = this.first().evaluate(context);
			return form.apply(this);
		}
		
		function evaluateList(context) {
			var first = this.first().evaluate(context);
			var rest = this.rest();
			
			if (rest != null)
				rest = rest.evaluateList(context);
				
			return new List(first, rest);
		}
		
		this.first = getFirst;
		this.rest = getRest;
		this.evaluate = evaluate;
		this.evaluateList = evaluateList;
		this.isAtom = function() { return false; }
	}
	
	function Atom(name) {
		function getValue(context) {
			return context.getValue(name);
		}
	
		this.evaluate = getValue;
		this.isAtom = function() { return true; }
	}
	
	function Form() {
		function getValue(context) {
			return this;
		}
		
		function apply(list, context) {
			return this.eval(list.rest().evaluateList(context));
		}
		
		this.evaluate = getValue;
		this.apply = apply;
	}
	
	function SpecialForm() {
		function getValue(context) {
			return this;
		}
		
		function apply(list, context) {
			return this.eval(list.rest());
		}
		
		this.evaluate = getValue;
		this.apply = apply;
	}
	
	function Context(parent) {
		var values = new Object();
		
		function getParent() {
			return parent;
		}
		
		function getValue(name) {
			var value = values[name];
			
			if (value == undefined && this.parent() != null)
				return this.parent().getValue(name);
				
			return value;
		}
		
		function setValue(name, value) {
			if (value == undefined)
				return;
				
			values[name] = value;
		}
		
		this.parent = getParent;
		this.getValue = getValue;
		this.setValue = setValue;
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
	
	return {
		// Classes
		List: List,
		Context: Context,
		Atom: Atom,
		
		// Forms
		listForm: listForm,
		firstForm: firstForm,
		restForm: restForm,
		
		// Functions
		isAtom: function(x) { return typeof(x) == "AjLispcript.Atom"; },
		makeList: makeList,
		
		// Top Context
		topContext: new Context()		
	}
}();

//Object.prototype.evaluate = function() { return this; };

String.prototype.evaluate = function(context) { return this; };

Number.prototype.evaluate = function(context) { return this; };

Date.prototype.evaluate = function(context) { return this; };

