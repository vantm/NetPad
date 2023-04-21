import {DI, IContainer} from "aurelia";
import {ITextEditor} from "./text-editor";

export const ITextEditorService = DI.createInterface<ITextEditorService>();

export interface ITextEditorService {
    get active(): ITextEditor | undefined;
    create(host: HTMLElement): ITextEditor;
}

export class TextEditorService implements ITextEditorService {
    private _active?: ITextEditor;

    constructor(@IContainer private readonly container: IContainer) {
    }

    public get active(): ITextEditor | undefined {
        return this._active;
    }

    public create(host: HTMLElement): ITextEditor {
        const editor = this.container.get(ITextEditor);
        editor.bind(host);

        editor.addDisposable(
            editor.monaco.onDidFocusEditorText(() => {
                this._active = editor;
            })
        );

        editor.addDisposable(() => {
            if (this._active === editor) {
                this._active = undefined;
            }
        });

        return editor;
    }
}
