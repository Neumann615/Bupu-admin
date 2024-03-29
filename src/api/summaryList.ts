import {
    RechargeSummaryDay,
    RechargeSummaryDayParams,
    PayRecordsDay,
    PayRecordsDayParams,
    RechargeSummaryMonthParams,
    RechargeSummaryMonth,
    PayRecordsMonth,
    PayRecordsMonthParams,
    PersonRecharge,
    PersonRechargeParams,
    PersonPeriodListParams,
    PersonPeriodList,
    CanteenPeriodParams,
    CanteenPeriod
} from "@/types/summaryList";
import { get, post } from "./axios";
/**
 * 
 * 充值汇总
 * @param v
 */
export function getRechargeSummaryDayList(v: RechargeSummaryDayParams): Promise<RechargeSummaryDay> {
    return get("/api/platform/api/consume/summary/rechargesummaryday/list", v)
}

/**
 * 消费汇总
 * @param v
 */
export function getPayRecordsDayList(v: PayRecordsDayParams): Promise<PayRecordsDay> {
    return get("/api/platform/api/consume/summary/payrecordsday/list", v)
}

/**
 * 每月充值汇总
 * @param v
 */
export function getRechargeSummaryMonthList(v: RechargeSummaryMonthParams): Promise<RechargeSummaryMonth> {
    return get("/api/platform/api/consume/summary/rechargesummarymonth/list", v)
}

/**
 * 每月消费汇总
 * @param v
 */
export function getPayRecordsMonthList(v: PayRecordsMonthParams): Promise<PayRecordsMonth> {
    return get("/api/platform/api/consume/summary/payrecordsmonth/list", v)
}

/**
 * 个人充值汇总
 * @param v
 */
export function getPersonRechargeList(v: PersonRechargeParams): Promise<PersonRecharge> {
    return get("/api/platform/api/consume/summary/personrecharge/list", v)
}

/**
 * 个人分餐汇总
 * @param v
 */
export function getPersonPeriodList(v: PersonPeriodListParams): Promise<PersonPeriodList> {
    return get("/api/platform/api/consume/summary/personperiod/list", v)
}

/**
 * 餐厅分餐汇总
 * @param v
 */
export function getCanteenPeriodList(v: CanteenPeriodParams): Promise<CanteenPeriod> {
    return get("/api/platform/api/consume/summary/canteenperiod/list", v)
}