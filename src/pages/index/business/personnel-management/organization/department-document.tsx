import { DeleteOutlined, EditOutlined, FolderAddOutlined } from '@ant-design/icons';
import { ActionType, ColumnsState, ParamsType, ProColumns, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm, Spin, Upload, UploadProps } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getOrganizationalDepartList, getPartTree, getBaseDepartEdit, getBaseDepartDel, getBaseDepartAdd } from '@/api/departApi';
import React, { useEffect, useState, useRef } from 'react';
import Tree from '@/components/common/group-tree/GroupTree';
import { downloadByPost } from '@/shared/download';
import { transformGroup, searchParentId } from '@/utils/tree';
import { getGridcolAdd, getGridcolList } from '@/api/commonApi';
import { TreeDataOrigin } from '@/components/common/group-tree/GroupTree';
import { message } from 'antd';
import { GridcolAddCols } from '@/types/api';
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
    const [treeData, setTreeData] = useState<TreeDataOrigin[]>([])
    const [selectKey, setSelectKey] = useState<number | null>(null)
    // 弹框
    const [title, setTitle] = useState<string>('');
    const [mode, setMode] = useState<string>('add');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [height, setHeight] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [queryParams, setQueryParams] = useState({});

    const initialValues = useRef<Record<string, any>>({})
    const [columnsStateMap, setColumnsStateMap] = useState<
        Record<string, ColumnsState>
    >({});
    const columns: ProColumns[] = [
        {
            title: '部门名称',
            dataIndex: 'departName',
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
            filters: false,
            fixed: 'right',
            render: (__, record) => [
                <a
                    key="editable"
                    onClick={() => {
                        handelTableEdit(record)
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
        init();
        initColumn();
        handleResize()
        window.addEventListener('resize', handleResize, { passive: true })
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const handelTableEdit = (item: any) => {
        setMode('edit')
        setTitle('编辑');
        setIsOpen(true);
        initialValues.current = item
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

    const initColumn = async () => {
        try {
            const params = {
                gridName: 'depart'
            }
            const result = await getGridcolList(params);
            const colsData = result.data.data.list
            const columnsData: Record<string, any> = {}
            colsData.forEach(i => {
                if (i['colVisible'] === '0') {
                    columnsData[i['colName']] = {
                        show: false,
                    }
                }
            })
            setColumnsStateMap(columnsData)
        }
        catch (e) {
            message.warning('获取列表数据失败！')
        }
    }

    const handleRequest = async (params: ParamsType) => {
        const params1 = {
            departName: params.departName,
            pageNum: params.current,
            pageSize: params.pageSize,
        }
        setQueryParams({
            departName: params.departName,
        })
        try {
            const result = await getOrganizationalDepartList(params1);
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
            const result = downloadByPost('/api/platform/api/human/organizational/depart/export', queryParams, '部门资料')
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
                id: data.id
            }
            await getBaseDepartDel(params);
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
        setTitle('编辑');
        setIsOpen(true);
    }

    const handleFinish = async (values: {
        departName: string
    }) => {
        const { departName } = values
        if (mode === 'add') {
            const params = {
                pid: selectKey!,
                departName,
            }
            const result = await getBaseDepartAdd(params);
            if (result.resultCode === '1') {
                await init()
                message.success('添加成功');
                actionRef.current?.reload();
                initialValues.current = {}
                setIsOpen(false)
            }
        }
        else if (mode === 'edit') {
            const { id, pid } = initialValues.current;
            let itemPid = '0'
            if (pid === 'undefined') {
                const item = searchParentId(treeData, id)
                itemPid = item?.length ? item[0]?.key : 0
            }
            else {
                itemPid = pid
            }
            let params = {
                pid: itemPid,
                id,
                departName,
            }
            const result = await getBaseDepartEdit(params);
            if (result.resultCode === '1') {
                await init()
                initialValues.current = {}
                message.success('编辑成功');
                actionRef.current?.reload();
                setIsOpen(false)
            }
        }
    }

    const handleSave = async (data: any) => {
        const { id, departName, pid } = data;
        const params = {
            id,
            pid,
            departName,
        }
        const result = await getBaseDepartEdit(params);
        if (result.resultCode === '1') {
            message.success('修改成功')
            actionRef.current?.reload();
        }

    }

    const handleSelect = async (node: number) => {
        setSelectKey(node)
    }

    const handleDrop = async (info: any) => {
        confirm({
            title: "确认拖拽",
            content: `确认将${info.dragNode.originData.departName}拖拽到${info.node.originData.departName}`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const dropKey = info.node.key;
                const params = {
                    ...info.dragNode.originData,
                    pid: dropKey
                }
                const result = await getBaseDepartEdit(params);
                if (result.resultCode === '1') {
                    await init()
                    initialValues.current = {}
                    message.success('拖拽成功！');
                    actionRef.current?.reload();
                }
            }
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

    const renderTreeFooter = (item: TreeDataOrigin) => {
        return <div>
            <FolderAddOutlined className={styles.treeItemIcon} title='添加' onClick={handelAdd} />
            <EditOutlined className={styles.treeItemIcon} title='修改' onClick={() => { handelEdit(item) }} />
            <Popconfirm key="delete" title='删除' description="该部门下的子节点也会被一起删除，确认删除该部门？" onConfirm={() => {
                handleDelete(item.originData)
            }}>
                <DeleteOutlined title='删除' />
            </Popconfirm>
        </div>

        // <div className={styles.treeItem}>
        //     <div>{item.title}</div>
        //     <div>
        //         <FolderAddOutlined className={styles.treeItemIcon} title='添加' onClick={handelAdd} />
        //         <EditOutlined className={styles.treeItemIcon} title='修改' onClick={() => { handelEdit(item) }} />
        //         <Popconfirm key="delete" title='删除' description="该部门下的子节点也会被一起删除，确认删除该部门？" onConfirm={() => {
        //             handleDelete(item.originData)
        //         }}>
        //             <DeleteOutlined title='删除' />
        //         </Popconfirm>
        //     </div>
        // </div>
    }

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

    const handleClick  = () => {
        console.log('123')
        const url = `${window.location.origin}/exportTemplate/departExport.xls`;
        window.open(url,'_parent')
    }

    return (
        <>
            <Spin tip="加载中..." size="small" spinning={isSpinning} wrapperClassName={styles.spin} fullscreen />
            <div className={styles.main}>
                <div className={styles.tree}>
                    <Tree
                        data={treeData}
                        renderTreeFooter={renderTreeFooter}
                        onSelect={handleSelect}
                        treeProps=
                        {
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
                        columns={columns}
                        actionRef={actionRef}
                        cardBordered
                        request={handleRequest}
                        scroll={{ y: height }}
                        editable={{
                            type: 'multiple',
                            onSave: async (_, data) => {
                                handleSave(data)
                            },
                        }}
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
                            </Popconfirm>,
                            <Button onClick={handleClick}>导入模板下载</Button>
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