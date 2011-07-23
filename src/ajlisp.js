
AjLisp = function() {
	function List(first, rest) {
		function getFirst() {
			return first;
		}
		
		function getRest() {
			return rest;
		}
		
		this.first = getFirst;
		this.rest = getRest;
	}
	
	List.prototype.isAtom = function() { return false; }
	List.prototype.isList = function() { return true; }
	List.prototype.evaluate = function(environment) 
	{
		var form = this.first().evaluate(environment);
		return form.apply(this, environment);
	}	
	
	List.prototype.evaluateList = function(environment) 
	{
		var first = this.first().evaluate(environment);
		var rest = this.rest();
			
		if (rest != null)
			rest = rest.evaluateList(environment);
				
		return new List(first, rest);
	}
	
	List.prototype.asString = function()
	{
		return "(" + this.asRestString();
	}
	
	List.prototype.asRestString = function()
	{
		var result = "";
		var first = this.first();
		
		result += asString(first);
		
		var rest = this.rest();
		
		if (isNil(rest))
			return result + ")";
			
		if (isList(rest))
			return result + " " + rest.asRestString(rest);

		return result + "." + asString(rest) + ")";
	}
	
	function Atom(name) {
		function getValue(environment) {
			return environment.getValue(name);
		}
	
		this.evaluate = getValue;
		this.name = function() { return name; };
	}
	
	Atom.prototype.isAtom = function() { return true; }
	Atom.prototype.isList = function() { return false; }
	Atom.prototype.asString = function() { return this.name(); }
	
	function Form() {
	}
	
	Form.prototype.evaluate = function(environment) { return this; }
	Form.prototype.apply = function(list, environment) 
	{ 
		if (isNil(list)) return this.eval(list, environment);
		return this.eval(list.rest().evaluateList(environment), environment); 
	}
	
	function SpecialForm() {
	}
	
	SpecialForm.prototype.evaluate = function(environment) { return this; }
	SpecialForm.prototype.apply = function(list, environment) 
	{ return this.eval(list.rest(), environment); }
	
	function Closure(argnames, closureenv, body) {
		body = new List(prognForm, body);
		
		this.eval = function(args, environment) {
			var newenv = makeEnvironment(argnames, args, closureenv);
			return evaluate(body, newenv);
		};
	}
	
	Closure.prototype.evaluate = Form.prototype.evaluate;
	Closure.prototype.apply = Form.prototype.apply;
		
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
	
	function asString(value)
	{
		if (isNil(value)) 
			return "nil";

		if (isAtom(value))
			return value.name();
			
		if (isList(value))
			return value.asString();
			
		return value+"";
	}
	
	function makeEnvironment(names, values, parent)
	{
		var newenv = new Environment(parent);
		
		if (isNil(names))
			return newenv;
			
		if (isAtom(names)) 
		{
			newenv[names.name()] = values;
			return newenv;
		}
		
		var name;
		var value;
		
		while (!isNil(names)) 
		{
			name = names.first().name();
			
			if (isNil(values)) 
			{
				newenv[name] = null;
			}
			else 
			{
				value = values.first();
				values = values.rest();
				newenv[name] = value;
			}
			
			names = names.rest();
		}
		
		return newenv;
	}
	
	function isAtom(x) 
	{
		if (x == null)
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
		
	var defineForm = new SpecialForm();
	defineForm.eval = function eval(list, env)
	{
		var name = list.first().name();
		var value = evaluate(list.rest().first(), env);
		environment[name] = value;
		return value;
	}
	
	var lambdaForm = new SpecialForm();
	lambdaForm.eval = function eval(list, env)
	{
		var argnames = list.first();
		var body = list.rest();
		return new Closure(argnames, env, body);
	}

	// Environment
	
	var environment = new Environment();
	
	environment.list = listForm;
	environment.first = firstForm;
	environment.rest = restForm;
	environment.progn = prognForm;
	
	environment.define = defineForm;
	environment.lambda = lambdaForm;
	
	// Lexer
	
	function Lexer(text) 
	{
		var position = 0;
		var length = text.length;
		
		this.nextToken = function() {
			skipSpaces();
			
			var char = nextChar();
			
			if (char == null)
				return null;
			
			if (isLetter(char))
				return nextName(char);
				
			if (isDigit(char))
				return nextNumber(char);
				
			return new Token(char, TokenType.Separator);
		}
		
		function nextChar()
		{
			if (position > length)
				return null;
				
			return text[position++];
		}
		
		function skipSpaces()
		{
			while (position < length && text[position] <= ' ')
				position++;
		}
		
		function nextName(char)
		{
			var name = char;
			
			while ((char = nextChar()) != null && isLetter(char))
				name += char;
				
			if (char != null)
				position--;
				
			return new Token(name, TokenType.Name);
		}
		
		function nextNumber(char)
		{
			var number = char;
			
			while ((char = nextChar()) != null && isDigit(char))
				number += char;
				
			if (char == '.')
				return nextFloatNumber(number+'.');
				
			if (char != null)
				position--;
				
			return new Token(parseInt(number), TokenType.Number);
		}
		
		function nextFloatNumber(number)
		{
			var char;
			
			while ((char = nextChar()) != null && isDigit(char))
				number += char;
				
			if (char != null)
				position--;
				
			return new Token(parseFloat(number), TokenType.Number);
		}
		
		function isLetter(char)
		{
			if (char >= 'a' && char <= 'z')
				return true;
				
			if (char >= 'A' && char <= 'Z')
				return true;
				
			return false;
		}
		
		function isDigit(char)
		{
			if (char >= '0' && char <= '9')
				return true;
				
			return false;
		}
	}
	
	function Token(value, type)
	{
		this.value = value;
		this.type = type;
	}
	
	var TokenType = { Name: 0, Number:1, Separator:2 };
	
	return {
		// Classes
		List: List,
		Environment: Environment,
		Atom: Atom,
		Closure: Closure,
		Lexer: Lexer,
		TokenType: TokenType,
		
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
