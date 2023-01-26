# cursor-eraser README

Erase unnecessary cursors! Useful when executed after <kbd>ctrl+shift+l</kbd>.

If you want to **unselect** the cursor without erasing, use [awtnb.filter-selections](https://marketplace.visualstudio.com/items?itemName=awtnb.filter-selections).

## Features

### Remove by regexp

+ `cursor-eraser.keep-match`: Cursors on lines that do not match the specified regular expression will be cleared.
+ `cursor-eraser.erase-match`: Cursors on lines that matches the specified regular expression will be cleared.

### Remove by position

+ `cursor-eraser.erase-toBegin`: Remove cursor to begin of file.
+ `cursor-eraser.erase-toEnd`: Remove cursor to end of file.

The starting point is the cursor position at the beginning of the multi-cursor mode.

### configuration

Case-sensitivity is configurable in `cursor-eraser.caseSensitive` of `setting.json`.

**Enjoy!**