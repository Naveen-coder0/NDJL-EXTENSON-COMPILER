'use strict';

const { TokenType } = require('./tokenizer');
const AST = require('./ast');

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() {
    return this.tokens[this.pos];
  }

  consume() {
    return this.tokens[this.pos++];
  }

  peekAt(offset) {
    return this.tokens[this.pos + offset];
  }

  expect(type, value = null) {
    const token = this.consume();
    if (token.type !== type) {
      throw new Error(
        `Expected token type '${type}', got '${token.type}' ("${token.value}")`
      );
    }
    if (value !== null && token.value !== value) {
      throw new Error(
        `Expected token value "${value}", got "${token.value}"`
      );
    }
    return token;
  }

  // entry point
  parse() {
    const body = [];
    while (this.peek().type !== TokenType.EOF) {
      body.push(this.parseStatement());
    }
    return new AST.Program(body);
  }

  parseStatement() {
    const token = this.peek();

    if (token.type === TokenType.KEYWORD && token.value === 'create') {
      return this.parseVarDeclaration();
    }

    if (token.type === TokenType.KEYWORD && token.value === 'say') {
      return this.parseSayStatement();
    }

    if (token.type === TokenType.KEYWORD && token.value === 'if') {
      return this.parseIfStatement();
    }

    if (token.type === TokenType.KEYWORD && token.value === 'define') {
      return this.parseFunctionDeclaration();
    }

    if (token.type === TokenType.KEYWORD && token.value === 'return') {
      return this.parseReturnStatement();
    }

    if (token.type === TokenType.KEYWORD && token.value === 'ask') {
      return this.parseAskStatement();
    }

    if (token.type === TokenType.KEYWORD && token.value === 'repeat') {
      return this.parseRepeatStatement();
    }

    // index assignment: IDENTIFIER [ expr ] =
    if (
      token.type === TokenType.IDENTIFIER &&
      this.peekAt(1).type === TokenType.LBRACKET
    ) {
      return this.parseIndexAssignment();
    }

    if (
      token.type === TokenType.IDENTIFIER &&
      this.peekAt(1).type === TokenType.LPAREN
    ) {
      return this.parseExpression(); // parsePrimary handles CallExpression
    }

    // variable reassignment: IDENTIFIER = expr
    if (
      token.type === TokenType.IDENTIFIER &&
      this.peekAt(1).type === TokenType.EQUALS
    ) {
      return this.parseAssignment();
    }

    throw new Error(`Unexpected token: "${token.value}" (${token.type})`);
  }

  parseVarDeclaration() {
    this.expect(TokenType.KEYWORD, 'create');

    const typeToken = this.expect(TokenType.KEYWORD);
    const validTypes = ['int', 'str', 'number', 'text', 'list'];
    if (!validTypes.includes(typeToken.value)) {
      throw new Error(
        `Expected type 'int', 'str', 'number', 'text', or 'list', got '${typeToken.value}'`
      );
    }

    const nameToken = this.expect(TokenType.IDENTIFIER);

    let value = null;
    if (this.peek().type === TokenType.EQUALS) {
      this.consume();
      value = this.parseExpression();
    }

    return new AST.VarDeclaration(typeToken.value, nameToken.value, value);
  }

  parseSayStatement() {
    this.expect(TokenType.KEYWORD, 'say');
    const expr = this.parseExpression();
    return new AST.SayStatement(expr);
  }

  parseFunctionDeclaration() {
    this.expect(TokenType.KEYWORD, 'define');
    const nameToken = this.expect(TokenType.IDENTIFIER);
    this.expect(TokenType.LPAREN);

    const params = [];
    if (this.peek().type !== TokenType.RPAREN) {
      params.push(this.expect(TokenType.IDENTIFIER).value);
      while (this.peek().type === TokenType.COMMA) {
        this.consume();
        params.push(this.expect(TokenType.IDENTIFIER).value);
      }
    }
    this.expect(TokenType.RPAREN);

    const body = [];
    while (
      !(this.peek().type === TokenType.KEYWORD && this.peek().value === 'end') &&
      this.peek().type !== TokenType.EOF
    ) {
      body.push(this.parseStatement());
    }
    this.expect(TokenType.KEYWORD, 'end');

    return new AST.FunctionDeclaration(nameToken.value, params, body);
  }

  parseReturnStatement() {
    this.expect(TokenType.KEYWORD, 'return');
    const t = this.peek();
    const stmtStarters = ['create', 'say', 'if', 'define', 'return', 'ask', 'end', 'else'];
    let value = null;
    if (
      t.type !== TokenType.EOF &&
      !(t.type === TokenType.KEYWORD && stmtStarters.includes(t.value))
    ) {
      value = this.parseExpression();
    }
    return new AST.ReturnStatement(value);
  }

  parseAskStatement() {
    this.expect(TokenType.KEYWORD, 'ask');
    const promptToken = this.expect(TokenType.STRING);
    this.expect(TokenType.KEYWORD, 'into');
    const varToken = this.expect(TokenType.IDENTIFIER);
    return new AST.AskStatement(promptToken.value, varToken.value);
  }

  parseRepeatStatement() {
    this.expect(TokenType.KEYWORD, 'repeat');
    const count = this.parseExpression();
    this.expect(TokenType.KEYWORD, 'times');

    const body = [];
    while (
      !(this.peek().type === TokenType.KEYWORD && this.peek().value === 'end') &&
      this.peek().type !== TokenType.EOF
    ) {
      body.push(this.parseStatement());
    }
    this.expect(TokenType.KEYWORD, 'end');

    return new AST.RepeatStatement(count, body);
  }

  parseAssignment() {
    const nameToken = this.expect(TokenType.IDENTIFIER);
    this.expect(TokenType.EQUALS);
    const value = this.parseExpression();
    return new AST.Assignment(nameToken.value, value);
  }

  parseIndexAssignment() {
    const nameToken = this.expect(TokenType.IDENTIFIER);
    this.expect(TokenType.LBRACKET);
    const index = this.parseExpression();
    this.expect(TokenType.RBRACKET);
    this.expect(TokenType.EQUALS);
    const value = this.parseExpression();
    return new AST.IndexAssignment(nameToken.value, index, value);
  }

  parseIfStatement() {
    this.expect(TokenType.KEYWORD, 'if');
    const condition = this.parseCondition();

    const consequent = [];
    while (
      !(this.peek().type === TokenType.KEYWORD && this.peek().value === 'else') &&
      !(this.peek().type === TokenType.KEYWORD && this.peek().value === 'end') &&
      this.peek().type !== TokenType.EOF
    ) {
      consequent.push(this.parseStatement());
    }

    let alternate = null;
    if (this.peek().type === TokenType.KEYWORD && this.peek().value === 'else') {
      this.consume(); // consume 'else'
      alternate = [];
      while (
        !(this.peek().type === TokenType.KEYWORD && this.peek().value === 'end') &&
        this.peek().type !== TokenType.EOF
      ) {
        alternate.push(this.parseStatement());
      }
    }

    this.expect(TokenType.KEYWORD, 'end');
    return new AST.IfStatement(condition, consequent, alternate);
  }

  // comparison → logical ('greater' 'than' | 'less' 'than' | 'equals') logical
  parseComparison() {
    const left = this.parseExpression();
    const t = this.peek();

    if (t.type === TokenType.KEYWORD && t.value === 'greater') {
      this.consume();
      this.expect(TokenType.KEYWORD, 'than');
      const right = this.parseExpression();
      return new AST.BinaryExpression('>', left, right);
    }

    if (t.type === TokenType.KEYWORD && t.value === 'less') {
      this.consume();
      this.expect(TokenType.KEYWORD, 'than');
      const right = this.parseExpression();
      return new AST.BinaryExpression('<', left, right);
    }

    if (t.type === TokenType.KEYWORD && t.value === 'equals') {
      this.consume();
      const right = this.parseExpression();
      return new AST.BinaryExpression('==', left, right);
    }

    // no comparison operator — return left as-is (bare logical expr in if)
    return left;
  }

  // expr → additive (arithmetic only)
  parseExpression() {
    return this.parseAdditive();
  }

  // condition → notExpr (('and' | 'or') notExpr)* — used for if conditions
  parseCondition() {
    let left = this.parseNotExpr();

    while (
      this.peek().type === TokenType.KEYWORD &&
      (this.peek().value === 'and' || this.peek().value === 'or')
    ) {
      const op = this.consume().value;
      const right = this.parseNotExpr();
      left = new AST.LogicalExpression(op, left, right);
    }

    return left;
  }

  // notExpr → 'not' notExpr | comparison
  parseNotExpr() {
    if (this.peek().type === TokenType.KEYWORD && this.peek().value === 'not') {
      this.consume();
      const operand = this.parseNotExpr();
      return new AST.UnaryExpression('not', operand);
    }
    return this.parseComparison();
  }

  // additive → multiplicative (('+' | '-') multiplicative)*
  parseAdditive() {
    let left = this.parseMultiplicative();

    while (
      this.peek().type === TokenType.OPERATOR &&
      ['+', '-'].includes(this.peek().value)
    ) {
      const op = this.consume().value;
      const right = this.parseMultiplicative();
      left = new AST.BinaryExpression(op, left, right);
    }

    return left;
  }

  // multiplicative → primary (('*' | '/' | '%') primary)*
  parseMultiplicative() {
    let left = this.parsePrimary();

    while (
      this.peek().type === TokenType.OPERATOR &&
      ['*', '/', '%'].includes(this.peek().value)
    ) {
      const op = this.consume().value;
      const right = this.parsePrimary();
      left = new AST.BinaryExpression(op, left, right);
    }

    return left;
  }

  // primary → NUMBER | STRING | IDENTIFIER
  parsePrimary() {
    const token = this.peek();

    if (token.type === TokenType.NUMBER) {
      this.consume();
      return new AST.NumberLiteral(token.value);
    }

    if (token.type === TokenType.STRING) {
      this.consume();
      return new AST.StringLiteral(token.value);
    }

    if (token.type === TokenType.IDENTIFIER) {
      this.consume();
      if (this.peek().type === TokenType.LPAREN) {
        this.consume(); // consume '('
        const args = this.parseArgList();
        this.expect(TokenType.RPAREN);
        return new AST.CallExpression(token.value, args);
      }
      if (this.peek().type === TokenType.LBRACKET) {
        this.consume(); // consume '['
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET);
        return new AST.MemberExpression(token.value, index);
      }
      if (this.peek().type === TokenType.DOT) {
        this.consume(); // consume '.'
        const prop = this.expect(TokenType.IDENTIFIER).value;
        return new AST.PropertyAccess(token.value, prop);
      }
      return new AST.Identifier(token.value);
    }

    if (token.type === TokenType.LBRACKET) {
      return this.parseArrayLiteral();
    }

    throw new Error(
      `Unexpected token in expression: "${token.value}" (${token.type})`
    );
  }

  parseArrayLiteral() {
    this.expect(TokenType.LBRACKET);
    const elements = [];
    if (this.peek().type !== TokenType.RBRACKET) {
      elements.push(this.parseExpression());
      while (this.peek().type === TokenType.COMMA) {
        this.consume();
        elements.push(this.parseExpression());
      }
    }
    this.expect(TokenType.RBRACKET);
    return new AST.ArrayLiteral(elements);
  }

  parseArgList() {
    const args = [];
    if (this.peek().type === TokenType.RPAREN) return args;
    args.push(this.parseExpression());
    while (this.peek().type === TokenType.COMMA) {
      this.consume();
      args.push(this.parseExpression());
    }
    return args;
  }
}

module.exports = { Parser };
