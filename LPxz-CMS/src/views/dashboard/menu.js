import React from 'react'
import {
    EditOutlined,
    FileMarkdownOutlined,
    MessageOutlined,
    ClusterOutlined,
    TagsOutlined,
    HistoryOutlined,
    CommentOutlined,
    FieldTimeOutlined
} from '@ant-design/icons'

const menus = [
    {
        key: '/article/create',
        icon: <EditOutlined />,
        label: '写文章',
        // children: new Array(4).fill(null).map((_, j) => {
        //     const subKey = index * 4 + j + 1
        //     return {
        //         key: subKey,
        //         label: `option${subKey}`,
        //     }
        // })
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
    {
        key: '/scheduleJob',
        icon: <FieldTimeOutlined />,
        label: '定时任务'
    },
]

export default menus