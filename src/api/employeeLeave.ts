import { EmployeeLeaveEditData, BaseEmployeeLeaveAdd, BaseEmployeeLeaveDel, BaseEmployeeLeaveEdit, OrganizationalEmployeeLeaveList } from "@/types/employeeLeave";
import { get, post } from "./axios";


/**
 * 
 * 离职档案
 * @param v
 */
export function getPersonalEmployeeLeaveList(v: OrganizationalEmployeeLeaveList) {
    return get("/api/platform/api/human/personal/employeeleave/list", v)
}

/**
 * 离职
 * @param v
 */
export function getBaseEmployeeLeaveAdd(v: BaseEmployeeLeaveAdd) {
    return post("/api/platform/api/human/personal/employeeleave/add", v)
}

/**
 * 离职修改
 * @param v
 */
export function getBaseEmployeeLeaveEdit(v: BaseEmployeeLeaveEdit): Promise<EmployeeLeaveEditData> {
    return post("/api/platform/api/human/personal/employeeleave/edit", v)
}

/**
 * 重新入职
 * @param v
 */
export function getBaseEmployeeEntry(v: BaseEmployeeLeaveDel) {
    return post("/api/platform/api/human/personal/employeeleave/entry", v)
}