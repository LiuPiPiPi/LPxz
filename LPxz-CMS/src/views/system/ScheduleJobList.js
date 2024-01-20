import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Divider, Switch, Table, Button, message, Popconfirm, Modal, Form, Input } from 'antd'
import { CheckOutlined, CloseOutlined, PlusOutlined, FileDoneOutlined } from '@ant-design/icons'

// project imports
import { getJobList, updateJobStatus, runJobOnce, deleteJobById, addJob, editJob } from 'api/schedule'
import formatTime from 'utils/format-time'

const { TextArea } = Input

const ScheduleJobList = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const [scheduleJobList, setScheduleJobList] = useState([])
    const [formData, setFormData] = useState({ pageNum: 1, pageSize: 10 })
    const [total, setTotal] = useState(0)

    const getScheduleJobList = (query) => {
        getJobList(query)
            .then((res) => {
                if (res.code === 200) {
                    setScheduleJobList(res.data.list)
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
        getScheduleJobList(formData)
    }, [formData])

    const handleStatusChanged = (row) => {
        updateJobStatus(row.jobId, !row.status).then(res => {
            if (res.code === 200) {
                getScheduleJobList(formData)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error('请求失败')
        })
    }

    const handleDeleteScheduleJob = (id) => {
        deleteJobById(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    getScheduleJobList(formData)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    const [openDialog, setOpenDialog] = useState(false)
    const [dialogType, setDialogType] = useState('add')
    const [scheduleJobId, setScheduleJobId] = useState(null)

    const handleOpenDialog = (row) => {
        if (row === null) {
            // 添加
            setDialogType('add')
            setScheduleJobId(null)
            form.resetFields()
        } else {
            // 修改
            setDialogType('edit')
            setScheduleJobId(row.jobId)
            form.setFieldsValue(row)
        }
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const handleDialogSubmit = () => {
        form.validateFields().then((values) => {
            if (dialogType === 'add') {
                addJob(values).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        handleCloseDialog()
                        getScheduleJobList(formData)
                    } else {
                        message.error(res.msg)
                    }
                }).catch(() => {
                    message.error("请求失败")
                })
            } else {
                Object.assign(values, { jobId: scheduleJobId })
                editJob(values).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        handleCloseDialog()
                        getScheduleJobList(formData)
                    } else {
                        message.error(res.msg)
                    }
                }).catch(() => {
                    message.error("请求失败")
                })
            }
        }).catch(err => {
            console.log('Error: ', err)
        })
    }

    const handleRunOnce = (id) => {
        runJobOnce(id).then(res => {
            if (res.code === 200) {
                message.success(res.msg)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
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
            title: 'Bean',
            key: 'beanName',
            dataIndex: 'beanName',
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
            title: 'cron',
            dataIndex: 'cron',
            key: 'cron',
            align: 'center'
        },
        {
            title: '状态',
            key: 'status',
            align: 'center',
            width: '80px',
            render: (_, row) => (
                <Popconfirm
                    placement="topRight"
                    title={`确认要${row.status === true ? '暂停' : '启用'}该任务吗？`}
                    onConfirm={() => handleStatusChanged(row)}
                    onCancel={() => { message.info('已取消执行') }}
                    okText="确定"
                    cancelText="取消"
                >
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={row.status}
                    />
                </Popconfirm>
            )
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align: 'center',
            ellipsis: true
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
            width: '150px',
            render: (_, row) => (
                <>
                    <Popconfirm
                        placement="topRight"
                        title="确认要立即执行一次该任务吗？"
                        onConfirm={() => handleRunOnce(row.jobId)}
                        onCancel={() => { message.info('已取消执行') }}
                        okType="danger"
                    >
                        <Button size='small'>执行一次</Button>
                    </Popconfirm>
                    <br /><br />
                    <Button type='primary' size='small' onClick={() => handleOpenDialog(row)}>编辑</Button>
                    <Divider type='vertical' />
                    <Popconfirm
                        placement="topRight"
                        title="确认删除吗？"
                        onConfirm={() => handleDeleteScheduleJob(row.jobId)}
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
            <>
                <Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenDialog(null)}>添加</Button>
                <Divider type='vertical' />
                <Button icon={<FileDoneOutlined />} onClick={() => { navigate('logs/scheduleJob') }}>日志</Button>
            </>
            <Divider type='horizontal' />
            <Modal
                title={`${dialogType === 'add' ? '添加' : '编辑'}定时任务`}
                open={openDialog}
                width="50%"
                okText="确定"
                cancelText="取消"
                onOk={handleDialogSubmit}
                onCancel={handleCloseDialog}
                forceRender
                destroyOnClose
            >
                <Form
                    name="edit_schedule_job"
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 3 }}
                >
                    <Form.Item name="beanName" label="Bean" required>
                        <Input />
                    </Form.Item>
                    <Form.Item name="methodName" label="方法名" required>
                        <Input />
                    </Form.Item>
                    <Form.Item name="params" label="参数">
                        <Input />
                    </Form.Item>
                    <Form.Item name="cron" label="cron" required>
                        <Input />
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <TextArea />
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={scheduleJobList} rowKey={row => row.jobId}
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

export default ScheduleJobList
