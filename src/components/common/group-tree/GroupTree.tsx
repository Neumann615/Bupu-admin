import React, { useEffect, useState, useRef } from 'react';
import { getDefaultKey, getSearchResultTree, loadGroup } from './helper';
import { Input, Tree, Spin, message } from 'antd';
import { BasicDataNode, EventDataNode } from 'antd/lib/tree';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => ({
  main: {
      width: "100%",
      height: "100%",
  },
}))

const { Search } = Input;

export interface DataNode {
  key: string;
  title: string;
  children?: DataNode[];
}

interface GroupTreeProps {
  data:DataNode[];
  onSelect?: (selectedKeys: string, node: EventDataNode<DataNode>) => void;
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

export default (props: GroupTreeProps) => {
  const [loadingTree, setLoadingTree] = useState<Boolean>(true);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectKeys, setSelectKey] = useState<string[]>([]);
  const defaultExpandedKeys = useRef<(string | number)[]>([]);
  const originTreeData = useRef<DataNode[]>([]);

  useEffect(() => {
    initData()
  })

  const initData = async () => {
    // const { code, msg, data } = (await loadGroup()) as TreeResult;
    // if (code !== 0) {
    //   message.warning(msg);
    //   return;
    // }
    const {data} = props
    if(data?.length){
      setTreeData(data)
      const { defaultExpandedKeys } = getDefaultKey(data!);
      defaultExpandedKeys.current = defaultExpandedKeys;
      originTreeData.current = data!;
      setLoadingTree(false);
      setSelectKey([]);
    }
    // const { defaultExpandedKeys } = getDefaultKey(data!);
    // defaultExpandedKeys.current = defaultExpandedKeys;
    // originTreeData.current = data!;
    // setLoadingTree(false);
    // setSelectKey([]);
    // setTreeData(data!)
  }
  const handleSelect = (selectedKeysTemp: string[], info: SelectInfo) => {
    const keys = selectedKeysTemp.length ? selectedKeysTemp : selectKeys;
    setSelectKey(keys);
    props.onSelect?.(keys[0], info.node);
  };

  const renderTree = () => {
    return treeData?.length ? (
      <Tree
        defaultExpandedKeys={defaultExpandedKeys.current}
        onSelect={handleSelect}
        treeData={treeData}
        selectedKeys={selectKeys}
      />
    ) : (
      <div>暂无数据</div>
    );
  };

  const handleSearch = (value: string) => {
    if (!value) {
      setTreeData(originTreeData.current)
    }
    const treeData = getSearchResultTree(JSON.parse(JSON.stringify(originTreeData.current)), value);
    setTreeData(treeData)
  };
  const { styles } = useStyles();
  return (
    <div className={styles.main}>
      <Search placeholder={'请输入搜索内容...'} onSearch={handleSearch} />
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