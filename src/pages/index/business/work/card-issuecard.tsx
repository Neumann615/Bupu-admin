import React, { useEffect, useRef } from 'react';
import { ActionType, ParamsType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(() => ({
    tab: {
        width: "100%",
        height: "100%",
        padding: "12px",
    },
}))

export default () => {
    const { styles } = useStyles();
    const actionRef = useRef<ActionType>();
    const columns: ProColumns[] = [
        {
            title: 'IC卡序列号',
            dataIndex: 'cardId',
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
            title: '部门ID',
            dataIndex: 'departId',
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
    ];
    useEffect(() => {
    })

    const onChange = () => {

    }

    const handleRequest = (params: ParamsType) => {
        console.log(params,'params')
        return {
            data: [],
            page: 1,
            total: 0
        }
    }


    const renderTabChildren = () => {
        return <ProTable
            columns={columns}
            scroll={{ x: 1300 }}
            actionRef={actionRef}
            request={handleRequest}
            columnsState={{
                persistenceKey: 'pro-table-singe-demos',
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
            headerTitle="卡片中心"
        />
    }

    const tabItems = [
        {
            label: '发卡',
            key: 'issuecard',
            children: renderTabChildren()
        },
        {
            label: '挂失',
            key: 'lostcard',
            children: renderTabChildren()
        },
        {
            label: '解挂',
            key: 'unhookcard',
            children: renderTabChildren()
        },
        {
            label: '补卡',
            key: 'reissuecard',
            children: renderTabChildren()
        },
        {
            label: '退卡',
            key: 'returncard',
            children: renderTabChildren()
        },
    ]

    return <Tabs defaultActiveKey="1" onChange={onChange} items={tabItems} className={styles.tab} />
}