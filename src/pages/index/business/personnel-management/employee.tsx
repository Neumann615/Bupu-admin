import { ActionType, ParamsType, ProColumns, ProForm, ProFormText, ProFormDateTimeRangePicker, ProFormDatePicker } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm, Upload, UploadProps } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getOrganizationalEmployeeList, getBaseEmployeeAdd, getBaseEmployeeEdit, getBaseEmployeeDel, getBaseEmployeeLeave } from '@/api/employee';
import React, { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'; import { downloadByPost } from '@/shared/download';
import { searchParentId } from '@/utils/tree';
;
export interface FormValues {
    personPwd: string;
    personName: string;
    personId: string;
    jobId: string;
    idCard: string;
    departId: string;
    levelId: string;
    personMobile: string;
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
    const [height, setHeight] = useState(0);
    const [mode, setMode] = useState<string>('add');
    const [isSpinning, setIsSpinning] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const columns: ProColumns[] = [
        {
            title: '姓名',
            dataIndex: 'personName',
            ellipsis: true,
            width: 100,
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
            width: 100,
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
            valueType: 'date',
            search: false,
            editable: false,
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
            search: false,
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
            search: false,
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
            valueType: 'date',
            editable: false,
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
            search: false,
            width: 100,
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
            width: 100,
            ellipsis: true,
            search: false,
            editable: false,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 100,
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
            render: (__, record, _, action) => [
                <Popconfirm key="lz" title='离职' description="确认离职？" onConfirm={() => {
                    handleLeave(record)
                }}>
                    <a href={record.url} target="_blank" rel="noopener noreferrer">
                        离职
                    </a>
                </Popconfirm>,
                <a
                    key="editable"
                    onClick={() => {
                        handelTableEdit(record)
                        // action?.startEditable?.(record.accountId);
                    }}
                >
                    编辑
                </a>,
                <Popconfirm key="delete" title='删除' description="确认删除此条记录？" onConfirm={() => {
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

    const handelTableEdit = (item: any) => {
        setMode('edit')
        setTitle('编辑');
        setIsOpen(true);
        const { beginTime, endTime } = item
        const itemTemp = {
            ...item,
            rangeTime: [beginTime, endTime],
        }
        initialValues.current = itemTemp
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
            setQueryParams({
                ...params,
            })
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

    const handleDelete = async (data: OriginData) => {
        try {
            const params = {
                accountId: data.accountId
            }
            const result = await getBaseEmployeeDel(params);
            if (result.resultCode === '1') {
                actionRef.current?.reload();
                message.success('删除成功')
            }
            message.warning('删除失败')
        }
        catch (e) {
            message.warning('删除失败')
        }
    }

    const handleLeave = async (data: OriginData) => {
        try {
            const params = {
                accountId: data.accountId
            }
            const result = await getBaseEmployeeLeave(params);
            if (result.resultCode === '1') {
                actionRef.current?.reload();
                message.success('离职成功')
                return;
            }
            message.warning(result.resultMsg || '操作失败')
        }
        catch (e) {
            message.warning('操作失败')
        }
    }

    const handleCancel = () => {
        setIsOpen(false);
        initialValues.current = {}
    }
    const handleFinish = async (values: any) => {
        if (mode === 'add') {
            const { rangeTime, ...rest } = values;
            const params = {
                beginTime: rangeTime[0],
                endTime: rangeTime[1],
                ...rest
            }
            try {
                const result = await getBaseEmployeeAdd(params);
                if (result.resultCode === '1') {
                    message.success('添加成功');
                    actionRef.current?.reload();
                    initialValues.current = {}
                    setIsOpen(false)
                    return;
                }
                message.warning(result.resultMsg || '添加失败！')
            }
            catch (e) {
                message.warning('添加失败！')
            }
        }
        else if (mode === 'edit') {
            const { cardId, accountId } = initialValues.current;
            const { rangeTime, ...rest } = values;
            let data = {
                cardId,
                accountId,
                beginTime: rangeTime[0],
                endTime: rangeTime[1],
                ...rest,
            }
            const result = await getBaseEmployeeEdit(data);
            if (result.resultCode === '1') {
                initialValues.current = {}
                message.success('编辑成功');
                actionRef.current?.reload();
                setIsOpen(false)
            }
        }
    }



    const handleSave = async (data: any) => {
        const result = await getBaseEmployeeEdit(data);
        if (result.resultCode === '1') {
            message.success('修改成功')
            actionRef.current?.reload();
            return
        }
        message.warning('添加失败！')
    }

    const handleAdd = () => {
        setMode('add');
        setIsOpen(true)
        setTitle('新建');
    }

    /**
 * 导出
 */
    const handleExport = async () => {
        setIsSpinning(true);
        try {
            const result = downloadByPost('/api/platform/api/human/personal/person/export', queryParams, '人事档案')
            setIsSpinning(false);
        }
        catch (e) {
            setIsSpinning(false);
            message.warning('导出失败')
        }

    }

    const uploadParam: UploadProps = {
        name: 'fileStream',
        action: '/api/platform/api/public/dbgrid/import',
        headers: {
            authorization: 'authorization-text',
        },
        data: {
            fileInfo: JSON.stringify({
                tableName: "person",
                fileName: "人事档案.xls"
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


    return (
        <div className={styles.main} id='proTable'>
            <ProTable
                columns={columns}
                scroll={{ x: 1300, y: height }}
                actionRef={actionRef}
                request={handleRequest}
                editable={{
                    type: 'multiple',
                    onSave: async (_, data) => {
                        console.log('保存')
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
            <Modal title={title} open={isOpen} onCancel={handleCancel} footer={null} destroyOnClose>
                <ProForm
                    onFinish={async (values: FormValues) => {
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
                    {/* <ProForm.Group>
                        <ProFormText
                            name="personAddress"
                            width="md"
                            label="联系地址"
                            placeholder="请输入联系地址"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm.Group> */}
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