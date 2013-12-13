
var functions = require('./functions');

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
    if (!functions.isList(list))
        return false;
        
    return functions.equals(this.first(), list.first()) && functions.equals(this.rest(), list.rest());
}

List.prototype.evaluateList = function(environment) 
{
    var first = functions.evaluate(this.first(), environment);
    var rest = this.rest();
        
    if (!functions.isNil(rest))
        rest = rest.evaluateList(environment);
            
    return new List(first, rest);
}

List.prototype.asString = function()
{
    var f = this.first();
    
    if (functions.isAtom(f) && !functions.isNil(f) && f.name() == "quote")
        return "'" + this.rest().first().asString();
        
    return "(" + this.asRestString();
}

List.prototype.asRestString = function()
{
    var result = "";
    var first = this.first();
    
    result += functions.asString(first);
    
    var rest = this.rest();
    
    if (functions.isNil(rest))
        return result + ")";
        
    if (functions.isList(rest))
        return result + " " + rest.asRestString(rest);

    return result + "." + functions.asString(rest) + ")";
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

function createList(first, rest) {
    return new List(first, rest);
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
	    
module.exports = {
    createList: createList,
    makeList: makeList
};