import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Divider, Switch, Table, Button, message, Popconfirm } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import { getMomentListByQuery, updatePublished, deleteMomentById } from 'api/moment'
import formatTime from 'utils/format-time'

const Moment = () => {
    const navigate = useNavigate()

    const [momentList, setMomentList] = useState([])
    const [formData, setFormData] = useState({ pageNum: 1, pageSize: 10 })
    const [total, setTotal] = useState(0)

    const getMomentList = (query) => {
        getMomentListByQuery(query)
            .then((res) => {
                if (res.code === 200) {
                    setMomentList(res.data.list)
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
        getMomentList(formData)
    }, [formData])

    const handleEditPublished = (row) => {
        updatePublished(row.id, !row.published)
            .then((res) => {
                if (res.code === 200) {
                    getMomentList(formData)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    const handleEditMoment = (id) => {
        navigate(`/moment/create/${id}`)
    }

    const handleDeleteMoment = (id) => {
        deleteMomentById(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    getMomentList(formData)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
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
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            align: 'center'
        },
        {
            title: '发布状态',
            key: 'published',
            width: '100px',
            align: 'center',
            render: (_, row) => (
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={row.published}
                    onChange={() => handleEditPublished(row)}
                />
            )
        },
        {
            title: '点赞数',
            dataIndex: 'likes',
            key: 'likes',
            align: 'center',
            width: '80px',
        },
        {
            title: '创建时间',
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
            width: '180px',
            render: (_, row) => (
                <span>
                    <Button type='primary' size='small' onClick={() => handleEditMoment(row.id)}>编辑</Button>
                    <Divider type='vertical' />
                    <Popconfirm
                        placement="topRight"
                        title="确认删除吗？"
                        onConfirm={() => handleDeleteMoment(row.id)}
                        okText="删除"
                        okType="danger"
                        cancelText="取消"
                    >
                        <Button danger size='small'>删除</Button>
                    </Popconfirm>
                </span>
            )
        }
    ]

    return (
        <Table columns={columns} dataSource={momentList} rowKey={row => row.id}
            pagination={{
                defaultCurrent: 1,
                total: total,
                onChange: (pageNum, pageSize) => {
                    setFormData({ ...formData, ...{ pageNum, pageSize } })
                }
            }} />
    )
}

export default Moment
