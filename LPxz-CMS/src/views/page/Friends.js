import { useState, useEffect } from 'react'

import {
    Form, Input, Space, Button, message, Switch, Modal,
    Divider, Popconfirm, Avatar, Image, Table
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
// import react-markdown-editor-lite, and a markdown parser you like
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

import {
    getFriendsByQuery, updatePublished, saveFriend, updateFriend,
    deleteFriendById, getFriendInfo, updateContent, updateCommentEnabled
} from "api/friend"
import formatTime from 'utils/format-time'

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */)

const Friends = () => {
    const [form] = Form.useForm()
    const [modalForm] = Form.useForm()

    const [modalOpen, setModalOpen] = useState(false)
    const [commentChecked, setCommentChecked] = useState(false)
    const [content, setContent] = useState('')
    const [formData, setFormData] = useState({ pageNum: 1, pageSize: 10 })
    const [friendList, setFriendList] = useState([])
    const [total, setTotal] = useState(null)
    const [friend, setFriend] = useState(null)

    const getFriendList = query => {
        getFriendsByQuery(query).then(res => {
            if (res.code === 200) {
                setFriendList(res.data.list)
                setTotal(res.data.total)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
        })
    }

    const getInfo = () => {
        getFriendInfo().then(res => {
            if (res.code === 200) {
                setCommentChecked(res.data.commentEnabled)
                setContent(res.data.content)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
        })
    }

    useEffect(() => {
        getFriendList(formData)
        getInfo()
    }, [formData])

    const handleOpenModal = row => {
        if (row) {
            modalForm.setFieldsValue(row)
            setFriend(row)
        } else {
            modalForm.resetFields()
            setFriend(null)
        }
        setModalOpen(true)
    }

    const handleClose = () => {
        setModalOpen(false)
    }

    const handleChangeComment = (checked) => {
        updateCommentEnabled(checked).then(res => {
            if (res.code === 200) {
                message.success(res.msg)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
        })
    }

    const friendPublishedChanged = row => {
        updatePublished(row.id, !row.published).then(res => {
            if (res.code === 200) {
                getFriendList(formData)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
        })
    }

    const handleDeleteFriend = id => {
        deleteFriendById(id).then(res => {
            if (res.code === 200) {
                getFriendList(formData)
                message.success(res.msg)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
        })
    }

    const handleSubmit = () => {
        updateContent(content).then(res => {
            if (res.code === 200) {
                message.success(res.msg)
                getInfo()
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
        })
    }

    const handleModalSubmit = () => {
        modalForm.validateFields().then(values => {
            if (friend) {
                updateFriend({ ...friend, ...values }).then(res => {
                    if (res.code === 200) {
                        getFriendList()
                        message.success(res.msg)
                        setModalOpen(false)
                    } else {
                        message.error(res.msg)
                    }
                }).catch(() => {
                    message.error("请求失败")
                })
            } else {
                saveFriend(values).then(res => {
                    if (res.code === 200) {
                        getFriendList()
                        message.success(res.msg)
                        setModalOpen(false)
                    } else {
                        message.error(res.msg)
                    }
                }).catch(() => {
                    message.error("请求失败")
                })
            }
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
            title: '头像',
            dataIndex: 'method',
            align: 'center',
            render: (_, row) => (
                <Avatar shape='square' size={45} src={<Image src={row.avatar} />} />
            )
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            align: 'center'
        },
        {
            title: '描述',
            dataIndex: 'description',
            align: 'center'
        },
        {
            title: '站点',
            dataIndex: 'website',
            align: 'center'
        },
        {
            title: '是否公开',
            key: 'top',
            width: '100px',
            align: 'center',
            render: (_, row) => (
                <Switch checked={row.published}
                    onChange={() => friendPublishedChanged(row)} />
            )
        },
        {
            title: '浏览次数',
            dataIndex: 'views',
            align: 'center'
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreate',
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
                    <Button size='small' type='primary' onClick={() => handleOpenModal(row)}>编辑</Button>
                    <Divider type='vertical' />
                    <Popconfirm
                        placement="topRight"
                        title="确认删除吗？"
                        onConfirm={() => handleDeleteFriend(row.id)}
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
            <Space size='large'>
                <Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal(null)}>添加友链</Button>
                <><span>页面评论</span><Switch key={commentChecked} defaultChecked={commentChecked} onChange={handleChangeComment} /></>
            </Space>
            <br />
            <br />
            <Table columns={columns} dataSource={friendList} rowKey={row => row.id}
                pagination={{
                    defaultCurrent: 1,
                    total: total,
                    onChange: (pageNum, pageSize) => {
                        setFormData({ ...formData, ...{ pageNum, pageSize } })
                    }
                }} />
            <br />
            <MdEditor style={{ height: '300px' }} value={content} renderHTML={text => mdParser.render(text)}
                onChange={({ html, text }) => setContent(text)} />
            <br />
            <Button type='primary' size='large' onClick={handleSubmit}>保存</Button>
            <Modal
                open={modalOpen}
                title="添加友链"
                width="40%"
                onOk={handleModalSubmit}
                onCancel={handleClose}
                forceRender
                destroyOnClose
            >
                <Form
                    name="friend_list"
                    form={modalForm}
                    layout="horizontal"
                    onFinish={handleSubmit}
                    labelCol={{ span: 4 }}
                >
                    <Form.Item name="nickname" label="昵称" required>
                        <Input placeholder="请输入昵称" />
                    </Form.Item>
                    <Form.Item name="description" label="描述" required>
                        <Input placeholder='请输入描述' />
                    </Form.Item>
                    <Form.Item name="website" label="网站" required>
                        <Input placeholder='请输入网站' />
                    </Form.Item>
                    <Form.Item name="avatar" label="头像 URL" required>
                        <Input placeholder='请输入头像 URL' />
                    </Form.Item>
                    <Form.Item name="published" label="是否公开" valuePropName='checked'>
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Friends
