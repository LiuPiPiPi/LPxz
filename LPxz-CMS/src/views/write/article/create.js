// import react-markdown-editor-lite, and a markdown parser you like
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, DatePicker, Row, Col, Button, message, Input, Select } from 'antd'
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
    const [article, setArticle] = useState({})
    const [categoryList, setCategoryList] = useState([])
    const [tagList, setTagList] = useState([])

    const modalRef = useRef()

    const getArticle = useCallback(() => {
        if (id) {
            getArticleById(id).then((res) => {
                if (res.code === 200) {
                    setArticle(res.data)
                    setDescription(res.data.description)
                    setContent(res.data.content)
                    form.setFieldsValue({
                        ...res.data,
                        ...{
                            cate: res.data.category.id,
                            tagList: res.data.tags.map(ele => { return ele.id }),
                            createTime: momentJS(res.data.createTime)
                        }
                    })
                } else {
                    message.error(res.msg)
                }
            }).catch(() => {
                message.error("请求失败")
            })
        }
    }, [id, form])

    useEffect(() => {
        getCategoryAndTag().then(res => {
            if (res.code === 200) {
                setCategoryList(res.data.categories)
                setTagList(res.data.tags)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error('请求失败')
        })
        getArticle()
    }, [getArticle])

    const handleSubmit = (article, values) => {
        form.validateFields().then(vals => {
            const formData = { ...article, ...values, ...vals, ...{ description, content } }
            console.log(formData)
            if ('id' in article) {
                // update
                updateArticle(formData).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        navigate('/article/manage')
                    } else {
                        message.error(res.msg)
                    }
                }).catch(() => {
                    message.error('请求失败')
                })
            } else {
                // create
                saveArticle(formData).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        navigate('/article/manage')
                    } else {
                        message.error(res.msg)
                    }
                }).catch(() => {
                    message.error('请求失败')
                })
            }
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
                initialValues={{
                    views: 0
                }}
            >
                <Row>
                    <Col span={6}>
                        <Form.Item name="cate" label="分类" required>
                            <Select
                                options={categoryList.map(ele => {
                                    return { label: ele.name, value: ele.id }
                                })}
                                placeholder="选择分类"
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                        <Form.Item name="tagList" label="标签" required>
                            <Select
                                mode="multiple"
                                showArrow
                                options={tagList.map(ele => {
                                    return { label: ele.name, value: ele.id }
                                })}
                                placeholder="选择标签"
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    {/* TODO 等待后端接口实现 */}
                    <Col span={6} offset={2}>
                        <Form.Item name="createTime" label="创建时间">
                            <DatePicker showTime />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Form.Item name="words" label="字数" required>
                            <Input type='number' placeholder='请输入文章字数（自动计算阅读时长）'
                                onChange={() => form.setFieldValue('readTime', Math.round(form.getFieldValue('words') / 200))} />
                        </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                        <Form.Item name="readTime" label="阅读时长（分钟）">
                            <Input type='number' placeholder='请输入阅读时长（可选）默认 Math.round(字数 / 200)' />
                        </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                        <Form.Item name="views" label="浏览次数">
                            <Input type='number' placeholder='请输入浏览次数（可选）默认为 0' />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button htmlType="submit" type="primary" onClick={() => modalRef.current.handleOpen()}>
                        保存
                    </Button>
                </Form.Item>
            </Form>
            <DialogVisibleModal ref={modalRef} article={article} handleSubmit={handleSubmit} />
        </>
    )
}

export default CreateArticle