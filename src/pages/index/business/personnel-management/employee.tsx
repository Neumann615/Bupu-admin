import { ActionType, ParamsType, ProColumns, ProForm, ProFormText, ProFormDateTimeRangePicker, ProFormDatePicker } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getOrganizationalEmployeeList, getBaseEmployeeAdd, getBaseEmployeeEdit, getBaseEmployeeDel } from '@/api/employee';
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
    accountId: string;
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
    rangeTime:string;
}

interface OriginData {
    children: OriginData[];
    departName: string;
    id: number;
}

const useStyles = createStyles(({ token }) => ({
    main: {
        width: "100%",
        height: "100%",
        padding: "12px",
        //display: "flex",
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
            title: '出生日期',
            dataIndex: 'birthDate',
            ellipsis: true,
            width: 150,
            search: false,
            fixed: "left",
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
            title: '人员编号',
            dataIndex: 'personId',
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
            title: '岗位id',
            dataIndex: 'jobId',
            ellipsis: true,
            width: 150,
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
            title: '有效开始时间',
            dataIndex: 'beginTime',
            ellipsis: true,
            width: 150,
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
            title: '身份证号',
            dataIndex: 'idCard',
            ellipsis: true,
            width: 150,
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
            title: '部门ID',
            dataIndex: 'departId',
            ellipsis: true,
            width: 150,
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
            title: '卡序列号',
            dataIndex: 'cardSn',
            ellipsis: true,
            width: 150,
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
            title: '有效结束时间',
            dataIndex: 'endTime',
            ellipsis: true,
            width: 150,
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
            title: '级别',
            dataIndex: 'levelId',
            ellipsis: true,
            width: 150,
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
            title: '手机号',
            dataIndex: 'personMobile',
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
            title: '联系地址',
            dataIndex: 'personAddress',
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
                <Popconfirm key="delete" title='删除' description="该岗位下的子节点也会被一起删除，确认删除岗位？" onConfirm={() => {
                    handleDelete(record)
                }}>
                    <a href={record.url} target="_blank" rel="noopener noreferrer">
                        删除
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
            const result = await getOrganizationalEmployeeList(params1);
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

    const handleDelete = async (data: GithubIssueItem | OriginData) => {
        try {
            const params = {
                id: data.id
            }
            await getBaseEmployeeDel(params);
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
    const handleFinish = async (values:FormValues) => {
        const { rangeTime, ...rest } = values;
        const params = {
            beginTime: rangeTime[0],
            endTime: rangeTime[1],
            ...rest
        }
        try{
            const result = await getBaseEmployeeAdd(params);
            if (result.resultCode === '0'){
                message.success('添加成功');
                actionRef.current?.reload();
                initialValues.current = {}
                setIsOpen(false)
                return;
            }
            message.warning('添加失败！')
        }
        catch(e){
            message.warning('添加失败！')
        }
    }



    const handleSave = async (data: GithubIssueItem) => {
        const { id, jobName, pid } = data;
        const params = {
            id,
            pid,
            jobName,
        }
        const result = await getBaseEmployeeEdit(params);
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
                            name="personName"
                            width="md"
                            label="姓名"
                            placeholder="请输入名称"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            name="personId"
                            width="md"
                            label="人员编号"
                            placeholder="请输入人员编号"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            name="jobId"
                            width="md"
                            label="岗位ID"
                            placeholder="请输入岗位ID"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            name="idCard"
                            width="md"
                            label="身份证号"
                            placeholder="请输入身份证号"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            name="departId"
                            width="md"
                            label="部门ID"
                            placeholder="请输入部门ID"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            name="cardSn"
                            width="md"
                            label="卡序列号"
                            placeholder="请输入卡序列号"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            name="levelId"
                            width="md"
                            label="级别"
                            placeholder="请输入级别"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            name="personMobile"
                            width="md"
                            label="手机号"
                            placeholder="请输入手机号"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            name="personAddress"
                            width="md"
                            label="联系地址"
                            placeholder="请输入联系地址"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormDateTimeRangePicker
                            width="md"
                            name='rangeTime'
                            rules={[{ required: true, message: '这是必填项' }]}
                            label="合同生效时间"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormDatePicker
                            width="md"
                            name="birthDate"
                            rules={[{ required: true, message: '这是必填项' }]}
                            label="出生日期" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText.Password
                            name="personPwd"
                            width="md"
                            label="个人密码"
                            placeholder="请输入密码"
                            rules={[{ required: true, message: '这是必填项' },
                            () => ({
                                validator(_, value) {
                                    if (value?.length <= 6) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('密码长度需小于六位!'));
                                },
                            }),]}
                        />
                    </ProForm.Group>
                </ProForm>
            </Modal>
        </div >
    );
};