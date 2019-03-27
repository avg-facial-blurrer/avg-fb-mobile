import {Permissions} from './Permissions';

export class Child {
ID: number;
firstName: string;
lastName: string;
permissions: Permissions;

constructor(ID: number, firstName: string, lastName: string, permissions: Permissions) {
this.ID = ID;
this.firstName = firstName;
this.lastName = lastName;
this.permissions = permissions;
}
}