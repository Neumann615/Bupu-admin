import { ActionType, ProColumns, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getPersonalEmployeeLeaveList, getBaseEmployeeLeaveEdit, getBaseEmployeeEntry } from '@/api/employeeLeave';
import React, { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import { BaseEmployeeLeaveEdit } from '@/types/employeeLeave';
export interface FormValues {
  birthDate: string;
  personPwd: string;
  personName: string;
  personId: string;
  jobId: string;
  idCard: string;
  departId: string;
  cardSn: string;
  levelId: string;
  personMobile: string;
  personAddress: string;
  rangeTime: string;
}

interface OriginData {
  children: OriginData[];
  departName: string;
  accountId: number;
}

const useStyles = createStyles(() => ({
  main: {
    width: "100%",
    height: "100%",
    padding: "12px",
  },
}))

const selectOption = [
  {
    value: "1",
    label: "辞职",
  },
  {
    value: "2",
    label: "自离",
  },
  {
    value: "3",
    label: "辞退",
  },
  {
    value: "4",
    label: "退休",
  },
]
export default () => {
  const actionRef = useRef<ActionType>();
  const { styles } = useStyles();
  const [height, setHeight] = useState(0);
  const initialValues = useRef<Record<string, any>>({})
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const columns: ProColumns[] = [
    {
      title: '姓名',
      dataIndex: 'personName',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      editable: false,
    },
    {
      title: '离职类型',
      dataIndex: 'leaveType',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        4: { text: '退休' },
        1: {
          text: '辞职',
        },
        2: {
          text: '自离',
        },
        3: {
          text: '辞退',
        },
      },
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
      title: '离职原因',
      dataIndex: 'leaveReason',
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
      title: '操作',
      valueType: 'option',
      width: 150,
      key: 'option',
      fixed: 'right',
      render: (__, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            // action?.startEditable?.(record.accountId);
            handelTableEdit(record)
          }}
        >
          编辑
        </a>,
        <Popconfirm key="delete" title='重新入职' description="确认重新入职岗位？" onConfirm={() => {
          handleEntry(record)
        }}>
          <a href={record.url} target="_blank" rel="noopener noreferrer">
            重新入职
          </a>
        </Popconfirm>

      ],
    },
  ];

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handelTableEdit = (item: any) => {
    setIsOpen(true);
    initialValues.current = item
  }

  const handleResize = () => {
    const proTable = document.getElementById('proTable')
    const height = proTable?.clientHeight || document.body.clientHeight;
    const cardHeight = proTable?.querySelector('.proForm')?.clientHeight;
    const tableHeight = height - (cardHeight || 0) - 200
    setHeight(tableHeight)
  }

  const handleRequest = async (params: any) => {
    const params1 = {
      ...params,
      pageNum: params.current,
      pageSize: params.pageSize,
    }
    try {
      const result = await getPersonalEmployeeLeaveList(params1);
      if (result.status === 200) {
        return {
          data: result.data.data.list,
          page: 1,
          total: result.data.data.total
        }
      }
      message.warning('查询离职档案失败！')
      return {
        data: result.data.data.list,
        page: 1,
        total: result.data.data.total
      }
    }
    catch (e) {
      message.warning('查询离职档案失败！')
      return []
    }
  }

  const handleEntry = async (data: OriginData) => {
    try {
      const params = {
        accountId: data.accountId
      }
      const result = await getBaseEmployeeEntry(params);
      if (result?.resultCode === '1') {
        actionRef.current?.reload();
        message.success('入职成功')
        return;
      }
      message.warning(result.resultMsg || '添加失败！');
    }
    catch (e) {
      message.warning('入职失败');
    }
  }

  const handleCancel = () => {
    setIsOpen(false);
  }

  const handleFinish = async (value: BaseEmployeeLeaveEdit) => {
    try {
      const { accountId } = initialValues.current;
      const params = {
        ...value,
        accountId,
      }
      const result = await getBaseEmployeeLeaveEdit(params);
      if (result.resultCode === '1') {
        message.success('修改成功')
        actionRef.current?.reload();
        setIsOpen(false);
        return;
      }
      setIsOpen(false);
      message.warning('修改失败')
    }
    catch (e) {
      message.warning('修改失败')
    }
  }
  // const handleSave = async (data: any) => {
  //   try {
  //     const result = await getBaseEmployeeLeaveEdit(data);
  //     if (result.resultCode === '1') {
  //       message.success('修改成功')
  //       actionRef.current?.reload();
  //       return;
  //     }
  //     message.warning('修改失败')
  //   }
  //   catch (e) {
  //     message.warning('修改失败')
  //   }
  // }

  return (
    <div className={styles.main} id='proTable'>
      <ProTable
        columns={columns}
        scroll={{ x: 1300, y: height }}
        actionRef={actionRef}
        //cardBordered
        request={handleRequest}
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
        rowKey="accountId"
        search={{
          labelWidth: 'auto',
          className: 'proForm'
        }}
        options={false}
        pagination={{
          defaultPageSize: 20,
          pageSizeOptions: [5, 10, 50],
          showSizeChanger: true,
        }}
        dateFormatter="string"
        headerTitle="岗位资料"
        toolBarRender={() => [
          <Button key="3">
            导出
          </Button>
        ]}
      />
      <Modal title={'编辑'} open={isOpen} onCancel={handleCancel} footer={null} destroyOnClose>
        <ProForm
          onFinish={async (values) => {
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
            name="personName"
            width="md"
            label="姓名"
            placeholder="请输入姓名"
            disabled
            rules={[{ required: true, message: '这是必填项' }]}
          />
          <ProFormSelect
            name="leaveType"
            width="md"
            label="离职类型"
            placeholder="请输入离职类型"
            options={selectOption}
            rules={[{ required: true, message: '这是必填项' }]}
          />
          <ProFormText
            name="leaveReason"
            width="md"
            label="离职原因"
            placeholder="请输入离职原因"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm>
      </Modal>
    </div >
  );
};