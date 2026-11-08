import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Form, DatePicker, Card, Button, message, Input, Select } from 'antd'
import dayjs from 'dayjs'
// import react-markdown-editor-lite, and a markdown parser you like
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

import { getCategoryAndTag, saveArticle, getArticleById, updateArticle } from 'api/article'
import ArticleVisibleModal from 'components/ArticleVisibleModal'

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */)

const CreateArticle = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const { id } = useParams()

    const [article, setArticle] = useState({})
    const [categoryList, setCategoryList] = useState([])
    const [tagList, setTagList] = useState([])

    const modalRef = useRef()

    const getArticle = useCallback(() => {
        if (id) {
            getArticleById(id).then((res) => {
                if (res.code === 200) {
                    setArticle(res.data)
                    form.setFieldsValue({
                        ...res.data,
                        ...{
                            cate: res.data.category.id,
                            tagList: res.data.tags.map(ele => { return ele.id }),
                            gmtCreate: dayjs(res.data.gmtCreate)
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
            const formData = { ...article, ...values, ...vals }
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
                initialValues={{
                    views: 0,
                    cover: ''
                }}
            >
                <div className="cms-editor-grid">
                    <Card title="正文">
                        <Form.Item name="title" label="文章标题" required>
                            <Input placeholder="请输入文章标题" />
                        </Form.Item>
                        <Form.Item name="content" label="文章正文">
                            <MdEditor style={{ height: 480 }} renderHTML={text => mdParser.render(text)}
                                onChange={({ text }) => form.setFieldValue('content', text)} />
                        </Form.Item>
                    </Card>
                    <Card title="文章属性">
                        <Form.Item name="cate" label="分类" required>
                            <Select options={categoryList.map(({ name, id }) => ({ label: name, value: id }))}
                                placeholder="选择分类" allowClear />
                        </Form.Item>
                        <Form.Item name="tagList" label="标签" required>
                            <Select mode="tags" options={tagList.map(({ name, id }) => ({ label: name, value: id }))}
                                placeholder="选择或输入标签" allowClear />
                        </Form.Item>
                        <Form.Item name="cover" label="文章封面 URL">
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="文章描述">
                            <MdEditor style={{ height: 160 }} renderHTML={text => mdParser.render(text)}
                                onChange={({ text }) => form.setFieldValue('description', text)} />
                        </Form.Item>
                        <Form.Item name="gmtCreate" label="创建时间">
                            <DatePicker showTime />
                        </Form.Item>
                        <Form.Item name="words" label="字数" required>
                            <Input type="number"
                                onChange={() => form.setFieldValue('readTime', Math.round(form.getFieldValue('words') / 200))} />
                        </Form.Item>
                        <Form.Item name="readTime" label="阅读时长（分钟）">
                            <Input type="number" placeholder="默认按字数计算" />
                        </Form.Item>
                        <Form.Item name="views" label="浏览次数">
                            <Input type="number" />
                        </Form.Item>
                    </Card>
                </div>
                <div className="cms-editor-actions">
                    <Button type="primary" onClick={() => modalRef.current.handleOpen()}>保存</Button>
                </div>
            </Form>
            <ArticleVisibleModal ref={modalRef} article={article} handleSubmit={handleSubmit} />
        </>
    )
}

export default CreateArticle