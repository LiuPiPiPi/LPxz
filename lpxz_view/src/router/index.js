import { createRouter, createWebHistory } from 'vue-router'
import getPageTitle from '@/util/get-page-title'
import { resolveScrollPosition, saveHomeScrollPosition } from './scroll-position'
import store from '@/store'
import { routeNameToSwitchKey, isModuleEnabled } from '@/util/moduleSwitch'


const routes = [
	{
		path: '/login',
		component: () => import('@/views/Login'),
		meta: { title: '登录' }
	},
	{
		path: '/',
		component: () => import('@/views/Index'),
		redirect: '/home',
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('@/views/home/Home'),
				meta: { title: '首页' }
			},
			{
				path: '/archives',
				name: 'archives',
				component: () => import('@/views/archives/Archives'),
				meta: { title: '归档' }
			},
			{
				path: '/article/:id',
				name: 'article',
				component: () => import('@/views/article/Article'),
				meta: { title: '文章' }
			},
			{
				path: '/tag/:name',
				name: 'tag',
				component: () => import('@/views/tag/Tag'),
				meta: { title: '标签' }
			},
			{
				path: '/category/:name',
				name: 'category',
				component: () => import('@/views/category/Category'),
				meta: { title: '分类' }
			},
			{
				path: '/moments',
				name: 'moments',
				component: () => import('@/views/moments/Moments'),
				meta: { title: '动态' }
			},
			{
				path: '/friends',
				name: 'friends',
				component: () => import('@/views/friends/Friends'),
				meta: { title: '友人帐' }
			},
			{
				path: '/about',
				name: 'about',
				component: () => import('@/views/about/About'),
				meta: { title: '关于我' }
			}
		]
	}
]

const router = createRouter({
	history: createWebHistory(),
	base: process.env.BASE_URL,
	routes: routes,
	scrollBehavior(to, from, savedPosition) {
		return resolveScrollPosition(to, savedPosition)
	}
})

router.beforeEach((to, from, next) => {
	saveHomeScrollPosition(from, window.scrollY)
	document.title = getPageTitle(to.meta.title)
	// 若站点信息已加载，禁用的模块路由重定向回首页（首次直链访问由 Index.vue 兜底）
	const siteInfo = store.state.siteInfo
	if (siteInfo && typeof siteInfo === 'object') {
		const switchKey = routeNameToSwitchKey(to.name)
		if (switchKey && !isModuleEnabled(siteInfo[switchKey])) {
			return next({ name: 'home' })
		}
	}
	next()
})

export default router
