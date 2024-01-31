import { DeviceList, DeviceAdd, DeviceEdit, DeviceEditData, DeviceDel } from "@/types/deviceList";
import { get, post } from "./axios";


/**
 * 
 * 获取设备明细
 * @param v
 */
export function getDeviceList(v: DeviceList) {
    return get("/api/platform/api/device/device/list", v)
}

/**
 * 增加设备
 * @param v
 */
export function getDeviceAdd(v: DeviceAdd) {
    return post("/api/platform/api/device/device/add", v)
}

/**
 * 修改设备
 * @param v
 */
export function getDeviceEdit(v: DeviceEdit): Promise<DeviceEditData> {
    return post("/api/platform/api/device/device/edit", v)
}

/**
 * 删除设备
 * @param v
 */
export function getDeviceDel(v: DeviceDel) {
    return post("/api/platform/api/device/device/del", v)
}
