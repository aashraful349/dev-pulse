export interface IUser{
    name:string;
    email:string;
    password:string;
    role?:string;
}

export interface loginCredential{
    email:string;
    password:string;
}

export const userRole={
    contributor:"contributor",
    maintainer:"maintainer"
} as const;

export type ROLES="contributor"|"maintainer";

export interface IIssue{
    title:string;
    description:string;
    type:"bug"|"feature_request";
}