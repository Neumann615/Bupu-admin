import { get, post } from "./axios";
import { GridcolAdd, GridcolList,GridcolListParams,GridcolAddParams } from '@/types/api';
/**
 * 
 * 保存表头
 * @param v
 */
export function getGridcolAdd(data:GridcolAddParams): Promise<GridcolAdd> {
    return post("/api/platform/api/public/gridcol/add",data)
}

/**
 * 
 * 获取表头
 * @param v
 */
export function getGridcolList(data:GridcolListParams): Promise<GridcolList> {
    return get("/api/platform/api/public/gridcol/list",data)
}

