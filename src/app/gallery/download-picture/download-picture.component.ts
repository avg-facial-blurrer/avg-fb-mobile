import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { MessageService } from '../../message.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-download-picture',
  templateUrl: './download-picture.component.html',
  styleUrls: ['./download-picture.component.scss'],
})
export class DownloadPictureComponent {

   @Input() picture: string;
   @Output() talk: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private base64togallery: Base64ToGallery, private messageService: MessageService, private domSanitizer: DomSanitizer) { }

  getPictureToDisplay() {
    // console.log(this.picture);
    // const pictureInfo  = 'data:Image/*;base64,';
    // const pictureToDisplay = pictureInfo.concat(this.picture);
    this.domSanitizer.bypassSecurityTrustResourceUrl(this.picture);
    console.log(this.picture);
    return this.picture;
  }

   saveImage() {
    console.log(this.picture);
    this.messageService.presentToast('Wordt opgeslagen, even geduld');
    this.base64togallery.base64ToGallery(this.picture.slice(this.picture.indexOf(',')+ 1)).then(() => {this.messageService.presentToast('Opgeslagen in device gallerij'); },
        (err) => {
      this.messageService.presentToast('Opslaan niet gelukt'); console.log(err); }
    );
    this.picture = undefined;
    this.talkBack();
  }

  public deleteImage(): void {
    this.picture = undefined;
    this.talkBack();
  }

  public talkBack(): void {
    this.talk.emit(true);
  }
}