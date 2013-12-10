// Lexer

var separators = "()";

function Lexer(text) 
{
    var position = 0;
    var length = text.length;
    var lasttoken = null;
    
    this.nextToken = function() {
        if (lasttoken != null) {
            var value = lasttoken;
            lasttoken = null;
            return value;
        }
    
        skipSpaces();
        
        var char = nextChar();
        
        if (char == null)
            return null;
        
        if (isLetter(char))
            return nextName(char);
            
        if (char == '.' && isLetter(peekChar()))
            return nextName(char);
            
        if (isDigit(char))
            return nextNumber(char);

        if (char == '"')
            return nextString();
            
        if (char == "'")
            return new Token(char, TokenType.Name);
            
        if (separators.indexOf(char) >= 0)				
            return new Token(char, TokenType.Separator);
            
        return nextSpecialName(char);
    }
    
    this.pushToken = function(token) 
    {
        lasttoken = token;
    }
    
    function nextChar()
    {
        if (position > length)
            return null;
            
        return text[position++];
    }
    
    function peekChar()
    {
        if (position > length)
            return null;
            
        return text[position];
    }
    
    function skipSpaces()
    {
        while (position < length && text[position] <= ' ')
            position++;
    }
    
    function isSpace(char)
    {
        return char <= ' ';
    }
    
    function nextName(char)
    {
        var name = char;
        
        while ((char = nextChar()) != null && (isLetter(char) || isDigit(char)) || char === "-")
            name += char;
            
        if (char != null)
            position--;
            
        return new Token(name, TokenType.Name);
    }
    
    function nextSpecialName(char)
    {
        var name = char;
        
        while ((char = nextChar()) != null && !isLetter(char) && !isDigit(char) && !isSpace(char))
            name += char;
            
        if (char != null)
            position--;
            
        return new Token(name, TokenType.Name);
    }
    
    function nextString()
    {
        var value = '';
        
        while ((char = nextChar()) != null && char !== '"')
            value += char;
            
        return new Token(value, TokenType.String);
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

var TokenType = { Name: 0, Number:1, Separator:2, String:3 };

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    createLexer: createLexer,
    TokenType: TokenType
}

