export interface IGlobalResponse<T= unknown> {
    status : boolean;
    message:string;
    data?: T;
    pagination?: IPagination;
    error?: IErrorDetail | IErrorDetail[];
}
export interface IPagination {
    total:number;
    current_page:number;
    total_page:number;
    per_page:number;
}

export interface IErrorDetail {
    message:string;
    field?: string;
}

export interface ILoginResponse {
    token:String;
    admin:{
        id:number;
        username:string;
        email:string;
        name:string;

    };
}