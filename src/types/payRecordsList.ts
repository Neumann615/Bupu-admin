export interface ConsumeRuleParams {

}

export interface ConsumeRule extends BaseResponse {
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
    resultCode: string;
}

export interface ConsumeRuleAdd extends BaseResponse {

}
export interface ConsumeRuleAddParams {

}
export interface ConsumeRuleEditParams {

}
export interface ConsumeRuleEdit extends BaseResponse {

}
export interface ConsumeRuleDelParams {

}
export interface ConsumeRuleDel extends BaseResponse {

}