export interface EmployeeDataSource {
    children: EmployeeDataSource[]
    employeeName: string;
    id: number;
}

export interface OrganizationalEmployeeList {
    employeeName: string;
    pageSize: number;
    pageNum: number;
}

export interface BaseEmployeeAdd {
    birthDate: string;
    personPwd: string;
    personName: string;
    personId: string;
    jobId: string;
    idCard: string;
    departId: string;
    cardSn: string;
    levelId: string;
    personMobile: string;
    personAddress: string;
    beginTime: string;
    endTime: string;
}

export interface BaseEmployeeEdit {
    id: number;
    pid: string;
    employeeName: string;
}

export interface EmployeeEditData extends T {
}

export interface BaseEmployeeDel {
    accountId: number;
}

export interface BasePersonleave {
    accountId: number;
}

interface T {
    resultCode: string;
}

export interface DeviceList {
    pageSize: number;
    pageNum: number;
    devName?: string;
    serialId?: number;
    devId?: number;
}

export interface DeviceAdd {
    devId: string;
    devName: string;
    devSerial: string;
    devIP: string;
    devPort: string;
    areaId: string;
    canteenId: string;
    devModel: string;
    devType: string;
}

export interface DeviceEdit {

}
export interface DeviceEditData {

}

export interface DeviceDel {

}