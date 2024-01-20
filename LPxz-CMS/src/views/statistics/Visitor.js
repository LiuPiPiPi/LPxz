import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Divider, Table, Button, message, Popconfirm, Form, DatePicker, Tooltip } from 'antd'
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

// project imports
import { getVisitorList, deleteVisitor } from "api/visitor"
import formatTime from 'utils/format-time'

const { RangePicker } = DatePicker

const Visitor = () => {
    const [logList, setLogList] = useState([])
    const [searchForm] = Form.useForm()
    const [formData, setFormData] = useState({ pageNum: 1, pageSize: 10 })
    const [total, setTotal] = useState(0)
    const navigate = useNavigate()

    const init = (query) => {
        getVisitorList(query)
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
        init(formData)
    }, [formData])

    const handleDeleteVisitor = (row) => {
        deleteVisitor(row.id, row.uuid)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    getVisitorList(formData)
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
            title: '访客标识',
            dataIndex: 'uuid',
            align: 'center',
            ellipsis: true
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            align: 'center'
        },
        {
            title: 'IP 来源',
            dataIndex: 'ipSource',
            align: 'center',
            ellipsis: true
        },
        {
            title: '操作系统',
            dataIndex: 'os',
            align: 'center'
        },
        {
            title: '浏览器',
            dataIndex: 'browser',
            align: 'center',
            ellipsis: true
        },
        {
            title: '首次访问',
            dataIndex: 'gmtCreate',
            align: 'center',
            width: '120px',
            render: text => (
                <span>{formatTime(text)}</span>
            )
        },
        {
            title: () => (<>最后访问 <Tooltip title="每日凌晨自动更新"><QuestionCircleOutlined /></Tooltip></>),
            dataIndex: 'lastTime',
            align: 'center',
            width: '120px',
            render: text => (
                <span>{formatTime(text)}</span>
            )
        },
        {
            title: () => (<>PV <Tooltip title="访客总浏览量，每日凌晨自动更新"><QuestionCircleOutlined /></Tooltip></>),
            dataIndex: 'pv',
            align: 'center'
        },
        {
            title: '操作',
            key: 'operate',
            align: 'center',
            width: '180px',
            render: (_, row) => (
                <>
                    <Button type='primary' size='small' onClick={() => { navigate(`/log/visitLog/${row.uuid}`) }}>
                        查看记录</Button>
                    <Divider type='vertical' />
                    <Popconfirm
                        placement="topRight"
                        title="确认删除吗？"
                        onConfirm={() => handleDeleteVisitor(row)}
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

export default Visitor
