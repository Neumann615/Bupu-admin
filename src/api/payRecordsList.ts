import {
    ConsumeRuleParams,
    ConsumeRule,
    ConsumeRuleAdd,
    ConsumeRuleAddParams,
    ConsumeRuleEditParams,
    ConsumeRuleEdit,
    ConsumeRuleDelParams,
    ConsumeRuleDel
} from "@/types/payRecordsList";
import { get, post } from "./axios";
/**
 * 
 * 获取消费规则明细
 * @param v
 */
export function getConsumeRuleList(v: ConsumeRuleParams): Promise<ConsumeRule> {
    return get("/api/platform/api/consume/base/consumerule/list", v)
}

/**
 * 增加消费规则
 * @param v
 */
export function getConsumeRuleAdd(v: ConsumeRuleAddParams): Promise<ConsumeRuleAdd> {
    return post("/api/platform/api/consume/base/consumerule/add", v)
}

/**
 * 修改消费规则
 * @param v
 */
export function getConsumeRuleEdit(v: ConsumeRuleEditParams): Promise<ConsumeRuleEdit> {
    return post("/api/platform/api/consume/base/consumerule/edit", v)
}

/**
 * 删除消费规则
 * @param v
 */
export function getNameListDel(v: ConsumeRuleDelParams): Promise<ConsumeRuleDel> {
    return post("/api/platform/api/consume/base/consumerule/del", v)
}