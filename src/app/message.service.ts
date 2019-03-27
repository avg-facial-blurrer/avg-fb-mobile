import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private toastController: ToastController) { }

  public async presentToast(message: string, duration?: number): Promise<void> {
    let time = duration != null && duration != undefined ? duration : 2500;

    const toast = await this.toastController.create({
      message: message,
      position: 'middle',
      duration: time
    });
    toast.present();
  }
}