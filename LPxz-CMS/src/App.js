import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

import Routes from 'routes'

const App = () => (
    <ConfigProvider locale={zh_CN}>
        {/* <BrowserRouter basename="/admin"> */}
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </ConfigProvider>
)

export default App

