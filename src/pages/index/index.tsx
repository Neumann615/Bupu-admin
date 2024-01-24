import {Responsive, WidthProvider} from 'react-grid-layout'
import {createStyles} from "antd-style"
import {Button, Card, Space, Statistic} from "antd"
import {ArrowDownOutlined, ArrowUpOutlined, DownOutlined} from "@ant-design/icons"
import {Bar, Column, Pie} from '@ant-design/plots'
import React from "react"
import type {ProColumns} from '@ant-design/pro-components'
import {ProTable, TableDropdown} from '@ant-design/pro-components'

const DemoColumn = () => {
    const data = [
        {
            type: '家具家电',
            sales: 38,
        },
        {
            type: '粮油副食',
            sales: 52,
        },
        {
            type: '生鲜水果',
            sales: 61,
        },
        {
            type: '美容洗护',
            sales: 145,
        },
        {
            type: '母婴用品',
            sales: 48,
        },
        {
            type: '进口食品',
            sales: 38,
        },
        {
            type: '食品饮料',
            sales: 38,
        },
        {
            type: '家庭清洁',
            sales: 38,
        },
    ];
    const config = {
        data,
        height: "100%",
        xField: 'type',
        yField: 'sales',
        label: {
            // 可手动配置 label 数据标签位置
            position: 'middle',
            // 'top', 'bottom', 'middle',
            // 配置样式
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            type: {
                alias: '类别',
            },
            sales: {
                alias: '销售额',
            },
        },
    };
    return <Column {...config} />;
}

const DemoPie = () => {
    const data = [
        {
            type: '分类一',
            value: 27,
        },
        {
            type: '分类二',
            value: 25,
        },
        {
            type: '分类三',
            value: 18,
        },
        {
            type: '分类四',
            value: 15,
        },
        {
            type: '分类五',
            value: 10,
        },
        {
            type: '其他',
            value: 5,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        height: "100%",
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
        ],
    };
    return <Pie {...config} />;
}

const DemoBar = () => {
    const data = [
        {
            year: '1951 年',
            value: 38,
        },
        {
            year: '1952 年',
            value: 52,
        },
        {
            year: '1956 年',
            value: 61,
        },
        {
            year: '1957 年',
            value: 145,
        },
        {
            year: '1958 年',
            value: 48,
        },
    ];
    const config = {
        data,
        height: "100%",
        xField: 'value',
        yField: 'year',
        seriesField: 'year',
        legend: {
            position: 'top-left',
        },
    };
    return <Bar {...config} />;
}

const AllTable = () => {
    const valueEnum = {
        0: 'close',
        1: 'running',
        2: 'online',
        3: 'error',
    };

    type TableListItem = {
        key: number;
        name: string;
        containers: number;
        creator: string;
        status: string;
        createdAt: number;
        memo: string;
        createTime: string | Date;
        updateTime: string | Date
    };
    const tableListDataSource: TableListItem[] = [];

    const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];

    for (let i = 0; i < 25; i += 1) {
        tableListDataSource.push({
            key: i,
            name: 'AppName',
            containers: Math.floor(Math.random() * 20),
            creator: creators[Math.floor(Math.random() * creators.length)],
            status: valueEnum[((Math.floor(Math.random() * 10) % 4) + '') as '0'],
            createdAt: Date.now() - Math.floor(Math.random() * 100000),
            createTime: new Date(),
            updateTime: new Date(),
            memo:
                i % 2 === 1
                    ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴'
                    : '简短备注文案',
        });
    }

    const columns: ProColumns<TableListItem>[] = [
        {
            title: '应用名称',
            width: 120,
            dataIndex: 'name',
            render: (_) => <a>{_}</a>,
        },
        {
            title: '容器数量',
            dataIndex: 'containers',
            align: 'center',
            sorter: (a, b) => a.containers - b.containers,
        },
        {
            title: '创建时间',
            width: 220,
            dataIndex: 'createTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '更新时间',
            width: 220,
            dataIndex: 'updateTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '状态',
            width: 120,
            dataIndex: 'status',
            initialValue: 'all',
            valueEnum: {
                all: {text: '全部', status: 'Default'},
                close: {text: '关闭', status: 'Default'},
                running: {text: '运行中', status: 'Processing'},
                online: {text: '已上线', status: 'Success'},
                error: {text: '异常', status: 'Error'},
            },
        },
        {
            title: '创建者',
            width: 120,
            dataIndex: 'creator',
            valueEnum: {
                all: {text: '全部'},
                付小小: {text: '付小小'},
                曲丽丽: {text: '曲丽丽'},
                林东东: {text: '林东东'},
                陈帅帅: {text: '陈帅帅'},
                兼某某: {text: '兼某某'},
            },
        },
        {
            title: '操作',
            width: 180,
            key: 'option',
            valueType: 'option',
            render: () => [
                <a key="link">链路</a>,
                <a key="link2">报警</a>,
                <a key="link3">监控</a>,
                <TableDropdown
                    key="actionGroup"
                    menus={[
                        {key: 'copy', name: '复制'},
                        {key: 'delete', name: '删除'},
                    ]}
                />,
            ],
        },
    ]
    return <ProTable<TableListItem>
        dataSource={tableListDataSource}
        rowKey="key"
        pagination={{
            showQuickJumper: true,
            pageSize:10
        }}
        columns={columns}
        search={false}
        dateFormatter="string"
        headerTitle="统计表格"
        toolBarRender={() => [
            <Button key="show">查看日志</Button>,
            <Button key="out">
                导出数据
                <DownOutlined/>
            </Button>,
            <Button type="primary" key="primary">
                创建应用
            </Button>,
        ]}
    />
}


