<template>
	<div ref="nav" class="ui stackable menu site-nav" :class="{ 'transparent': clientSize.clientWidth > 768 }">
		<div class="ui container nav-shell">
			<router-link to="/" class="brand-link" aria-label="LPxz Home">
				<span class="brand-mark" aria-hidden="true">
					<img src="/img/brand/logo.png" alt="" />
				</span>
			</router-link>

			<nav class="nav-links" :class="{ 'is-collapsed': mobileHide }" aria-label="主导航">
				<router-link to="/home" class="item nav-item"
					:class="{ 'active': $route.name === 'home' }">
					首页
				</router-link>
				<router-link to="/moments" class="item nav-item"
					:class="{ 'active': $route.name === 'moments' }">
					动态
				</router-link>
				<router-link to="/archives" class="item nav-item"
					:class="{ 'active': $route.name === 'archives' }">
					归档
				</router-link>
				<router-link to="/friends" class="item nav-item"
					:class="{ 'active': $route.name === 'friends' }">
					友链
				</router-link>
				<router-link to="/about" class="item nav-item"
					:class="{ 'active': $route.name === 'about' }">
					关于
				</router-link>
			</nav>

			<div ref="searchBox" class="nav-actions" :class="{ 'is-collapsed': mobileHide }">
				<div class="nav-search" :class="{ 'is-open': showSearchPanel }">
					<el-input v-model="queryString" placeholder="搜索文章" clearable
						@input="handleSearchInput" @focus="openSearchPanel" @clear="clearSearch"
						@keydown.enter.prevent="goFirstResult">
					</el-input>
					<transition name="search-panel">
						<div v-if="showSearchPanel" class="search-panel">
							<div class="search-panel-head">
								<span>搜索文章</span>
								<small v-if="queryString.trim()">按标题优先排序</small>
							</div>
							<div v-if="searchLoading" class="search-panel-state">正在搜索...</div>
							<div v-else-if="!queryString.trim()" class="search-panel-state">输入关键词搜索标题和内容</div>
							<div v-else-if="queryResult.length === 0" class="search-panel-state">没有找到相关文章</div>
							<div v-else class="search-result-list">
								<button v-for="item in queryResult" :key="item.id" class="search-result-item"
									@mousedown.prevent="handleSelect(item)">
									<span class="title-row">
										<span class="title">{{ item.title }}</span>
										<span class="match-type" :class="`is-${item.matchType}`">{{ item.matchType === 'title' ? '标题' : '内容' }}</span>
									</span>
									<span class="content" v-if="item.content">{{ item.content }}</span>
								</button>
							</div>
						</div>
					</transition>
				</div>
			</div>

			<button class="ui menu icon button nav-toggle m-mobile-show" :class="{ 'is-open': !mobileHide }" @click="toggle" aria-label="展开菜单">
				<i class="sidebar icon"></i>
			</button>
		</div>
	</div>
</template>

<script>
import { getSearchArticleList } from "@/api/article";
import { mapState } from 'vuex'

