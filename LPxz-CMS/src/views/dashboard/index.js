import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import 'antd/dist/antd.css'
import { Layout, Menu } from 'antd'
// import { LineChartOutlined, SearchOutlined, HistoryOutlined, TeamOutlined } from '@ant-design/icons'

// import MainContent from 'components/MainContent'
import logo from 'assets/img/logo.png'
import avatar from 'assets/img/avatar.jpg'
import './index.css'

const { Header, Content, Footer, Sider } = Layout

export default function Dashboard() {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {

    })

    const menuSelected = location.pathname

    return (
        <Layout>
            <Header className="header">
                {/* 普通函数是对象属性的简洁赋值方法。不可以直接定义，this由"调用"该函数的对象来决定，所以这里使用箭头函数 */}
                <div className="logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="logo" />
                </div>
                <span className="title">LPxz's Blog 后台管理系统</span>
                <div className="avatar" onClick={() => navigate('/userInfo')}>
                    <img src={avatar} alt="avatar" />
                </div>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                    <Sider className="site-layout-background" width={200}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[menuSelected]}
                            selectedKeys={[menuSelected]}
                            // defaultOpenKeys={['sub1']}
                            style={{ height: '100%' }}
                        >
                            {/* TODO 改为循环结构 menuItems.js */}
                            <Menu.Item
                                key="/article/create"
                                // icon={<LineChartOutlined />}
                                onClick={() => navigate('/article/create')}
                            >
                                写文章
                            </Menu.Item>
                            <Menu.Item
                                key="/moment/create"
                                // icon={<LineChartOutlined />}
                                onClick={() => navigate('/moment/create')}
                            >
                                写动态
                            </Menu.Item>
                            <Menu.Item
                                key="/article/manage"
                                // icon={<SearchOutlined />}
                                onClick={() => navigate('/article/manage')}
                            >
                                文章管理
                            </Menu.Item>
                            <Menu.Item
                                key="/moment/manage"
                                // icon={<HistoryOutlined />}
                                onClick={() => navigate('/moment/manage')}
                            >
                                动态管理
                            </Menu.Item>
                            <Menu.Item
                                key="/aboutUs"
                                // icon={<TeamOutlined />}
                                onClick={() => navigate('/aboutUs')}
                            >
                                关于我们
                            </Menu.Item>
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
            <Footer style={{ textAlign: 'center' }}> Rainfall System © 2021 Created by NWPU DACHUANG Group. </Footer>
        </Layout>
    )
}