const ResponsiveReactGridLayout = WidthProvider(Responsive)
const useStyles = createStyles(({token, css}) => ({
    content: css`
      width: 100%;
      position: relative;
      min-height: 100%;
    `,
    headerItem: css`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    headerItemTitle: {
        color: token.colorTextBase
    },
    headerItemContent: {
        flex: 1,
        height: "1px",
        display: "flex",
        alignItems: "center"
    },
    headerItemFooter: css`
      box-sizing: border-box;
      padding-top: ${token.paddingXS}px;
      border-top: 1px solid ${token.colorBorderSecondary};
    `,
    mainItem: css`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    mainItemTitle: css`
      color: ${token.colorTextBase};
      box-sizing: border-box;
      padding: ${token.paddingSM}px;
      font-weight: ${token.fontWeightStrong};
      letter-spacing: 1px;
      font-size: ${token.fontSizeHeading5}px;
    `,
    mainItemContent: {
        flex: 1,
        height: "1px"
    }
}))

export default () => {
    const {styles, theme} = useStyles()
    const layout = [
        {
            i: 'a',
            x: 0,
            y: 0,
            w: 3,
            h: 3,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: theme.paddingSM}}>
                <div className={styles.headerItem}>
                    <div className={styles.headerItemTitle}>
                        本月收入
                    </div>
                    <div className={styles.headerItemContent}>
                        <Statistic
                            valueStyle={{fontSize: theme.fontSizeXL, lineHeight: 1, fontWeight: theme.fontWeightStrong}}
                            value={930000}
                            precision={0}
                            prefix={"￥"}
                        />
                    </div>
                    <div className={styles.headerItemFooter}>
                        <Space>
                            <Statistic
                                valueStyle={{fontSize: theme.fontSizeSM, lineHeight: 1}}
                                value={780000}
                                precision={0}
                                prefix={<>
                                    <span style={{color: theme.colorTextTertiary}}>上月</span> ￥
                                </>}
                            />
                            <Statistic
                                valueStyle={{fontSize: theme.fontSizeSM, lineHeight: 1, color: theme.green5}}
                                value={12.8}
                                precision={1}
                                prefix={<ArrowUpOutlined style={{fontSize: "12px"}}/>}
                                suffix="%"
                            />
                        </Space>
                    </div>
                </div>
            </Card>
        },
        {
            i: 'b',
            x: 3,
            y: 0,
            w: 3,
            h: 3,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: theme.paddingSM}}>
                <div className={styles.headerItem}>
                    <div className={styles.headerItemTitle}>
                        本月支出
                    </div>
                    <div className={styles.headerItemContent}>
                        <Statistic
                            valueStyle={{fontSize: theme.fontSizeXL, lineHeight: 1, fontWeight: theme.fontWeightStrong}}
                            value={80000}
                            precision={0}
                            prefix={"￥"}
                        />
                    </div>
                    <div className={styles.headerItemFooter}>
                        <Space>
                            <Statistic
                                valueStyle={{fontSize: theme.fontSizeSM, lineHeight: 1}}
                                value={20000}
                                precision={0}
                                prefix={<>
                                    <span style={{color: theme.colorTextTertiary}}>上月</span> ￥
                                </>}
                            />
                            <Statistic
                                valueStyle={{fontSize: theme.fontSizeSM, lineHeight: 1, color: theme.green5}}
                                value={60}
                                precision={1}
                                prefix={<ArrowUpOutlined style={{fontSize: "12px"}}/>}
                                suffix="%"
                            />
                        </Space>
                    </div>
                </div>
            </Card>
        },
        {
            i: 'c',
            x: 6,
            y: 0,
            w: 3,
            h: 3,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: theme.paddingSM}}>
                <div className={styles.headerItem}>
                    <div className={styles.headerItemTitle}>
                        本月余额
                    </div>
                    <div className={styles.headerItemContent}>
                        <Statistic
                            valueStyle={{fontSize: theme.fontSizeXL, lineHeight: 1, fontWeight: theme.fontWeightStrong}}
                            value={20000}
                            precision={0}
                            prefix={"￥"}
                        />
                    </div>
                    <div className={styles.headerItemFooter}>
                        <Space>
                            <Statistic
                                valueStyle={{fontSize: theme.fontSizeSM, lineHeight: 1}}
                                value={40000}
                                precision={0}
                                prefix={<>
                                    <span style={{color: theme.colorTextTertiary}}>上月</span> ￥
                                </>}
                            />
                            <Statistic
                                valueStyle={{fontSize: theme.fontSizeSM, lineHeight: 1, color: theme.red5}}
                                value={50}
                                precision={1}
                                prefix={<ArrowDownOutlined style={{fontSize: "12px"}}/>}
                                suffix="%"
                            />
                        </Space>
                    </div>
                </div>
            </Card>
        },
        {
            i: 'd',
            x: 9,
            y: 0,
            w: 3,
            h: 3,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: theme.paddingSM}}>
                <div className={styles.headerItem}>
                    <div className={styles.headerItemTitle}>
                        本月型号数
                    </div>
                    <div className={styles.headerItemContent}>
                        <Statistic
                            valueStyle={{fontSize: theme.fontSizeXL, lineHeight: 1, fontWeight: theme.fontWeightStrong}}
                            value={500}
                            precision={0}

                        />
                    </div>
                    <div className={styles.headerItemFooter}>
                        <Space>
                            <Statistic
                                valueStyle={{fontSize: theme.fontSizeSM, lineHeight: 1}}
                                value={250}
                                precision={0}
                                prefix={<>
                                    <span style={{color: theme.colorTextTertiary}}>上月</span>
                                </>}
                            />
                            <Statistic
                                valueStyle={{fontSize: theme.fontSizeSM, lineHeight: 1, color: theme.green5}}
                                value={12.8}
                                precision={1}
                                prefix={<ArrowUpOutlined style={{fontSize: "12px"}}/>}
                                suffix="%"
                            />
                        </Space>
                    </div>
                </div>
            </Card>
        },

        {
            i: 'e',
            x: 0,
            y: 3,
            w: 7.5,
            h: 8,
            autoSize: true,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: 0}}
                       bordered={false}>
                <div className={styles.mainItem}>
                    <div className={styles.mainItemTitle}>
                        项目全周期月度收支余
                    </div>
                    <div className={styles.mainItemContent}>
                        <div style={{width: "100%", height: "100%"}}>
                            <DemoColumn></DemoColumn>
                        </div>
                    </div>
                </div>
            </Card>
        },
        {
            i: 'f',
            x: 8,
            y: 3,
            w: 4.5,
            h: 8,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: 0}}
                       bordered={false}>
                <div className={styles.mainItem}>
                    <div className={styles.mainItemTitle}>
                        项目数量
                    </div>
                    <div className={styles.mainItemContent}>
                        <div style={{width: "100%", height: "100%"}}>
                            <DemoBar></DemoBar>
                        </div>
                    </div>
                </div>
            </Card>
        },
        //
        {
            i: 'g',
            x: 0,
            y: 11,
            w: 4,
            h: 6,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: 0}}
                       bordered={false}>
                <div className={styles.mainItem}>
                    <div className={styles.mainItemTitle}>
                        项目支出
                    </div>
                    <div className={styles.mainItemContent}>
                        <div style={{width: "100%", height: "100%"}}>
                            <DemoPie></DemoPie>
                        </div>
                    </div>
                </div>
            </Card>
        },
        {
            i: 'h',
            x: 4,
            y: 11,
            w: 4,
            h: 6,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: 0}}
                       bordered={false}>
                <div className={styles.mainItem}>
                    <div className={styles.mainItemTitle}>
                        项目收入
                    </div>
                    <div className={styles.mainItemContent}>
                        <div style={{width: "100%", height: "100%"}}>
                            <DemoPie></DemoPie>
                        </div>
                    </div>
                </div>
            </Card>
        },
        {
            i: 'i',
            x: 8,
            y: 11,
            w: 4,
            h: 6,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: 0}}
                       bordered={false}>
                <div className={styles.mainItem}>
                    <div className={styles.mainItemTitle}>
                        项目余额
                    </div>
                    <div className={styles.mainItemContent}>
                        <div style={{width: "100%", height: "100%"}}>
                            <DemoPie></DemoPie>
                        </div>
                    </div>
                </div>
            </Card>
        },

        {
            i: 'j',
            x: 0,
            y: 17,
            w: 12,
            h: 5,
            static: true,
            dom: <Card style={{height: "100%"}} bodyStyle={{height: "100%", padding: 0}}
                       bordered={false}>
                <AllTable></AllTable>
            </Card>
        }
    ]

    function createElement(el) {
        return <div
            key={el.i}
            data-grid={el}
        >
            {el.dom}
        </div>
    }

    return <ResponsiveReactGridLayout
        className={styles.content}
        autoSize={true}
        margin={[18, 18]}
        cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
        rowHeight={30}
    >
        {layout.map((el: any) => createElement(el))}
    </ResponsiveReactGridLayout>
}

