import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN';

import Routes from 'routes'

const routerBasename = process.env.REACT_APP_ROUTER_BASENAME || undefined

const App = () => (
    <ConfigProvider locale={zhCN}>
        <BrowserRouter basename={routerBasename}>
            <Routes />
        </BrowserRouter>
    </ConfigProvider>
)

export default App
