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
    pid: number;
    employeeName: string;
}

export interface BaseEmployeeEdit{
    id: number;
    pid: string;
    employeeName: string;
}

export interface EmployeeEditData extends T{
}

export interface BaseEmployeeDel{
    id: number;
}

interface T {
    resultCode:string;
}