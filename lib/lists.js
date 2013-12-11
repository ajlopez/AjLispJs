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
	    
module.exports = {
    createList: createList,
    makeList: makeList
};