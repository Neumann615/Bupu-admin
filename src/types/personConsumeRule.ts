export interface PersonConsumeRuleList extends BaseResponse {
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
export interface PersonConsumeRuleListParams { }
export interface PersonConsumeRuleAddParams { }
export interface PersonConsumeRuleAdd extends BaseResponse {
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
export interface PersonConsumeRuleEditParams { }
export interface PersonConsumeRuleEdit extends BaseResponse {
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
export interface PersonConsumeRuleDelParams { }
export interface PersonConsumeRuleDel extends BaseResponse {
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
    resultCode: string;
}