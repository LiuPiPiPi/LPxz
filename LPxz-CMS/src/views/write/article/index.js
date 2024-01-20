import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { Divider, Switch, Table, Button, message, Popconfirm, Form, Input, Select } from 'antd'
import { EditOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons'

// project imports
import { getDataByQuery, deleteById, updateTop, updateRecommend, updateVisibility } from 'api/article'
import formatTime from 'utils/format-time'
import ArticleVisibleModal from 'components/ArticleVisibleModal'

const Article = () => {
    const navigate = useNavigate()
    const [searchForm] = Form.useForm()

    const [articleList, setArticleList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [formData, setFormData] = useState({ title: '', categoryId: null, pageNum: 1, pageSize: 10 })
    const [total, setTotal] = useState(0)
    const [article, setArticle] = useState(null)

    const modalRef = useRef()

    const getArticleList = query => {
        getDataByQuery(query)
            .then((res) => {
                if (res.code === 200) {
                    setArticleList(res.data.articles.list)
                    setCategoryList(res.data.categories)
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
        getArticleList(formData)
    }, [formData])

    const handleTopChanged = (row) => {
        updateTop(row.id, !row.top).then(res => {
            if (res.code === 200) {
                getArticleList(formData)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error('请求失败')
        })
    }

    const handleRecommendChanged = (row) => {
        updateRecommend(row.id, !row.recommend).then(res => {
            if (res.code === 200) {
                getArticleList(formData)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error('请求失败')
        })
    }

    const handleEditArticle = (id) => {
        navigate(`/article/create/${id}`)
    }

    const handleDeleteArticle = (id) => {
        deleteById(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg)
                    getArticleList(formData)
                } else {
                    message.error(res.msg)
                }
            })
            .catch(() => {
                message.error('请求失败')
            })
    }

    const handleSubmitVisible = (article, values) => {
        updateVisibility(article.id, values).then(res => {
            if (res.code === 200) {
                message.success(res.msg)
                getArticleList(formData)
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
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            align: 'center'
        },
        {
            title: '分类',
            key: 'category',
            width: '100px',
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
            width: '100px',
            align: 'center',
            render: (_, row) => (
                <Button type='link' onClick={() => {
                    setArticle(row)
                    modalRef.current.handleOpen()
                }}>
                    <EditOutlined />&nbsp;{row.published ? (row.password !== '' ? '密码保护' : '公开') : '私密'}
                </Button>
            )
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
            title: '最近更新',
            dataIndex: 'gmtModified',
            key: 'gmtModified',
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
                    <Popconfirm
                        placement="topRight"
                        title="确认删除吗？"
                        onConfirm={() => handleDeleteArticle(row.id)}
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
            <Form
                name="search_article"
                form={searchForm}
                layout="inline"
                onFinish={() => {
                    searchForm.validateFields().then(values => {
                        setFormData({ ...formData, ...values })
                    })
                }}
            >
                <Form.Item name="title">
                    <Input placeholder="文章标题" allowClear />
                </Form.Item>
                <Form.Item name="categoryId">
                    <Select
                        options={categoryList.map(ele => {
                            return {
                                label: ele.name,
                                value: ele.id
                            }
                        })}
                        placeholder="文章分类"
                        allowClear
                    />
                </Form.Item>
                <Form.Item shouldUpdate>
                    <Button type="primary" htmlType="submit"><SearchOutlined /></Button>
                </Form.Item>
            </Form>
            <br />
            <Table columns={columns} dataSource={articleList} rowKey={row => row.id}
                pagination={{
                    defaultCurrent: 1,
                    total: total,
                    onChange: (pageNum, pageSize) => {
                        setFormData({ ...formData, ...{ pageNum, pageSize } })
                    }
                }} />
            <ArticleVisibleModal ref={modalRef} article={article} handleSubmit={handleSubmitVisible} />
        </>
    )
}

export default Article
