import { useState, useEffect } from 'react'

import { Divider, Tag, Table, Button, message, Popconfirm, Form, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'

// project imports
import { getLoginLogList, deleteLoginLogById } from "api/loginLog"
import formatTime from 'utils/format-time'

const { RangePicker } = DatePicker

const LoginLog = () => {
    const [logList, setLogList] = useState([])
    const [searchForm] = Form.useForm()
    const [formData, setFormData] = useState({ pageNum: 1, pageSize: 10 })
    const [total, setTotal] = useState(0)

    const getLogList = (query) => {
        getLoginLogList(query)
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
        deleteLoginLogById(id)
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
            title: '用户名称',
            key: 'username',
            dataIndex: 'username',
            align: 'center'
        },
        {
            title: 'IP',
            key: 'ip',
            dataIndex: 'ip',
            align: 'center'
        },
        {
            title: 'IP 来源',
            dataIndex: 'ipSource',
            key: 'ipSource',
            align: 'center',
            ellipsis: true
        },
        {
            title: '操作系统',
            key: 'os',
            dataIndex: 'os',
            align: 'center'
        },
        {
            title: '浏览器',
            dataIndex: 'browser',
            key: 'browser',
            align: 'center',
            ellipsis: true
        },
        {
            title: '登录状态',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            render: text => (
                <Tag color={text ? 'success' : 'error'}>{text ? '成功' : '失败'}</Tag>
            )
        },
        {
            title: '描述',
            key: 'description',
            dataIndex: 'description',
            align: 'center'
        },
        {
            title: '操作时间',
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
                        onConfirm={() => handleDeleteLog(row.id)}
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
                <Form.Item label="操作时间" name="date">
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
            <Table columns={columns} dataSource={logList} rowKey={row => row.id}
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

export default LoginLog
