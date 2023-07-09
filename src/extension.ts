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

class RegExpCursorEraser {
  readonly editor: vscode.TextEditor;
  readonly caseSensitive: boolean;
  readonly keepMatch: boolean;

  constructor(editor: vscode.TextEditor, caseSensitive: boolean = true, keepMatch: boolean = true) {
    this.editor = editor;
    this.caseSensitive = caseSensitive;
    this.keepMatch = keepMatch;
  }

  private erase(pattern: string) {
    const opt = this.caseSensitive ? "" : "i";
    const reg = new RegExp(pattern, opt);
    const newSels = this.editor.selections.filter((sel) => {
      const line = this.editor.document.lineAt(sel.active).text;
      const isMatch = reg.test(line);
      if (this.keepMatch) {
        return isMatch;
      }
      return !isMatch;
    });
    if (newSels.length) {
      this.editor.selections = newSels;
    } else {
      vscode.window.showErrorMessage("cursor-eraser: no match line.");
    }
  }

  execute(pattern: string) {
    if (this.editor.selections.length < 2) {
      return;
    }
    if (pattern.length) {
      this.erase(pattern);
      return;
    }

    const eraseProcess = vscode.window
      .showInputBox({
        title: this.caseSensitive ? "cursor-eraser (case-sensitive)" : "cursor-eraser (ignore-case)",
        prompt: this.keepMatch ? "KEEP cursor by regexp (cursors on non-matched line will be erased)." : "ERASE cursor by regexp.",
      })
      .then((pattern: string | undefined) => {
        if (!pattern) {
          return;
        }
        this.erase(pattern);
      });
    Promise.resolve(eraseProcess).catch((reason) => {
      vscode.window.showErrorMessage("cursor-eraser: " + reason.message);
    });
  }
}

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
    vscode.commands.registerTextEditorCommand("cursor-eraser.keep-match", (editor: vscode.TextEditor, _edit: vscode.TextEditorEdit, pattern: string = "") => {
      const eraser = new RegExpCursorEraser(editor, caseSensitive, true);
      eraser.execute(pattern);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("cursor-eraser.erase-match", (editor: vscode.TextEditor, _edit: vscode.TextEditorEdit, pattern: string = "") => {
      const eraser = new RegExpCursorEraser(editor, caseSensitive, false);
      eraser.execute(pattern);
    })
  );
}

export function deactivate() {}
