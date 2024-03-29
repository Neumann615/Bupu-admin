export interface EmployeeLeaveTree{
    status: number;
    statusText: string;
    data: {
        data: EmployeeLeaveDataSource[];
        msgId: string;
        resultMsg: string;
        token: string;
    }
}


export interface EmployeeLeaveDataSource {
    children: EmployeeLeaveDataSource[]
    EmployeeLeaveName: string;
    id: number;
}

export interface OrganizationalEmployeeLeaveList{
    EmployeeLeaveName:string;
    pageSize:number;
    pageNum:number;
}

export interface BaseEmployeeLeaveAdd{
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
    beginTime:string;
    endTime:string;
}

export interface BaseEmployeeLeaveEdit{
    leaveType: string;
    leaveReason: string;
    accountId: string;
}

export interface EmployeeLeaveEditData extends T{
}

export interface BaseEmployeeLeaveDel{
    accountId: number;
}

interface T {
    resultCode:string;
}