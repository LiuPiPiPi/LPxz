import { ArcElement, Chart, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

Chart.register(ArcElement, Legend, Tooltip)

const COLORS = ['#5B8FF9', '#5AD8A6', '#F6BD16', '#E86452', '#6DC8EC', '#945FB9', '#FF9845', '#1E9493', '#FF99C3']

const options = {
    responsive: true,
    maintainAspectRatio: false,
    radius: '90%',
    cutout: '68%',
    plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10 } },
    },
}

export default function ArticleCategoryChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无数据</div>
    }

    const chartData = {
        labels: data.map(({ name }) => name),
        datasets: [{
            data: data.map(({ value }) => value),
            backgroundColor: COLORS,
            borderWidth: 0,
        }],
    }

    return (
        <div className="cms-chart">
            <Doughnut data={chartData} options={options} role="img" aria-label="文章分类分布" />
        </div>
    )
}