export default {
	name: "articleNav",
	props: {
		categoryList: {
			type: Array,
			required: true
		},
	},
	data() {
		return {
			mobileHide: true,
			queryString: '',
			queryResult: [],
			timer: null,
			searchFocused: false,
			searchLoading: false
		}
	},
	computed: {
		...mapState(['clientSize']),
		showSearchPanel() {
			return this.searchFocused
				&& (!this.mobileHide || this.clientSize.clientWidth > 767)
				&& (this.queryString.trim() !== '' || this.searchLoading || this.queryResult.length > 0)
		}
	},
	watch: {
		// 路由改变时，收起导航栏
		'$route.path'() {
			this.mobileHide = true
		}
	},
	mounted() {
		//监听页面滚动位置，改变导航栏的显示
		window.addEventListener('scroll', () => {
			//首页且不是移动端
			if (this.clientSize.clientWidth > 768) {
				if (window.scrollY > this.clientSize.clientHeight / 2) {
					this.$refs.nav.classList.remove('transparent')
				} else {
					this.$refs.nav.classList.add('transparent')
				}
			}
			})
		document.addEventListener('click', this.handleDocumentClick)
		//监听点击事件，收起导航菜单
		// document.addEventListener('click', (e) => {
		// 	//遍历冒泡
		// 	let flag = e.path.some(item => {
		// 		if (item === this.$refs.nav) return true
		// 	})
		// 	//如果导航栏是打开状态，且点击的元素不是Nav的子元素，则收起菜单
		// 	if (!this.mobileHide && !flag) {
		// 		this.mobileHide = true
		// 	}
		// })
	},
	beforeUnmount() {
		document.removeEventListener('click', this.handleDocumentClick)
	},
	methods: {
		toggle() {
			this.mobileHide = !this.mobileHide
		},
		openSearchPanel() {
			this.searchFocused = true
		},
		handleDocumentClick(e) {
			if (this.$refs.searchBox && !this.$refs.searchBox.contains(e.target)) {
				this.searchFocused = false
			}
		},
		handleSearchInput(value) {
			this.searchFocused = true
			this.timer && clearTimeout(this.timer)
			if (value == null || value.trim() === '') {
				this.queryResult = []
				this.searchLoading = false
				return
			}
			this.searchLoading = true
			this.timer = setTimeout(() => this.querySearchAsync(value), 360)
		},
		clearSearch() {
			this.timer && clearTimeout(this.timer)
			this.queryString = ''
			this.queryResult = []
			this.searchLoading = false
			this.searchFocused = true
		},
		debounceQuery(queryString, callback) {
			this.timer && clearTimeout(this.timer)
			this.timer = setTimeout(() => this.querySearchAsync(queryString, callback), 1000)
		},
		querySearchAsync(queryString, callback) {
			if (queryString == null
				|| queryString.trim() === ''
				|| queryString.indexOf('%') !== -1
				|| queryString.indexOf('_') !== -1
				|| queryString.indexOf('[') !== -1
				|| queryString.indexOf('#') !== -1
				|| queryString.indexOf('*') !== -1
				|| queryString.trim().length > 20) {
				this.queryResult = []
				this.searchLoading = false
				callback && callback([])
				return
			}
			const normalizedQuery = queryString.trim().toLowerCase()
			getSearchArticleList(queryString.trim()).then(res => {
				if (res.code === 200) {
					this.queryResult = (res.data || [])
						.map(item => {
							const title = item.title || ''
							const content = item.content || ''
							const isTitleMatch = title.toLowerCase().indexOf(normalizedQuery) !== -1
							return {
								...item,
								content,
								value: title,
								matchType: item.matchType || (isTitleMatch ? 'title' : 'content'),
								_matchRank: isTitleMatch ? 0 : 1
							}
						})
						.sort((a, b) => a._matchRank - b._matchRank)
					callback && callback(this.queryResult)
				}
			}).catch(() => {
				this.msgError("请求失败")
				this.queryResult = []
				callback && callback([])
			}).finally(() => {
				this.searchLoading = false
			})
		},
		goFirstResult() {
			if (this.queryResult.length > 0) {
				this.handleSelect(this.queryResult[0])
			}
		},
		handleSelect(item) {
			if (item.id) {
				this.queryString = item.title
				this.searchFocused = false
				this.$router.push(`/article/${item.id}`)
			}
		}
	}
}
</script>

<style scoped>
.site-nav {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	z-index: 1000;
	border: 0 !important;
	border-bottom: 1px solid rgba(15, 23, 42, .06) !important;
	border-radius: 0 !important;
	background: rgba(255, 255, 255, .94) !important;
	backdrop-filter: blur(12px) saturate(140%);
	box-shadow: none;
	transition: background .3s ease, box-shadow .3s ease, padding .3s ease;
	font-size: 1rem;
}

.site-nav :deep(.item) {
	border-right: 0 !important;
}

.site-nav :deep(.item::before) {
	display: none !important;
}

.site-nav.transparent {
	background: rgba(255, 255, 255, .94) !important;
	box-shadow: none;
}

.ui.menu .nav-shell {
	position: relative;
	width: 100% !important;
	margin-left: auto !important;
	margin-right: auto !important;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 18px;
	min-height: 56px;
	padding: 0 260px;
}

.brand-link {
	position: absolute;
	left: 24px;
	top: 50%;
	transform: translateY(-50%);
	display: inline-flex;
	align-items: center;
	gap: 10px;
	flex: 0 0 auto;
	color: #121827 !important;
	text-decoration: none;
	min-width: 0;
}

