import { get, post } from "./axios";
import { OrganizationalDepartList } from '@/types/index'

interface T {
    status: number;
    statusText: string;
}

interface PartTree {
    status: number;
    statusText: string;
    data: {
        data: PartDataSource[];
        msgId: string;
        resultMsg: string;
        token: string;
    }
}

export interface PartDataSource {
    children: PartDataSource[]
    departName: string;
    id: number;
}

export interface BaseDepartAdd {
    pid: number;
    departName: string;
}

export interface BaseDepartEdit {
    id: number;
    pid: string;
    departName: string;
}

export interface BaseDepartDel {
    id: number;
}

export interface DepartEditData extends T{
}

interface T {
    resultCode:string;
}
/**
 * 
 * 获取部门明细
 * @param v
 */
export function getPartTree(): Promise<PartTree> {
    return get("/api/platform/api/public/depart/tree")
}

/**
 * 
 * 获取部门明细
 * @param v
 */
export function getOrganizationalDepartList(v: OrganizationalDepartList) {
    return get("/api/platform/api/human/organizational/depart/list", v)
}

/**
 * 添加部门明细
 * @param v
 */
export function getBaseDepartAdd(v: BaseDepartAdd) {
    return post("/api/platform/api/human/organizational/depart/add", v)
}

/**
 * 修改部门明细
 * @param v
 */
export function getBaseDepartEdit(v: BaseDepartEdit):Promise<DepartEditData> {
    return post("/api/platform/api/human/organizational/depart/edit", v)
}

/**
 * 删除部门明细
 * @param v
 */
export function getBaseDepartDel(v: BaseDepartDel) {
    return post("/api/platform/api/human/organizational/depart/del", v)
}