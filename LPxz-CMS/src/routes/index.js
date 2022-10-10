import { useRoutes } from 'react-router-dom'

import AuthRoutes from './AuthRoutes'
import MainRoutes from './MainRoutes'
import NotFound from 'views/NotFound'

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const NotFoundRoutes = {
        path: '*',
        element: <NotFound />
    }
    return useRoutes([MainRoutes, AuthRoutes, NotFoundRoutes])
}
