export interface OrganizationalDepartList {
  departName: string;
  pageSize: number;
  pageNum: number;
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

export interface GridcolAdd {

}

export interface GridcolList {

}

export interface GridcolListParams {
  gridName: string;
}

export interface GridcolAddParams {
  gridName: string;
  cols: GridcolAddCols[];
}

export interface GridcolAddCols {
  colName: string;
  colLabel: string;
  colSort: number;
  colVisible: number;
}