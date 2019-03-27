import {EditorMode} from './EditorMode';
import {EditorPage} from '../gallery/editor/editor.page';

export class BlurBlock {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    public HTMLElement: HTMLElement;

    private _solid;
    public blur = true;

    constructor(x: number, y: number, height: number, width: number, solid: boolean, private editorPage: EditorPage) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this._solid = solid;
        this.initialize();
    }

    private initialize() {
        this.HTMLElement = document.createElement('div');
        this.HTMLElement.style.left = this.x + 'px';
        this.HTMLElement.style.top = this.y + 'px';
        this.HTMLElement.style.width = this.width + 'px';
        this.HTMLElement.style.height = this.height + 'px';

        this.HTMLElement.classList.add('BlurBlock');

        this.deleteBlock();
        this.toggleColor();
    }

    public getHTMLElement(): HTMLElement {
        return this.HTMLElement;
    }

    public deleteBlock() {
        const self = this;
        this.HTMLElement.addEventListener('click', (ev: MouseEvent) => {
            if (this.editorPage.editorMode === EditorMode.Delete) {
                this.editorPage.blurBlocks.forEach(function(item, index, object) {
                    console.log('item.getX(): ' + item.getX() + ' self.getX(): ' + self.getX());
                    console.log('item._solid' + item._solid);
                    if ((item.getX() === self.getX()) && (item.getY() === self.getY()) && item._solid === false) {
                        object.splice(index, 1);
                        self.getHTMLElement().remove();
                    }
                });
                console.log('blurBlocks.length = ' + this.editorPage.blurBlocks.length);
                this.editorPage.editorMode = EditorMode.Default;
            }
        });
    }

    public toggleColor() {
        this.HTMLElement.addEventListener('click', (ev: MouseEvent) => {
            if (this._solid && this.editorPage.editorMode === EditorMode.Default) {
                this.blur ? this.HTMLElement.style.borderColor = 'blue' : this.HTMLElement.style.borderColor = 'red';
                this.blur = !this.blur;
                console.log(this.blur);
            } else if (!this._solid && this.editorPage.editorMode === EditorMode.Default) {
                this.blur ? this.HTMLElement.style.borderColor = 'green' : this.HTMLElement.style.borderColor = 'red';
                this.blur = !this.blur;
            }
        });
    }

    public getX(): number {
        return this.x;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public getY(): number {
        return this.y;
    }

    public setY(y: number): void {
        this.y = y;
    }

    public getWidth(): number {
        return this.width;
    }

    public setWidth(width: number): void {
        this.width = width;
    }

    public getHeight(): number {
        return this.height;
    }

    public setHeight(height: number): void {
        this.height = height;
    }


    get solid(): boolean {
        return this._solid;
    }

    set solid(value: boolean) {
        this._solid = value;
    }
}
