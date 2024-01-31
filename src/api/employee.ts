import { EmployeeEditData, EmployeeTree, BaseEmployeeAdd, BaseEmployeeDel, BaseEmployeeEdit, OrganizationalEmployeeList, BasePersonleave } from "@/types/employee";
import { get, post } from "./axios";


/**
 * 
 * 获取人事档案明细
 * @param v
 */
export function getOrganizationalEmployeeList(v: OrganizationalEmployeeList) {
    return get("/api/platform/api/human/personal/person/list", v)
}

/**
 * 添加人事档案明细
 * @param v
 */
export function getBaseEmployeeAdd(v: BaseEmployeeAdd) {
    return post("/api/platform/api/human/personal/person/add", v)
}

/**
 * 修改人事档案明细
 * @param v
 */
export function getBaseEmployeeEdit(v: BaseEmployeeEdit): Promise<EmployeeEditData> {
    return post("/api/platform/api/human/personal/person/edit", v)
}

/**
 * 删除人事档案明细
 * @param v
 */
export function getBaseEmployeeDel(v: BaseEmployeeDel) {
    return post("/api/platform/api/human/personal/person/del", v)
}


/**
 * 离职
 * @param v
 */
export function getBaseEmployeeLeave(v: BasePersonleave) {
    return post("/api/platform/api/human/personal/personleave/add", v)
}