import { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Typography, message, Spin, Tag } from 'antd'
import {
    FileMarkdownOutlined,
    MessageOutlined,
    TeamOutlined,
    TagsOutlined,
    UserOutlined
} from '@ant-design/icons'

import { getDataByQuery, getCategoryAndTag } from 'api/article'
import { getMomentListByQuery } from 'api/moment'
import { getFriendsByQuery } from 'api/friend'
import { getVisitorList } from 'api/visitor'

import ArticleCategoryChart from './ArticleCategoryChart'
import VisitTrendChart from './VisitTrendChart'
import ArticlePublishChart from './ArticlePublishChart'

const { Title } = Typography

export default function Welcome() {
    const [loading, setLoading] = useState(true)
    const [articleCount, setArticleCount] = useState(0)
    const [publishedCount, setPublishedCount] = useState(0)
    const [momentCount, setMomentCount] = useState(0)
    const [friendCount, setFriendCount] = useState(0)
    const [tagCount, setTagCount] = useState(0)
    const [categoryData, setCategoryData] = useState([])
    const [visitData, setVisitData] = useState([])
    const [publishData, setPublishData] = useState([])

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            const results = await Promise.allSettled([
                getDataByQuery({ pageNum: 1, pageSize: 1000 }),
                getMomentListByQuery({ pageNum: 1, pageSize: 1000 }),
                getFriendsByQuery({ pageNum: 1, pageSize: 1000 }),
                getCategoryAndTag(),
                getVisitorList({ pageNum: 1, pageSize: 1000 }),
            ])

            let articleList = []

            const articleRes = results[0].status === 'fulfilled' ? results[0].value : null
            const momentRes = results[1].status === 'fulfilled' ? results[1].value : null
            const friendRes = results[2].status === 'fulfilled' ? results[2].value : null
            const categoryRes = results[3].status === 'fulfilled' ? results[3].value : null
            const visitorRes = results[4].status === 'fulfilled' ? results[4].value : null

            if (articleRes && articleRes.code === 200) {
                articleList = articleRes.data.articles.list || []
                setArticleCount(articleRes.data.articles.total)
                setPublishedCount(articleList.filter(a => a.published).length)
                const monthMap = {}
                articleList.forEach(a => {
                    if (a.gmtCreate) {
                        const month = a.gmtCreate.substring(0, 7)
                        monthMap[month] = (monthMap[month] || 0) + 1
                    }
                })
                const publishArr = Object.entries(monthMap)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([month, count]) => ({ month, count }))
                setPublishData(publishArr)
            }

            if (momentRes && momentRes.code === 200) {
                setMomentCount(momentRes.data.total)
            }

            if (friendRes && friendRes.code === 200) {
                setFriendCount(friendRes.data.total)
            }

            if (categoryRes && categoryRes.code === 200) {
                setTagCount(categoryRes.data.tags.length)
                const categories = categoryRes.data.categories || []
                const catChartData = categories.map(c => ({
                    name: c.name,
                    value: articleList.filter(a => a.category && a.category.id === c.id).length,
                })).filter(c => c.value > 0)
                setCategoryData(catChartData)
            }

            if (visitorRes && visitorRes.code === 200) {
                setVisitData(visitorRes.data.list || [])
            }

            const failedCount = results.filter(r => r.status === 'rejected').length
            if (failedCount) {
                message.warning(`${failedCount} 个接口请求失败，数据可能不完整`)
            }
            setLoading(false)
        }
        init()
    }, [])

    const pvTotal = visitData.reduce((sum, v) => sum + (v.pv || 0), 0)
    const uvTotal = visitData.length

    return (
        <Spin spinning={loading}>
            <Title level={4} style={{ marginBottom: 24 }}>仪表盘</Title>

            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <Card>
                        <Statistic title="文章总数" value={articleCount} prefix={<FileMarkdownOutlined />} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic title="已发布" value={publishedCount}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<FileMarkdownOutlined />} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic title="动态数" value={momentCount} prefix={<MessageOutlined />} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic title="友链数" value={friendCount} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic title="标签数" value={tagCount} prefix={<TagsOutlined />} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic title="访客数" value={uvTotal} prefix={<UserOutlined />}
                            suffix={<Tag color="blue" style={{ marginLeft: 8 }}>PV {pvTotal}</Tag>} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={12}>
                    <Card title="文章分类分布" bordered={false}>
                        <ArticleCategoryChart data={categoryData} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="文章发布趋势" bordered={false}>
                        <ArticlePublishChart data={publishData} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="访客统计" bordered={false}>
                        <VisitTrendChart data={visitData} />
                    </Card>
                </Col>
            </Row>
        </Spin>
    )
}