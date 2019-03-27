
export class Permissions {
    socialMediaPermission: boolean;
    schoolPaperPermission: boolean;
    enclosedEnvironmentPermission: boolean;

    constructor (socialMediaPermission: boolean, schoolPaperPermission: boolean, enclosedEnvironmentPermission: boolean) {
        this.socialMediaPermission = socialMediaPermission;
        this.schoolPaperPermission = schoolPaperPermission;
        this.enclosedEnvironmentPermission = enclosedEnvironmentPermission;
    }
}