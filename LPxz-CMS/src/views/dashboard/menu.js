import React from 'react'
import {
    EditOutlined,
    FileMarkdownOutlined,
    MessageOutlined,
    ClusterOutlined,
    TagsOutlined,
    HistoryOutlined,
    CommentOutlined,
    FieldTimeOutlined,
    FundProjectionScreenOutlined,
    LoginOutlined,
    ProfileOutlined,
    AlertOutlined,
    LaptopOutlined
} from '@ant-design/icons'

const menus = [
    {
        key: 'writeManage',
        label: '写作管理',
        type: 'group',
        children: [
            {
                key: '/article/create',
                icon: <EditOutlined />,
                label: '写文章'
            },
            {
                key: '/moment/create',
                icon: <EditOutlined />,
                label: '写动态'
            },
            {
                key: '/article/manage',
                icon: <FileMarkdownOutlined />,
                label: '文章管理'
            },
            {
                key: '/moment/manage',
                icon: <MessageOutlined />,
                label: '动态管理'
            },
            {
                key: '/category/manage',
                icon: <ClusterOutlined />,
                label: '分类管理'
            },
            {
                key: '/tag/manage',
                icon: <TagsOutlined />,
                label: '标签管理'
            },
            // {
            //     key: '/comment/manage',
            //     icon: <CommentOutlined />,
            //     label: '评论管理'
            // },
        ]
    },
    {
        key: 'systemManage',
        label: '系统管理',
        type: 'group',
        children: [{
            key: '/system/scheduleJob',
            icon: <FieldTimeOutlined />,
            label: '定时任务'
        }]
    },
    {
        key: 'logManage',
        label: '日志管理',
        type: 'group',
        children: [
            {
                key: '/log/scheduleJobLog',
                icon: <FundProjectionScreenOutlined />,
                label: '任务日志'
            },
            {
                key: '/log/loginLog',
                icon: <LoginOutlined />,
                label: '登录日志'
            },
            {
                key: '/log/operationLog',
                icon: <ProfileOutlined />,
                label: '操作日志'
            },
            {
                key: '/log/exceptionLog',
                icon: <AlertOutlined />,
                label: '异常日志'
            },
            {
                key: '/log/visitLog',
                icon: <LaptopOutlined />,
                label: '访问日志'
            }
        ]
    }
]

export default menus