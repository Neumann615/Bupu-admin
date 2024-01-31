import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ParamsType, ProColumns, ProForm, ProFormText, ProFormTreeSelect } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getDeviceparameterList, getDeviceparameterAdd, getDeviceparameterEdit, getDeviceparameterDel } from '@/api/deviceparameter';
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
      title: '设备序列号',
      dataIndex: 'devSerial',
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
      title: '参数值',
      dataIndex: 'paramValue',
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
      title: '参数Key',
      dataIndex: 'paramKey',
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
      title: '设备名称',
      dataIndex: 'devName',
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
      title: '设备编号',
      dataIndex: 'devId',
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
      title: '参数名称',
      dataIndex: 'paramName',
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
      title: 'json格式参数',
      dataIndex: 'paramJson',
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
      title: '操作',
      valueType: 'option',
      width: 150,
      key: 'option',
      fixed: 'right',
      render: (text, record, _, action) => [
        // <a
        //   key="editable"
        //   onClick={() => {
        //     action?.startEditable?.(record.id);
        //   }}
        // >
        //   编辑
        // </a>,
        <Popconfirm key="delete" title='删除' description="确认删除？" onConfirm={() => {
          handleDelete(record)
        }}>
          <a href={record.url} target="_blank" rel="noopener noreferrer">
            删除
          </a>
        </Popconfirm>

      ],
    },
  ];

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { code, data, msg } = await initTreeData()
    console.log(data, 'data')
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
      const result = await getDeviceparameterList(params1);
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

  const handleDelete = async (data: GithubIssueItem | OriginData) => {
    try {
      const params = {
        id: data.id
      }
      await getDeviceparameterDel(params);
      await init()
      actionRef.current?.reload();
      message.success('删除成功')
    }
    catch (e) {
      message.warning('删除失败')
    }
  }

  const handleCancel = () => {
    setIsOpen(false);
    initialValues.current = {}
  }

  const handelAdd = () => {
    setMode('add');
    setTitle('添加');
    setIsOpen(true);
  }

  const handelEdit = (item: TreeDataOrigin) => {
    setMode('edit')
    initialValues.current = item.originData
    currentSelect.current = item;
    console.log(item, 'currentSelect')
    setTitle('编辑');
    setIsOpen(true);
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

  const handleFinish = async (values:DeviceAdd) => {
    if (mode === 'add') {
      const params = {
        ...values,
      }
      const result = await getDeviceparameterAdd(params);
      if (result.resultCode === '0') {
        await init()
        message.success('添加成功');
        actionRef.current?.reload();
        initialValues.current = {}
        setIsOpen(false)
      }
    }
    else if (mode === 'edit') {
      const { id } = (currentSelect.current as TreeDataOrigin).originData
      const item = searchParentId(treeDataOrigin.current, id, treeDataOrigin.current)
      const params = {
        pid: item.key,
        id,
        areaName,
      }
      const result = await getBaseAreaEdit(params);
      if (result.resultCode === '0') {
        await init()
        initialValues.current = {}
        message.success('编辑成功');
        actionRef.current?.reload();
        setIsOpen(false)
      }
    }
  }



  const handleSave = async (data: GithubIssueItem) => {
    const { id, areaName, pid } = data;
    const params = {
      id,
      pid,
      areaName,
    }
    const result = await getBaseAreaEdit(params);
    if (result.resultCode === '0') {
      message.success('修改成功')
      actionRef.current?.reload();
    }

  }

  const handleDrop = async (info: any) => {
    confirm({
      title: "确认拖拽",
      content: `确认将${info.dragNode.originData.areaName}拖拽到${info.node.originData.areaName}`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const dropKey = info.node.key;
        const params = {
          ...info.dragNode.originData,
          pid: dropKey
        }
        const result = await getBaseAreaEdit(params);
        if (result.resultCode === '0') {
          await init()
          initialValues.current = {}
          message.success('拖拽成功！');
          actionRef.current?.reload();
        }
      }
    })

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
            onSave: async (_, data) => {
              handleSave(data)
            },
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
          // options={{
          //     setting: {
          //         listsHeight: 400,
          //     },
          // }}
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
          // toolBarRender={() => [
          //   <Button key="3" type="primary" onClick={handleAdd}>
          //     <PlusOutlined />
          //     新建
          //   </Button>,
          // ]}
        />
      </div>
      <Modal title={title} open={isOpen} onCancel={handleCancel} footer={null} destroyOnClose>
        <ProForm
          onFinish={async (values: DeviceAdd) => {
            handleFinish(values)
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          grid={true}
          submitter={{
            // 配置按钮文本
            searchConfig: {
              resetText: '重置',
              submitText: '提交',
            },
            // 配置按钮的属性
            resetButtonProps: {
              style: {
                // 隐藏重置按钮
                justifyContent: 'center',
              },
            },
          }}
          initialValues={initialValues.current}
        >
          <ProForm.Group>
            <ProFormText
              name="devId"
              width="md"
              label="设备编号"
              placeholder="请输入设备编号"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="devName"
              width="md"
              label="设备名称"
              placeholder="请输入设备名称"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="devSerial"
              width="md"
              label="设备序列号"
              placeholder="请输入设备序列号"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="devIP"
              width="md"
              label="设备IP地址"
              placeholder="请输入设备IP地址"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="devPort"
              width="md"
              label="设备通讯端口"
              placeholder="请输入设备通讯端口"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="devType"
              width="md"
              label="设备分类"
              placeholder="请输入设备分类"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="devModel"
              width="md"
              label="设备分类"
              placeholder="请输入设备分类"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormTreeSelect
              label="所属餐厅"
              fieldProps={{
                fieldNames: {
                  label: 'title',
                },
                treeData: canteeTree,
                placeholder: '请选择餐厅',
              }}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormTreeSelect
              label="请选择"
              fieldProps={{
                fieldNames: {
                  label: 'title',
                },
                treeData: treeData,
                placeholder: '请选择区域',
              }}
            />
          </ProForm.Group>
        </ProForm>
      </Modal>
    </div >
  );
};