import { lazy } from 'react'

import Loadable from 'component/Loadable'

const Dashboard = Loadable(lazy(() => import('views/dashboard')))
const Moment = Loadable(lazy(() => import('views/moment')))
const Article = Loadable(lazy(() => import('views/article')))
const Tag = Loadable(lazy(() => import('views/tag')))

const MainRoutes = {
    path: '/',
    element: <Dashboard />,
    children: [
        {
            path: 'moment/manage',
            element: <Moment />
        },
        {
            path: 'article/manage',
            element: <Article />
        },
        {
            path: 'tag/manage',
            element: <Tag />
        },
    ]
}

export default MainRoutes
