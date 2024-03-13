import React, { useEffect, useRef, useState } from 'react';
import { ActionType, ParamsType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Tabs, Button } from 'antd';
import { createStyles } from 'antd-style';
import moment from 'moment'
import { getIssuecard, getLostcard, getReissuecard, getReturncard, getUnhookcard } from '@/api/cardIssuecard';
import SelectGroup from '@/components/common/select-group/SelectGroup';

const treeDataTemp = [
    {
        "name": "测试",
        "children": [
            {
                "name": "财务分部",
                "children": [
                    {
                        "name": "财务分部一部",
                        "children": [
                            {
                                "name": "财务分布测试",
                                "children": [
                                    {
                                        "name": "测测试",
                                        "id": "263"
                                    }
                                ],
                                "id": "262"
                            }
                        ],
                        "id": "227"
                    }
                ],
                "id": "226"
            },
            {
                "name": "财务部测试",
                "id": "235"
            },
            {
                "name": "aaaa11111",
                "id": "250"
            },
            {
                "name": "aaaa",
                "id": "251"
            },
            {
                "name": "aaaa",
                "id": "252"
            },
            {
                "name": "aaaa",
                "id": "253"
            },
            {
                "name": "aaaa",
                "id": "254"
            },
            {
                "name": "aaaa",
                "id": "255"
            },
            {
                "name": "aaaa",
                "id": "256"
            },
            {
                "name": "aaaa",
                "id": "257"
            },
            {
                "name": "aaaa",
                "id": "258"
            },
            {
                "name": "aaaa",
                "id": "259"
            }
        ],
        "id": "223"
    },
]
const useStyles = createStyles(() => ({
    tab: {
        width: "100%",
        height: "100%",
        padding: "12px",
    },
}))

const tabNum: Record<string, string> = {
    'issuecard': '发卡',
    'lostcard': '挂失',
    'unhookcard': '解挂',
    'reissuecard': '补卡',
    'returncard': '退卡'
}

export interface TabProps {
    title: string;
}

export default () => {
    const { styles } = useStyles();
    const actionRef = useRef<ActionType>();
    const [activeKey, setActiveKey] = useState<string>('issuecard');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [treeData, setTreeData] = useState<any[]>(treeDataTemp);
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
            title: 'IC卡序列号',
            dataIndex: 'cardId',
            ellipsis: true,
            search: false,
        },
        {
            title: '部门ID',
            dataIndex: 'departId',
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
            title: '人员姓名',
            dataIndex: 'personName',
            ellipsis: true,
        },
    ];
    useEffect(() => {
    })

    const onChange = (val: string) => {
        setActiveKey(val)
    }

    const handleRequest = async (params: ParamsType) => {
        const { current, pageSize, startTime, ...rest } = params
        const params1 = {
            pageNum: current,
            pageSize: pageSize,
            beginTime: startTime[0],
            endTime: startTime[1],
            ...rest
        }
        let result: {
            data: Record<string, any>[];
            total: number;
        } = {
            data: [],
            total: 0
        }
        switch (activeKey) {
            case 'issuecard':
                result = await handleGetIssuecard(params1);
                break;
            case 'lostcard':
                result = await handleLostcard(params1);
                break;
            case 'unhookcard':
                result = await handleUnhookcard(params1);
                break;
            case 'reissuecard':
                result = await handleReissuecard(params1);
                break;
            case 'returncard':
                result = await handleReturncard(params1);
                break;
            default:
                break;
        }
        return {
            data: result.data,
            page: params1.pageSize,
            total: result.total
        }
    }

    const handleGetIssuecard = async (params: any) => {
        try {
            const result = await getIssuecard(params)
            if (result.status === 200) {
                return {
                    data: result.data.data.list,
                    total: result.data.data.total
                }
            }
            return {
                data: [],
                total: 0
            }
        }
        catch (e) {
            return {
                data: [],
                total: 0
            }
        }
    }

    const handleLostcard = async (params: any) => {
        try {
            const result = await getLostcard(params)
            if (result.status === 200) {
                return {
                    data: result.data.data.list,
                    page: params.pageSize,
                    total: result.data.data.total
                }
            }
            return {
                data: [],
                page: 1,
                total: 0
            }
        }
        catch (e) {
            return {
                data: [],
                page: 1,
                total: 0
            }
        }
    }

    const handleUnhookcard = async (params: any) => {
        try {
            const result = await getUnhookcard(params)
            if (result.status === 200) {
                return {
                    data: result.data.data.list,
                    page: params.pageSize,
                    total: result.data.data.total
                }
            }
            return {
                data: [],
                page: 1,
                total: 0
            }
        }
        catch (e) {
            return {
                data: [],
                page: 1,
                total: 0
            }
        }
    }

    const handleReissuecard = async (params: any) => {
        try {
            const result = await getReissuecard(params)
            if (result.status === 200) {
                return {
                    data: result.data.data.list,
                    page: params.pageSize,
                    total: result.data.data.total
                }
            }
            return {
                data: [],
                page: 1,
                total: 0
            }
        }
        catch (e) {
            return {
                data: [],
                page: 1,
                total: 0
            }
        }
    }


    const handleReturncard = async (params: any) => {
        try {
            const result = await getReturncard(params)
            if (result.status === 200) {
                return {
                    data: result.data.data.list,
                    page: params.pageSize,
                    total: result.data.data.total
                }
            }
            return {
                data: [],
                page: 1,
                total: 0
            }
        }
        catch (e) {
            return {
                data: [],
                page: 1,
                total: 0
            }
        }
    }


    const renderTabChildren = (item: string) => {
        return <ProTable
            key={item}
            columns={columns}
            scroll={{ x: 1300 }}
            actionRef={actionRef}
            request={handleRequest}
            columnsState={{
                persistenceKey: 'pro-table-singe-demos-' + item,
                persistenceType: 'localStorage',
            }}
            rowKey="personId"
            search={{
                labelWidth: 'auto',
            }}
            options={false}
            form={{
                // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                syncToUrl: (values, type) => {
                    if (type === 'get') {
                        return {
                            ...values,
                        };
                    }
                    return values;
                },
                ignoreRules: false,
            }}
            pagination={{
                defaultPageSize: 20,
                pageSizeOptions: [5, 10, 50],
                showSizeChanger: true,
            }}
            dateFormatter="string"
            headerTitle="卡片中心"
            toolBarRender={() => [
                <Button type="primary" onClick={() => handleClick(item)}>{tabNum[item]}</Button>,
            ]}
        />
    }

    const handleClick = (item: string) => {
        console.log(tabNum, 'tabNum');
        setIsOpen(true);
        setTitle(tabNum[item])
    }

    const tabItems = [
        {
            label: '发卡',
            key: 'issuecard',
            children: renderTabChildren('issuecard')
        },
        {
            label: '挂失',
            key: 'lostcard',
            children: renderTabChildren('lostcard')
        },
        {
            label: '解挂',
            key: 'unhookcard',
            children: renderTabChildren('unhookcard')
        },
        {
            label: '补卡',
            key: 'reissuecard',
            children: renderTabChildren('reissuecard')
        },
        {
            label: '退卡',
            key: 'returncard',
            children: renderTabChildren('returncard')
        },
    ]

    return <>
        <Tabs activeKey={activeKey} onChange={onChange} items={tabItems} className={styles.tab} />
        <SelectGroup isOpen={isOpen} title={title} treeData={treeData} />
    </>
}