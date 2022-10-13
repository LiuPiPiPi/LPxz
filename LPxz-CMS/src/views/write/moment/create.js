// import react-markdown-editor-lite, and a markdown parser you like
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, DatePicker, Row, Col, Button, message, InputNumber } from 'antd'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css'
import momentJS from 'moment'

import { getMomentById, saveMoment, updateMoment } from "api/moment"

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */)

const CreateMoment = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const { id } = useParams()

    const [content, setContent] = useState('')

    const getMoment = useCallback(() => {
        if (id) {
            getMomentById(id).then((res) => {
                if (res.code === 200) {
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

    const handleSubmit = (published) => {
        form.validateFields().then((values) => {
            const obj = {
                ...values, ...{
                    id,
                    content,
                    createTime: values.createTime.toDate(),
                    published
                }
            }
            if (id) {
                updateMoment(obj).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        navigate('/moment/manage')
                    } else {
                        message.error(res.msg)
                    }
                }).catch(() => {
                    message.error('请求失败')
                })
            } else {
                saveMoment(obj).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg)
                        navigate('/moment/manage')
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
            <MdEditor style={{ height: '300px' }} value={content} renderHTML={text => mdParser.render(text)}
                onChange={({ html, text }) => { setContent(text) }} />
            <br />
            <Form
                name="create_moment"
                form={form}
                layout="vertical"
                initialValues={{
                    likes: 0
                }}
                onFinish={() => handleSubmit(true)}
            >
                <Row>
                    <Col span={9}>
                        <Form.Item name="likes" label="点赞数" required>
                            <InputNumber min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={9} offset={3}>
                        <Form.Item name="createTime" label="创建时间">
                            <DatePicker showTime />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button htmlType="button" onClick={() => handleSubmit(false)}>
                        保存草稿
                    </Button>
                    <Button htmlType="submit" type="primary" style={{ margin: '0 8px' }}>
                        发布动态
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default CreateMoment