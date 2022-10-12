import { useRoutes } from 'react-router-dom'

import loadable from 'utils/loadable'

// 公共模块
import MainRoutes from 'routes/MainRoutes'
// 基础页面
const View404 = loadable(() => import('views/others/404'))
const View500 = loadable(() => import('views/others/500'))

const ThemeRoutes = () => {
    const NotFoundRoutes = {
        path: '*',
        element: <View404 />
    }
    return useRoutes([MainRoutes, NotFoundRoutes])
}

export default ThemeRoutes