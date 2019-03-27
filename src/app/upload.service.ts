import { Injectable } from '@angular/core';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { LoadingController } from '@ionic/angular';
import { Base64 } from '@ionic-native/base64/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { RecognizerequestDTO } from './dto/RecognizerequestDTO';
import { Face } from './Classes/Face';
import { BlurFacesRequestDTO, ListOfFacesDTO } from './dto/BlurFacesRequestDTO';
import { Observable } from 'rxjs/index';
import { HTTP } from '@ionic-native/http/ngx';
import { RecognizeresponseDTO } from './dto/RecognizeresponseDTO';

const STORAGE_KEY = 'my_images';
const SERVER_BASE: string = "http://ec2-54-173-110-22.compute-1.amazonaws.com:8080/blackpool-backend/faceRecognition";

const httpoptions = {
    headers: new HttpHeaders({
        'Content-type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})

export class UploadService {

    listOfFaces: Face[];

    constructor(private file: File, private loadingController: LoadingController, private base64: Base64,
        private http: HttpClient, private messageService: MessageService, /*private requestService: RequestService*/
        private ionicHttp: HTTP) {
    }
    private prepared64String: string;

    // Starts the upload from the gallery, converting the local filepath used in the gallery to a b64 so
    // it can be used in our upload process
    startUpload(imgEntry) {
        this.getBase64(imgEntry);
        // this.uploadPictureforRecognition(this.prepared64String).subscribe();
        const listOffaces: Face[] = null;
        const face = new Face(40, 40, 40, 40, true, null);
        listOffaces.push(face);
        return this.uploadPictureforBlurring(imgEntry, listOffaces);
    }

    public async getBase64(file): Promise<string> {
        return await this.base64.encodeFile(file);
        /*this.base64.encodeFile(file).then((base64File: string) => {
            console.log('base: ', base64File);
            this.prepared64String = base64File.slice(base64File.indexOf(',') + 1);
            console.log('prepared: ', this.prepared64String);
            console.log('Length of String: ', this.prepared64String.length);
        }, (err) => {
            console.log(err);
        });*/
    }

    public getBlob(b64Data): Blob {
        const contentType = 'image/jpeg';
        const sliceSize = 512;

        b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    public async uploadPictureforRecognition(img: any): Promise<Observable<RecognizeresponseDTO>> {
        const request = new RecognizerequestDTO(img);
        console.log(request);
        this.ionicHttp.setDataSerializer('json');
        // return this.ionicHttp.post(URL, request, {'Content-type': 'application/json'});
        return await this.http.post<RecognizeresponseDTO>(SERVER_BASE + '/recognize', request, httpoptions);
    }

    public async uploadPictureforBlurring(img: any, listOfFaces: Face[]): Promise<Observable<RecognizerequestDTO>> {
        console.log(img);
        // this.getBase64(img.filePath);
        const blur = new BlurFacesRequestDTO(img, new ListOfFacesDTO(listOfFaces));
        console.log(blur);
        this.ionicHttp.setDataSerializer('json');
        return await this.http.post<RecognizerequestDTO>(SERVER_BASE + '/edit', blur, httpoptions);
    }
}