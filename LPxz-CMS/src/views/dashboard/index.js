import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Layout, Menu, Divider, Popover, message, Button } from 'antd'
import "antd/dist/reset.css"

import logo from 'assets/img/logo.png'
import avatar from 'assets/img/avatar.jpg'
import 'styles/dashboard.css'
import menus from './menu'

const { Header, Content, Footer, Sider } = Layout

export default function Dashboard() {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {

    })

    const handleLogout = () => {
        window.localStorage.clear()
        navigate('/login')
        message.success('退出成功')
    }

    return (
        <Layout style={{ minWidth: '1000px' }}>
            <Header className="header">
                {/* 普通函数是对象属性的简洁赋值方法。不可以直接定义，this由"调用"该函数的对象来决定，所以这里使用箭头函数 */}
                <div className="logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="logo" />
                </div>
                <span className="title">LPxz 后台管理系统</span>
                <Popover placement='bottomRight' content={(
                    <>
                        <Button type="text" onClick={() => navigate('/userInfo')}>个人信息</Button><br />
                        <Button type="text" danger onClick={handleLogout}>退出登录</Button>
                    </>
                )} trigger='click'>
                    <div className="avatar">
                        <img src={avatar} alt="avatar" />
                    </div>
                </Popover>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                    <Sider className="site-layout-background" width={200} breakpoint='lg' collapsedWidth={0}>
                        <Menu
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            items={menus}
                            onClick={event => {
                                event.key === 'lpxz-site' ? window.open('http://lpxz.work:8081') : navigate(event.key)
                            }}
                            style={{ height: '100%' }}
                        >
                        </Menu>
                    </Sider>
                    <TransitionGroup style={{ width: '100%' }}>
                        <CSSTransition
                            classNames="fade"
                            // key={location.pathname}
                            timeout={500}
                        >
                            <Content style={{ padding: '50px 15px', backgroundColor: 'white' }}>
                                <Outlet />
                            </Content>
                        </CSSTransition>
                    </TransitionGroup>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center', color: 'grey' }}>
                {'Copyright © ' + new Date().getFullYear() + ' '}<a href="http://lpxz.work">LPxz</a>
                <Divider type='vertical' />
                {'Powered by '}<a type='link' href="https://reactjs.org">React</a>
                <Divider type='vertical' />
                {'Theme by '}<a type='link' href="https://ant.design/index-cn">Ant Design</a>
            </Footer>
        </Layout >
    )
}