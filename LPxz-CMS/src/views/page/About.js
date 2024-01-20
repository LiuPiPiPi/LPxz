import { useEffect } from 'react'

import { Form, Input, Row, Col, Button, message, Switch } from 'antd'
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
                <Form.Item name="title" label="标题" required>
                    <Input placeholder="请输入标题" />
                </Form.Item>
                <Row>
                    <Col span={9}>
                        <Form.Item name="musicId" label="网易云歌曲 ID">
                            <Input placeholder='请输入网易云歌曲 ID（可选）' />
                        </Form.Item>
                    </Col>
                    <Col span={9} offset={3}>
                        <Form.Item name="commentEnabled" label="评论开关（点击保存按钮）" valuePropName='checked'>
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="content" label="正文">
                    <MdEditor style={{ height: '800px' }} renderHTML={text => mdParser.render(text)}
                        onChange={({ html, text }) => form.setFieldValue('content', text)} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' type='primary' size='large'>保存</Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default About
