import loadable from 'utils/loadable'
// import RequireAuth from 'utils/RequireAuth'

// 公共模块
const Dashboard = loadable(() => import('views/dashboard'))

// 基础页面
const Article = loadable(() => import('views/article'))
const CreateArticle = loadable(() => import('views/article/create'))
const Moment = loadable(() => import('views/moment'))
const CreateMoment = loadable(() => import('views/moment/create'))
// const Category = loadable(() => import('views/category'))
// const Tag = loadable(() => import('views/tag'))

const MainRoutes = {
    path: '/',
    // element: <RequireAuth><Dashboard /></RequireAuth>,
    element: <Dashboard />,
    children: [
        {
            path: 'moment/manage',
            element: <Moment />
        },
        {
            path: 'moment/create',
            element: <CreateMoment />
        },
        {
            path: 'article/manage',
            element: <Article />
        },
        {
            path: 'article/create',
            element: <CreateArticle />
        },
    //     {
    //         path: 'category/manage',
    //         element: <RequireAuth><Category /></RequireAuth>
    //     },
    //     {
    //         path: 'tag/manage',
    //         element: <RequireAuth><Tag /></RequireAuth>
    //     },
    ]
}

export default MainRoutes
