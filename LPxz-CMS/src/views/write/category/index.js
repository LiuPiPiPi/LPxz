import { useState, useEffect } from 'react'

import { Divider, Table, Button, message, Popconfirm, Modal, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

// project imports
import { getData, addCategory, editCategory, deleteCategoryById } from 'api/category'

const Category = () => {
    const [categoryList, setCategoryList] = useState([])
    const [form] = Form.useForm()

    useEffect(() => {
        getCategoryList()
    }, [])

    const getCategoryList = () => {
        getData({ pageNum: 1, pageSize: 10 })
            .then((res) => {
                if (res.code === 200) {
                    // message.success(res.msg)
                    setCategoryList(res.data.list)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    const handleDeleteCategory = (id) => {
        deleteCategoryById(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    getCategoryList()
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
    const [categoryId, setCategoryId] = useState(null)

    const handleOpenDialog = (row) => {
        if (row === null) {
            // 添加
            setDialogType('add')
            setCategoryId(null)
            form.resetFields()
        } else {
            // 修改
            setDialogType('edit')
            setCategoryId(row.id)
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
                addCategory(values).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        handleCloseDialog()
                        getCategoryList()
                    } else {
                        message.error(res.msg)
                    }
                }).catch(() => {
                    message.error("请求失败")
                })
            } else {
                Object.assign(values, { id: categoryId })
                editCategory(values).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        handleCloseDialog()
                        getCategoryList()
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
                        onConfirm={() => handleDeleteCategory(row.id)}
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
        <>
            <>
                <Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenDialog(null)}>添加分类</Button>
            </>
            <Divider type='horizontal' />
            <Modal
                title={`${dialogType === 'add' ? '添加' : '编辑'}分类`}
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
                    name="edit_category"
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 3 }}
                >
                    <Form.Item name="name" label="分类名称" required>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={categoryList} rowKey={row => row.id} />
        </>
    )
}

export default Category
