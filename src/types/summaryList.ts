export interface RechargeSummaryDay extends BaseResponse { }


export interface BaseResponse {
    status: number;
    data: {
        resultCode: string;
        data: {
            pageNum: number;
            pageSize: number;
            pageCount: number;
            total: number;
            list: Record<string, any>[]
        }
    }
}

export interface RechargeSummaryDayParams { }
export interface PayRecordsDay extends BaseResponse { }
export interface PayRecordsDayParams { }
export interface RechargeSummaryMonthParams { }
export interface RechargeSummaryMonth extends BaseResponse { }
export interface PayRecordsMonth extends BaseResponse { }
export interface PayRecordsMonthParams { }
export interface PersonRecharge extends BaseResponse { }
export interface PersonRechargeParams { }
export interface PersonPeriodListParams { }
export interface PersonPeriodList extends BaseResponse { }
export interface CanteenPeriodParams { }
export interface CanteenPeriod extends BaseResponse { }