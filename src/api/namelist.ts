import { NameListParams, NameList, NameListAddAddParams, NameListAdd, NameListDelParams, NameListDel } from "@/types/nameList";
import { get, post } from "./axios";
/**
 * 
 * 获取名单明细
 * @param v
 */
export function getNameList(v: NameListParams): Promise<NameList> {
    return get("/api/platform/api/work/namelist/namelist/list", v)
}

/**
 * 增加名单
 * @param v
 */
export function getNameListAdd(v: NameListAddAddParams): Promise<NameListAdd> {
    return post("/api/platform/api/work/namelist/namelist/add", v)
}

/**
 * 删除名单
 * @param v
 */
export function getNameListDel(v: NameListDelParams): Promise<NameListDel> {
    return post("/api/platform/api/work/namelist/namelist/del", v)
}