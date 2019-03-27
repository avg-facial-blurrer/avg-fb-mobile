import { MessageService } from './message.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Image } from './Classes/Image';
import { Subject, Observable } from 'rxjs';

const STORAGE_KEY = 'my_images';

@Injectable({
    providedIn: 'root'
})

export class GalleryService {
    private images = new Subject<Image[]>();
    public images$: Observable<Image[]> = this.images;

    constructor(private storage: Storage, private file: File, private webview: WebView, private messageService: MessageService) { }

    public loadImages(): void {
        let images: Image[] = this.loadStoredImages();
        this.images.next(images);
    }

    public async deleteImage(imgEntry: any): Promise<any> {
        await this.storage.get(STORAGE_KEY).then(images => {
            const arr = JSON.parse(images);
            const filtered = arr.filter(name => name !== imgEntry.name);
            this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

            const correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

            this.file.removeFile(correctPath, imgEntry.name);
        });
    }

    public storeImage(imagePath: any): void {
        const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }

    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(() => {
            this.updateStoredImages(newFileName).then(() => {
                this.loadImages();
                this.messageService.presentToast('Foto toegevoegd');
            });
        }, () => { 
            this.messageService.presentToast('Er is iets misgegaan tijdens het toevoegen van de foto');    
        });
    }

    public pathForImage(img: string): string {
        if (img === null) {
            return '';
        } else {
            const converted = this.webview.convertFileSrc(img);
            return converted;
        }
    }

    public createFileName(): string {
        const d = new Date(),
            n = d.getTime(),
            newFileName = n + '.jpg';
        return newFileName;
    }

    public async updateStoredImages(name): Promise<any> {
        await this.storage.get(STORAGE_KEY).then(images => {
            const arr = JSON.parse(images);
            if (!arr) {
                const newImages = [name];
                this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
            } else {
                arr.push(name);
                this.storage.set(STORAGE_KEY, JSON.stringify(arr));
            }
        });
    }

    private loadStoredImages(): Image[] {
        let storedImages: Image[] = [];
        this.storage
            .get(STORAGE_KEY)
            .then(images => {
                if (images) {
                    const arr = JSON.parse(images);
                    for (const img of arr) {
                        const filePath = this.file.dataDirectory + img;
                        const resPath = this.pathForImage(filePath);
                        storedImages.push(new Image(img, resPath, filePath));
                    }
                }
            });
        return storedImages;
    }
}