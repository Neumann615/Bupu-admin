import { ActionType, ParamsType, ProColumns, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getJobList, getBasJobAdd, getBaseJobEdit, getBaseJobDel } from '@/api/job';
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
    jobName: string;
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

interface IAttributes {
    code: string;
    ecode: string;
    info: string;
    level: string;
    memo: string | null;
    orderby: string;
    type: string;
    visible: string | boolean | null;
}

interface DataNode {
    key: string;
    title: string;
    children?: DataNode[];
}

interface TreeDataOrigin {
    key: number;
    originData: OriginData;
    title: string;
    children?: TreeDataOrigin[];
}

interface OriginData {
    children: OriginData[];
    departName: string;
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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const initialValues = useRef<Record<string, any>>({})
    const currentSelect = useRef<TreeDataOrigin | {}>({});
    const [title, setTitle] = useState('增加');
    const columns: ProColumns<GithubIssueItem>[] = [
        {
            title: '岗位名称',
            dataIndex: 'jobName',
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
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
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
            jobName: params.jobName,
            pageNum: params.current,
            pageSize: params.pageSize,
        }
        try {
            const result = await getJobList(params1);
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
            await getBaseJobDel(params);
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
        jobName: string
    }) => {
        const { jobName } = values
        const params = {
            jobName,
        }
        const result = await getBasJobAdd(params);
        if (result.resultCode === '0') {
            message.success('添加成功');
            actionRef.current?.reload();
            initialValues.current = {}
            setIsOpen(false)
        }
    }



    const handleSave = async (data: GithubIssueItem) => {
        const { id, jobName, pid } = data;
        const params = {
            id,
            pid,
            jobName,
        }
        const result = await getBaseJobEdit(params);
        if (result.resultCode === '0') {
            message.success('修改成功')
            actionRef.current?.reload();
        }
    }

    const handleAdd = () => {
        console.log('弹出安徽')
        setIsOpen(true)
        setTitle('新建');
    }

    return (
        <div className={styles.main}>
            <ProTable<GithubIssueItem>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={handleRequest}
                editable={{
                    type: 'multiple',
                    onSave: async (rowKey, data, row) => {
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
                }}
                options={{
                    setting: {
                        listsHeight: 400,
                    },
                }}
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
                        name="jobName"
                        width="md"
                        label="岗位"
                        placeholder="请输入岗位名称"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                </ProForm>
            </Modal>
        </div >
    );
};