
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
    isList: isList,
    isAtom: isAtom,
    isNil: isNil,
    asString: asString,
    equals: equals
};

