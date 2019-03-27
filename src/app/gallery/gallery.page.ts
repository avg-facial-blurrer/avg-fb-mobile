import { GalleryService } from './../gallery.service';
import { LoadService } from './../load.service';
import { Component, OnInit } from '@angular/core';
import { Image } from '../Classes/Image';
import { UploadService } from './../upload.service';
import { Base64 } from '@ionic-native/base64/ngx';
import { RecognizeresponseDTO } from '../dto/RecognizeresponseDTO';
import { RecognizerequestDTO } from '../dto/RecognizerequestDTO';
import {Face} from '../Classes/Face';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  images: Image[] = [];
  selectedImage: any = null;
  receivedImage: any = null;
  listOfFaces: any;
  detectedImage: string;
  faceArray: Face[] = [];

  constructor(private _galleryService: GalleryService, private _loadService: LoadService, private _uploadService: UploadService, private base64: Base64) { }

  ngOnInit(): void {
    this._galleryService.images$.subscribe((images) => {
      this._loadService.load('Loading images...').then(() => {
        this.images = images;
        this._loadService.dismiss();
      });
    });
    this._galleryService.loadImages();
  }

  public deleteImage(img: string): void {
    this._galleryService.deleteImage(img).then(() => {
      this._galleryService.loadImages();
    });
  }

  public async startUploadDetection(img): Promise<any> {
    console.log(this.listOfFaces);
    let imgTosend;
    const toappend = 'data:image/jpeg;base64,';

    await this.base64.encodeFile(img.filePath).then((base64File: string) =>
      imgTosend = toappend.concat(base64File.slice(base64File.indexOf(',') + 1)));
    this._loadService.load('Detecting Faces ...').then(() => {
      console.log(imgTosend);
      // this.uploadService.startUpload(img.filePath).subscribe(imgreturned => this.receivedImage = imgreturned, err => console.log(err));
      this._uploadService.uploadPictureforRecognition(imgTosend).then((observable) => {
        observable.subscribe((dto: RecognizeresponseDTO) => {
          this.listOfFaces = dto.listOfFaces;
          this.faceArray = dto.listOfFaces;
          console.log(dto.listOfFaces);
          this.detectedImage = imgTosend;
          this._loadService.dismiss();
        }, err => console.log(err));
      });
    });
  }

  public async startUploadBlur(imgToSend): Promise<any> {
    // console.log(this.listOfFaces);
    // let imgTosend;
    // const toappend = 'data:image/jpeg;base64,';

    // await this.base64.encodeFile(img.filePath).then((base64File: string) =>
    //     imgTosend = toappend.concat(base64File.slice(base64File.indexOf(',') + 1)));
    this._loadService.load('Blurring Faces ...').then(() => {
      this._uploadService.uploadPictureforBlurring(imgToSend, this.listOfFaces).then((observable) => {
        observable.subscribe((Rimage: RecognizerequestDTO) => {
          this.receivedImage = Rimage.img;
          this.detectedImage = undefined;
          this.listOfFaces = undefined;
          this._loadService.dismiss();
        }, err => console.log(err));
      });
    });
  }

  public talkBack(download: boolean): void {
    if (download) {
      this.receivedImage = undefined;
    } else {
      this.startUploadBlur(this.detectedImage);
    }
  }

    public talkBackSend(editorListOfFaces: any): void {
            this.listOfFaces = editorListOfFaces;
            this.startUploadBlur(this.detectedImage);
    }
}
