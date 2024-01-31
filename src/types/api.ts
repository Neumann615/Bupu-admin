export interface OrganizationalDepartList {
    departName:string;
    pageSize:number;
    pageNum:number;
}

export interface TreeDataOrigin {
    key: number;
    originData: OriginData;
    title: string;
    children?: TreeDataOrigin[];
  }
  
  interface OriginData {
    children: OriginData[];
    areaName: string;
    id: number;
  }
  
  export interface TreeList extends TreeDataOrigin {
    title: any;
    originTitle: string;
    key: number;
    originData: OriginData;
  }