
var lexers = require('./lexers'),
    lists = require('./lists'),
    atoms = require('./atoms');
    
var TokenType = lexers.TokenType;

var quote = atoms.createAtom("quote");

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
                return lists.createList(quote, lists.createList(parse(), null));
                
            return atoms.createAtom(token.value);
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

        return lists.createList(first, rest);
    }
}

function createParser(text) {
    var lexer = lexers.createLexer(text);
    return new Parser(lexer);
}

module.exports = {
    createParser: createParser
};

