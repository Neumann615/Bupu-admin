import React, { useRef, useState } from 'react';
import { Button, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import { ActionType, ParamsType, ProColumns, ProTable } from '@ant-design/pro-components';
import { getRechargeList, getRefundList, getCorrectionList } from '@/api/consumeDetail';
import moment from 'moment';
import { RechargeListParams } from '@/types/consumeDetail';
const { TabPane } = Tabs;

const useStyles = createStyles(() => ({
    tab: {
        width: "100%",
        height: "100%",
        padding: "12px",
    },
}))

const tabNum: Record<string, string> = {
    'recharge': '充值',
    'refund': '取款',
    'correction': '更正',
};

export default () => {
    const { styles } = useStyles();
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
            title: '交易单号',
            dataIndex: 'tradeNo',
            ellipsis: true,
            search: false,
        },
        {
            title: '交易类型',
            dataIndex: 'tradeType',
            ellipsis: true,
            valueType: 'select',
            valueEnum: {
                1: { text: '现金' },
                2: {
                    text: '补贴',
                },
                3: {
                    text: '支付宝 ',
                },
                4: {
                    text: '微信',
                },
                5: {
                    text: '银行',
                },
            },
        },
    ];
    const actionRef = useRef<ActionType>();
    const [activeKey, setActiveKey] = useState<string>('recharge');

    const renderTabChildren = (value: string) => {
        return <ProTable
            key={value}
            columns={columns}
            scroll={{ x: 1300 }}
            actionRef={actionRef}
            request={handleRequest}
            rowKey="personId"
            search={{
                labelWidth: 'auto',
            }}
            options={false}
            pagination={{
                defaultPageSize: 20,
                pageSizeOptions: [5, 10, 50],
                showSizeChanger: true,
            }}
            headerTitle="充值中心"
            toolBarRender={() => [
                <Button type="primary" onClick={() => handleClick(value)}>{tabNum[value]}</Button>,
            ]}
        />
    }

    const handleClick = (value: string) => {

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
        result = await handleRecharged(params1, activeKey)
        return {
            data: result.data,
            page: params1.pageSize,
            total: result.total
        }
    }

    const handleRecharged = async (params: RechargeListParams, type: string) => {
        try {
            if (type === 'recharge') {
                const result = await getRechargeList(params)
                if (result.status === 200) {
                    return {
                        data: result.data.data.list,
                        total: result.data.data.total
                    }
                }
            }
            else if (type === 'refund') {
                const result = await getRefundList(params)
                if (result.status === 200) {
                    return {
                        data: result.data.data.list,
                        total: result.data.data.total
                    }
                }
            }
            else if (type === 'correction') {
                const result = await getCorrectionList(params)
                if (result.status === 200) {
                    return {
                        data: result.data.data.list,
                        total: result.data.data.total
                    }
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

    const tabItems = [
        {
            label: '充值',
            key: 'recharge',
            children: renderTabChildren('recharge')
        },
        {
            label: '取款',
            key: 'refund',
            children: renderTabChildren('refund')
        },
        {
            label: '更正',
            key: 'correction',
            children: renderTabChildren('correction')
        },
    ];

    const onChange = (value: string) => {
        setActiveKey(value);
    }

    return <Tabs activeKey={activeKey} onChange={onChange} items={tabItems} className={styles.tab} />
}