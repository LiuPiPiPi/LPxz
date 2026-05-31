import { Pie } from '@ant-design/charts'

const COLORS = ['#5B8FF9', '#5AD8A6', '#F6BD16', '#E86452', '#6DC8EC', '#945FB9', '#FF9845', '#1E9493', '#FF99C3']

export default function ArticleCategoryChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无数据</div>
    }

    const config = {
        data,
        angleField: 'value',
        colorField: 'name',
        color: COLORS,
        radius: 0.9,
        innerRadius: 0.5,
        label: {
            text: 'name',
            position: 'outside',
            style: { fontSize: 12 },
        },
        legend: {
            position: 'bottom',
        },
        interactions: [{ type: 'element-active' }],
        statistic: {
            title: { content: '文章' },
            content: { content: data.reduce((s, d) => s + d.value, 0) },
        },
    }

    return <Pie {...config} />
}