import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ColumnsState, ParamsType, ProColumns, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm, Spin, Upload, UploadProps } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getPartTree } from '@/api/departApi';
import React, { useEffect, useState, useRef } from 'react';
import Tree from '@/components/common/group-tree/GroupTree';
import { downloadByPost } from '@/shared/download';
import { transformGroup } from '@/utils/tree';
import { getGridcolAdd, getGridcolList } from '@/api/commonApi';
import { TreeDataOrigin } from '@/components/common/group-tree/GroupTree';
import { message } from 'antd';
import { GridcolAddCols } from '@/types/api';
import moment from 'moment';
import { getPersonConsumeRuleList, getPersonConsumeRuleAdd, getPersonConsumeRuleEdit, getPersonConsumeRuleDel } from '@/api/personConsumeRule';

const useStyles = createStyles(({ token }) => ({
  main: {
    width: "100%",
    height: "100%",
    padding: "12px",
    display: "flex",
  },
  tree: {
    width: '280px',
    height: '100%',
    marginRight: '12px',
    backgroundColor: token.colorBgContainer,
    borderRadius: '6px',
    padding: token.paddingSM
  },
  right: {
    width: 'calc(100% - 260px)',
  },
  treeItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  treeItemIcon: {
    marginRight: '5px'
  },
  spin: {
    height: '100%'
  }
}))

