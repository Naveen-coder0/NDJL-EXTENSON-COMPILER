'use strict';

class Program {
  constructor(body) {
    this.type = 'Program';
    this.body = body;
  }
}

class VarDeclaration {
  constructor(varType, name, value) {
    this.type = 'VarDeclaration';
    this.varType = varType; // 'int' | 'str'
    this.name = name;       // string
    this.value = value;     // expression node
  }
}

class SayStatement {
  constructor(expression) {
    this.type = 'SayStatement';
    this.expression = expression;
  }
}

class BinaryExpression {
  constructor(operator, left, right) {
    this.type = 'BinaryExpression';
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

class Identifier {
  constructor(name) {
    this.type = 'Identifier';
    this.name = name;
  }
}

class NumberLiteral {
  constructor(value) {
    this.type = 'NumberLiteral';
    this.value = value;
  }
}

class StringLiteral {
  constructor(value) {
    this.type = 'StringLiteral';
    this.value = value;
  }
}

class IfStatement {
  constructor(condition, consequent, alternate) {
    this.type = 'IfStatement';
    this.condition  = condition;  // BinaryExpression with comparison op
    this.consequent = consequent; // Statement[]
    this.alternate  = alternate;  // Statement[] | null
  }
}

class FunctionDeclaration {
  constructor(name, params, body) {
    this.type   = 'FunctionDeclaration';
    this.name   = name;   // string
    this.params = params; // string[]
    this.body   = body;   // Statement[]
  }
}

class CallExpression {
  constructor(callee, args) {
    this.type   = 'CallExpression';
    this.callee = callee; // string (function name)
    this.args   = args;   // expression[]
  }
}

class ReturnStatement {
  constructor(value) {
    this.type  = 'ReturnStatement';
    this.value = value; // expression | null
  }
}

class AskStatement {
  constructor(prompt, variable) {
    this.type     = 'AskStatement';
    this.prompt   = prompt;   // string (literal)
    this.variable = variable; // string (identifier name)
  }
}

class RepeatStatement {
  constructor(count, body) {
    this.type  = 'RepeatStatement';
    this.count = count; // expression (number)
    this.body  = body;  // Statement[]
  }
}

class Assignment {
  constructor(name, value) {
    this.type  = 'Assignment';
    this.name  = name;  // string
    this.value = value; // expression
  }
}

class LogicalExpression {
  constructor(operator, left, right) {
    this.type     = 'LogicalExpression';
    this.operator = operator; // 'and' | 'or'
    this.left     = left;
    this.right    = right;
  }
}

class UnaryExpression {
  constructor(operator, operand) {
    this.type     = 'UnaryExpression';
    this.operator = operator; // 'not'
    this.operand  = operand;
  }
}

class ArrayLiteral {
  constructor(elements) {
    this.type     = 'ArrayLiteral';
    this.elements = elements; // expression[]
  }
}

class MemberExpression {
  constructor(object, index) {
    this.type   = 'MemberExpression';
    this.object = object; // string (variable name)
    this.index  = index;  // expression
  }
}

class PropertyAccess {
  constructor(object, property) {
    this.type     = 'PropertyAccess';
    this.object   = object;   // string (variable name)
    this.property = property; // string (e.g. 'length')
  }
}

class IndexAssignment {
  constructor(object, index, value) {
    this.type   = 'IndexAssignment';
    this.object = object; // string (variable name)
    this.index  = index;  // expression
    this.value  = value;  // expression
  }
}

module.exports = {
  Program,
  VarDeclaration,
  SayStatement,
  BinaryExpression,
  Identifier,
  NumberLiteral,
  StringLiteral,
  IfStatement,
  FunctionDeclaration,
  CallExpression,
  ReturnStatement,
  AskStatement,
  RepeatStatement,
  Assignment,
  LogicalExpression,
  UnaryExpression,
  ArrayLiteral,
  MemberExpression,
  PropertyAccess,
  IndexAssignment,
};
