import { BaseJobAdd, BaseJobEdit, JobEditData, BaseJobDel, JobListParams } from "@/types/jobDocumnet";
import { get, post } from "./axios";
/**
 * 
 * 获取岗位明细
 * @param v
 */
export function getJobList(v: JobListParams) {
    return get("/api/platform/api/human/organizational/job/list", v)
}

/**
 * 增加岗位
 * @param v
 */
export function getBasJobAdd(v: BaseJobAdd) {
    return post("/api/platform/api/human/organizational/job/add", v)
}

/**
 * 修改岗位明细
 * @param v
 */
export function getBaseJobEdit(v: BaseJobEdit): Promise<JobEditData> {
    return post("/api/platform/api/human/organizational/job/edit", v)
}

/**
 * 删除岗位明细
 * @param v
 */
export function getBaseJobDel(v: BaseJobDel) {
    return post("/api/platform/api/human/organizational/job/del", v)
}