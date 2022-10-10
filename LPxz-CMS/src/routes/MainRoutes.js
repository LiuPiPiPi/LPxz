import { lazy } from 'react'

import Loadable from 'component/Loadable'
import RequireAuth from 'component/RequireAuth'

const Dashboard = Loadable(lazy(() => import('views/dashboard')))
const Moment = Loadable(lazy(() => import('views/moment')))
const Article = Loadable(lazy(() => import('views/article')))
const Category = Loadable(lazy(() => import('views/category')))
const Tag = Loadable(lazy(() => import('views/tag')))

const MainRoutes = {
    path: '/',
    element: <RequireAuth><Dashboard /></RequireAuth>,
    children: [
        {
            path: 'moment/manage',
            element: <RequireAuth><Moment /></RequireAuth>
        },
        {
            path: 'article/manage',
            element: <RequireAuth><Article /></RequireAuth>
        },
        {
            path: 'category/manage',
            element: <RequireAuth><Category /></RequireAuth>
        },
        {
            path: 'tag/manage',
            element: <RequireAuth><Tag /></RequireAuth>
        },
    ]
}

export default MainRoutes
