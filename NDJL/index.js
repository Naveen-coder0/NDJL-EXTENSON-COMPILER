'use strict';

const fs   = require('fs');
const path = require('path');

const { tokenize }    = require('./tokenizer');
const { Parser }      = require('./parser');
const { Interpreter } = require('./interpreter');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: ndjl run <file.ndjl>');
  process.exit(1);
}

// Support both "ndjl run file.ndjl" and "ndjl file.ndjl"
let targetFile;
if (args[0] === 'run') {
  if (args.length < 2) {
    console.error('Usage: ndjl run <file.ndjl>');
    process.exit(1);
  }
  targetFile = args[1];
} else {
  targetFile = args[0];
}

const filePath = path.resolve(targetFile);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const source = fs.readFileSync(filePath, 'utf-8');

try {
  const tokens      = tokenize(source);
  const parser      = new Parser(tokens);
  const ast         = parser.parse();
  const interpreter = new Interpreter();
  interpreter.interpret(ast);
} catch (err) {
  console.error(`[NDJL Error] ${err.message}`);
  process.exit(1);
}
