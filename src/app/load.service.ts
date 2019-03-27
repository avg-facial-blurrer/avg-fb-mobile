import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadService {
    constructor(private loadingController: LoadingController) {}
    
    public async load(message?: string): Promise<void> {
        var settings;
        message != null && message != "" ? settings = {message: message, spinner: "circles"} : settings = {spinner: "circles"};

        const loader = await this.loadingController.create(settings);
        return await loader.present();
    }

    public async dismiss(): Promise<void> {
        this.loadingController.dismiss();
    }
}