export interface JobList{
    jobName:string;
    pageSize:number;
    pageNum:number;
}

export interface JobListParams{
    jobName:string;
    pageSize:number;
    pageNum:number;
}

export interface BaseJobAdd{
    jobName: string;
}

export interface BaseJobEdit{
    id: number;
    jobName: string;
}

interface T {
    resultCode:string;
}

export interface JobEditData extends T{
}

export interface BaseJobDel{
    id: number;
}