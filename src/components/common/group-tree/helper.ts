import { DataNode } from './GroupTree';
import { getPartTree } from '@/api/business';

interface IResult {
  msg: string;
  success: boolean;
  items: IItem[];
}
interface IItem {
  attributes: IAttributes;
  children: IItem[];
  id: string;
  departName: string;
}
interface IAttributes {
  code: string;
  ecode: string;
  info: string;
  level: string;
  memo: string | null;
  orderby: string;
  type: string;
  visible: string | boolean | null;
}

export async function loadGroup() {
  try {
    const result = await getPartTree<IResult>();
    console.log(result,'reuslt')
    return {
      code: 0,
      data: transformGroup(result.data.data),
      msg: '',
    };
  } catch (error) {
    console.log(error);
    return {
      code: 1,
      msg: "组织信息获取失败!",
    };
  }
}

function transformGroup(data: IItem[]) {
  const loop = (data: IItem[]) => {
    return data.map(l => {
      const {
        departName,
        id,
        children,
      } = l;
      const obj: DataNode = {
        title: departName,
        key: id,
      };
      if (children?.length) {
        obj.children = loop(children);
        return obj;
      }
      return obj;
    });
  };

  return loop(data);
}

export function getDefaultKey(treeData: DataNode[]) {
  const defaultExpandedKeys: Array<string | number> = [];
  const selectKeys: string[] = [];
  const loop = (data: DataNode[]) => {
    for (const t of data) {
      const { key, children } = t;
      if (!children) {
        selectKeys.push(key);
        return {
          selectKeys,
          defaultExpandedKeys,
        };
      }
      defaultExpandedKeys.push(key);
      loop([JSON.parse(JSON.stringify(children)).shift()!]);
    }
    return {
      selectKeys,
      defaultExpandedKeys,
    };
  };

  return loop(treeData);
}

export function getSearchResultTree(treeData: DataNode[], value: string) {
  const loop = (node: DataNode) => {
    if (node.title!.indexOf(value) > -1) {
      return node;
    }
    if (node.children) {
      node.children = node.children.map(loop).filter(Boolean) as DataNode[];
      if (node.children.length) {
        return node;
      }
    }
    return null;
  };
  return treeData.map(loop).filter(Boolean) as DataNode[];
}
