import { CanteenEditData, CanteenTree, BaseCanteenAdd, BaseCanteenDel, BaseCanteenEdit, OrganizationalCanteenList } from "@/types/canteen";
import { get, post } from "./axios";

/**
 * 
 * 获取区域明细
 * @param v
 */
export function getCanteenTree(): Promise<CanteenTree> {
    return get("/api/platform/api/public/canteen/tree")
}

/**
 * 
 * 获取区域明细
 * @param v
 */
export function getOrganizationalCanteenList(v: OrganizationalCanteenList) {
    return get("/api/platform/api/device/base/canteen/list", v)
}

/**
 * 添加区域明细
 * @param v
 */
export function getBaseCanteenAdd(v: BaseCanteenAdd) {
    return post("/api/platform/api/device/base/canteen/add", v)
}

/**
 * 修改区域明细
 * @param v
 */
export function getBaseCanteenEdit(v: BaseCanteenEdit): Promise<CanteenEditData> {
    return post("/api/platform/api/device/base/canteen/edit", v)
}

/**
 * 删除区域明细
 * @param v
 */
export function getBaseCanteenDel(v: BaseCanteenDel) {
    return post("/api/platform/api/device/base/canteen/del", v)
}