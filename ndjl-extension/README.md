# NDJL Language Support

Full VS Code language support for **NDJL** (Natural Developer Journey Language).

## Features

- **Syntax Highlighting** — Keywords (purple), strings (green), numbers (orange), comments (gray), array brackets
- **Autocomplete** — Keyword completions with short triggers (`cr` → `create`, `sa` → `say`, `re` → `repeat`, `de` → `define`)
- **Code Snippets** — `if` block, `repeat` loop, `define` function, variable declarations, and more
- **File Association** — Automatic `.ndjl` file recognition
- **Run Command** — Right-click → *Run NDJL File* or use the command palette
- **Terminal Execution** — Runs via `ndjl run <file>`

## Keywords

`create` `number` `text` `list` `say` `if` `else` `end` `repeat` `times` `define` `return` `ask` `into` `and` `or` `not`

## Word Operators

`plus` `minus` `greater than` `less than` `equals`

## Snippets

| Prefix    | Description               |
|-----------|---------------------------|
| `if`      | If conditional block      |
| `ifelse`  | If-else block             |
| `repeat`  | Repeat loop               |
| `define`  | Function definition       |
| `crnum`   | Create number variable    |
| `crtxt`   | Create text variable      |
| `crlist`  | Create list variable      |
| `say`     | Print output              |
| `ask`     | Get user input            |

## Requirements

- The `ndjl` CLI must be available on your system PATH for the run command to work.

## Usage

1. Open any `.ndjl` file
2. Enjoy syntax highlighting and autocomplete
3. Right-click in the editor → **Run NDJL File**



<!-- ALL rights are reseve under NDJL -->
erer