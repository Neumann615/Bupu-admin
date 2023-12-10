export interface AreaTree{
    status: number;
    statusText: string;
    data: {
        data: AreaDataSource[];
        msgId: string;
        resultMsg: string;
        token: string;
    }
}

export interface AreaDataSource {
    children: AreaDataSource[]
    areaName: string;
    id: number;
}

export interface OrganizationalAreaList{
    areaName:string;
    pageSize:number;
    pageNum:number;
}

export interface BaseAreaAdd{
    pid: number;
    areaName: string;
}

export interface BaseAreaEdit{
    id: number;
    pid: string;
    areaName: string;
}

export interface AreaEditData extends T{
}

export interface BaseAreaDel{
    id: number;
}

interface T {
    resultCode:string;
}