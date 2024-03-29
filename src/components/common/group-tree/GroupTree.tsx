import React, { useEffect, useState, useRef, useMemo } from 'react';
import { getDefaultKey } from './helper';
import { Input, Tree, Spin, TreeProps, TreeDataNode } from 'antd';
import { EventDataNode } from 'antd/lib/tree';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => ({
  main: {
    width: "100%",
    height: "100%",
  },
  search: {
    marginBottom: token.paddingMD
  },
  treeItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  treeItemIcon: {
    marginRight: '5px'
  },
  siteTreeSearchValue: {
    color: 'red',
  }
}))

const { Search } = Input;

export interface TreeList extends TreeDataOrigin {
  title: any;
  originTitle: string;
  key: number;
  originData: OriginData;
}

export interface DataNode {
  key: string;
  originTitle: string;
  title: string;
  children?: DataNode[];
}
interface GroupTreeProps {
  data: TreeDataOrigin[];
  treeProps?: TreeProps,
  onSelect?: (selectedKeys: number, node: EventDataNode<DataNode>) => void;
  renderTreeFooter?: (item: TreeDataOrigin) => React.ReactNode
}

interface SelectInfo {
  event: 'select';
  selected: boolean;
  node: EventDataNode<DataNode>;
  selectedNodes: DataNode[];
  nativeEvent: MouseEvent;
}

export interface TreeDataOrigin {
  key: number;
  originData: Record<string, any>;
  title: string;
  children?: TreeDataOrigin[];
}
export interface OriginData {
  children: OriginData[];
  departName: string;
  id: number;
}

export default (props: GroupTreeProps) => {
  const { styles } = useStyles();
  const [loadingTree, setLoadingTree] = useState<Boolean>(true);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectKeys, setSelectKey] = useState<number[]>([]);
  const defaultExpandedKeys = useRef<(string | number)[]>([]);
  const treeDataOrigin = useRef<TreeDataOrigin[]>([]);
  const originTreeData = useRef<DataNode[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 打平的树结构
  const [treeExtendData, setTreeExtendData] = useState<Record<string, any>[]>([])

  useEffect(() => {
    initData()
  }, [props.data])

  const treeData1 = useMemo(() => {
    const loop = (data: any[]): TreeDataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <div className={styles.treeItem}>
              <span>
                {beforeStr}
                <span className={styles.siteTreeSearchValue}>{searchValue}</span>
                {afterStr}
              </span>
              {item.key === selectKeys[0] && props?.renderTreeFooter?.(item)}
            </div>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
    return loop(treeData);
  }, [searchValue, treeData, selectKeys]);


  const extendTreeData = (defaultData: Record<string, any>[]) => {
    const dataList: { key: React.Key; title: string }[] = [];
    const generateList = (data: Record<string, any>[]) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key, title } = node;
        dataList.push({ key, title: title });
        if (node.children) {
          generateList(node.children);
        }
      }
    };
    generateList(defaultData);
    return dataList
  }

  const initData = async () => {
    const { data } = props
    if (data?.length) {
      const treeDataTemp = data;
      treeDataOrigin.current = data
      setTreeData(treeDataTemp)
      const extendTreeDataTemp = extendTreeData(treeDataTemp);
      setTreeExtendData(extendTreeDataTemp)
      const { defaultExpandedKeys } = getDefaultKey(data!);
      defaultExpandedKeys.current = defaultExpandedKeys;
      originTreeData.current = data!;
      setLoadingTree(false);
      setSelectKey([]);
    }
  }
  const handleSelect = (selectedKeysTemp: string[], info: SelectInfo) => {
    const keys = selectedKeysTemp.length ? selectedKeysTemp : selectKeys;
    setSelectKey(keys as number[]);
    props.onSelect?.(keys[0] as number, info.node);
  };

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };


  const renderTree = () => {
    const { treeProps = {} } = props;
    return treeData?.length ? (
      <Tree
        onExpand={onExpand}
        blockNode={true}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        defaultExpandedKeys={defaultExpandedKeys.current}
        onSelect={handleSelect}
        treeData={treeData1}
        {
        ...treeProps
        }
      />
    ) : (
      <div>暂无数据</div>
    );
  };

  const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey!;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    const newExpandedKeys = treeExtendData
      .map((item: any) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item: any, i: any, self: any): item is React.Key => !!(item && self.indexOf(item) === i));
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  return (
    <div className={styles.main}>
      <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={onChange} className={styles.search} />
      <div>
        {loadingTree ? (
          <div>
            <Spin size="large" tip={'加载中...'} />
          </div>
        ) : (
          renderTree()
        )}
      </div>
    </div>
  );
}