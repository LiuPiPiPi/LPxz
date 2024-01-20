import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { Divider, Table, Button, message, Popconfirm, Form, DatePicker, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'

// project imports
import { getVisitLogList, deleteVisitLogById } from "api/visitLog"
import formatTime from 'utils/format-time'

const { RangePicker } = DatePicker

const VisitLog = () => {
    const { uuid } = useParams()
    const [logList, setLogList] = useState([])
    const [searchForm] = Form.useForm()
    const [formData, setFormData] = useState({ pageNum: 1, pageSize: 10 })
    const [total, setTotal] = useState(0)

    const getLogList = useCallback((query) => {
        if (uuid) {
            query = { query, uuid }
            searchForm.setFieldValue('uuid', uuid)
        }
        getVisitLogList(query)
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
    }, [uuid, searchForm])

    useEffect(() => {
        getLogList(formData)
    }, [formData, getLogList])

    const handleDeleteLog = (id) => {
        deleteVisitLogById(id)
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
            let { uuid, date } = values
            if (date && date.length === 2) {
                date = formatTime(date[0]) + ',' + formatTime(date[1])
            }
            setFormData({ formData, uuid, date })
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
            key: 'uuid',
            dataIndex: 'uuid',
            align: 'center',
            ellipsis: true,
            render: text => (
                <Button type='link' onClick={() => {
                    searchForm.setFieldValue('uuid', text)
                    handleSearch()
                }}>
                    {text}
                </Button>
            )
        },
        {
            title: '请求方式',
            key: 'method',
            dataIndex: 'method',
            align: 'center'
        },
        {
            title: '访问行为',
            key: 'behavior',
            dataIndex: 'behavior',
            align: 'center'
        },
        {
            title: '访问内容',
            key: 'content',
            dataIndex: 'content',
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
                <Form.Item label="访客标识" name="uuid" style={{ width: '35%' }} >
                    <Input placeholder='请输入访客标识码' allowClear />
                </Form.Item>
                <Form.Item label="访问时间" name="date">
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
                expandable={{
                    expandedRowRender: record => (
                        <>
                            <p>访客标识：{record.uuid}</p>
                            <p>请求接口：{record.uri}</p>
                            <p>请求参数：{record.param}</p>
                            <p>备注：{record.remark}</p>
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

export default VisitLog