.brand-mark {
	position: relative;
	width: 30px;
	height: 30px;
	flex: 0 0 30px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	filter: none;
}

.brand-mark img {
	width: 100%;
	height: 100%;
	object-fit: contain;
	display: block;
}

.nav-links {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	flex: 0 1 auto;
}

.nav-links :deep(.nav-item) {
	position: relative;
	margin: 0;
	padding: 6px 16px;
	border-radius: 8px;
	color: #475569;
	font-family: 'Microsoft Yahei', Arial, sans-serif;
	font-size: 14px;
	font-weight: 500;
	text-decoration: none;
	transition: color .25s ease, background .25s ease;
}

.nav-links :deep(.nav-item:hover) {
	color: #0f172a;
	background: rgba(14, 165, 233, .08);
}

.nav-links :deep(.nav-item.active) {
	color: #0f172a;
	background: rgba(14, 165, 233, .12);
	font-weight: 600;
}







.nav-actions {
	position: absolute;
	right: 24px;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	flex: 0 0 auto;
}

.nav-search {
	position: relative;
	width: 210px;
	margin-left: 0;
}

.nav-search :deep(.el-input__wrapper) {
	border-radius: 999px;
	background: rgba(15, 23, 42, .03);
	box-shadow: inset 0 0 0 1px rgba(15, 23, 42, .08);
	transition: background .2s ease, box-shadow .2s ease, transform .2s ease;
}

.nav-search :deep(.el-input__wrapper:hover) {
	background: rgba(15, 23, 42, .05);
	box-shadow: inset 0 0 0 1px rgba(15, 23, 42, .12);
}

.nav-search :deep(.el-input__wrapper.is-focus) {
	background: #fff;
	box-shadow: inset 0 0 0 2px rgba(14, 165, 233, .22);
	transform: none;
}

.nav-search :deep(.el-input__inner) {
	height: 32px;
	color: #202532;
	font-family: 'Microsoft Yahei', Arial, sans-serif;
	font-size: 13px;
	font-weight: 500;
}

.nav-search :deep(.el-input__inner::placeholder) {
	color: #7b8496;
}

.nav-search :deep(.el-input__prefix) {
	left: 15px;
	display: inline-flex;
	align-items: center;
	height: 100%;
}

.nav-search :deep(.el-input__prefix-inner) {
	display: inline-flex;
	align-items: center;
	height: 100%;
}

.search-icon {
	position: relative;
	width: 14px;
	height: 14px;
	display: inline-block;
	border: 2px solid #7b8496;
	border-radius: 50%;
	box-sizing: border-box;
}

.search-icon::after {
	content: "";
	position: absolute;
	width: 7px;
	height: 2px;
	right: -6px;
	bottom: -3px;
	border-radius: 999px;
	background: #7b8496;
	transform: rotate(45deg);
	transform-origin: left center;
}

.search-panel {
	position: absolute;
	top: calc(100% + 12px);
	right: 0;
	width: min(560px, calc(100vw - 32px));
	padding: 10px;
	border: 1px solid rgba(22, 32, 51, 0.08);
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 24px 64px rgba(20, 26, 45, 0.18);
	backdrop-filter: blur(18px) saturate(140%);
	z-index: 1200;
}

.search-panel-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 8px 10px 10px;
	border-bottom: 1px solid rgba(22, 32, 51, 0.08);
	font-family: 'Microsoft Yahei', Arial, sans-serif;
}

.search-panel-head span {
	color: #151b2d;
	font-size: 13px;
	font-weight: 800;
}

.search-panel-head small {
	color: #7b8496;
	font-size: 12px;
}

.search-panel-state {
	padding: 22px 10px;
	color: #7b8496;
	font-family: 'Microsoft Yahei', Arial, sans-serif;
	font-size: 13px;
	text-align: center;
}

.search-result-list {
	display: grid;
	gap: 4px;
	max-height: min(420px, calc(100vh - 150px));
	overflow-y: auto;
	padding-top: 8px;
}

.search-result-item {
	display: grid;
	gap: 7px;
	width: 100%;
	padding: 12px 10px;
	border: 0;
	border-radius: 8px;
	background: transparent;
	text-align: left;
	cursor: pointer;
	font-family: 'Microsoft Yahei', Arial, sans-serif;
	transition: background .18s ease, transform .18s ease;
}

