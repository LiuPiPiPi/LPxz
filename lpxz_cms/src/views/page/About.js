import { useEffect } from 'react'

import { Form, Input, Button, Card, message, Switch } from 'antd'
// import react-markdown-editor-lite, and a markdown parser you like
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

import { getAbout, updateAbout } from "api/about"

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */)

const About = () => {
    const [form] = Form.useForm()

    useEffect(() => {
        getAbout().then(res => {
            form.setFieldsValue(res.data)
        })
    }, [form])

    const handleSubmit = () => {
        form.validateFields().then(values => {
            updateAbout(values).then(res => {
                if (res.code === 200) {
                    message.success(res.msg)
                } else {
                    message.error(res.msg)
                }
            }).catch(() => {
                message.error("请求失败")
            })
        })
    }

    return (
        <>
            <Form
                name="about_me"
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="cms-editor-grid">
                    <Card title="页面内容">
                        <Form.Item name="title" label="标题" required>
                            <Input placeholder="请输入标题" />
                        </Form.Item>
                        <Form.Item name="content" label="正文">
                            <MdEditor style={{ height: 460 }} renderHTML={text => mdParser.render(text)}
                                onChange={({ text }) => form.setFieldValue('content', text)} />
                        </Form.Item>
                    </Card>
                    <Card title="页面设置">
                        <Form.Item name="commentEnabled" label="允许评论" valuePropName="checked"
                            extra="保存后应用到前台页面。">
                            <Switch aria-label="允许评论" />
                        </Form.Item>
                    </Card>
                </div>
                <div className="cms-editor-actions">
                    <Button htmlType="submit" type="primary">保存</Button>
                </div>
            </Form>
        </>
    )
}

export default About
