import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Form, Button, Checkbox, message, notification, Tabs, Select } from 'antd'
import "antd/dist/reset.css"
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'

import { login } from 'api/login'
import 'styles/login.css'

const { Option } = Select

const Login = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState("")
    const [btnDisable, setBtnDisable] = useState(false)
    const [btnContent, setBtnContent] = useState("发送验证码")

    useEffect(() => {
        notification['info']({
            message: '欢迎使用 LPxz-CMS',
            duration: null,
            description: '账号 Admin(管理员)'
        })
        return () => {
            notification.destroy()
        }
    }, [])

    const onFinish = (values) => {
        setLoading(true)
        let loginForm = {
            username: values.username,
            password: values.password
        }
        login(loginForm).then(res => {
            if (res.code === 200) {
                message.success(res.msg)
                window.localStorage.setItem('token', res.data.token)
                window.localStorage.setItem('user', JSON.stringify(res.data.user))
                navigate('/')
            } else {
                message.error(res.msg)
                setLoading(false)
            }
        }).catch(() => {
            message.error("请求失败")
            setLoading(false)
        })
    }

    const handleCaptcha = () => {
        // TODO
        let maxTime = 60;
        setInterval(() => {
            if (maxTime > 0) {
                --maxTime
                setBtnContent('重新获取(' + maxTime + ')')
                setBtnDisable(true)
            } else {
                setBtnContent('发送验证码')
                setBtnDisable(false)
            }
        }, 1000)
    }

    return (
        <div className='layout_style'>
            <div className='login_card'>
                <span className='login_title'>LPxz 后台管理系统</span>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="账号密码" key="1">
                        <Form
                            name="normal_login"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名!',
                                    }
                                ]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="用户名" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码!',
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined />}
                                    type="password"
                                    placeholder="密码"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>记住我</Checkbox>
                                </Form.Item>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login_button" loading={loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="验证码" key="2">
                        <Form
                            name="captcha_login"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="phoneNumber"
                                rules={[
                                    { required: true, message: '请输入手机号码!' },
                                    { pattern: new RegExp(/^1[3456789]\d{9}$/, "g"), message: '请输入正确的手机号码!' }
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    allowClear
                                    placeholder="手机号码"
                                    addonBefore={
                                        <Form.Item name="prefix" noStyle>
                                            <Select style={{ width: 70 }} defaultValue={"86"}>
                                                <Option value="86">+86</Option>
                                                <Option value="87">+87</Option>
                                            </Select>
                                        </Form.Item>
                                    }
                                    onChange={(e) => { setPhone(e.target.value) }}
                                />
                            </Form.Item>
                            <Input.Group compact>
                                <Form.Item
                                    name="captcha"
                                    style={{ width: '70%' }}
                                    rules={[
                                        { required: true, message: '请输入验证码!' },
                                        { pattern: new RegExp(/^[0-9]{4}$$/, "g"), message: '请输入四位数字验证码!' }
                                    ]}
                                >
                                    <Input placeholder="验证码" />
                                </Form.Item>
                                <Form.Item shouldUpdate style={{ width: '30%' }}>
                                    <Button
                                        disabled={btnDisable}
                                        style={{ width: '100%' }}
                                        onClick={handleCaptcha}
                                    >{btnContent}</Button>
                                </Form.Item>
                            </Input.Group>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>记住我</Checkbox>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login_button" loading={loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </Tabs.TabPane>
                </Tabs>
            </div >
        </div >
    )
}

export default Login
