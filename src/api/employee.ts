import { EmployeeEditData, EmployeeTree, BaseEmployeeAdd, BaseEmployeeDel, BaseEmployeeEdit, OrganizationalEmployeeList } from "@/types/employee";
import { get, post } from "./axios";


/**
 * 
 * 获取人事档案明细
 * @param v
 */
export function getOrganizationalEmployeeList(v: OrganizationalEmployeeList) {
    return get("/api/platform/api/human/personal/employee/list", v)
}

/**
 * 添加人事档案明细
 * @param v
 */
export function getBaseEmployeeAdd(v: BaseEmployeeAdd) {
    return post("/api/platform/api/human/personal/employee/add", v)
}

/**
 * 修改人事档案明细
 * @param v
 */
export function getBaseEmployeeEdit(v: BaseEmployeeEdit): Promise<EmployeeEditData> {
    return post("/api/platform/api/human/personal/employee/edit", v)
}

/**
 * 删除人事档案明细
 * @param v
 */
export function getBaseEmployeeDel(v: BaseEmployeeDel) {
    return post("/api/platform/api/human/personal/employee/del", v)
}