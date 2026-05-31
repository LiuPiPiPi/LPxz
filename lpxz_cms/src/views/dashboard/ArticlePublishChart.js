import { Column } from '@ant-design/charts'

export default function ArticlePublishChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无数据</div>
    }

    const config = {
        data,
        xField: 'month',
        yField: 'count',
        colorField: 'count',
        color: ({ count }) => {
            const colors = ['#5B8FF9', '#5AD8A6', '#F6BD16', '#E86452', '#6DC8EC']
            return colors[Math.min(count - 1, colors.length - 1)] || '#5B8FF9'
        },
        label: {
            text: (d) => d.count,
            position: 'outside',
            style: { fontSize: 12 },
        },
        axis: {
            x: { title: '月份' },
            y: { title: '文章数' },
        },
        style: { radiusTop: 4 },
    }

    return <Column {...config} />
}