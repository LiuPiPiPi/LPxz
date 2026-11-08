import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Breadcrumb, Button, ConfigProvider, Drawer, Dropdown, Menu, Space, message } from 'antd'
import {
    ArrowLeftOutlined, DownOutlined, EditOutlined, ExportOutlined, LogoutOutlined,
    MenuOutlined, PlusOutlined, UserOutlined
} from '@ant-design/icons'
import 'antd/dist/reset.css'

import logo from 'assets/img/logo.png'
import avatar from 'assets/img/avatar.jpg'
import 'styles/dashboard.css'
import menus from './menu'

const theme = {
    token: {
        colorPrimary: '#0969e8',
        colorText: '#171f2d',
        colorTextSecondary: '#596679',
        colorBorder: '#d8e0ea',
        borderRadius: 8,
        controlHeight: 36,
    },
    components: {
        Card: { headerHeight: 48 },
        Menu: { itemHeight: 36, itemSelectedBg: '#e8f1ff', itemSelectedColor: '#085bc5' },
        Table: { headerBg: '#f0f3f7', headerColor: '#414e62', rowHoverBg: '#f6f9ff' },
    },
}

const descriptions = {
    '/': '内容与访问概览',
    '/article/create': '编辑 Markdown 正文，设置分类、标签和可见性。',
    '/moment/create': '记录近况，可保存草稿或直接发布。',
    '/article/manage': '查找文章，管理可见性、置顶与推荐。',
    '/moment/manage': '查看动态内容和发布状态。',
    '/category/manage': '管理文章的分类名称。',
    '/tag/manage': '管理文章标签及其显示颜色。',
    '/siteSetting': '分区管理站点信息、资料卡和前台显示。',
    '/friends': '维护友情链接及公开状态。',
    '/about': '编辑前台「关于我」的内容和评论设置。',
    '/system/scheduleJob': '配置任务调度、启停任务或手动执行一次。',
    '/log/scheduleJobLog': '查看定时任务的运行结果和耗时。',
    '/log/loginLog': '核查后台登录结果与来源。',
    '/log/operationLog': '按时间查阅后台操作记录。',
    '/log/exceptionLog': '查看请求异常和详细错误信息。',
}

const menuPages = menus.flatMap(item => item.children
    ? item.children.map(child => ({ ...child, group: item.label }))
    : [item])

const pageLinks = {
    '/': [
        { to: '/article/create', label: '写文章', icon: <PlusOutlined />, type: 'primary' },
        { to: '/moment/create', label: '写动态', icon: <EditOutlined /> },
    ],
    '/article/manage': [{ to: '/article/create', label: '写文章', icon: <PlusOutlined />, type: 'primary' }],
    '/moment/manage': [{ to: '/moment/create', label: '写动态', icon: <PlusOutlined />, type: 'primary' }],
    '/article/create': [{ to: '/article/manage', label: '返回文章列表', icon: <ArrowLeftOutlined /> }],
    '/moment/create': [{ to: '/moment/manage', label: '返回动态列表', icon: <ArrowLeftOutlined /> }],
}

export default function Dashboard() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [navigationOpen, setNavigationOpen] = useState(false)
    const siteUrl = process.env.REACT_APP_SITE_URL || 'https://lpxz.work'
    const route = pathname.replace(/\/+$/, '') || '/'
    const editor = route.match(/^\/(article|moment)\/create\/.+$/)
    const pageKey = editor ? `/${editor[1]}/create` : route
    const page = menuPages.find(item => item.key === pageKey)
    const title = editor ? (editor[1] === 'article' ? '编辑文章' : '编辑动态') : page?.label
    const breadcrumb = ['管理后台', page?.group, title].filter(Boolean).map(text => ({ title: text }))

    const handleLogout = () => {
        window.localStorage.clear()
        navigate('/login')
        message.success('退出成功')
    }

    const navigation = (
        <nav className="cms-navigation" aria-label="管理菜单">
            <Menu
                mode="inline"
                selectedKeys={[pageKey]}
                items={menus}
                onClick={({ key }) => {
                    setNavigationOpen(false)
                    navigate(key)
                }}
            />
            <a className="cms-site-link" href={siteUrl} target="_blank" rel="noopener noreferrer">
                <ExportOutlined /> 访问站点
            </a>
        </nav>
    )

    return (
        <ConfigProvider theme={theme}>
            <div className="cms-shell">
                <aside className="cms-sidebar">
                    <Link to="/" className="cms-brand">
                        <img src={logo} alt="" />
                        <span>LPxz <small>管理后台</small></span>
                    </Link>
                    {navigation}
                </aside>
                <div className="cms-workspace">
                    <header className="cms-topbar">
                        <Button
                            className="cms-menu-trigger"
                            icon={<MenuOutlined />}
                            aria-label="打开管理菜单"
                            aria-expanded={navigationOpen}
                            onClick={() => setNavigationOpen(true)}
                        />
                        <Breadcrumb items={breadcrumb} />
                        <Dropdown
                            trigger={['click']}
                            placement="bottomRight"
                            menu={{
                                items: [
                                    { key: 'profile', label: '个人信息', icon: <UserOutlined />, onClick: () => navigate('/userInfo') },
                                    { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
                                ],
                            }}
                        >
                            <Button type="text" className="cms-account" aria-label="管理员菜单">
                                <Avatar src={avatar} size={28} />
                                <span>管理员</span>
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    </header>
                    <main className="cms-main">
                        {title && (
                            <div className="cms-page-heading">
                                <div>
                                    <h1>{title}</h1>
                                    <p>{descriptions[pageKey]}</p>
                                </div>
                                {pageLinks[pageKey] && (
                                    <Space wrap>
                                        {pageLinks[pageKey].map(({ to, label, ...button }) => (
                                            <Button key={to} {...button} onClick={() => navigate(to)}>{label}</Button>
                                        ))}
                                    </Space>
                                )}
                            </div>
                        )}
                        <Outlet key={route} />
                    </main>
                </div>
                <Drawer
                    title="LPxz 管理后台"
                    placement="left"
                    width={280}
                    open={navigationOpen}
                    onClose={() => setNavigationOpen(false)}
                    styles={{ body: { padding: '8px 12px' } }}
                >
                    {navigation}
                </Drawer>
            </div>
        </ConfigProvider>
    )
}
