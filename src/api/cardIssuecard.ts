import { get, post } from "./axios";
import { Issuecard,IssuecardAdd,LostcardAdd,Lostcard,Unhookcard, UnhookcardAdd, Reissuecard, ReissuecardAdd, Returncard } from '@/types/cardIssuecard'

/**
 * 
 * 发卡明细
 * @param v
 */
export function getIssuecard(params): Promise<Issuecard> {
    return get("/api/platform/api/work/card/issuecard/list",params)
}

/**
 * 
 * 发卡
 * @param v
 */
export function getIssuecardAdd(params): Promise<IssuecardAdd> {
    return post("/api/platform/api/work/card/issuecard/add",params)
}

/**
 * 
 * 挂失明细
 * @param v
 */
export function getLostcard(params): Promise<Lostcard> {
    return get("/api/platform/api/work/card/lostcard/list",params)
}

/**
 * 
 * 挂失
 * @param v
 */
export function getLostcardAdd(params): Promise<LostcardAdd> {
    return post("/api/platform/api/work/card/lostcard/add",params)
}
/**
 * 
 * 解挂明细
 * @param v
 */
export function getUnhookcard(params): Promise<Unhookcard> {
    return get("/api/platform/api/work/card/unhookcard/list",params)
}

/**
 * 
 * 解挂
 * @param v
 */
export function getUnhookcardAdd(params): Promise<UnhookcardAdd> {
    return post("/api/platform/api/work/card/unhookcard/add",params)
}

/**
 * 
 * 补卡明细
 * @param v
 */
export function getReissuecard(params): Promise<Reissuecard> {
    return get("/api/platform/api/work/card/reissuecard/list",params)
}

/**
 * 
 * 补卡
 * @param v
 */
export function getReissuecardAdd(params): Promise<ReissuecardAdd> {
    return post("/api/platform/api/work/card/reissuecard/add",params)
}

/**
 * 
 * 退卡明细
 * @param v
 */
export function getReturncard(params): Promise<Returncard> {
    return get("/api/platform/api/work/card/returncard/list",params)
}

/**
 * 
 * 退卡
 * @param v
 */
export function getReturncardAdd(params): Promise<Returncard> {
    return post("/api/platform/api/work/card/returncard/add",params)
}