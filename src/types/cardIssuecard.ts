export interface Issuecard extends BaseResponse {
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
}

export interface IssuecardAdd {

}

export interface Lostcard extends BaseResponse {
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

export interface LostcardAdd {

}
export interface Unhookcard extends BaseResponse {
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

export interface UnhookcardAdd {

}

export interface Reissuecard extends BaseResponse {
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

export interface ReissuecardAdd {

}

export interface Returncard extends BaseResponse {
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

export interface ReturncardAdd {

}