.search-result-item:hover {
	background: rgba(58, 122, 254, 0.08);
	transform: translateY(-1px);
}

.search-result-item .title-row {
	display: flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
}

.search-result-item .title {
	flex: 1 1 auto;
	min-width: 0;
	overflow: hidden;
	color: #151b2d;
	font-size: 14px;
	font-weight: 800;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.search-result-item .match-type {
	flex: 0 0 auto;
	padding: 2px 6px;
	border-radius: 6px;
	font-size: 12px;
	font-weight: 800;
}

.search-result-item .match-type.is-title {
	background: rgba(124, 92, 255, 0.12);
	color: #6b4cf6;
}

.search-result-item .match-type.is-content {
	background: rgba(25, 194, 167, 0.12);
	color: #109b85;
}

.search-result-item .content {
	overflow: hidden;
	color: #687386;
	font-size: 12px;
	line-height: 1.55;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.search-panel-enter-active,
.search-panel-leave-active {
	transition: opacity .18s ease, transform .18s ease;
}

.search-panel-enter-from,
.search-panel-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}

.nav-toggle {
	position: absolute;
	top: 9px;
	right: 16px;
	width: 38px;
	height: 38px;
	padding: 0 !important;
	border-radius: 8px !important;
	background: #121827 !important;
	color: #fff !important;
	box-shadow: 0 10px 24px rgba(18, 24, 39, 0.24) !important;
}

.nav-toggle.is-open {
	background: #5d4df1 !important;
}

@media screen and (min-width: 768px) and (max-width: 980px) {
	.ui.menu .nav-shell {
		padding-left: 210px;
		padding-right: 210px;
	}

	.nav-links {
		gap: 2px;
	}

	.nav-links :deep(.nav-item) {
		padding-left: 12px;
		padding-right: 12px;
	}

	.nav-search {
		width: 180px;
	}
}

@media screen and (max-width: 767px) {
	.site-nav {
		position: fixed;
		background: rgba(255, 255, 255, 0.94) !important;
	}

	.ui.menu .nav-shell {
		width: 100% !important;
		display: flex !important;
		flex-direction: row !important;
		min-height: 56px;
		padding: 8px 68px 8px 16px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
		gap: 12px;
	}

	.brand-link,
	.nav-actions {
		position: static;
		transform: none;
	}

	.nav-links,
	.nav-actions {
		width: 100%;
		flex-basis: 100%;
	}

	.nav-links {
		order: 3;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		column-gap: 18px;
		row-gap: 8px;
	}

	.nav-actions {
		order: 4;
	}

	.nav-links.is-collapsed,
	.nav-actions.is-collapsed {
		display: none;
	}

	.ui.inverted.menu .nav-item {
		justify-content: center;
		min-width: 0;
		margin: 0 !important;
		padding: 8px 12px !important;
		border-radius: 8px;
		font-size: 14px;
		text-align: center;
	}

	.nav-search {
		width: 100% !important;
		flex: 1 1 auto;
		min-width: 0;
	}

	.search-panel {
		left: 0;
		right: auto;
		width: 100%;
	}
}
</style>

<style>
.site-nav .nav-search .el-input__wrapper {
	border-radius: 999px !important;
	background: rgba(15, 23, 42, .03) !important;
	box-shadow: inset 0 0 0 1px rgba(15, 23, 42, .08) !important;
	transition: background .2s ease, box-shadow .2s ease, transform .2s ease;
}

.site-nav .nav-search .el-input__wrapper:hover {
	background: rgba(15, 23, 42, .05) !important;
	box-shadow: inset 0 0 0 1px rgba(15, 23, 42, .12) !important;
}

.site-nav .nav-search .el-input__wrapper.is-focus {
	background: #fff !important;
	box-shadow: inset 0 0 0 2px rgba(14, 165, 233, .22) !important;
	transform: none;
}

.site-nav .nav-search .el-input__inner {
	height: 32px;
	color: #202532;
	font-family: 'Microsoft Yahei', Arial, sans-serif;
	font-size: 13px;
	font-weight: 500;
}

.site-nav .nav-search .el-input__inner::placeholder {
	color: #7b8496;
}

@media screen and (max-width: 767px) {
	.site-nav .nav-actions .nav-search {
		width: 100% !important;
		flex: 1 1 auto;
		min-width: 0;
	}
}
</style>
