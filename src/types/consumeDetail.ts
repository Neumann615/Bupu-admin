export interface RechargeListParams {
    pageNum?: number;
    pageSize?: number;
    departId?: number;
    beginTime?: string;
    endTime?: string;
    personId?: string;
    personName?: string;
    tradeNo?: string;
    tradeType?: string;
}
export interface RechargeList extends BaseResponse {
    data: {
        data: {
            pageNum: number;
            pageSize: number;
            pageCount: number;
            total: number;
            list: Record<string, any>[]
        }
    }
}

export interface RefundListParams {

}

export interface RefundList extends BaseResponse {
    data: {
        data: {
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

export interface CorrectionListParams {

}

export interface CorrectionList extends BaseResponse {
    data: {
        data: {
            pageNum: number;
            pageSize: number;
            pageCount: number;
            total: number;
            list: Record<string, any>[]
        }
    }
}