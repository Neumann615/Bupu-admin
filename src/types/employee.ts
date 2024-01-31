export interface EmployeeTree{
    status: number;
    statusText: string;
    data: {
        data: EmployeeDataSource[];
        msgId: string;
        resultMsg: string;
        token: string;
    }
}


export interface EmployeeDataSource {
    children: EmployeeDataSource[]
    employeeName: string;
    id: number;
}

export interface OrganizationalEmployeeList{
    employeeName:string;
    pageSize:number;
    pageNum:number;
}

export interface BaseEmployeeAdd{
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

export interface BaseEmployeeEdit{
    id: number;
    pid: string;
    employeeName: string;
}

export interface EmployeeEditData extends T{
}

export interface BaseEmployeeDel{
    accountId: number;
}

export interface BasePersonleave{
    accountId: number;
}

interface T {
    resultCode:string;
}