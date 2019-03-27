export class Image {
    public readonly name: string
    public readonly path: string
    public readonly filePath : string

    constructor(name: string, path: string, filePath: string) {
        this.name = name;
        this.path = path;
        this.filePath = filePath;
    }
}