// import react-markdown-editor-lite, and a markdown parser you like
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, DatePicker, Row, Col, Button, message, Input } from 'antd'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css'
import momentJS from 'moment'

import { getCategoryAndTag, saveArticle, getArticleById, updateArticle } from 'api/article'
import DialogVisibleModal from 'components/DialogVisibleModal'

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */)

const CreateArticle = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const { id } = useParams()

    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [modalOpen, setModalOpen] = useState(false)

    const getMoment = useCallback(() => {
        if (id) {
            getArticleById(id).then((res) => {
                if (res.code === 200) {
                    setDescription(res.data.description)
                    setContent(res.data.content)
                    form.setFieldsValue({ ...res.data, createTime: momentJS(res.data.createTime) })
                } else {
                    message.error(res.msg)
                }
            }).catch(() => {
                message.error("请求失败")
            })
        }
    }, [id, form])

    useEffect(() => {
        getMoment()
    }, [getMoment])

    const handleOpenModal = () => {

    }

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            console.log(values)
            const obj = {
                ...values, ...{
                    id,
                    content,
                    appreciation: false
                }
            }

            // if (id) {
            //     updateArticle(obj).then(res => {
            //         if (res.code === 200) {
            //             message.success(res.msg)
            //             navigate('/article/manage')
            //         } else {
            //             message.error(res.msg)
            //         }
            //     }).catch(() => {
            //         message.error('请求失败')
            //     })
            // } else {
            //     saveArticle(obj).then(res => {
            //         if (res.code === 200) {
            //             message.success(res.msg)
            //             navigate('/article/manage')
            //         } else {
            //             message.error(res.msg)
            //         }
            //     }).catch(() => {
            //         message.error('请求失败')
            //     })
            // }
        })
    }

    return (
        <>
            <Form
                name="create_article"
                form={form}
                layout="vertical"
            >
                <Row>
                    <Col span={9}>
                        <Form.Item name="title" label="文章标题" required>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={9} offset={3}>
                        <Form.Item name="firstPicture" label="文章首图 URL" required>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {/* 摘要描述 */}
            <MdEditor style={{ height: '200px' }} value={description} renderHTML={text => mdParser.render(text)}
                onChange={({ html, text }) => { setDescription(text) }} />
            <br />
            {/* 文章正文 */}
            <MdEditor style={{ height: '500px' }} value={content} renderHTML={text => mdParser.render(text)}
                onChange={({ html, text }) => { setContent(text) }} />
            <br />
            <Form
                name="create_article"
                form={form}
                layout="vertical"
            >
                <Row>
                    <Col span={6}>
                        <Form.Item name="cate" label="分类" required>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                        <Form.Item name="tag" label="标签" required>
                            <Input />
                        </Form.Item>
                    </Col>
                    {/* TODO 等待后端接口实现 */}
                    {/* <Col span={6} offset={2}>
                        <Form.Item name="url" label="创建时间" required>
                            <Input />
                        </Form.Item>
                    </Col> */}
                </Row>
                <Row>
                    <Col span={6}>
                        <Form.Item name="words" label="字数" required>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                        <Form.Item name="readTime" label="阅读时长（分钟）">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                        <Form.Item name="views" label="浏览次数">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button htmlType="submit" type="primary" onClick={() => { setModalOpen(true) }}>
                        保存
                    </Button>
                </Form.Item>
            </Form>
            <DialogVisibleModal open={modalOpen} />
        </>
    )
}

export default CreateArticle