import {Face} from '../Classes/Face';

export class RecognizeresponseDTO {
    private _listOfFaces: Face [];

    constructor(listOfFaces: Face[]) {
        this._listOfFaces = listOfFaces;
    }


    get listOfFaces(): Face[] {
        return this._listOfFaces;
    }

    set listOfFaces(value: Face[]) {
        this._listOfFaces = value;
    }
}
