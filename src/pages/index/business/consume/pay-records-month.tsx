import { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Spin } from 'antd';
import { createStyles } from "antd-style"
import { ProTable } from '@ant-design/pro-components';
import React, { useState, useRef } from 'react';
import { getPayRecordsMonthList } from '@/api/summaryList';
import { useEffect } from 'react';
import moment from 'moment';

const useStyles = createStyles(() => ({
  main: {
    width: "100%",
    height: "100%",
    padding: "12px",
    display: "flex",
  },
  spin: {
    height: '100%'
  }
}))

export default () => {
  const actionRef = useRef<ActionType>();
  const { styles } = useStyles();
  const [height, setHeight] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

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
      title: '总数',
      dataIndex: 'totalcashAmount',
      ellipsis: true,
      search: false,
    },
    {
      title: '现金总额',
      dataIndex: '6cashAmount',
      ellipsis: true,
      search: false,
      editable: false,
    },
    {
      title: '补贴总额',
      dataIndex: 'totalsubsidyAmount',
      ellipsis: true,
      search: false,
      editable: false,
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
    const { current, pageSize, startTime, ...rest } = params
    const params1 = {
      pageNum: current,
      pageSize: pageSize,
      beginTime: startTime[0],
      endTime: startTime[1],
      ...rest
    }
    try {
      const result = await getPayRecordsMonthList(params1);
      if (result.status === 200) {
        return {
          data: result.data.data.list,
          page: 1,
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
      return []
    }
  }

  const handlePrint = () => {
    console.log('打印');
  }

  const handleExport = () => {
    console.log('导出');
  }

  return (
    <div className={styles.main} id='proTable'>
      <Spin tip="加载中..." size="small" spinning={isSpinning} wrapperClassName={styles.spin} fullscreen />
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        scroll={{ y: height }}
        request={handleRequest}
        style={{ height: '100%' }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          className: 'proForm'
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
        headerTitle="每月消费汇总"
        toolBarRender={() => [
          <Popconfirm key="export" title='导出' description="确认导出？" onConfirm={() => {
            handleExport()
          }}>
            <Button type='primary' key="export">
              导出
            </Button>
          </Popconfirm>,
          <Popconfirm key="print" title='打印' description="确认打印？" onConfirm={() => {
            handlePrint()
          }}>
            <Button key="export">
              打印
            </Button>
          </Popconfirm>
        ]}
      />
    </div >
  );
};