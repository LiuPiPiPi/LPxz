import { Table, Tag } from 'antd'
import dayjs from 'dayjs'

const columns = [
    {
        title: '#',
        width: 50,
        align: 'center',
        render: (_, __, i) => i + 1,
    },
    {
        title: '访客标识',
        dataIndex: 'uuid',
        ellipsis: true,
    },
    {
        title: 'IP',
        dataIndex: 'ip',
    },
    {
        title: 'IP 来源',
        dataIndex: 'ipSource',
        ellipsis: true,
    },
    {
        title: '操作系统',
        dataIndex: 'os',
    },
    {
        title: '浏览器',
        dataIndex: 'browser',
        ellipsis: true,
    },
    {
        title: '首次访问',
        dataIndex: 'gmtCreate',
        width: 130,
        render: t => t ? dayjs(t).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
        title: 'PV',
        dataIndex: 'pv',
        render: v => <Tag color="blue">{v || 0}</Tag>,
    },
]

export default function VisitTrendChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无访客数据</div>
    }

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey={r => r.id || r.uuid}
            pagination={{ pageSize: 10, size: 'small' }}
            size="small"
        />
    )
}