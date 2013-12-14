
var functions = require('./functions');

function Atom(name) {
    this.evaluate = function(environment) {
        if (this.value)
            return this.value;
            
        return environment.getValue(name);
    };
    
    this.name = function() { return name; };
    
    if (name.length > 0 && name[0] == '.')
    {
        // TO DO Review quick hack, instead of Form
        var form = new Object();
        
        form.apply = function(list, environment) 
        { 
            if (functions.isNil(list)) return this.eval(list, environment);
            
            var rest = list.rest();
            
            if (rest != null)
                rest = rest.evaluateList(environment);
                
            return this.eval(rest, environment); 
        };
        
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
    if (functions.isNil(atom) || !functions.isAtom(atom))
        return false;
        
    return this.name() == atom.name();
}

function createAtom(name) {
    return new Atom(name);
}

module.exports = {
    createAtom: createAtom
}

