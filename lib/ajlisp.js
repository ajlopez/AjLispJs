
var lexers = require('./lexers');

var TokenType = lexers.TokenType;

ajlisp = function() {
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
	
	List.prototype.equals = function(list)
	{
		if (!isList(list))
			return false;
			
		return equals(this.first(), list.first()) && equals(this.rest(), list.rest());
	}
	
	List.prototype.evaluateList = function(environment) 
	{
		var first = evaluate(this.first(), environment);
		var rest = this.rest();
			
		if (!isNil(rest))
			rest = rest.evaluateList(environment);
				
		return new List(first, rest);
	}
	
	List.prototype.asString = function()
	{
		var f = this.first();
		
		if (isAtom(f) && !isNil(f) && f.name() == "quote")
			return "'" + this.rest().first().asString();
			
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
	
	List.prototype.asArray = function()
	{
		var rest = this.rest();
		
		if (rest === null)
			return [this.first()];
		
		var result = rest.asArray();
		
		result.unshift(this.first());
		
		return result;
	}
	
	function Atom(name) {
		this.evaluate = function(environment) {
			if (this.value)
				return this.value;
				
			return environment.getValue(name);
		};
		
		this.name = function() { return name; };
		
		if (name.length > 0 && name[0] == '.')
		{
			var form = new Form();
			var verb = name.slice(1);
			form.eval = function(list, environment)
			{
				var target = list.first();
				var args = list.rest();
				
				if (args)
					args = args.asArray();
					
				var value = target[verb];
                
				if (args || typeof value == 'function')				
					return value.apply(target, args);
					
				return value;
			}
			
			this.value = form;
		}
	}
	
	Atom.prototype.isAtom = function() { return true; }
	Atom.prototype.isList = function() { return false; }
	Atom.prototype.asString = function() { return this.name(); }
	
	Atom.prototype.equals = function(atom)
	{
		if (isNil(atom) || !isAtom(atom))
			return false;
			
		return this.name() == atom.name();
	}
	
	var quote = new Atom("quote");
	
	function Form() {
	}
	
	Form.prototype.evaluate = function(environment) { return this; }
	Form.prototype.apply = function(list, environment) 
	{ 
		if (isNil(list)) return this.eval(list, environment);
		
		var rest = list.rest();
		
		if (rest != null)
			rest = rest.evaluateList(environment);
			
		return this.eval(rest, environment); 
	}
	
	function SpecialForm() {
	}
	
	SpecialForm.prototype.evaluate = function(environment) { return this; }
	SpecialForm.prototype.apply = function(list, environment) 
	{ 
		if (isNil(list)) return this.eval(list, environment);
		
		return this.eval(list.rest(), environment);
	}
	
	function Closure(argnames, closureenv, body) {
		body = new List(doForm, body);
		
		this.eval = function(args, environment) {
			var newenv = makeEnvironment(argnames, args, closureenv);
			return evaluate(body, newenv);
		};
	}
	
	Closure.prototype.evaluate = Form.prototype.evaluate;
	Closure.prototype.apply = Form.prototype.apply;
		
	function FormClosure(argnames, closureenv, body)
	{
		Closure.prototype.constructor.call(this, argnames, closureenv, body);
	}
	
	FormClosure.prototype.evaluate = SpecialForm.prototype.evaluate;
	FormClosure.prototype.apply = SpecialForm.prototype.apply;
		
	function MacroClosure(argnames, closureenv, body)
	{
		body = new List(doForm, body);
		
		this.eval = function(args, environment) {
			var newenv = makeEnvironment(argnames, args, closureenv);
			var value = evaluate(body, newenv);
			return evaluate(value, environment);
		};
	}
	
	MacroClosure.prototype.evaluate = SpecialForm.prototype.evaluate;
	MacroClosure.prototype.apply = SpecialForm.prototype.apply;
		
	function Environment(parent) {
		function getParent() {
			return parent;
		}
		
		function getValue(name) {
			var value = this[name];
			
			if (value === undefined && this.parent() != null)
				return this.parent().getValue(name);
				
			return value;
		}
		
		function setValue(name, value) {
			if (value === undefined)
				return;
				
			this[name] = value;
		}
		
		this.parent = getParent;
		this.getValue = getValue;
		this.setValue = setValue;
	}
	
	function evaluate(x, environment)
	{
		if (x === null || x === undefined)
			return x;
			
		if (x.evaluate)
			return x.evaluate(environment);
			
		return x;
	}
    
    function evaluateText(text, env)
    {
        if (!env)
            env = environment;
            
        var lexer = lexers.createLexer(text);
        var parser = new Parser(lexer);
        
        var result = null;
        
        for (var expr = parser.parse(); expr !== null; expr = parser.parse())
            result = evaluate(expr, env);
        
        return result;        
    }
	
	function asString(value)
	{
		if (isNil(value)) 
			return "nil";

		if (isAtom(value))
			return value.name();
			
		if (isList(value))
			return value.asString();
			
		if (typeof value == "string")
			return '"' + value + '"';
			
		return value+"";
	}
	
	function equals(obj1, obj2)
	{
		if (isNil(obj1))
			return isNil(obj2);

		if (isNil(obj2))
			return isNil(obj1);
			
		if (isAtom(obj1) && isAtom(obj2))
			return obj1.equals(obj2);
			
		if (isList(obj1) && isList(obj2))
			return obj1.equals(obj2);
			
		return obj1 == obj2;
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
	
	function makeLetEnvironment(namesvalues, parent)
	{
		var newenv = new Environment(parent);
		
		if (isNil(namesvalues))
			return newenv;
			
		var name;
		var value;
		
		while (!isNil(namesvalues)) 
		{
			name = namesvalues.first().first().name();
			value = namesvalues.first().rest().first();
			
			if (!isNil(value))
				value = evaluate(value, parent);
				
			newenv[name] = value;
			
			namesvalues = namesvalues.rest();
		}
		
		return newenv;
	}

	function isAtom(x) 
	{
		if (x === null)
			return true;
			
		if (x.isAtom != undefined && typeof(x.isAtom) == "function")
			return x.isAtom();
		
		return false;
	}
	
	function isList(x)
	{
		if (x === null)
			return true;
			
		if (x === undefined)
			return false;
			
		if (x.isList != undefined && typeof(x.isList)=="function")
			return x.isList();
		
		return false;
	}
	
	function isNil(x)
	{
		return x === null;
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
	
	var nilpForm = new Form();
	nilpForm.eval = function eval(list) 
	{
		if (isNil(list))
			return true;
			
		return isNil(list.first());
	}
	
	var listpForm = new Form();
	listpForm.eval = function eval(list) 
	{
		if (isNil(list))
			return true;
			
		return isList(list.first());
	}
	
	var equalpForm = new Form();
	equalpForm.eval = function(list) 
	{
		if (isNil(list))
			return true;
			
		var first = list.first();
		var second = null;
		
		if (!isNil(list.rest()))
			second = list.rest().first();
			
		return equals(first, second);
	}
	
	var lesspForm = new Form();
	lesspForm.eval = function(list) 
	{
		if (isNil(list))
			return true;
			
		var first = list.first();
		var second = null;
		
		if (!isNil(list.rest()))
			second = list.rest().first();
			
		return first < second;
	}
	
	var greaterpForm = new Form();
	greaterpForm.eval = function(list) 
	{
		if (isNil(list))
			return true;
			
		var first = list.first();
		var second = null;
		
		if (!isNil(list.rest()))
			second = list.rest().first();
			
		return first > second;
	}
	
	var doForm = new SpecialForm();
	doForm.eval = function(list, environment)
	{
		var result = null;
		
		while (!isNil(list)) 
		{
			result = evaluate(list.first(), environment);
			list = list.rest();
		}
		
		return result;
	}
	
	var letForm = new SpecialForm();
	letForm.eval = function(list, environment)
	{
		var result = null;
		var newenv = makeLetEnvironment(list.first(), environment);
		var body = list.rest();
		
		while (!isNil(body)) 
		{
			result = evaluate(body.first(), newenv);
			body = body.rest();
		}
		
		return result;
	}
	
	var firstForm = new Form();
	firstForm.eval = function eval(list) 
	{
		return list.first().first();
	}
	
	var restForm = new Form();
	restForm.eval = function(list) 
	{
		return list.first().rest();
	}
	
	var consForm = new Form();
	consForm.eval = function(list)
	{
		if (isNil(list))
			return null;
			
		var first = list.first();
		var rest = list.rest();
		
		if (isNil(rest))
			return new List(first, null);
			
		return new List(first, rest.first());
	}
		
	var defineForm = new SpecialForm();
	defineForm.eval = function(list, env)
	{
		var name = list.first().name();
		var value = list.rest().first();
		var body = list.rest().rest();
		
		if (isNil(body)) {
			value = evaluate(value, env);
		}
		else {
			value = new Closure(value, env, body);
		}		
		
		environment[name] = value;
		return value;
	}
		
	var ifForm = new SpecialForm();
	ifForm.eval = function(list, env)
	{
		var cond = evaluate(list.first(), env);
		var then = list.rest().first();
		var elsebody = list.rest().rest();
		
		if (!isNil(cond) && cond != false)
			return evaluate(then, env);

		while (!isNil(elsebody)) 
		{
			result = evaluate(elsebody.first(), env);
			elsebody = elsebody.rest();
		}
		
		return result;			
	}
	
	var lambdaForm = new SpecialForm();
	lambdaForm.eval = function eval(list, env)
	{
		var argnames = list.first();
		var body = list.rest();
		return new Closure(argnames, env, body);
	}
	
	var flambdaForm = new SpecialForm();
	flambdaForm.eval = function eval(list, env)
	{
		var argnames = list.first();
		var body = list.rest();
		return new FormClosure(argnames, env, body);
	}
	
	var mlambdaForm = new SpecialForm();
	mlambdaForm.eval = function eval(list, env)
	{
		var argnames = list.first();
		var body = list.rest();
		return new MacroClosure(argnames, env, body);
	}
	
	var quoteForm = new SpecialForm();
	quoteForm.eval = function eval(list, env)
	{
		return list.first();
	}
	
	// Arithmetic forms
	
	var addForm = new Form();
	addForm.eval = function(list)
	{
		var result = 0;
		
		while (list && isList(list))
		{
			result += list.first();
			list = list.rest();
		}
		
		return result;
	};

	var subtractForm = new Form();
	subtractForm.eval = function(list)
	{
		var result = list.first();
		list = list.rest();
		
		while (list && isList(list))
		{
			result -= list.first();
			list = list.rest();
		}
		
		return result;
	};

	var multiplyForm = new Form();
	multiplyForm.eval = function(list)
	{
		var result = 1;
		
		while (list && isList(list))
		{
			result *= list.first();
			list = list.rest();
		}
		
		return result;
	};

	var divideForm = new Form();
	divideForm.eval = function(list)
	{
		var result = list.first();
		list = list.rest();
		
		while (list && isList(list))
		{
			result /= list.first();
			list = list.rest();
		}
		
		return result;
	};

	// Environment
	
	var environment = new Environment();
	
	environment.list = listForm;
	environment.first = firstForm;
	environment.rest = restForm;
	environment.cons = consForm;
	environment['do'] = doForm;
	environment['if'] = ifForm;
	
	environment.define = defineForm;
	environment.lambda = lambdaForm;
	environment.flambda = flambdaForm;
	environment.mlambda = mlambdaForm;
	environment.let = letForm;
	
	environment.quote = quoteForm;
	
	environment.nilp = nilpForm;
	environment.listp = listpForm;
	environment.equalp = equalpForm;
	environment['='] = equalpForm;
	environment.lessp = lesspForm;
	environment['<'] = lesspForm;
	environment.greaterp = greaterpForm;
	environment['>'] = greaterpForm;
	
	environment['+'] = addForm;
	environment.add = addForm;
	environment['-'] = subtractForm;
	environment.sub = subtractForm;
	environment['*'] = multiplyForm;
	environment.mult = multiplyForm;
	environment['/'] = divideForm;
	environment.div = divideForm;
		
	// Parser
	
	function Parser(lexer) 
	{
		this.parse = parse;
		
		function parse() {
			var token = lexer.nextToken();
			
			if (token === null)
				return null;
				
			if (token.type == TokenType.Name) {
				if (token.value == "nil")
					return null;
				if (token.value == "false")
					return false;
				if (token.value == "true")
					return true;
				if (token.value == "'")
					return new List(quote, new List(parse(), null));
					
				return new Atom(token.value);
			}
				
			if (token.type == TokenType.Separator && token.value == "(")
				return parseListRest();
				
			if (token.type == TokenType.Number || token.type == TokenType.String)
				return token.value;
				
			throw "Invalid token: " + token.value;
		}
		
		function parseListRest()
		{
			var token = lexer.nextToken();
			
			if (token.type == TokenType.Separator && token.value == ")")
				return null;
				
			lexer.pushToken(token);
			
			var first = parse();
			var rest = parseListRest();

			return new List(first, rest);
		}
	}
    
    function createParser(text) {
        var lexer = lexers.createLexer(text);
        return new Parser(lexer);
    }
	
	return {
		// Classes
		List: List,
		Environment: Environment,
		Atom: Atom,
		Closure: Closure,
		createParser: createParser,
		
		// Functions
		makeList: makeList,
		isAtom: isAtom,
		isList: isList,
		isNil: isNil,
		asString: asString,
		evaluate: evaluate,
        evaluateText: evaluateText,
		
		// Top Environment
		environment: environment
	}
}();

if (typeof(window) === 'undefined') {
	ajlisp.environment.global = global;
	module.exports = ajlisp;
}
else
	ajlisp.environment.global = window;
	


