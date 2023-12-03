import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProForm, ProFormText } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import { getOrganizationalDepartList, getBaseAreaDel, getPartTree } from '@/api/departApi';
import React, { useEffect, useState } from 'react';
import Tree from '@/components/common/group-tree/GroupTree';
import { Button, message } from 'antd';
import { useRef } from 'react';

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

interface IResult {
    msg: string;
    success: boolean;
    items: IItem[];
}
interface IItem {
    attributes: IAttributes;
    children: IItem[];
    id: string;
    departName: string;
}
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

const columns: ProColumns<GithubIssueItem>[] = [
    // {
    //     dataIndex: 'index',
    //     valueType: 'indexBorder',
    //     width: 48,
    // },
    {
        title: '部门名称',
        dataIndex: 'departName',
        ellipsis: true,

    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        ellipsis: true,
        search: false
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        ellipsis: true,
        search: false
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
            <a href={record.url} target="_blank" rel="noopener noreferrer" key="delete" onClick={() => { handleDelete(record, action) }}>
                删除
            </a>,
        ],
    },
];

const useStyles = createStyles(() => ({
    main: {
        width: "100%",
        height: "100%",
        padding: "12px",
        display: "flex",
    },
    tree: {
        width: '30%',
        height: '100%',
        marginRight: '12px'
    },
    right: {
        width: '70%'
    }
}))

export default () => {
    const actionRef = useRef<ActionType>();
    const { styles } = useStyles();
    const [treeData, setTreeData] = useState<DataNode[]>([])
    const [title, setTitle] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        // init()
    })

    const init = async () => {
        const { code, data, msg } = await initTreeData()
        if (code === 0) {
            setTreeData(data!)
            return
        }
        message.warning(msg);
    }
    const handleRequest = async (params, sort, filter) => {
        console.log(params, 'chaxun')
        const params1 = {
            departName: params.departName,
            pageNum: params.current,
            pageSize: params.pageSize,
        }
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
    const initTreeData = async () => {
        try {
            const result = await getPartTree();
            console.log(result, 'reuslt')
            return {
                code: 0,
                data: transformGroup(result.data.data),
                msg: '',
            };
        } catch (error) {
            console.log(error);
            return {
                code: 1,
                msg: "组织信息获取失败!",
            };
        }
    }

    const transformGroup = (data: IItem[]) => {
        const loop = (data: IItem[]) => {
            return data.map(l => {
                const {
                    departName,
                    id,
                    children,
                } = l;
                const obj: DataNode = {
                    title: departName,
                    key: id,
                };
                if (children?.length) {
                    obj.children = loop(children);
                    return obj;
                }
                return obj;
            });
        };

        return loop(data);
    }

    const handleDelete = async (data, action) => {
        if (data.children?.length) {
            message.warning('该节点下面有子节点，暂不允许删除！')
            return;
        }
        console.log(data, 'data');
        const params = {
            id: data.id
        }
        await getBaseAreaDel(params);
        action.reload();
    }

    // 列表转树状结构
    const transFormTreeData = (list) => {
        const map = {};
        const tree = [];
        for (const node of list) {
            map[node.id] = { ...node }
        }
        for (const node of Object.values(map)) {
            if (node.pid === '0') {
                tree.push(node)
            }
            else {
                map[node.pid].children ? map[node.pid].children.push(node) : map[node.pid].children = [node]
            }
        }
        return tree
    }
    // console.log(listToTree(treeToList(tree)))
    const handleOk = () => {

    }

    const handleCancel = () => {

    }

    return (
        <div className={styles.main}>
            <div className={styles.tree}>
                {/* <Tree data={treeData} /> */}
            </div>
            <div className={styles.right}>
                <ProTable<GithubIssueItem>
                    columns={columns}
                    actionRef={actionRef}
                    cardBordered
                    request={handleRequest}
                    editable={{
                        type: 'multiple',
                    }}
                    style={{ height: '100%' }}
                    columnsState={{
                        persistenceKey: 'pro-table-singe-demos',
                        persistenceType: 'localStorage',
                        onChange(value) {
                            console.log('value: ', value);
                        },
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
                        defaultCurrent: 10,
                        pageSizeOptions: [10, 20, 50],
                        showSizeChanger: true,
                        onChange: (page) => {
                            console.log(page)
                            actionRef.current?.reload();
                        },
                    }}
                    dateFormatter="string"
                    headerTitle="部门资料"
                    toolBarRender={() => [
                        <Button
                            key="button"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setTitle('新建');
                                setIsOpen(true);
                                // actionRef.current?.reload();
                            }}
                            type="primary"
                        >
                            新建
                        </Button>
                    ]}
                />
            </div>
            <Modal title={title} open={isOpen} onOk={handleOk} onCancel={handleCancel}>
                <ProForm>
                    <ProFormText
                        name={['departName']}
                        width="md"
                        label="部门"
                        placeholder="请输入部门名称"
                    />
                </ProForm>
            </Modal>
        </div>
    );
};