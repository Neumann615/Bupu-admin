import {
    RechargeRecordsParams,
    RechargeRecords,
    PayRecordsListParams,
    PayRecordsList,
    PersonaTradeListParams,
    PersonaTradeList,
    CostRecordsListParams,
    CostRecordsList
} from "@/types/detailList";
import { get } from "./axios";


/**
 * 
 * 获取充值明细
 * @param v
 */
export function getRechargeRecords(v: RechargeRecordsParams): Promise<RechargeRecords> {
    return get("/api/platform/api/consume/detail/rechargerecords/list", v)
}

/**
 * 
 * 获取消费明细
 * @param v
 */
export function getPayRecordsList(v: PayRecordsListParams): Promise<PayRecordsList> {
    return get("/api/platform/api/consume/detail/payrecords/list", v)
}

/**
 * 
 * 获取交易流水明细
 * @param v
 */
export function getPersonaTradeList(v: PersonaTradeListParams): Promise<PersonaTradeList> {
    return get("/api/platform/api/consume/detail/personatrade/list", v)
}

/**
 * 
 * 获取费用明细
 * @param v
 */
export function getCostRecordsList(v: CostRecordsListParams): Promise<CostRecordsList> {
    return get("/api/platform/api/consume/detail/costrecords/list", v)
}
