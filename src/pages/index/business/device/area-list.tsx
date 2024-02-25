import { ActionType, ParamsType, ProColumns, ProForm, ProFormText } from '@ant-design/pro-components';
import { Modal, Popconfirm } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getAreaTree, getOrganizationalAreaList, getBaseAreaAdd, getBaseAreaEdit, getBaseAreaDel } from '@/api/area';
import React, { useEffect, useState, useRef } from 'react';
import Tree from '@/components/common/group-tree/GroupTree';
import { message } from 'antd';
import { transformGroup, searchParentId } from '@/utils/tree';
import { TreeDataOrigin } from '@/components/common/group-tree/GroupTree';
const { confirm } = Modal
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
  const { styles } = useStyles();
  const actionRef = useRef<ActionType>();
  const [treeData, setTreeData] = useState<TreeDataOrigin[]>([])
  const [selectKey, setSelectKey] = useState<number | null>(null)
  const [title, setTitle] = useState<string>('');
  const [mode, setMode] = useState<string>('add');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const initialValues = useRef<Record<string, any>>({})
  const currentSelect = useRef<TreeDataOrigin | {}>({});
  const [height, setHeight] = useState(0);
  const columns: ProColumns[] = [
    {
      title: '区域名称',
      dataIndex: 'areaName',
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
      title: '更新时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      search: false,
      editable: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      search: false,
      editable: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (__, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm key="delete" title='删除' description="该部门下的子节点也会被一起删除，确认删除该部门？" onConfirm={() => {
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
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleResize = () => {
    const proTable = document.getElementById('proTable')
    const height = proTable?.clientHeight || document.body.clientHeight;
    const cardHeight = proTable?.querySelector('.proForm')?.clientHeight;
    const tableHeight = height - (cardHeight || 0) - 190
    setHeight(tableHeight)
  }

  const init = async () => {
    const { code, data, msg } = await initTreeData()
    if (code === 0) {
      setTreeData(data)
      return
    }
    message.warning(msg || '查询失败！');
  }

  const handleRequest = async (params: ParamsType) => {
    const params1 = {
      areaName: params.areaName,
      pageNum: params.current,
      pageSize: params.pageSize,
    }
    try {
      const result = await getOrganizationalAreaList(params1);
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
  const initTreeData = async (): Promise<{
    code: number;
    data: TreeDataOrigin[];
    msg: string;
  }> => {
    try {
      const result = await getAreaTree();
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

  const handleDelete = async (data: Record<string, any>) => {
    try {
      const params = {
        id: data.id
      }
      await getBaseAreaDel(params);
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

  const handleFinish = async (values: {
    areaName: string
  }) => {
    const { areaName } = values
    if (mode === 'add') {
      const params = {
        pid: selectKey!,
        areaName,
      }
      try {
        const result = await getBaseAreaAdd(params);
        if (result.resultCode === '1') {
          await init()
          message.success('添加成功');
          actionRef.current?.reload();
          initialValues.current = {}
          setIsOpen(false)
          return;
        }
      }
      catch (e) {
        message.warning('添加失败')
      }
      message.warning('添加失败！')
    }
    else if (mode === 'edit') {
      const { id } = (currentSelect.current as TreeDataOrigin).originData
      const item = searchParentId(treeData, id)
      const params = {
        pid: item.key,
        id,
        areaName,
      }
      try {
        const result = await getBaseAreaEdit(params);
        if (result.resultCode === '1') {
          await init()
          initialValues.current = {}
          message.success('编辑成功');
          actionRef.current?.reload();
          setIsOpen(false)
          return
        }
        message.warning('编辑失败！')
      }
      catch (e) {
        message.warning('编辑失败！')
      }
    }
  }



  const handleSave = async (data: any) => {
    const { id, areaName, pid } = data;
    const params = {
      id,
      pid,
      areaName,
    }
    try {
      const result = await getBaseAreaEdit(params);
      if (result.resultCode === '1') {
        message.success('修改成功')
        actionRef.current?.reload();
        return
      }
      message.warning('修改失败！')
    }
    catch (e) {
      message.warning('修改失败！')
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
        if (result.resultCode === '1') {
          await init()
          initialValues.current = {}
          message.success('拖拽成功！');
          actionRef.current?.reload();
          return
        }
        message.warning('拖拽失败！')
      }
    })

  }

  const handleSelect = (node: number) => {
    setSelectKey(node)
  }

  return (
    <div className={styles.main}>
      <div className={styles.tree}>
        <Tree data={treeData}
          onSelect={handleSelect}
          treeProps={
            {
              draggable: true,
              onDragEnter: (info) => {
                console.log(info, 'onDragEnter')
              },
              onDrop: handleDrop
            }
          } />
      </div>
      <div className={styles.right} id='proTable'>
        <ProTable
          scroll={{ y: height }}
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={handleRequest}
          editable={{
            type: 'multiple',
            onSave: async (__, data) => {
              handleSave(data)
            },
          }}
          style={{ height: '100%' }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
            className: 'proForm'
          }}
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          pagination={{
            defaultPageSize: 20,
            pageSizeOptions: [5, 10, 50],
            showSizeChanger: true,
          }}
          dateFormatter="string"
          headerTitle="区域资料"
        />
      </div>
      <Modal title={title} open={isOpen} onCancel={handleCancel} footer={null} destroyOnClose>
        <ProForm
          onFinish={async (values: {
            areaName: string
          }) => {
            handleFinish(values)
          }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
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
          <ProFormText
            name="areaName"
            width="md"
            label="区域名称"
            placeholder="请输入部门名称"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm>
      </Modal>
    </div >
  );
};