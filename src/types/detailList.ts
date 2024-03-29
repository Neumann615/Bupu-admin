export interface RechargeRecordsParams { }
export interface RechargeRecords extends BaseRequest {
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
export interface BaseRequest {
    status: Number;
}
export interface PayRecordsListParams { }
export interface PayRecordsList extends BaseRequest { }
export interface PersonaTradeListParams { }
export interface PersonaTradeList extends BaseRequest { }
export interface CostRecordsListParams { }
export interface CostRecordsList extends BaseRequest { }