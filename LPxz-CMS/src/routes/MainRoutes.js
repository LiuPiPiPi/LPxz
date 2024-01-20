import loadable from 'utils/loadable'
import RequireAuth from 'components/RequireAuth'

// 公共模块
const Dashboard = loadable(() => import('views/dashboard'))
const Welcome = loadable(() => import('views/dashboard/Welcome'))

// 基础页面
const Article = loadable(() => import('views/write/article'))
const CreateArticle = loadable(() => import('views/write/article/create'))
const Moment = loadable(() => import('views/write/moment'))
const CreateMoment = loadable(() => import('views/write/moment/create'))
const Category = loadable(() => import('views/write/category'))
const Tag = loadable(() => import('views/write/tag'))
const Comment = loadable(() => import('views/write/comment'))

const ScheduleJobList = loadable(() => import('views/system/ScheduleJobList'))

const ScheduleJobLog = loadable(() => import('views/log/ScheduleJobLog'))
const LoginLog = loadable(() => import('views/log/LoginLog'))
const OperationLog = loadable(() => import('views/log/OperationLog'))
const ExceptionLog = loadable(() => import('views/log/ExceptionLog'))
const VisitLog = loadable(() => import('views/log/VisitLog'))

const Visitor = loadable(() => import('views/statistics/Visitor'))

const SiteSetting = loadable(() => import('views/page/SiteSetting'))
const Friends = loadable(() => import('views/page/Friends'))
const About = loadable(() => import('views/page/About'))

const MainRoutes = {
    path: '/',
    element: <RequireAuth><Dashboard /></RequireAuth>,
    children: [
        {
            path: '/',
            element: <RequireAuth><Welcome /></RequireAuth>
        },
        // ============ write manage ============ //
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
        // ============ page manage ============ //
        {
            path: 'siteSetting',
            element: <RequireAuth><SiteSetting /></RequireAuth>
        },
        {
            path: 'friends',
            element: <RequireAuth><Friends /></RequireAuth>
        },
        {
            path: 'about',
            element: <RequireAuth><About /></RequireAuth>
        },
        // ============ system manage ============ //
        {
            path: 'system/scheduleJob',
            element: <RequireAuth><ScheduleJobList /></RequireAuth>
        },
        // ============ log manage ============ //
        {
            path: 'log/scheduleJobLog',
            element: <RequireAuth><ScheduleJobLog /></RequireAuth>
        },
        {
            path: 'log/loginLog',
            element: <RequireAuth><LoginLog /></RequireAuth>
        },
        {
            path: 'log/operationLog',
            element: <RequireAuth><OperationLog /></RequireAuth>
        },
        {
            path: 'log/exceptionLog',
            element: <RequireAuth><ExceptionLog /></RequireAuth>
        },
        {
            path: 'log/visitLog',
            element: <RequireAuth><VisitLog /></RequireAuth>
        },
        {
            path: 'log/visitLog/:uuid',
            element: <RequireAuth><VisitLog /></RequireAuth>
        },
        // ============ log manage ============ //
        {
            path: 'visitor',
            element: <RequireAuth><Visitor /></RequireAuth>
        }
    ]
}

export default MainRoutes
