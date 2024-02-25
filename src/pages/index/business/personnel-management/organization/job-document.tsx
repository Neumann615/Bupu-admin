import { ActionType, ParamsType, ProColumns, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getJobList, getBasJobAdd, getBaseJobEdit, getBaseJobDel } from '@/api/job';
import React, { useState, useRef } from 'react';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

interface OriginData {
    children: OriginData[];
    departName: string;
    id: number;
}

const useStyles = createStyles(() => ({
    main: {
        width: "100%",
        height: "100%",
        padding: "12px",
        display: "flex",
    },
}))

export default () => {
    const actionRef = useRef<ActionType>();
    const { styles } = useStyles();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const initialValues = useRef<Record<string, any>>({})
    const [title, setTitle] = useState('增加');
    const [height,setHeight] = useState(0);
    const columns: ProColumns[] = [
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
            render: (__, record, _, action) => [
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

    useEffect(() => {
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

    const handleDelete = async (data: OriginData) => {
        try {
            const params = {
                id: data.id
            }
            const result = await getBaseJobDel(params);
            if(result.resultCode === '1'){
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
        if (result.resultCode === '1') {
            message.success('添加成功');
            actionRef.current?.reload();
            initialValues.current = {}
            setIsOpen(false)
            return 
        }
        message.warning('添加失败');
    }



    const handleSave = async (data:any) => {
        const { id, jobName, pid } = data;
        const params = {
            id,
            pid,
            jobName,
        }
        const result = await getBaseJobEdit(params);
        if (result.resultCode === '1') {
            message.success('修改成功')
            actionRef.current?.reload();
            return
        }
        message.warning('编辑失败');
    }

    const handleAdd = () => {
        console.log('弹出安徽')
        setIsOpen(true)
        setTitle('新建');
    }

    return (
        <div className={styles.main} id='proTable'>
            <ProTable
                columns={columns}
                actionRef={actionRef}
                cardBordered
                scroll={{y:height}}
                request={handleRequest}
                editable={{
                    type: 'multiple',
                    onSave: async (_, data) => {
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
                    className:'proForm'
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