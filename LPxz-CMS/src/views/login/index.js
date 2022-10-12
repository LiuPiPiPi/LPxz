import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Form, Button, Checkbox, message, notification } from 'antd'
import "antd/dist/antd.min.css"
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import { login } from 'api/login'
import './index.css'

const Login = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

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
        console.log('Success:', values)
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
            }
        }).catch(() => {
            message.error("请求失败")
        })
        // 这里可以做权限校验 模拟接口返回用户权限标识
        // switch (values.username) {
        //     case 'admin':
        //         values.auth = 0
        //         break
        //     default:
        //         values.auth = 1
        // }
    }

    return (
        <div className='layout_style'>
            <div className='login_card'>
                <span className='title'>管理面板后台</span>
                <Form
                    name="normal_login"
                    className="login-form"
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
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
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
                            prefix={<LockOutlined className="site-form-item-icon" />}
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
                        <Button type="primary" htmlType="submit" className="login-button" loading={loading}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login
