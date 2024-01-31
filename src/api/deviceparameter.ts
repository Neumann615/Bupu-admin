import { DeviceList, DeviceAdd, DeviceEdit, DeviceEditData, DeviceDel } from "@/types/deviceList";
import { get, post } from "./axios";


/**
 * 
 * 获取设备参数
 * @param v
 */
export function getDeviceparameterList(v: DeviceList) {
    return get("/api/platform/api/device/deviceparameter/list", v)
}

/**
 * 增加设备参数
 * @param v
 */
export function getDeviceparameterAdd(v: DeviceAdd) {
    return post("/api/platform/api/device/deviceparameter/add", v)
}

/**
 * 修改设备参数
 * @param v
 */
export function getDeviceparameterEdit(v: DeviceEdit): Promise<DeviceEditData> {
    return post("/api/platform/api/device/deviceparameter/edit", v)
}

/**
 * 删除设备参数
 * @param v
 */
export function getDeviceparameterDel(v: DeviceDel) {
    return post("/api/platform/api/device/deviceparameter/del", v)
}
