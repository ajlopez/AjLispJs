
var lexers = require('./lexers'),
    parsers = require('./parsers'),
    functions = require('./functions'),
    atoms = require('./atoms'),
    lists = require('./lists');

var TokenType = lexers.TokenType;

ajlisp = function() {		
	function Form() {
	}
	
	Form.prototype.evaluate = function(environment) { return this; }
	Form.prototype.apply = function(list, environment) 
	{ 
		if (functions.isNil(list)) return this.eval(list, environment);
		
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
		if (functions.isNil(list)) return this.eval(list, environment);
		
		return this.eval(list.rest(), environment);
	}
	
	function Closure(argnames, closureenv, body) {
		body = lists.createList(doForm, body);
		
		this.eval = function(args, environment) {
			var newenv = makeEnvironment(argnames, args, closureenv);
			return functions.evaluate(body, newenv);
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
		body = lists.createList(doForm, body);
		
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
	    
    function evaluateText(text, env)
    {
        if (!env)
            env = environment;
            
        var parser = parsers.createParser(text);
        
        var result = null;
        
        for (var expr = parser.parse(); expr !== null; expr = parser.parse())
            result = functions.evaluate(expr, env);
        
        return result;        
    }
	
	function makeEnvironment(names, values, parent)
	{
		var newenv = new Environment(parent);
		
		if (functions.isNil(names))
			return newenv;
			
		if (functions.isAtom(names)) 
		{
			newenv[names.name()] = values;
			return newenv;
		}
		
		var name;
		var value;
		
		while (!functions.isNil(names)) 
		{
			name = names.first().name();
			
			if (functions.isNil(values)) 
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
	
	var listForm = new Form();
	listForm.eval = function eval(list) 
	{
		return list;
	}
	
	var nilpForm = new Form();
	nilpForm.eval = function eval(list) 
	{
		if (functions.isNil(list))
			return true;
			
		return isNil(list.first());
	}
	
	var listpForm = new Form();
	listpForm.eval = function eval(list) 
	{
		if (functions.isNil(list))
			return true;
			
		return functions.isList(list.first());
	}
	
	var equalpForm = new Form();
	equalpForm.eval = function(list) 
	{
		if (functions.isNil(list))
			return true;
			
		var first = list.first();
		var second = null;
		
		if (!functions.isNil(list.rest()))
			second = list.rest().first();
			
		return functions.equals(first, second);
	}
	
	var lesspForm = new Form();
	lesspForm.eval = function(list) 
	{
		if (functions.isNil(list))
			return true;
			
		var first = list.first();
		var second = null;
		
		if (!functions.isNil(list.rest()))
			second = list.rest().first();
			
		return first < second;
	}
	
	var greaterpForm = new Form();
	greaterpForm.eval = function(list) 
	{
		if (functions.isNil(list))
			return true;
			
		var first = list.first();
		var second = null;
		
		if (!functions.isNil(list.rest()))
			second = list.rest().first();
			
		return first > second;
	}
	
	var doForm = new SpecialForm();
	doForm.eval = function(list, environment)
	{
		var result = null;
		
		while (!functions.isNil(list)) 
		{
			result = functions.evaluate(list.first(), environment);
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
		
		while (!functions.isNil(body)) 
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
		if (functions.isNil(list))
			return null;

		var first = list.first();
		var rest = list.rest();
		
		if (functions.isNil(rest))
			return lists.createList(first, null);
			
		return list.createList(first, rest.first());
	}
		
	var defineForm = new SpecialForm();
	defineForm.eval = function(list, env)
	{
		var name = list.first().name();
		var value = list.rest().first();
		var body = list.rest().rest();
		
		if (functions.isNil(body)) {
			value = functions.evaluate(value, env);
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
		
		if (!functions.isNil(cond) && cond != false)
			return functions.evaluate(then, env);

		while (!functions.isNil(elsebody)) 
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
		
		while (list && functions.isList(list))
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
		
		while (list && functions.isList(list))
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
		
		while (list && functions.isList(list))
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
		
		while (list && functions.isList(list))
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
	
	return {
		// Classes
		Environment: Environment,
		Closure: Closure,
		
		// Functions
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
	


