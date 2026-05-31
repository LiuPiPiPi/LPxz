import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN';

import Routes from 'routes'

const App = () => (
    <ConfigProvider locale={zhCN}>
        {/* <BrowserRouter basename="/admin"> */}
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </ConfigProvider>
)

export default App

