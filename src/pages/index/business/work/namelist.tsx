import { DeleteOutlined, EditOutlined, FolderAddOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ColumnsState, ParamsType, ProColumns, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm, Spin, Upload, UploadProps } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getPartTree } from '@/api/departApi';
import React, { useEffect, useState, useRef } from 'react';
import Tree from '@/components/common/group-tree/GroupTree';
import { downloadByPost } from '@/shared/download';
import { transformGroup, searchParentId } from '@/utils/tree';
import { getGridcolAdd, getGridcolList } from '@/api/commonApi';
import { TreeDataOrigin } from '@/components/common/group-tree/GroupTree';
import { message } from 'antd';
import { GridcolAddCols } from '@/types/api';
import { getNameList, getNameListAdd, getNameListDel } from '@/api/namelist';
import moment from 'moment';
const { confirm } = Modal

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
    const [title, setTitle] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [height, setHeight] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const [tableExtraParams, setTableExtraParams] = useState({});
    const initialValues = useRef<Record<string, any>>({});
    const [columnsStateMap, setColumnsStateMap] = useState<
        Record<string, ColumnsState>
    >({});
    const columns: ProColumns[] = [
        {
            title: '日期范围',
            dataIndex: 'startTime',
            valueType: 'dateRange',
            hideInTable: true,
            initialValue: [moment().subtract(1, 'years'), moment()],
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
            title: '人员姓名',
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
        },
        {
            title: '设备序列号',
            dataIndex: 'devSerial',
            ellipsis: true,
            search: false,
            editable: false,
        },
        {
            title: '设备编号',
            dataIndex: 'devId',
            ellipsis: true,
            search: false,
            editable: false,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            filters: false,
            fixed: 'right',
            render: (__, record) => [
                <Popconfirm key="delete" title='删除' description="确认删除该名单？" onConfirm={() => {
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
    }, [])


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
        const { current, pageSize, startTime, ...rest } = params
        const params1 = {
            pageNum: current,
            pageSize: pageSize,
            //TODO:
            timeType: 1, // 0下载到设备时间查询，1操作时的时间
            beginTime: startTime[0],
            endTime: startTime[1],
            ...rest,
        }
        setQueryParams({
            ...params,
        })
        try {
            const result = await getNameList(params1);
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
            // const result = downloadByPost('/api/platform/api/human/organizational/depart/export', queryParams, '部门资料')
            setIsSpinning(false);
        }
        catch (e) {
            setIsSpinning(false);
            message.warning('导出失败')
        }

    }

    const handleDelete = async (data: Record<string, any>) => {
        try {
            const params = {
                accountId: [data.accountId],
                devSerial: [data.devSerial],
            }
            await getNameListDel(params);
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

    const handleAdd = () => {
        setTitle('添加');
        setIsOpen(true);
    }

    const handleFinish = async (values: Record<string, any>) => {
        const params = {
            accountId: [],
            devSerial: [],
        }
        const result = await getNameListAdd(params);
        // if (result.resultCode === '1') {
        //     await init()
        //     message.success('添加成功');
        //     actionRef.current?.reload();
        //     initialValues.current = {}
        //     setIsOpen(false)
        // }
    }

    const handleSelect = async (node: number) => {
        console.log(node, 'node');
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
                fileName: "部门资料.xls"
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
                        headerTitle="部门资料"
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
                <Modal title={title} open={isOpen} onCancel={handleCancel} footer={null} destroyOnClose>
                    <ProForm
                        onFinish={async (values: {
                            departName: string
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
                            name="departName"
                            width="md"
                            label="部门"
                            placeholder="请输入部门名称"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                    </ProForm>
                </Modal>
            </div >
        </>
    );
};