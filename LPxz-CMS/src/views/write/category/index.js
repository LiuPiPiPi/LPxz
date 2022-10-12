import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Divider, Switch, Table, Button, message, Popconfirm } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

// project imports
import { getData, addCategory, editCategory, deleteCategoryById } from 'api/category'

const Category = () => {
    const [categoryList, setCategoryList] = useState([])

    useEffect(() => {
        getCategoryList()
    }, [])

    const getCategoryList = () => {
        getData({ pageNum: 1, pageSize: 10 })
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    setCategoryList(res.data.list)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    const handleEditCategory = (id) => {
        // navigate(`/category/edit/${id}`)
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
                    <Button type='primary' size='small' onClick={() => handleEditCategory(row.id)}>编辑</Button>
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
        <Table columns={columns} dataSource={categoryList} />
    )
}

export default Category
