import React, { useEffect, useState, useRef } from 'react';
import { getDefaultKey, getSearchResultTree, loadGroup } from './helper';
import { Input, Tree, Spin, message, TreeProps } from 'antd';
import { cloneDeep } from 'lodash-es';
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
  renderTreeFooter?:(item:TreeDataOrigin) => React.ReactNode
}
interface GroupTreeState {
  loadingTree: boolean;
  treeData: DataNode[];
  selectKeys: string[];
}

interface TreeResult {
  code: 0;
  msg: string;
  data?: DataNode[];
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
  originData: Record<string,any>;
  title: string;
  children?: TreeDataOrigin[];
}
export interface OriginData {
  children: OriginData[];
  departName: string;
  id: number;
}

export default (props: GroupTreeProps) => {
  const [loadingTree, setLoadingTree] = useState<Boolean>(true);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectKeys, setSelectKey] = useState<number[]>([]);
  const defaultExpandedKeys = useRef<(string | number)[]>([]);
  const treeDataOrigin = useRef<TreeDataOrigin[]>([]);
  const originTreeData = useRef<DataNode[]>([]);

  useEffect(() => {
    initData()
  }, [props.data])

  const initData = async () => {
    const { data } = props
    if (data?.length) {
      const treeDataTemp = transformTreeData(data,selectKeys[0]);
      treeDataOrigin.current = data
      setTreeData(treeDataTemp)
      const { defaultExpandedKeys } = getDefaultKey(data!);
      defaultExpandedKeys.current = defaultExpandedKeys;
      originTreeData.current = data!;
      setLoadingTree(false);
      setSelectKey([]);
    }
  }
  const handleSelect = (selectedKeysTemp: string[], info: SelectInfo) => {
    const keys = selectedKeysTemp.length ? selectedKeysTemp : selectKeys;
    const treeDataTemp = transformTreeData(treeDataOrigin.current, keys[0])
    setTreeData(treeDataTemp)
    setSelectKey(keys);
    props.onSelect?.(keys[0], info.node);
  };

  const transformTreeData = (data: TreeDataOrigin[], selectNode: number): TreeList[] => {
    const dataTemp = cloneDeep(data);
    return dataTemp.map(item => {
      if (item.children?.length) {
        return {
          ...item,
          title: () => {
            return (
              (item.key === selectNode && props.renderTreeFooter)?
              props?.renderTreeFooter(item)
                : <div>{item.title}</div>
            )

          },
          originTitle: item.title,
          children: transformTreeData(item.children, selectNode)
        }
      }
      return {
        ...item,
        originTitle: item.title,
        title: () => {
          return (
            (item.key === selectNode && props.renderTreeFooter) ?
            props.renderTreeFooter(item): <div>{item.title}</div>
          )
        }
      }
    })
  }

  const renderTree = () => {
    const { treeProps = {} } = props;
    return treeData?.length ? (
      <Tree
        blockNode={true}
        defaultExpandedKeys={defaultExpandedKeys.current}
        onSelect={handleSelect}
        treeData={treeData}
        {
        ...treeProps
        }
      />
    ) : (
      <div>暂无数据</div>
    );
  };

  const handleSearch = (value: string) => {
    if (!value) {
      setTreeData(originTreeData.current)
    }
    const treeData = getSearchResultTree(cloneDeep(originTreeData.current), value);
    setTreeData(treeData)
  };
  const { styles } = useStyles();
  return (
    <div className={styles.main}>
      <Search placeholder={'请输入搜索内容...'} onSearch={handleSearch} className={styles.search} />
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