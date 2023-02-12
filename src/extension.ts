import * as vscode from "vscode";

const eraseVertical = (editor: vscode.TextEditor, upward: boolean = true) => {
  if (editor.selections.length < 2) {
    return;
  }

  // index 0 of Selections seems to be the position just before starting multi-cursor-mode.
  const origin = editor.selections[0];

  const newSels = editor.selections.filter((sel) => {
    if (upward) {
      if (sel.end.line == origin.end.line) {
        return sel.end.character <= origin.end.character;
      }
      return sel.end.line < origin.end.line;
    }
    if (origin.start.line == sel.start.line) {
      return origin.start.character <= sel.start.character;
    }
    return origin.start.line < sel.start.line;
  });
  if (newSels.length) {
    editor.selections = newSels;
  }
};

const eraseByRegExp = (editor: vscode.TextEditor, caseSensitive: boolean = true, keepMatch: boolean = true) => {
  if (editor.selections.length < 2) {
    return;
  }
  const filterProcess = vscode.window
    .showInputBox({
      title: caseSensitive ? "cursor-eraser (case-sensitive)" : "cursor-eraser (ignore-case)",
      prompt: keepMatch ? "KEEP cursor by regexp (cursors on non-matched line will be erased)." : "ERASE cursor by regexp.",
    })
    .then((query: string | undefined) => {
      if (!query) {
        return;
      }
      const opt = caseSensitive ? "" : "i";
      const reg = new RegExp(query, opt);
      const newSels = editor.selections.filter((sel) => {
        const line = editor.document.lineAt(sel.active).text;
        const isMatch = reg.test(line);
        if (keepMatch) {
          return isMatch;
        }
        return !isMatch;
      });
      if (newSels.length) {
        editor.selections = newSels;
      } else {
        vscode.window.showErrorMessage("cursor-eraser: no match line.");
      }
    });
  Promise.resolve(filterProcess).catch((reason) => {
    vscode.window.showErrorMessage("cursor-eraser: " + reason.message);
  });
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("cursor-eraser.erase-toBegin", (editor: vscode.TextEditor) => {
      eraseVertical(editor, false);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("cursor-eraser.erase-toEnd", (editor: vscode.TextEditor) => {
      eraseVertical(editor, true);
    })
  );

  const config = vscode.workspace.getConfiguration("cursor-eraser");
  const caseSensitive: boolean = config.get("caseSensitive") || false;
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("cursor-eraser.keep-match", (editor: vscode.TextEditor) => {
      eraseByRegExp(editor, caseSensitive, true);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("cursor-eraser.erase-match", (editor: vscode.TextEditor) => {
      eraseByRegExp(editor, caseSensitive, false);
    })
  );
}

export function deactivate() {}
