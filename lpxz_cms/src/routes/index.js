import { useRoutes } from 'react-router-dom'

import loadable from 'utils/loadable'

// module
import MainRoutes from 'routes/MainRoutes'
// Page
const AuthLogin = loadable(() => import('views/login'))
const Error404 = loadable(() => import('views/error/404'))

const ThemeRoutes = () => {
    const AuthRoutes = {
        path: '/login',
        element: <AuthLogin />
    }
    const ErrorRoutes = {
        path: '*',
        element: <Error404 />
    }
    return useRoutes([MainRoutes, AuthRoutes, ErrorRoutes])
}

export default ThemeRoutes