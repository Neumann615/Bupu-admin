export interface NameListParams {
    pageNum?: number;
    pageSize?: number;
    personName?: string;
    personId?: number;
    departId?: number;
    cardId?: number;
    timeType?: number;
    beginTime?: string;
    endTime?: string;
    devSerial?: string;
    devId?: string;
}
export interface NameList extends BaseResponse{
    data: {
        data:{
            pageNum: number;
            pageSize: number;
            pageCount: number;
            total: number;
            list: Record<string, any>[]
        }
    }
}

export interface BaseResponse {
    status: number;
    resultCode:string;
}

export interface NameListAddAddParams {
    accountId: string[];
    devSerial: string[];
}
export interface NameListAdd {

}
export interface NameListDelParams {
    accountId: string[];
    devSerial: string[];
}
export interface NameListDel {

}