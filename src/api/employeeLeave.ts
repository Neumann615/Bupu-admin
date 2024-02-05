import { EmployeeLeaveEditData, BaseEmployeeLeaveAdd, BaseEmployeeLeaveDel, BaseEmployeeLeaveEdit, OrganizationalEmployeeLeaveList } from "@/types/employeeLeave";
import { get, post } from "./axios";


/**
 * 
 * 离职档案
 * @param v
 */
export function getPersonalEmployeeLeaveList(v: OrganizationalEmployeeLeaveList) {
    return get("/api/platform/api/human/personal/personleave/list", v)
}

/**
 * 离职修改
 * @param v
 */
export function getBaseEmployeeLeaveEdit(v: BaseEmployeeLeaveEdit): Promise<EmployeeLeaveEditData> {
    return post("/api/platform/api/human/personal/personleave/edit", v)
}

/**
 * 重新入职
 * @param v
 */
export function getBaseEmployeeEntry(v: BaseEmployeeLeaveDel) {
    return post("/api/platform/api/human/personal/personleave/entry", v)
}