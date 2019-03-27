import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DownloadPictureComponent } from './gallery/download-picture/download-picture.component';
import { EditorPage } from './gallery/editor/editor.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [CommonModule, IonicModule],
    declarations: [DownloadPictureComponent, EditorPage],
    exports: [DownloadPictureComponent, EditorPage]
})
export class SharedModule { }
