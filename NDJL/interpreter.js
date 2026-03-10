'use strict';

const fs = require('fs');

class ReturnValue {
  constructor(value) { this.value = value; }
}

class Interpreter {
  constructor() {
    this.globals   = Object.create(null);
    this.env       = this.globals;
    this.functions = Object.create(null);
  }

  interpret(program) {
    for (const node of program.body) {
      this.execute(node);
    }
  }

  execute(node) {
    switch (node.type) {
      case 'VarDeclaration':
        return this.execVarDeclaration(node);
      case 'SayStatement':
        return this.execSayStatement(node);
      case 'IfStatement':
        return this.execIfStatement(node);
      case 'FunctionDeclaration':
        return this.execFunctionDeclaration(node);
      case 'ReturnStatement':
        return this.execReturnStatement(node);
      case 'AskStatement':
        return this.execAskStatement(node);
      case 'CallExpression':
        this.execCallExpression(node);
        return;
      case 'RepeatStatement':
        return this.execRepeatStatement(node);
      case 'Assignment':
        return this.execAssignment(node);
      case 'IndexAssignment':
        return this.execIndexAssignment(node);
      default:
        throw new Error(`Unknown statement node: '${node.type}'`);
    }
  }

  execVarDeclaration(node) {
    if (node.value === null) {
      const defaults = { int: 0, number: 0, str: '', text: '', list: [] };
      this.env[node.name] = (node.varType in defaults) ? defaults[node.varType] : null;
      return;
    }

    const value = this.evaluate(node.value);

    if (node.varType === 'int' || node.varType === 'number') {
      if (typeof value !== 'number') {
        throw new Error(
          `Type error: '${node.name}' declared as ${node.varType} but got ${typeof value}`
        );
      }
    } else if (node.varType === 'str' || node.varType === 'text') {
      if (typeof value !== 'string') {
        throw new Error(
          `Type error: '${node.name}' declared as ${node.varType} but got ${typeof value}`
        );
      }
    } else if (node.varType === 'list') {
      if (!Array.isArray(value)) {
        throw new Error(
          `Type error: '${node.name}' declared as list but got ${typeof value}`
        );
      }
    }

    this.env[node.name] = value;
  }

  execSayStatement(node) {
    const value = this.evaluate(node.expression);
    console.log(value);
  }

  execIfStatement(node) {
    const condition = this.evaluate(node.condition);
    if (condition) {
      for (const stmt of node.consequent) this.execute(stmt);
    } else if (node.alternate !== null) {
      for (const stmt of node.alternate) this.execute(stmt);
    }
  }

  execRepeatStatement(node) {
    const count = this.evaluate(node.count);
    if (typeof count !== 'number' || count < 0) {
      throw new Error(`repeat count must be a non-negative number, got ${count}`);
    }
    for (let i = 0; i < Math.floor(count); i++) {
      for (const stmt of node.body) this.execute(stmt);
    }
  }

  execAssignment(node) {
    if (!(node.name in this.env)) {
      throw new Error(`Cannot assign to undeclared variable: '${node.name}'`);
    }
    this.env[node.name] = this.evaluate(node.value);
  }

  execIndexAssignment(node) {
    const arr = this.env[node.object];
    if (!Array.isArray(arr)) {
      throw new Error(`'${node.object}' is not a list`);
    }
    const index = this.evaluate(node.index);
    const value = this.evaluate(node.value);
    arr[index] = value;
  }

  execFunctionDeclaration(node) {
    this.functions[node.name] = node;
  }

  execReturnStatement(node) {
    const value = node.value !== null ? this.evaluate(node.value) : null;
    throw new ReturnValue(value);
  }

  execAskStatement(node) {
    process.stdout.write(node.prompt);
    const buf = Buffer.alloc(1024);
    const n = fs.readSync(0, buf, 0, 1024, null);
    const input = buf.toString('utf8', 0, n).trim();
    this.env[node.variable] = input;
  }

  execCallExpression(node) {
    const fn = this.functions[node.callee];
    if (!fn) throw new Error(`Undefined function: '${node.callee}'`);

    if (node.args.length !== fn.params.length) {
      throw new Error(
        `Function '${node.callee}' expects ${fn.params.length} argument(s), got ${node.args.length}`
      );
    }

    const argValues = node.args.map(arg => this.evaluate(arg));

    const prevEnv = this.env;
    const localEnv = Object.create(this.globals);
    for (let i = 0; i < fn.params.length; i++) {
      localEnv[fn.params[i]] = argValues[i];
    }
    this.env = localEnv;

    let returnValue = null;
    try {
      for (const stmt of fn.body) {
        this.execute(stmt);
      }
    } catch (e) {
      if (e instanceof ReturnValue) {
        returnValue = e.value;
      } else {
        throw e;
      }
    } finally {
      this.env = prevEnv;
    }

    return returnValue;
  }

  evaluate(node) {
    switch (node.type) {
      case 'NumberLiteral':
        return node.value;

      case 'StringLiteral':
        return node.value;

      case 'Identifier': {
        if (!(node.name in this.env)) {
          throw new Error(`Undefined variable: '${node.name}'`);
        }
        return this.env[node.name];
      }

      case 'BinaryExpression':
        return this.evalBinary(node);

      case 'LogicalExpression':
        return this.evalLogical(node);

      case 'UnaryExpression':
        return this.evalUnary(node);

      case 'CallExpression':
        return this.execCallExpression(node);

      case 'ArrayLiteral':
        return node.elements.map(el => this.evaluate(el));

      case 'MemberExpression': {
        const arr = this.env[node.object];
        if (!Array.isArray(arr)) {
          throw new Error(`'${node.object}' is not a list`);
        }
        const index = this.evaluate(node.index);
        return arr[index];
      }

      case 'PropertyAccess': {
        const obj = this.env[node.object];
        if (obj === undefined || obj === null) {
          throw new Error(`Undefined variable: '${node.object}'`);
        }
        if (node.property === 'length') {
          if (typeof obj.length === 'number') return obj.length;
          throw new Error(`'${node.object}' has no length property`);
        }
        throw new Error(`Unknown property '${node.property}' on '${node.object}'`);
      }

      default:
        throw new Error(`Unknown expression node: '${node.type}'`);
    }
  }

  evalBinary(node) {
    const left  = this.evaluate(node.left);
    const right = this.evaluate(node.right);

    switch (node.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/':
        if (right === 0) throw new Error('Runtime error: division by zero');
        return left / right;
      case '%':  return left % right;
      case '>':  return left > right;
      case '<':  return left < right;
      case '==': return left === right;
      default:
        throw new Error(`Unknown operator: '${node.operator}'`);
    }
  }

  evalLogical(node) {
    const left = this.evaluate(node.left);
    if (node.operator === 'and') return left && this.evaluate(node.right);
    if (node.operator === 'or')  return left || this.evaluate(node.right);
    throw new Error(`Unknown logical operator: '${node.operator}'`);
  }

  evalUnary(node) {
    if (node.operator === 'not') return !this.evaluate(node.operand);
    throw new Error(`Unknown unary operator: '${node.operator}'`);
  }
}

module.exports = { Interpreter };
