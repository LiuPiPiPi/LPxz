import loadable from 'utils/loadable'
import RequireAuth from 'components/RequireAuth'

// 公共模块
const Dashboard = loadable(() => import('views/dashboard'))

// 基础页面
const Article = loadable(() => import('views/write/article'))
const CreateArticle = loadable(() => import('views/write/article/create'))
const Moment = loadable(() => import('views/write/moment'))
const CreateMoment = loadable(() => import('views/write/moment/create'))
const Category = loadable(() => import('views/write/category'))
const Tag = loadable(() => import('views/write/tag'))
const Comment = loadable(() => import('views/write/comment'))

const ScheduleJobList = loadable(() => import('views/system/ScheduleJobList'))

const MainRoutes = {
    path: '/',
    element: <RequireAuth><Dashboard /></RequireAuth>,
    children: [
        {
            path: 'moment/manage',
            element: <RequireAuth><Moment /></RequireAuth>
        },
        {
            path: 'moment/create',
            element: <RequireAuth><CreateMoment /></RequireAuth>
        },
        {
            path: 'moment/create/:id',
            element: <RequireAuth><CreateMoment /></RequireAuth>
        },
        {
            path: 'article/manage',
            element: <RequireAuth><Article /></RequireAuth>
        },
        {
            path: 'article/create',
            element: <RequireAuth><CreateArticle /></RequireAuth>
        },
        {
            path: 'article/create/:id',
            element: <RequireAuth><CreateArticle /></RequireAuth>
        },
        {
            path: 'category/manage',
            element: <RequireAuth><Category /></RequireAuth>
        },
        {
            path: 'tag/manage',
            element: <RequireAuth><Tag /></RequireAuth>
        },
        {
            path: 'comment/manage',
            element: <RequireAuth><Comment /></RequireAuth>
        },
        {
            path: 'scheduleJob',
            element: <RequireAuth><ScheduleJobList /></RequireAuth>
        },
    ]
}

export default MainRoutes
