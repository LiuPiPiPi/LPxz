import { useState, useEffect } from 'react'

import { Divider, Table, Button, message, Popconfirm, Modal, Form, Input, Select, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

// project imports
import { getData, addTag, editTag, deleteTagById } from 'api/tag'

const Tag = () => {
    const [form] = Form.useForm()
    const [tagList, setTagList] = useState([])
    const [formData, setFormData] = useState({ pageNum: 1, pageSize: 10 })
    const [total, setTotal] = useState(0)

    const getTagList = (query) => {
        getData(query)
            .then((res) => {
                if (res.code === 200) {
                    setTagList(res.data.list)
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
        getTagList(formData)
    }, [formData])

    const handleDeleteTag = (id) => {
        deleteTagById(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    getTagList(formData)
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
    const [tagId, setTagId] = useState(null)

    const handleOpenDialog = (row) => {
        if (row === null) {
            // 添加
            setDialogType('add')
            setTagId(null)
            form.resetFields()
        } else {
            // 修改
            setDialogType('edit')
            setTagId(row.id)
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
                addTag(values).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        handleCloseDialog()
                        getTagList(formData)
                    } else {
                        message.error(res.msg)
                    }
                }).catch(() => {
                    message.error("请求失败")
                })
            } else {
                Object.assign(values, { id: tagId })
                editTag(values).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        handleCloseDialog()
                        getTagList(formData)
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

    const columns = [
        {
            title: '#',
            key: 'index',
            width: '60px',
            align: 'center',
            render: (_, __, index) => <span>{index + 1}</span>
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: '颜色',
            key: 'color',
            width: '300px',
            align: 'center',
            render: (_, row) => (
                <Row gutter={{ xs: 8, sm: 16, md: 24 }} justify='center' wrap>
                    <Col span={8}>{row.color}</Col>
                    <Col span={16} style={{ backgroundColor: `${row.color}` }} />
                </Row>
            )
        },
        {
            title: '操作',
            key: 'operate',
            align: 'center',
            width: '200px',
            render: (_, row) => (
                <span>
                    <Button type='primary' size='small' onClick={() => handleOpenDialog(row)}>编辑</Button>
                    <Divider type='vertical' />
                    <Popconfirm
                        placement="topRight"
                        title="确认删除吗？"
                        onConfirm={() => handleDeleteTag(row.id)}
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

    const colors = [
        { label: '红色', value: 'red' },
        { label: '橘黄', value: 'orange' },
        { label: '黄色', value: 'yellow' },
        { label: '橄榄绿', value: 'olive' },
        { label: '纯绿', value: 'green' },
        { label: '水鸭蓝', value: 'teal' },
        { label: '纯蓝', value: 'blue' },
        { label: '紫罗兰', value: 'violet' },
        { label: '紫色', value: 'purple' },
        { label: '粉红', value: 'pink' },
        { label: '棕色', value: 'brown' },
        { label: '灰色', value: 'grey' },
        { label: '黑色', value: 'black' }
    ]

    return (
        <>
            <>
                <Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenDialog(null)}>添加标签</Button>
            </>
            <Divider type='horizontal' />
            <Modal
                title={`${dialogType === 'add' ? '添加' : '编辑'}标签`}
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
                    name="edit_tag"
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 3 }}
                >
                    <Form.Item name="name" label="标签名称" required>
                        <Input />
                    </Form.Item>
                    <Form.Item name="color" label="标签颜色">
                        <Select allowClear>
                            {colors.map(color => (
                                <Select.Option key={color.value} value={color.value}>
                                    <Row>
                                        <Col span={4}>{color.label}</Col>
                                        <Col span={8} style={{ backgroundColor: `${color.value}` }} />
                                    </Row>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={tagList} rowKey={row => row.id}
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

export default Tag
