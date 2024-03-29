import { CorrectionList, CorrectionListParams, RechargeList, RechargeListParams, RefundList, RefundListParams } from "@/types/consumeDetail";
import { get, post } from "./axios";
/**
 * 
 * 获取今日充值明细
 * @param v
 */
export function getRechargeList(data: RechargeListParams): Promise<RechargeList> {
    return get("/api/platform/api/work/recharge/recharge/list", data)
}

/**
 * 
 * 获取今日取款明细
 * @param v
 */
export function getRefundList(data: RechargeListParams): Promise<RefundList> {
    return get("/api/platform/api/work/recharge/refund/list", data)
}

/**
 * 
 * 获取今日更正明细
 * @param v
 */
export function getCorrectionList(data: RechargeListParams): Promise<CorrectionList> {
    return get("/api/platform/api/work/recharge/correction/list", data)
}
