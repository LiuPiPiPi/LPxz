import { useEffect, useState } from 'react'

import { Typography, message, Button } from 'antd'

import { getDashboard } from "api/dashboard"

export default function Welcome() {
    const [pv, setPv] = useState(null)
    const [uv, setUv] = useState(null)
    const [articleCount, setArticleCount] = useState(null)
    const [commentCount, setCommentCount] = useState(null)

    const init = () => {
        getDashboard().then(res => {
            if (res.code === 200) {
                setPv(res.data.pv)
                setUv(res.data.uv)
                setArticleCount(res.data.articleCount)
                setCommentCount(res.data.commentCount)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
        })
    }

    useEffect(() => {
        // init()
    }, [])

    return (
        <>
            <Typography.Title>欢迎界面</Typography.Title>
            <>
                {/* <Typography.Paragraph>今日 PV：{pv}</Typography.Paragraph>
                <Typography.Paragraph>今日 UV：{uv}</Typography.Paragraph>
                <Typography.Paragraph>文章数：{articleCount}</Typography.Paragraph>
                <Typography.Paragraph>评论数：{commentCount}</Typography.Paragraph> */}
            </>
        </>
    )
}
