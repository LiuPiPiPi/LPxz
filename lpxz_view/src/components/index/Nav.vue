<template>
	<div class="ui menu site-nav">
		<div class="ui container nav-shell">
			<router-link to="/" class="brand-link" aria-label="LPxz Home">
				<span class="brand-mark" aria-hidden="true">
					<img src="/img/brand/logo.png" alt="" />
				</span>
			</router-link>

			<nav id="site-navigation" class="nav-links" :class="{ 'is-collapsed': mobileHide }" aria-label="主导航"
				@click="mobileHide = true">
				<router-link to="/home" class="item nav-item"
					:class="{ 'active': $route.name === 'home' }">
					首页
				</router-link>
				<router-link v-if="moduleVisible.moment" to="/moments" class="item nav-item"
					:class="{ 'active': $route.name === 'moments' }">
					动态
				</router-link>
				<router-link v-if="moduleVisible.archive" to="/archives" class="item nav-item"
					:class="{ 'active': $route.name === 'archives' }">
					归档
				</router-link>
				<router-link v-if="moduleVisible.friend" to="/friends" class="item nav-item"
					:class="{ 'active': $route.name === 'friends' }">
					友链
				</router-link>
				<router-link v-if="moduleVisible.about" to="/about" class="item nav-item"
					:class="{ 'active': $route.name === 'about' }">
					关于
				</router-link>
			</nav>

			<button ref="searchToggle" class="nav-search-toggle m-mobile-show" type="button"
				:aria-expanded="searchOpen" aria-controls="site-search"
				@click="searchOpen ? closeSearch(true) : openMobileSearch()">
				<i class="search icon" aria-hidden="true"></i>搜索
			</button>
			<div id="site-search" ref="searchBox" class="nav-actions" :class="{ 'is-search-open': searchOpen }"
				role="search" aria-label="搜索文章">
				<div class="nav-search">
					<div class="search-input-row">
						<input ref="searchInput" v-model="queryString" class="search-input" type="search"
							placeholder="搜索文章" aria-label="搜索文章" role="combobox" autocomplete="off"
							:aria-expanded="showResults" :aria-controls="showResults ? 'article-search-results' : undefined"
							:aria-activedescendant="activeResultId"
							@focus="searchOpen = true" @click="searchOpen = true" @keydown="handleSearchKey">
						<button type="button" class="search-close m-mobile-show" @click="closeSearch(true)">关闭</button>
					</div>
					<div v-if="searchOpen" class="search-panel">
						<div class="search-panel-head">
							<span>搜索结果</span>
							<small v-if="showResults">标题优先</small>
						</div>
						<div v-if="searchMessage" class="search-panel-state" role="status">{{ searchMessage }}</div>
						<div v-if="showResults" id="article-search-results" class="search-result-list" role="listbox"
							aria-label="文章搜索结果">
							<div v-for="(item, index) in queryResult" :id="`article-result-${item.id}`" :key="item.id"
								class="search-result-item" role="option" :aria-selected="index === activeIndex"
								@mousedown.prevent @click="handleSelect(item)">
								<span class="title-row">
									<span class="title"><template v-for="(part, i) in item.titleParts" :key="i"><mark
										v-if="i === 1">{{ part }}</mark><template v-else>{{ part }}</template></template></span>
									<span class="match-type">{{ item.matchType === 'title' ? '标题' : '正文' }}</span>
								</span>
								<span v-if="item.contentParts[0] || item.contentParts[1]" class="content"><template
									v-for="(part, i) in item.contentParts" :key="i"><mark
										v-if="i === 1">{{ part }}</mark><template v-else>{{ part }}</template></template></span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<button class="ui menu icon button nav-toggle m-mobile-show" type="button" :class="{ 'is-open': !mobileHide }"
				@click="toggleMenu" :aria-label="mobileHide ? '展开菜单' : '收起菜单'" :aria-expanded="!mobileHide"
				aria-controls="site-navigation">
				<i class="sidebar icon" aria-hidden="true"></i>
			</button>
		</div>
	</div>
</template>

<script>
import { getSearchArticleList } from "@/api/article"
import { mapState } from 'vuex'
import { isModuleEnabled } from '@/util/moduleSwitch'

function highlightMatch(text = '', query) {
	const index = text.toLowerCase().indexOf(query.toLowerCase())
	if (index < 0) return [text]
	return [text.slice(0, index), text.slice(index, index + query.length), text.slice(index + query.length)]
}

