import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Divider, Switch, Table, Button, message } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

// project imports
import { getDataByQuery, deleteById, updateTop, updateRecommend, updateVisibility } from 'api/article'
import formatTime from 'utils/format-time'

const Article = () => {
    const navigate = useNavigate()

    const [articleList, setArticleList] = useState([])
    const [categoryList, setCategoryList] = useState([])

    useEffect(() => {
        getArticleList()
    }, [])

    const getArticleList = () => {
        getDataByQuery({ title: '', categoryId: null, pageNum: 1, pageSize: 50 })
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    setArticleList(res.data.blogs.list)
                    setCategoryList(res.data.categories.list)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    const handleTopChanged = (row) => {
        updateTop(row.id, !row.top).then(res => {
            if (res.code === 200) {
                getArticleList()
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error('请求失败')
        })
    }

    const handleRecommendChanged = (row) => {
        updateRecommend(row.id, !row.recommended).then(res => {
            if (res.code === 200) {
                getArticleList()
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error('请求失败')
        })
    }

    const handleEditArticle = (id) => {
        navigate(`/article/edit/${id}`)
    }

    const handleDeleteArticle = (id) => {
        // deleteMomentById(id)
        //     .then((res) => {
        //         if (res.code === 200) {
        //             message.success(res.msg })
        //             getArticleList()
        //         } else {
        //             message.error(res.msg })
        //         }
        //     })
        //     .catch(() => {
        //         message.error('请求失败' })
        //     })
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
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            align: 'center'
        },
        {
            title: '分类',
            key: 'category',
            width: '150px',
            align: 'center',
            render: (_, row) => (
                <span>{row.category.name}</span>
            )
        },
        {
            title: '置顶',
            key: 'top',
            width: '80px',
            align: 'center',
            render: (_, row) => (
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={row.top}
                    onChange={() => handleTopChanged(row)}
                />
            )
        },
        {
            title: '推荐',
            key: 'recommend',
            width: '80px',
            align: 'center',
            render: (_, row) => (
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={row.recommend}
                    onChange={() => handleRecommendChanged(row)}
                />
            )
        },
        {
            title: '可见性',
            key: 'published',
            width: '80px',
            align: 'center',
            render: (_, row) => (
                <span>{row.published ? (row.password !== '' ? '密码保护' : '公开') : '私密'}</span>
            )
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
            title: '最近更新',
            dataIndex: 'updateTime',
            key: 'updateTime',
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
                    <Button type='primary' size='small' onClick={() => handleEditArticle(row.id)}>编辑</Button>
                    <Divider type='vertical' />
                    <Button type='danger' size='small' onClick={() => handleDeleteArticle(row.id)}>删除</Button>
                </span>
            )
        }
    ]

    return (
        <Table columns={columns} dataSource={articleList} />
    )
}

export default Article
