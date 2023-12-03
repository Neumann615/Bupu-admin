import { get,post } from "./axios";
import {OrganizationalDepartList} from '@/types/index'
/**
 * 
 * 获取区域明细
 * @param v
 */
export function getPartTree() {
    return get("/api/platform/api/public/depart/tree")
}

/**
 * 
 * 获取区域明细
 * @param v
 */
export function getOrganizationalDepartList(v:OrganizationalDepartList) {
    return get("/api/platform/api/human/organizational/depart/list", v)
}

/**
 * 添加区域明细
 * @param v
 */
export function getBaseAreaAdd(v) {
    return post("/api/platform/api/device/base/area/add", v)
}

/**
 * 修改区域明细
 * @param v
 */
export function getBaseAreaEdit(v) {
    return post("/api/platform/api/device/base/area/edit", v)
}

/**
 * 删除区域明细
 * @param v
 */
export function getBaseAreaDel(v) {
    return post("/api/platform/api/device/base/area/del", v)
}