import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Divider, Switch, Table, Button, message, Popconfirm } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

// project imports
import { getJobList, updateJobStatus, runJobOnce, deleteJobById, addJob, editJob } from 'api/schedule'
import formatTime from 'utils/format-time'

const ScheduleJobList = () => {
    const [scheduleJobList, setScheduleJobList] = useState([])

    const getScheduleJobListList = () => {
        getJobList({ pageNum: 1, pageSize: 10 })
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    setScheduleJobList(res.data.list)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    useEffect(() => {
        getScheduleJobListList()
    }, [])

    const handleStatusChanged = (row) => {
        updateJobStatus(row.id, !row.status).then(res => {
            if (res.code === 200) {
                getScheduleJobListList()
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error('请求失败')
        })
    }

    const handleEditScheduleJobList = (id) => {
        // navigate(`/ScheduleJob/edit/${id}`)
    }

    const handleDeleteScheduleJobList = (id) => {
        deleteJobById(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    getScheduleJobListList()
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    const [openDialog, setOpenDialog] = useState(false)
    const [momentId, setMomentId] = useState(null)
    const handleOpenDialog = (id) => {
        setMomentId(id)
        setOpenDialog(true)
    }
    const handleCloseDialog = () => {
        setOpenDialog(false)
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
            title: 'Bean',
            dataIndex: 'beanName',
            key: 'beanName',
            align: 'center'
        },
        {
            title: '方法名',
            dataIndex: 'methodName',
            key: 'methodName',
            align: 'center',
            width: '100px'
        },
        {
            title: '参数',
            dataIndex: 'params',
            key: 'params',
            align: 'center',
            width: '100px'
        },
        {
            title: 'cron',
            dataIndex: 'cron',
            key: 'cron',
            align: 'center',
            width: '100px'
        },
        {
            title: '状态',
            key: 'status',
            align: 'center',
            width: '80px',
            render: (_, row) => (
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={row.status}
                    onChange={() => handleStatusChanged(row)}
                />
            )
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align: 'center'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
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
            width: '150px',
            render: (_, row) => (
                <span>
                    {/* TODO */}
                    <Button type='warning' size='small' onClick={() => {}}>执行一次</Button>
                    <Divider type='vertical' />
                    <Button type='primary' size='small' onClick={() => handleEditScheduleJobList(row.id)}>编辑</Button>
                    <Divider type='vertical' />
                    <Popconfirm
                        placement="topRight"
                        title="确认删除吗？"
                        onConfirm={() => handleDeleteScheduleJobList(row.id)}
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
        <Table columns={columns} dataSource={scheduleJobList} />
    )
}

export default ScheduleJobList
