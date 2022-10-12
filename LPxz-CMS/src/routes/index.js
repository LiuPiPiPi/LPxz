import { useRoutes } from 'react-router-dom'

import loadable from 'utils/loadable'

// module
import MainRoutes from 'routes/MainRoutes'
// Page
const AuthLogin = loadable(() => import('views/login'))
// const AuthRegister = loadable(() => import('views/register'))
const View404 = loadable(() => import('views/others/404'))
// const View500 = loadable(() => import('views/others/500'))

const ThemeRoutes = () => {
    const AuthRoutes = {
        path: '/login',
        element: <AuthLogin />
    }
    const NotFoundRoutes = {
        path: '*',
        element: <View404 />
    }
    return useRoutes([MainRoutes, AuthRoutes, NotFoundRoutes])
}

export default ThemeRoutes