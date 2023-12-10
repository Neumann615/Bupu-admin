export interface CanteenTree{
    status: number;
    statusText: string;
    data: {
        data: CanteenDataSource[];
        msgId: string;
        resultMsg: string;
        token: string;
    }
}


export interface CanteenDataSource {
    children: CanteenDataSource[]
    canteenName: string;
    id: number;
}

export interface OrganizationalCanteenList{
    canteenName:string;
    pageSize:number;
    pageNum:number;
}

export interface BaseCanteenAdd{
    pid: number;
    canteenName: string;
}

export interface BaseCanteenEdit{
    id: number;
    pid: string;
    canteenName: string;
}

export interface CanteenEditData extends T{
}

export interface BaseCanteenDel{
    id: number;
}

interface T {
    resultCode:string;
}