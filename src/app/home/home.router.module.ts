import { AddPicturePage } from './../add-picture/add-picture.page';
import { GalleryPage } from './../gallery/gallery.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from '../home/home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: '/home/(addPicture:addPicture)',
        pathMatch: 'full',
      },
      {
          path: 'addPicture',
          outlet: 'addPicture',
          component: AddPicturePage
      },
      {
        path: 'gallery',
        outlet: 'gallery',
        component: GalleryPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/(addPicture:addPicture)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
