import { useState, useEffect } from 'react'

import { Divider, Tag, Table, Button, message, Popconfirm, Form, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'

// project imports
import { getJobLogList, deleteJobLogByLogId } from "api/schedule"
import formatTime from 'utils/format-time'

const { RangePicker } = DatePicker

const ScheduleJobLog = () => {
    const [logList, setLogList] = useState([])
    const [searchForm] = Form.useForm()
    const [formData, setFormData] = useState({ pageNum: 1, pageSize: 10 })
    const [total, setTotal] = useState(0)

    const getLogList = (query) => {
        getJobLogList(query)
            .then((res) => {
                if (res.code === 200) {
                    setLogList(res.data.list)
                    setTotal(res.data.total)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    useEffect(() => {
        getLogList(formData)
    }, [formData])

    const handleDeleteLog = (id) => {
        deleteJobLogByLogId(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    getLogList(formData)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    const handleSearch = () => {
        searchForm.validateFields().then(values => {
            let { date } = values
            if (date && date.length === 2) {
                date = formatTime(date[0]) + ',' + formatTime(date[1])
            }
            setFormData({ formData, date })
        })
    }

    const columns = [
        {
            title: '#',
            key: 'index',
            width: '60px',
            align: 'center',
            render: (_, __, index) => <span>{index + 1}</span>
        },
        {
            title: '日志 ID',
            key: 'logId',
            dataIndex: 'logId',
            align: 'center'
        },
        {
            title: '任务 ID',
            key: 'jobId',
            dataIndex: 'jobId',
            align: 'center'
        },
        {
            title: 'Bean',
            dataIndex: 'beanName',
            key: 'beanName',
            align: 'center',
            ellipsis: true
        },
        {
            title: '方法名',
            dataIndex: 'methodName',
            key: 'methodName',
            align: 'center',
            ellipsis: true
        },
        {
            title: '参数',
            dataIndex: 'params',
            key: 'params',
            align: 'center'
        },
        {
            title: '结果',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            render: text => (
                <Tag color={text ? 'success' : 'error'}>{text ? '成功' : '失败'}</Tag>
            )
        },
        {
            title: '执行耗时',
            key: 'times',
            dataIndex: 'times',
            align: 'center',
            render: text => (
                <Tag color="processing">{text}ms</Tag>
            )
        },
        {
            title: '执行时间',
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',
            align: 'center',
            width: '120px',
            render: text => (
                <span>{formatTime(text)}</span>
            )
        },
        {
            title: '操作',
            key: 'operate',
            align: 'center',
            width: '80px',
            render: (_, row) => (
                <>
                    <Popconfirm
                        placement="topRight"
                        title="确认删除吗？"
                        onConfirm={() => handleDeleteLog(row.logId)}
                        okText="删除"
                        okType="danger"
                    >
                        <Button danger size='small'>删除</Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    return (
        <>
            <Form
                name="search_schedule_job_log"
                form={searchForm}
                layout="inline"
                onFinish={handleSearch}
            >
                <Form.Item label="执行时间" name="date">
                    <RangePicker
                        ranges={{
                            '今天': [moment().startOf('day'), moment().endOf('day')],
                            '本周': [moment().startOf('week'), moment().endOf('week')],
                            '本月': [moment().startOf('month'), moment().endOf('month')]
                        }}
                    />
                </Form.Item>
                <Form.Item shouldUpdate>
                    <Button type="primary" htmlType="submit"><SearchOutlined /></Button>
                </Form.Item>
            </Form>
            <Divider type="horizontal" />
            <Table columns={columns} dataSource={logList} rowKey={row => row.logId}
                expandable={{
                    expandedRowRender: record => (
                        <>
                            <p>异常信息：{record.error || '无'}</p>
                        </>
                    )
                }}
                pagination={{
                    defaultCurrent: 1,
                    total: total,
                    onChange: (pageNum, pageSize) => {
                        setFormData({ ...formData, ...{ pageNum, pageSize } })
                    }
                }} />
        </>
    )
}

export default ScheduleJobLog
