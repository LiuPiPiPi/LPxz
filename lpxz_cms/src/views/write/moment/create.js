import { useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Form, DatePicker, Card, Button, message, InputNumber } from 'antd'
import dayjs from 'dayjs'
// import react-markdown-editor-lite, and a markdown parser you like
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

import { getMomentById, saveMoment, updateMoment } from "api/moment"

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */)

const CreateMoment = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const { id } = useParams()

    const getMoment = useCallback(() => {
        if (id) {
            getMomentById(id).then((res) => {
                if (res.code === 200) {
                    form.setFieldsValue({ ...res.data, gmtCreate: dayjs(res.data.gmtCreate) })
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
        form.validateFields().then(values => {
            const obj = { ...values, ...{ id, published } }
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
            <Form
                name="create_moment"
                form={form}
                layout="vertical"
                initialValues={{
                    likes: 0
                }}
                onFinish={() => handleSubmit(true)}
            >
                <div className="cms-editor-grid">
                    <Card title="动态内容">
                        <Form.Item name="content" label="正文">
                            <MdEditor style={{ height: 340 }} renderHTML={text => mdParser.render(text)}
                                onChange={({ text }) => form.setFieldValue('content', text)} />
                        </Form.Item>
                    </Card>
                    <Card title="发布信息">
                        <Form.Item name="likes" label="点赞数" required>
                            <InputNumber min={0} />
                        </Form.Item>
                        <Form.Item name="gmtCreate" label="创建时间">
                            <DatePicker showTime />
                        </Form.Item>
                    </Card>
                </div>
                <div className="cms-editor-actions">
                    <Button onClick={() => handleSubmit(false)}>保存草稿</Button>
                    <Button htmlType="submit" type="primary">发布动态</Button>
                </div>
            </Form>
        </>
    )
}

export default CreateMoment