import { DeleteOutlined, EditOutlined, FolderAddOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ParamsType, ProColumns, ProForm, ProFormText, ProFormTreeSelect } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm, TreeSelect } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getDeviceList, getDeviceAdd, getDeviceEdit, getDeviceDel } from '@/api/deviceList';
import { getAreaTree } from '@/api/area';
import React, { useEffect, useState, useRef } from 'react';
import Tree from '@/components/common/group-tree/GroupTree';
import { message } from 'antd';
import { cloneDeep } from 'lodash-es';
import { AreaDataSource } from '@/types/area';
import { getCanteenTree } from '@/api/canteen';
import { DeviceAdd } from '@/types/deviceList';
const { confirm } = Modal

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  areaName: string;
  pid: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

interface TreeDataOrigin {
  key: number;
  originData: OriginData;
  value:string;
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

const useStyles = createStyles(({ token }) => ({
  main: {
    width: "100%",
    height: "100%",
    padding: "12px",
    display: "flex",
  },
  tree: {
    width: '30%',
    height: '100%',
    marginRight: '12px',
    backgroundColor: token.colorBgContainer,
    borderRadius: '6px',
    padding: token.paddingMD
  },
  right: {
    width: '70%',
  },
  treeItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  treeItemIcon: {
    marginRight: '5px'
  }
}))

export default () => {
  const actionRef = useRef<ActionType>();
  const { styles } = useStyles();
  const [treeData, setTreeData] = useState<TreeList[]>([])
  const [selectKey, setSelectKey] = useState<number | null>(null)
  const [title, setTitle] = useState<string>('');
  const [mode, setMode] = useState<string>('add');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tableParams, setTableParams] = useState({});
  const initialValues = useRef<Record<string, any>>({})
  const currentSelect = useRef<TreeDataOrigin | {}>({});
  const treeDataOrigin = useRef<TreeDataOrigin[]>([]);
  const [canteeTree, setCanteeTree] = useState<TreeList[]>([])
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '设备编号',
      dataIndex: 'devId',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '设备名称',
      dataIndex: 'devName',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '设备序列号',
      dataIndex: 'devSerial',
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '设备IP地址',
      dataIndex: 'devIP',
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '设备通讯端口',
      dataIndex: 'devPort',
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '所属区域ID',
      dataIndex: 'areaId',
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '所属餐厅ID',
      dataIndex: 'canteenId',
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '机型',
      dataIndex: 'devModel',
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '设备分类',
      dataIndex: 'devType',
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
  ];

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { code, data, msg } = await initTreeData()
    if (code === 0) {
      setTreeData(data)
      return
    }
    message.warning(msg);
  }


  const transformTreeData = (data: TreeDataOrigin[], selectNode: number): TreeList[] => {
    const dataTemp = cloneDeep(data);
    return dataTemp.map(item => {
      if (item.children?.length) {
        return {
          ...item,
          title: () => {
            return (
              <div>{item.title}</div>
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
            <div>{item.title}</div>
          )
        }
      }
    })
  }

  const handleRequest = async (params: ParamsType) => {
    console.log(params, 'params')
    const { current, pageSize, ...rest } = params
    const params1 = {
      pageNum: current,
      pageSize: pageSize,
      ...rest
    }
    try {
      const result = await getDeviceList(params1);
      if (result.status === 200) {
        return {
          data: result.data.data.list,
          page: 1,
          total: result.data.data.total
        }
      }
      return {
        data: result.data.data.list,
        page: 1,
        total: result.data.data.total
      }
    }
    catch (e) {
      return []
    }
  }

  const handleAdd = () => {
    setIsOpen(true)
    setTitle('新建');
  }


  const initTreeData = async (): Promise<{
    code: number;
    data: TreeDataOrigin[];
    msg: string;
  }> => {
    try {
      const result = await getAreaTree();
      console.log(result, 'result')
      return {
        code: 0,
        data: transformGroup(result.data.data, 'areaName'),
        msg: '',
      };
    } catch (error) {
      return {
        code: 1,
        data: [],
        msg: "组织信息获取失败!",
      };
    }
  }

  const initCateenTreeData = async (): Promise<{
    code: number;
    data: TreeDataOrigin[];
    msg: string;
  }> => {
    try {
      const result = await getCanteenTree();
      console.log(result, 'result')
      return {
        code: 0,
        data: transformGroup(result.data.data, 'canteenName'),
        msg: '',
      };
    } catch (error) {
      return {
        code: 1,
        data: [],
        msg: "组织信息获取失败!",
      };
    }
  }

  const transformGroup = (data: AreaDataSource[], key: string) => {
    const loop = (data: AreaDataSource[]) => {
      return data.map(l => {
        const {
          id,
          children,
        } = l;
        const obj: TreeDataOrigin = {
          title: l[key],
          key: id,
          value:id,
          originData: l
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

  const searchParentId = (treeData: TreeDataOrigin[], item: number, p: TreeDataOrigin) => {
    for (let i = 0; i < treeData?.length; i++) {
      const e = treeData[i];
      if (item === e.key) {
        return p
      }
      if (e.children?.length) {
        const res = searchParentId(e.children, item, e)
        if (res) {
          return res
        }
        return null
      }
    }
  }

  const handleSelect = (node: number) => {
    const treeDataTemp = transformTreeData(treeDataOrigin.current, node)
    console.log(node, 'node')
    setTableParams({
      areaId: node
    })
    setSelectKey(node)
    setTreeData(treeDataTemp)
  }
  return (
    <div className={styles.main}>
      <div className={styles.tree}>
        <Tree data={treeData} onSelect={handleSelect} />
      </div>
      <div className={styles.right}>
        <ProTable<GithubIssueItem>
          columns={columns}
          scroll={{ x: 1300 }}
          actionRef={actionRef}
          //cardBordered
          request={handleRequest}
          params={tableParams}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
          }}
          rowKey="personId"
          search={{
            labelWidth: 'auto',
          }}
          options={false}
          form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            defaultPageSize: 20,
            pageSizeOptions: [5, 10, 50],
            showSizeChanger: true,
          }}
          dateFormatter="string"
          headerTitle="岗位资料"
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={handleAdd}>
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
      </div>
    </div >
  );
};