export default {
	name: "articleNav",
	data() {
		return {
			mobileHide: true,
			queryString: '',
			queryResult: [],
			timer: null,
			requestId: 0,
			searchOpen: false,
			searchLoading: false,
			searchError: '',
			activeIndex: -1
		}
	},
	computed: {
		...mapState(['siteInfo']),
		moduleVisible() {
			const info = this.siteInfo
			return {
				moment: !!info && isModuleEnabled(info.momentModuleEnabled),
				archive: !!info && isModuleEnabled(info.archiveModuleEnabled),
				friend: !!info && isModuleEnabled(info.friendModuleEnabled),
				about: !!info && isModuleEnabled(info.aboutModuleEnabled)
			}
		},
		showResults() {
			return this.searchOpen && this.queryResult.length > 0
		},
		activeResultId() {
			const item = this.queryResult[this.activeIndex]
			return this.showResults && item ? `article-result-${item.id}` : undefined
		},
		searchMessage() {
			if (this.searchLoading) return '正在搜索…'
			if (this.searchError) return this.searchError
			if (!this.queryString.trim()) return '输入关键词搜索标题和正文'
			if (!this.queryResult.length) return '没有找到相关文章，试试其他关键词'
			return ''
		}
	},
	watch: {
		'$route.path'() {
			this.mobileHide = true
			this.closeSearch()
		},
		queryString(value) {
			clearTimeout(this.timer)
			const requestId = ++this.requestId
			this.queryResult = []
			this.activeIndex = -1
			this.searchLoading = false
			this.searchError = ''
			this.searchOpen = true

			const query = value.trim()
			if (!query) return
			if (query.length > 20 || /[%_[#*]/.test(query)) {
				this.searchError = '请输入 20 字以内的关键词，去掉 %、_、[、# 或 * 后重试'
				return
			}

			this.searchLoading = true
			this.timer = setTimeout(() => this.search(query, requestId), 360)
		}
	},
	mounted() {
		document.addEventListener('click', this.closeSearchOutside)
		document.addEventListener('focusin', this.closeSearchOutside)
	},
	beforeUnmount() {
		clearTimeout(this.timer)
		this.requestId++
		document.removeEventListener('click', this.closeSearchOutside)
		document.removeEventListener('focusin', this.closeSearchOutside)
	},
	methods: {
		toggleMenu() {
			this.closeSearch()
			this.mobileHide = !this.mobileHide
		},
		openMobileSearch() {
			this.mobileHide = true
			this.searchOpen = true
			this.$nextTick(() => this.$refs.searchInput.focus())
		},
		closeSearch(restoreFocus = false) {
			this.searchOpen = false
			this.activeIndex = -1
			if (restoreFocus && window.matchMedia('(max-width: 767px)').matches) {
				this.$refs.searchToggle.focus()
			}
		},
		closeSearchOutside(event) {
			if (this.searchOpen && !this.$refs.searchBox.contains(event.target) && !this.$refs.searchToggle.contains(event.target)) {
				this.closeSearch()
			}
		},
		async search(query, requestId) {
			try {
				const response = await getSearchArticleList(query)
				if (requestId !== this.requestId) return
				if (response.code !== 200) {
					this.searchError = '搜索失败，请重新输入关键词'
					return
				}
				this.queryResult = (response.data || []).map(item => {
					const titleParts = highlightMatch(item.title || '', query)
					return {
						...item,
						titleParts,
						contentParts: highlightMatch(item.content || '', query),
						matchType: item.matchType || (titleParts.length > 1 ? 'title' : 'content')
					}
				}).sort((a, b) => Number(b.matchType === 'title') - Number(a.matchType === 'title'))
			} catch {
				if (requestId === this.requestId) this.searchError = '搜索失败，请重新输入关键词'
			} finally {
				if (requestId === this.requestId) this.searchLoading = false
			}
		},
		// Keep focus on the input while arrow keys move through the result list.
		// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#keyboard-interaction
		handleSearchKey(event) {
			if (event.isComposing) return
			if (event.key === 'Escape' && this.searchOpen) {
				event.preventDefault()
				this.closeSearch(true)
				return
			}
			const direction = { ArrowDown: 1, ArrowUp: -1 }[event.key]
			if (direction && this.queryResult.length) {
				event.preventDefault()
				this.searchOpen = true
				const count = this.queryResult.length
				const start = this.activeIndex < 0 && direction < 0 ? 0 : this.activeIndex
				this.activeIndex = (start + direction + count) % count
				this.$nextTick(() => document.getElementById(this.activeResultId)?.scrollIntoView({ block: 'nearest' }))
			}
			if (event.key === 'Enter' && this.showResults) {
				event.preventDefault()
				this.handleSelect(this.queryResult[Math.max(0, this.activeIndex)])
			}
		},
		handleSelect(item) {
			this.closeSearch()
			this.$store.dispatch('goArticlePage', item)
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
}

.search-input-row {
	display: flex;
	align-items: center;
	gap: 12px;
}

.search-input {
	width: 100%;
	min-width: 0;
	height: 36px;
	padding: 0 14px;
	border: 1px solid #cbd5e1;
	border-radius: 999px;
	background: #f8fafc;
	color: #0f172a;
	font: inherit;
	font-size: 14px;
}

.search-input::placeholder {
	color: #475569;
}

.search-panel {
	position: absolute;
	top: calc(100% + 12px);
	right: 0;
	width: min(540px, calc(100vw - 32px));
	padding: 8px;
	border: 1px solid #e2e8f0;
	border-radius: 10px;
	background: #fff;
	box-shadow: 0 16px 40px rgba(15, 23, 42, .15);
}

.search-panel-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 10px 12px;
	border-bottom: 1px solid #e2e8f0;
	font-weight: 700;
}

.search-panel-head small,
.search-panel-state {
	color: #475569;
	font-size: 13px;
	font-weight: 400;
}

.search-panel-state {
	padding: 16px 10px;
}

.search-result-list {
	display: grid;
	gap: 4px;
	max-height: min(440px, calc(100vh - 150px));
	overflow-y: auto;
	padding-top: 4px;
}

.search-result-item {
	display: grid;
	gap: 6px;
	min-width: 0;
	padding: 10px;
	border-radius: 6px;
	cursor: pointer;
}

.search-result-item:hover,
.search-result-item[aria-selected="true"] {
	background: #e0f2fe;
}

.search-result-item[aria-selected="true"] {
	box-shadow: inset 3px 0 var(--site-link);
}

.title-row {
	display: flex;
	align-items: flex-start;
	gap: 10px;
}

.title,
.content {
	display: -webkit-box;
	overflow: hidden;
	overflow-wrap: anywhere;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.title {
	flex: 1;
	font-weight: 700;
	line-height: 1.4;
}

.content {
	color: #475569;
	font-size: 13px;
	line-height: 1.45;
}

.match-type {
	padding: 2px 6px;
	border-radius: 4px;
	background: #f1f5f9;
	color: #334155;
	font-size: 12px;
	white-space: nowrap;
}

.search-result-item mark {
	background: #fef3c7;
	color: #78350f;
}

.nav-toggle,
.nav-search-toggle,
.search-close {
	min-width: 44px;
	min-height: 44px;
	border: 1px solid #cbd5e1;
	border-radius: 8px;
	background: #fff;
	color: #0f172a;
	font: inherit;
	cursor: pointer;
}

.nav-toggle {
	margin: 0 !important;
	padding: 0 !important;
	background: #0f172a !important;
	color: #fff !important;
}

.nav-toggle.is-open {
	background: var(--site-link) !important;
}

@media (min-width: 768px) and (max-width: 980px) {
	.ui.menu .nav-shell {
		padding-inline: 210px;
	}

	.nav-links {
		gap: 2px;
	}

	.nav-links :deep(.nav-item) {
		padding-inline: 12px;
	}

	.nav-search {
		width: 180px;
	}
}

@media (max-width: 767px) {
	.ui.menu .nav-shell {
		margin: 0 !important;
		justify-content: flex-end;
		gap: 8px;
		padding: 6px 16px;
	}

	.brand-link {
		left: 16px;
	}

	.nav-links,
	.nav-actions {
		position: absolute;
		inset: 100% 0 auto;
		transform: none;
		border-bottom: 1px solid #e2e8f0;
		background: #fff;
		box-shadow: 0 12px 24px rgba(15, 23, 42, .12);
	}

	.nav-links {
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 6px;
		padding: 12px 16px;
	}

	.nav-links.is-collapsed,
	.nav-actions:not(.is-search-open) {
		display: none;
	}

	.nav-links :deep(.nav-item) {
		display: flex;
		align-items: center;
		min-height: 44px;
		padding: 8px 12px;
		white-space: nowrap;
	}

	.nav-actions {
		display: block;
		padding: 12px 16px;
	}

	.nav-search {
		width: 100%;
	}

	.search-panel {
		position: static;
		width: 100%;
		margin-top: 8px;
		padding: 0;
		border: 0;
		box-shadow: none;
	}

	.search-result-list {
		max-height: min(440px, max(96px, calc(100dvh - 200px)));
	}

	.search-close,
	.nav-search-toggle {
		padding: 0 10px;
		white-space: nowrap;
	}

	.search-input {
		height: 44px;
		font-size: 16px;
	}
}
</style>
