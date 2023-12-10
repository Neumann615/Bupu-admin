import { AreaEditData, AreaTree, BaseAreaAdd, BaseAreaDel, BaseAreaEdit, OrganizationalAreaList } from "@/types/area";
import { get, post } from "./axios";

/**
 * 
 * 获取区域明细
 * @param v
 */
export function getAreaTree(): Promise<AreaTree> {
    return get("/api/platform/api/public/area/tree")
}

/**
 * 
 * 获取区域明细
 * @param v
 */
export function getOrganizationalAreaList(v: OrganizationalAreaList) {
    return get("/api/platform/api/device/base/area/list", v)
}

/**
 * 添加区域明细
 * @param v
 */
export function getBaseAreaAdd(v: BaseAreaAdd) {
    return post("/api/platform/api/device/base/area/add", v)
}

/**
 * 修改区域明细
 * @param v
 */
export function getBaseAreaEdit(v: BaseAreaEdit):Promise<AreaEditData> {
    return post("/api/platform/api/device/base/area/edit", v)
}

/**
 * 删除区域明细
 * @param v
 */
export function getBaseAreaDel(v: BaseAreaDel) {
    return post("/api/platform/api/device/base/area/del", v)
}