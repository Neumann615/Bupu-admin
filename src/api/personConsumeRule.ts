import {
    PersonConsumeRuleList,
    PersonConsumeRuleListParams,
    PersonConsumeRuleAddParams,
    PersonConsumeRuleAdd,
    PersonConsumeRuleEditParams,
    PersonConsumeRuleEdit,
    PersonConsumeRuleDelParams,
    PersonConsumeRuleDel
} from "@/types/personConsumeRule";
import { get, post } from "./axios";
/**
 * 
 * 获取人员消费规则明细
 * @param v
 */
export function getPersonConsumeRuleList(v: PersonConsumeRuleListParams): Promise<PersonConsumeRuleList> {
    return get("/api/platform/api/consume/base/personconsumerule/list", v)
}

/**
 * 分配人员消费规则
 * @param v
 */
export function getPersonConsumeRuleAdd(v: PersonConsumeRuleAddParams): Promise<PersonConsumeRuleAdd> {
    return post("/api/platform/api/consume/base/personconsumerule/add", v)
}

/**
 * 修改人员消费规则
 * @param v
 */
export function getPersonConsumeRuleEdit(v: PersonConsumeRuleEditParams): Promise<PersonConsumeRuleEdit> {
    return post("/api/platform/api/consume/base/personconsumerule/edit", v)
}

/**
 * 删除人员消费规则
 * @param v
 */
export function getPersonConsumeRuleDel(v: PersonConsumeRuleDelParams): Promise<PersonConsumeRuleDel> {
    return post("/api/platform/api/consume/base/personconsumerule/del", v)
}