export default () => {
  const { styles } = useStyles();
  const actionRef = useRef<ActionType>();
  const [treeData, setTreeData] = useState<TreeDataOrigin[]>([]);
  const [selectKey, setSelectKey] = useState<number | null>(null);
  // 弹框
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [height, setHeight] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [queryParams, setQueryParams] = useState({});
  const [tableExtraParams, setTableExtraParams] = useState({});
  const initialValues = useRef<Record<string, any>>({});
  const [title, setTitle] = useState('新建');
  const [mode, setMode] = useState('add');
  const [columnsStateMap, setColumnsStateMap] = useState<
    Record<string, ColumnsState>
  >({});
  const columns: ProColumns[] = [
    {
      title: '人员名称',
      dataIndex: 'personName',
      ellipsis: true,
      search: false,
    },
    {
      title: '人员编号',
      dataIndex: 'personId',
      ellipsis: true,
      search: false,
    },
    {
      title: '部门名称',
      dataIndex: 'departName',
      ellipsis: true,
      search: false,
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (__, record) => [
        <a
          key="editable"
          onClick={() => {
            handleTableEdit(record)
          }}
        >
          编辑
        </a>,
        <Popconfirm key="delete" title='删除' description="确认删除该消费规则？" onConfirm={() => {
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
    init();
    // initColumn();
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []);

  const handleTableEdit = (item: any) => {
    setIsOpen(true)
    setTitle('编辑');
    setMode('edit')
    initialValues.current = item
  }

  const handleDelete = async (data: Record<string, any>) => {
    try {
      const params = {
        accountId: data.accountId
      }
      const result = await getPersonConsumeRuleDel(params);
      if (result.resultCode === '1') {
        actionRef.current?.reload();
        message.success('删除成功');
        return;
      }
      message.warning('添加失败');
    }
    catch (e) {
      message.warning('删除失败')
    }
  }

  const handleResize = () => {
    const proTable = document.getElementById('proTable')
    const height = proTable?.clientHeight || document.body.clientHeight;
    const cardHeight = proTable?.querySelector('.proForm')?.clientHeight;
    const tableHeight = height - (cardHeight || 0) - 190
    setHeight(tableHeight)
  }

  const init = async () => {
    try {
      const { code, data, msg } = await initTreeData()
      if (code === 0) {
        setTreeData(data)
        return
      }
      message.warning(msg || '获取部门树失败！');
    }
    catch (e) {
      message.warning('获取部门树失败！');
    }
  }

  // TODO:
  // const initColumn = async () => {
  //     try {
  //         const params = {
  //             gridName: 'depart'
  //         }
  //         const result = await getGridcolList(params);
  //         const colsData = result.data.data.list
  //         const columnsData: Record<string, any> = {}
  //         colsData.forEach(i => {
  //             if (i['colVisible'] === '0') {
  //                 columnsData[i['colName']] = {
  //                     show: false,
  //                 }
  //             }
  //         })
  //         setColumnsStateMap(columnsData)
  //     }
  //     catch (e) {
  //         message.warning('获取列表数据失败！')
  //     }
  // }

  const handleRequest = async (params: ParamsType) => {
    const { current, pageSize, ...rest } = params
    const params1 = {
      pageNum: current,
      pageSize: pageSize,
      ...rest,
    }
    setQueryParams({
      ...params,
    })
    try {
      const result = await getPersonConsumeRuleList(params1);
      if (result.resultCode === '1') {
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
      const result = await getPartTree();
      return {
        code: 0,
        data: transformGroup(result.data.data, 'departName'),
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

  /**
   * 导出
   */
  const handleExport = async () => {
    setIsSpinning(true);
    try {
      // TODO:导出
      // const result = downloadByPost('/api/platform/api/human/organizational/depart/export', queryParams, '人员消费规则')
      setIsSpinning(false);
    }
    catch (e) {
      setIsSpinning(false);
      message.warning('导出失败')
    }

  }

  const handleSelect = async (node: number) => {
    setSelectKey(node)
    setTableExtraParams({
      departId: node
    })
  }

  const uploadParam: UploadProps = {
    name: 'fileStream',
    action: '/api/platform/api/public/dbgrid/import',
    headers: {
      authorization: 'authorization-text',
    },
    data: {
      fileInfo: JSON.stringify({
        tableName: "departs",
        fileName: "人员消费规则.xls"
      })
    },
    fileList: [],
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 导入成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 导入失败`);
      }
    },
  };

  const transformColumns = (item: Record<string, ColumnsState>) => {
    return columns.map((i, index: number) => {
      const colVisible = item?.[i.dataIndex as string]?.show === false ? 0 : 1
      return {
        colName: i.dataIndex as string,
        colLabel: i.title as string,
        colSort: index,
        colVisible: colVisible,
      }
    })
  }

  const saveColumns = async (params: GridcolAddCols[], item: any) => {
    const param = {
      gridName: "depart",
      cols: params
    }
    try {
      const result = await getGridcolAdd(param);
      if (result?.resultCode === '1') {
        message.success('保存成功！')
        setColumnsStateMap(item)
        return;
      }
      message.warning('保存失败！')
    }
    catch (e) {
      message.warning('保存失败！')
    }
  }

  const handleAdd = () => {
    setIsOpen(true);
    setTitle('新建');
  }

  const handleCancel = () => {
    setIsOpen(false);
  }
  return (
    <>
      <Spin tip="加载中..." size="small" spinning={isSpinning} wrapperClassName={styles.spin} fullscreen />
      <div className={styles.main}>
        <div className={styles.tree}>
          <Tree
            data={treeData}
            onSelect={handleSelect} />
        </div>
        <div className={styles.right} id='proTable'>
          <ProTable
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={handleRequest}
            params={tableExtraParams}
            scroll={{ y: height }}
            style={{ height: '100%' }}
            rowKey="id"
            search={{
              labelWidth: 'auto',
              className: 'proForm'
            }}
            pagination={{
              defaultPageSize: 20,
              pageSizeOptions: [5, 10, 50],
              showSizeChanger: true,
            }}
            dateFormatter="string"
            headerTitle="人员消费规则"
            columnsState={{
              value: columnsStateMap,
              onChange: (item) => {
                const transformData = transformColumns(item)
                saveColumns(transformData, item)
              },
            }}
            toolBarRender={() => [
              <Button key="3" type="primary" onClick={handleAdd}>
                <PlusOutlined />
                新建
              </Button>,
              <Upload
                {...uploadParam}
              >
                <Button key="import" type="primary">
                  导入
                </Button>
              </Upload>,
              <Popconfirm key="delete" title='导出' description="确认导出？" onConfirm={() => {
                handleExport()
              }}>
                <Button key="export">
                  导出
                </Button>
              </Popconfirm>
            ]}
          />
        </div>
      </div >
      <Modal title={title} open={isOpen} onCancel={handleCancel} footer={null} destroyOnClose>
        新建
      </Modal>
    </>
  );
};