import {Face} from '../Classes/Face';

export class ListOfFacesDTO {
    listOfFaces: Face[];

    constructor(faces: Face[]) {
        this.listOfFaces = faces;
    }
}

export class BlurFacesRequestDTO {
    img: string;
    listOfFaces: ListOfFacesDTO;

    constructor(img: string, listOfFaces: ListOfFacesDTO) {
        this.img = img;
        this.listOfFaces = listOfFaces;
    }
}
