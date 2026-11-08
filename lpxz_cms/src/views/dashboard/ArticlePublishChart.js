import { BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip)

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { title: { display: true, text: '月份' }, grid: { display: false } },
        y: { title: { display: true, text: '文章数' }, beginAtZero: true, ticks: { precision: 0 } },
    },
}

export default function ArticlePublishChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无数据</div>
    }

    const chartData = {
        labels: data.map(({ month }) => month),
        datasets: [{
            label: '文章数',
            data: data.map(({ count }) => count),
            backgroundColor: '#0969e8',
            borderRadius: 4,
            maxBarThickness: 72,
        }],
    }

    return (
        <div className="cms-chart">
            <Bar data={chartData} options={options} role="img" aria-label="各月文章发布数量" />
        </div>
    )
}
