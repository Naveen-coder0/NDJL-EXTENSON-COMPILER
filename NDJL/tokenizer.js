'use strict';

const TokenType = {
  KEYWORD:    'KEYWORD',
  IDENTIFIER: 'IDENTIFIER',
  NUMBER:     'NUMBER',
  STRING:     'STRING',
  OPERATOR:   'OPERATOR',
  EQUALS:     'EQUALS',
  LPAREN:     'LPAREN',
  RPAREN:     'RPAREN',
  COMMA:      'COMMA',
  LBRACKET:   'LBRACKET',
  RBRACKET:   'RBRACKET',
  DOT:        'DOT',
  EOF:        'EOF',
};

const KEYWORDS = [
  'create', 'say', 'int', 'str', 'number', 'text', 'list',
  'if', 'else', 'end',
  'greater', 'than', 'less', 'equals',
  'define', 'return', 'ask', 'into',
  'repeat', 'times',
  'and', 'or', 'not',
];

function tokenize(source) {
  const tokens = [];
  let i = 0;

  while (i < source.length) {
    // Skip whitespace and newlines
    if (/[ \t\r\n]/.test(source[i])) {
      i++;
      continue;
    }

    // String literal
    if (source[i] === '"') {
      let str = '';
      i++; // skip opening quote
      while (i < source.length && source[i] !== '"') {
        if (source[i] === '\n') throw new Error('Unterminated string literal');
        str += source[i++];
      }
      if (i >= source.length) throw new Error('Unterminated string literal');
      i++; // skip closing quote
      tokens.push({ type: TokenType.STRING, value: str });
      continue;
    }

    // Number literal (integer or float)
    if (/[0-9]/.test(source[i])) {
      let num = '';
      while (i < source.length && /[0-9.]/.test(source[i])) {
        num += source[i++];
      }
      tokens.push({ type: TokenType.NUMBER, value: parseFloat(num) });
      continue;
    }

    // Identifier or keyword
    if (/[a-zA-Z_]/.test(source[i])) {
      let word = '';
      while (i < source.length && /[a-zA-Z_0-9]/.test(source[i])) {
        word += source[i++];
      }
      if (KEYWORDS.includes(word)) {
        tokens.push({ type: TokenType.KEYWORD, value: word });
      } else {
        tokens.push({ type: TokenType.IDENTIFIER, value: word });
      }
      continue;
    }

    // Arithmetic operators
    if (['+', '-', '*', '/', '%'].includes(source[i])) {
      tokens.push({ type: TokenType.OPERATOR, value: source[i] });
      i++;
      continue;
    }

    // Assignment
    if (source[i] === '=') {
      tokens.push({ type: TokenType.EQUALS, value: '=' });
      i++;
      continue;
    }

    // Parentheses and comma
    if (source[i] === '(') {
      tokens.push({ type: TokenType.LPAREN, value: '(' });
      i++;
      continue;
    }

    if (source[i] === ')') {
      tokens.push({ type: TokenType.RPAREN, value: ')' });
      i++;
      continue;
    }

    if (source[i] === ',') {
      tokens.push({ type: TokenType.COMMA, value: ',' });
      i++;
      continue;
    }

    // Array brackets
    if (source[i] === '[') {
      tokens.push({ type: TokenType.LBRACKET, value: '[' });
      i++;
      continue;
    }

    if (source[i] === ']') {
      tokens.push({ type: TokenType.RBRACKET, value: ']' });
      i++;
      continue;
    }

    // Property access
    if (source[i] === '.') {
      tokens.push({ type: TokenType.DOT, value: '.' });
      i++;
      continue;
    }

    throw new Error(`Unknown character: '${source[i]}' at position ${i}`);
  }

  tokens.push({ type: TokenType.EOF, value: null });
  return tokens;
}

module.exports = { tokenize, TokenType };
