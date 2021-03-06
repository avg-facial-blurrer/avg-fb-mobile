import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePageRoutingModule } from './home.router.module';

import { HomePage } from './home.page';

import { GalleryPageModule } from './../gallery/gallery.module';
import { AddPicturePageModule } from '../add-picture/add-picture.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    AddPicturePageModule,
    GalleryPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
