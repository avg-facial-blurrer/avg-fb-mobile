import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import {MessageService} from '../../message.service';
import {BlurBlock} from '../../Classes/BlurBlock';
import {Face} from '../../Classes/Face';
import {DomSanitizer} from '@angular/platform-browser';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {Platform} from '@ionic/angular';
import {EditorMode} from '../../Classes/EditorMode';
import {FaceSize} from '../../Classes/FaceSize';
import {GalleryPage} from '../gallery.page';


const defaultDimensions = {width: 544, height: 1152};

@Component({
    selector: 'app-editor',
    templateUrl: './editor.page.html',
    styleUrls: ['./editor.page.scss'],
})

export class EditorPage implements OnInit {

    public blurBlocks: BlurBlock[] = [];
    private editor: HTMLElement;
    public editorMode: EditorMode = EditorMode.Default;
    public faceSize: FaceSize = FaceSize.Small;
    private nRecognizedFaces = 0;

    @Input() listOfFaces: any;
    @Input() picture: string;
    @Output() talk: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private _messageService: MessageService, private domSanitizer: DomSanitizer, private screenOrientation: ScreenOrientation,
                private platform: Platform, private galleryPage: GalleryPage) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    }

    ngOnInit() {
        this.editor = <HTMLElement>document.querySelector('#Editor');
        document.querySelector('#Send').addEventListener('click', (ev: MouseEvent) => {
            this.Send();
        });
        let n: any;
        n = window.setTimeout(() => {
            console.log('Started drawFaces()');
            Array.from(this.listOfFaces).forEach((face: Face) => {
                const newDimensions = this.mapDimensions(face);
                const block = new BlurBlock(newDimensions.x, newDimensions.y, newDimensions.height, newDimensions.width, true, this);
                console.log('blurBlocks array, containing detected faces');
                console.log(this.blurBlocks);
                this.blurBlocks.push(block);
                this.editor.appendChild(block.getHTMLElement());
                this.nRecognizedFaces++;
                console.log('Face drawn! nRecognizedFaces: ' + this.nRecognizedFaces);
            });
            console.log('All faces drawn, exitting...');
        }, 100);
    }

    public setEditorMode(mode: EditorMode): void {
        if (mode === this.editorMode) {
            this.editorMode = EditorMode.Default;
            this.toggleSelectedbtn(EditorMode.Default);
        } else {
            this.editorMode = mode;
            this.toggleSelectedbtn(mode);
        }
        console.log(this.editorMode);
    }

    private toggleSelectedbtn(mode: EditorMode): void {
        if (mode === EditorMode.Add) {
            (<HTMLElement>document.querySelector('#Add')).style.backgroundColor = 'blue';
            (<HTMLElement>document.querySelector('#Delete')).style.backgroundColor = 'transparent';
        } else if (mode === EditorMode.Delete) {
            (<HTMLElement>document.querySelector('#Delete')).style.backgroundColor = 'blue';
            (<HTMLElement>document.querySelector('#Add')).style.backgroundColor = 'transparent';
        } else if (mode === EditorMode.Default) {
            (<HTMLElement>document.querySelector('#Add')).style.backgroundColor = 'transparent';
            (<HTMLElement>document.querySelector('#Delete')).style.backgroundColor = 'transparent';
        }
    }

    public setFaceSize(size: FaceSize): void {
        this.faceSize = size;
    }

    private getFaceSize(): number {
        if (this.faceSize === 0) {
            return 50;
        } else if (this.faceSize === 1) {
            return 125;
        } else if (this.faceSize === 2) {
            return 250;
        }
    }

    private mapDimensions(face: Face): Face {
        const scaleX = ((<HTMLElement>document.querySelector('#Image')).clientWidth) / defaultDimensions.width;
        console.log(scaleX);
        const scaleY = ((<HTMLElement>document.querySelector('#Image')).clientHeight) / defaultDimensions.height;
        console.log(scaleY);
        return new Face(
            face.x * scaleX,
            face.y * scaleY,
            face.width * scaleX,
            face.height * scaleY,
            false,
            face.child
        );
    }

    private rescaleX(number: number) {
        const scale = 1 / (((<HTMLElement>document.querySelector('#Image')).clientWidth) / defaultDimensions.width);
        console.log('scale: ' + scale);
        return Math.round(number * scale);
    }

    private rescaleY (number: number) {
        const scale = 1 / (((<HTMLElement>document.querySelector('#Image')).clientHeight) / defaultDimensions.height);
        console.log('scale: ' + scale);
        return Math.round(number * scale);
    }

    public ImageClicks(event): void {
        if (this.editorMode === EditorMode.Add) {
            this.Add(event.clientX, event.clientY);
        }
        this.setEditorMode(EditorMode.Default);
    }

    private Add(x: number, y: number): void {
        const newBlock = new BlurBlock(x, y, this.getFaceSize(), this.getFaceSize(), false, this);
        this.addItemToDOM(newBlock.getHTMLElement());
        this.blurBlocks.push(newBlock);
    }

    public loadImage(): string {
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.picture);
        return this.picture;
    }

    private Send(): void {
        const editorListOfFaces = [];
        const faceArray = this.galleryPage.faceArray;
        for (let i = 0; i < this.galleryPage.faceArray.length; i++) {
            editorListOfFaces.push(new Face(Math.round(faceArray[i].x), Math.round(faceArray[i].y),
                Math.round(faceArray[i].width), Math.round(faceArray[i].height), this.blurBlocks[i].blur, null));
        }

        const self = this;
        this.blurBlocks.forEach(function (item, index) {
            console.log('Blurblokjes gezichten: ');
            if (index >= self.nRecognizedFaces) {
                const face =
                    new Face(self.rescaleX(item.getX()),
                        self.rescaleY(item.getY()),
                        self.rescaleX(item.getWidth()),
                        self.rescaleY(item.getHeight()),
                        item.blur,
                        null);
                editorListOfFaces.push(face);
            }
        });
        this.talkBack(editorListOfFaces);
    }

    private addItemToDOM(element: HTMLElement): void {
        if (this.editor !== undefined) {
            this.editor.appendChild(element);
        } else {
            this._messageService.presentToast('Er is iets fout gegaan tijdens het laden van de editor');
        }
    }

    public talkBack(editorListOfFaces: any): void {
        console.log(editorListOfFaces);
        this.talk.emit(editorListOfFaces);
    }
}
