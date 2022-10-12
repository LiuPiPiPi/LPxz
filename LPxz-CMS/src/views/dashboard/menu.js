import React from 'react'
import { LineChartOutlined, SearchOutlined, HistoryOutlined, TeamOutlined } from '@ant-design/icons'

const menus = [
    {
        key: '/article/create',
        icon: <LineChartOutlined />,
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
        icon: <LineChartOutlined />,
        label: '写动态'
    },
    {
        key: '/article/manage',
        icon: <SearchOutlined />,
        label: '文章管理'
    },
    {
        key: '/moment/manage',
        icon: <HistoryOutlined />,
        label: '动态管理'
    },
    {
        key: '/category/manage',
        icon: <HistoryOutlined />,
        label: '分类管理'
    },
    {
        key: '/tag/manage',
        icon: <HistoryOutlined />,
        label: '标签管理'
    },
    {
        key: '/comment/manage',
        icon: <HistoryOutlined />,
        label: '评论管理'
    },
    {
        key: '/scheduleJob',
        icon: <TeamOutlined />,
        label: '定时任务'
    },
]

export default menus