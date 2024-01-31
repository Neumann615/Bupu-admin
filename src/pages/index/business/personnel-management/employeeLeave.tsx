import { ActionType, ParamsType, ProColumns, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getPersonalEmployeeLeaveList, getBaseEmployeeLeaveEdit, getBaseEmployeeEntry } from '@/api/employeeLeave';
import React, { useState, useRef } from 'react';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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
  sex: string;
  updatetime: string;
  timeBalance: string;
  pushMsg: string;
  birthDate: string;
  longLat: string;
  nickName: string;
  personPwd: string;
  sequId: string;
  personName: string;
  personId: string;
  doorRule: string;
  departName: string;
  jobId: string;
  previousWalletBalance: string;
  updateBy: string;
  isDel: string;
  beginTime: string;
  idCard: string;
  lastTime: string;
  departId: string;
  entryTime: string;
  cashBalance: string;
  cardSn: string;
  previousSubsidyBalance: string;
  leaveType: string;
  leaveTime: string;
  wxStatus: string;
  createTime: string;
  personAddress: string;
  leaveReason: string;
  subsidyBalance: string;
  previousCashBalance: string;
  accountId: number;
  payOpenId: string;
  loginPwd: string;
  endTime: string;
  openId: string;
  levelId: string;
  consumeRule: string;
  jobName: string;
  personMobile: string;
  createBy: string;
  headImg: string;
  appId: string;
  attendanceRule: string;
  askLeaveTime: string;
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

export default () => {
  const actionRef = useRef<ActionType>();
  const { styles } = useStyles();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const initialValues = useRef<Record<string, any>>({})
  const [title, setTitle] = useState('增加');
  const columns: ProColumns<GithubIssueItem>[] = [
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
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.personId);
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

  const handleRequest = async (params: ParamsType) => {
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

  const handleEntry = async (data: GithubIssueItem | OriginData) => {
    try {
      const params = {
        accountId: data.accountId
      }
      const result = await getBaseEmployeeEntry(params);
      if(result?.resultCode === '1'){
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
    initialValues.current = {}
  }
  const handleFinish = async (values: FormValues) => {
    try {
      const result = await getBaseEmployeeLeaveAdd(values);
      if (result.resultCode === '1') {
        message.success('添加成功');
        actionRef.current?.reload();
        initialValues.current = {}
        setIsOpen(false)
        return;
      }
      message.warning('添加失败！')
    }
    catch (e) {
      message.warning('添加失败！')
    }
  }



  const handleSave = async (data: GithubIssueItem) => {
    const result = await getBaseEmployeeLeaveEdit(data);
    if (result.resultCode === '0') {
      message.success('修改成功')
      actionRef.current?.reload();
    }
  }

  const handleAdd = () => {
    setIsOpen(true)
    setTitle('新建');
  }

  return (
    <div className={styles.main}>
      <ProTable<GithubIssueItem>
        columns={columns}
        scroll={{ x: 1300 }}
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
        toolBarRender={() => [
          <Button key="3" type="primary" onClick={handleAdd}>
            <PlusOutlined />
            新建
          </Button>,
        ]}
      />
      <Modal title={title} open={isOpen} onCancel={handleCancel} footer={null} destroyOnClose>
        <ProForm
          onFinish={async (values: {
            jobName: string
          }) => {
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
              name="accountId"
              width="md"
              label="账号"
              placeholder="请输入账号"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              width="md"
              placeholder="请输入离职类型"
              rules={[{ required: true, message: '这是必填项' }]}
              name="leaveType"
              label="离职类型"
              options={[
                {
                  value: "1",
                  label: "退休",
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
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="leaveReason"
              width="md"
              label="离职原因"
              placeholder="请输入离职原因"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
        </ProForm>
      </Modal>
    </div >
  );
};