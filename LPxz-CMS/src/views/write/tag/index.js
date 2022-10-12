import { useState, useEffect } from 'react'

import { Divider, Table, Button, message, Popconfirm } from 'antd'

// project imports
import { getData, addTag, editTag, deleteTagById } from 'api/tag'

const Tag = () => {
    const [tagList, setTagList] = useState([])

    const getTagList = () => {
        getData({ pageNum: 1, pageSize: 10 })
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    setTagList(res.data.list)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    useEffect(() => {
        getTagList()
    }, [])

    const handleEditTag = (id) => {
        // navigate(`/tag/edit/${id}`)
    }

    const handleDeleteTag = (id) => {
        deleteTagById(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    getTagList()
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
            title: '颜色',
            dataIndex: 'color',
            key: 'color',
            align: 'center',
            width: '100px',
        },
        {
            title: '操作',
            key: 'operate',
            align: 'center',
            width: '200px',
            render: (_, row) => (
                <span>
                    <Button type='primary' size='small' onClick={() => handleEditTag(row.id)}>编辑</Button>
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

    return (
        <Table columns={columns} dataSource={tagList} />
    )
}

export default Tag
