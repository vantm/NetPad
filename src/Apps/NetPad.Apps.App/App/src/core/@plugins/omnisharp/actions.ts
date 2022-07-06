import * as monaco from "monaco-editor";
import {CodeFormatRequest} from "@domain";
import {EditorUtil} from "@application";
import {OmniSharpPlugin} from "./plugin";
import {IOmniSharpService} from "./omnisharp-service";

export const codeFormatAction: monaco.editor.IActionDescriptor = {
    id: "netpad-omnisharp-code-format",
    label: "Format Code",
    keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI
    ],
    contextMenuGroupId: "1_modification",
    contextMenuOrder: 2,
    run: async (editor) => {
        const model = editor.getModel();
        const cursorPos = editor.getPosition();
        const editorValue = model.getValue();

        const request = new CodeFormatRequest(<any>{
            buffer: editorValue
        });

        const scriptId = EditorUtil.getScriptId(model);
        const omnisharpService = OmniSharpPlugin.container.get(IOmniSharpService);
        const response = await omnisharpService.formatCode(scriptId, request);

        if (response.buffer === editorValue) {
            return;
        }

        editor.setValue(response.buffer);
        editor.setPosition(cursorPos);
    }
}

export const restartOmniSharpServerAction: monaco.editor.IActionDescriptor = {
    id: "netpad-omnisharp-restart-server",
    label: "Developer: Restart OmniSharp Server",
    run: async (editor) => {
        const scriptId = EditorUtil.getScriptId(editor.getModel());

        const omnisharpService = OmniSharpPlugin.container.get(IOmniSharpService);
        await omnisharpService.restartServer(scriptId);
    }
}
