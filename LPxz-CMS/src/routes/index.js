import { useRoutes } from 'react-router-dom'

import AuthRoutes from 'routes/AuthRoutes'
import MainRoutes from 'routes/MainRoutes'
import NotFound from 'views/NotFound'

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const NotFoundRoutes = {
        path: '*',
        element: <NotFound />
    }
    return useRoutes([MainRoutes, AuthRoutes, NotFoundRoutes])
}
