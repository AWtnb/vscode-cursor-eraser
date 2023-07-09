# cursor-eraser README

Erase unnecessary cursors! Useful when executed after <kbd>ctrl+shift+l</kbd>.

If you want to **unselect** the cursor without erasing, use [awtnb.filter-selections](https://marketplace.visualstudio.com/items?itemName=awtnb.filter-selections).

## Features

### Remove by regular expression

+ `cursor-eraser.keep-match`: remove cursors on lines that do not match the specified regular expression.
+ `cursor-eraser.erase-match`: remove cursors on lines that matches the specified regular expression.

#### configuration

+ Case-sensitivity is configurable in `cursor-eraser.caseSensitive` of `setting.json` (default: `true`).
+ Each command can take an argument for the regular expression to be used. For example, if you append the following to `keybindings.json`, you can remove the cursor on a blank line by pressing `ctrl+alt+q`.

    ```
    {
        "key": "ctrl+alt+q",
        "command": "cursor-eraser.erase-match",
        "args": "^$",
        "when": "editorTextFocus"
    }
    ```

### Remove by position

+ `cursor-eraser.erase-toBegin`: remove cursor to begin of file.
+ `cursor-eraser.erase-toEnd`: remove cursor to end of file.

The starting point is the cursor position at the beginning of the multi-cursor mode.


**Enjoy!**