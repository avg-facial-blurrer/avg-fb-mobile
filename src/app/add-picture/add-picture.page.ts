import { WebView } from '@ionic-native/ionic-webview/ngx';
import { GalleryService } from './../gallery.service';
import { MessageService } from '../message.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Component } from '@angular/core';
import { UploadService } from '../upload.service';
import { Base64 } from '@ionic-native/base64/ngx';
import { RecognizeresponseDTO } from '../dto/RecognizeresponseDTO';
import { RecognizerequestDTO } from '../dto/RecognizerequestDTO';

@Component({
    selector: 'app-add-picture',
    templateUrl: './add-picture.page.html',
    styleUrls: ['./add-picture.page.scss'],
})

export class AddPicturePage {
    public receivedPicture: any;
    public picture: string;
    public picturewebPath: string;

    constructor(private camera: Camera, private galleryService: GalleryService, private messageService: MessageService,
        private webView: WebView, private _uploadService: UploadService, private base64: Base64) { }

    public getCameraOptions(upload?: boolean): CameraOptions {
        const cameraOptions: CameraOptions = {
            quality: 100,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            targetWidth: 2048,
            targetHeight: 1152
        };
        upload
            ? cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
            : cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
        return cameraOptions;
    }

    public takePicture(upload?: boolean): void {
        const cameraOptions = this.getCameraOptions(upload);
        this.camera.getPicture(cameraOptions).then(imagePath => {
            this.picture = imagePath;
            if (cameraOptions.sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.processImage(false, true);
            } else {
                this.picturewebPath = this.webView.convertFileSrc(imagePath);
            }
        });
    }

    public talkBack(e: string): void {
        this.receivedPicture = undefined;
        this.picture = undefined;
        this.picturewebPath = undefined;
    }

    public async processImage(save?: boolean, upload?: boolean): Promise<any> {
        if (save) {
            this.galleryService.storeImage(this.picture);
        }

        if (upload) {
            let imgTosend;
            const toappend = 'data:image/jpeg;base64,';
            await this.base64.encodeFile(this.picture).then((base64File: string) =>
                imgTosend = toappend.concat(base64File.slice(base64File.indexOf(',') + 1)));
            this._uploadService.uploadPictureforRecognition(imgTosend).then((observable) => {
                observable.subscribe(
                    (dto: RecognizeresponseDTO) =>
                        console.log(dto.listOfFaces)
                    , (err) =>
                        console.log(err));
            });
        }
        this.picture = undefined;
        this.picturewebPath = undefined;
    }
}
