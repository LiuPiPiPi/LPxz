<template>
	<div ref="nav" class="ui inverted stackable pointing menu" :class="{ 'transparent': clientSize.clientWidth > 768 }">
		<div class="ui container">
			<router-link to="/">
				<h3 class="ui header item m-orange logo" style="">{{ siteName }}</h3>
			</router-link>
			<router-link to="/home" class="item m-black"
				:class="{ 'm-mobile-hide': mobileHide, 'active': $route.name === 'home' }">
				文章
			</router-link>
			<router-link to="/moments" class="item m-black"
				:class="{ 'm-mobile-hide': mobileHide, 'active': $route.name === 'moments' }">
				动态
			</router-link>
			<router-link to="/archives" class="item m-black"
				:class="{ 'm-mobile-hide': mobileHide, 'active': $route.name === 'archives' }">
				归档
			</router-link>
			<router-link to="/friends" class="item m-black"
				:class="{ 'm-mobile-hide': mobileHide, 'active': $route.name === 'friends' }">
				友链
			</router-link>
			<router-link to="/about" class="item m-black"
				:class="{ 'm-mobile-hide': mobileHide, 'active': $route.name === 'about' }">
				关于
			</router-link>
			<el-autocomplete v-model="queryString" :fetch-suggestions="debounceQuery" placeholder="搜索..."
				class="item" style="width: 250px" :class="{ 'm-mobile-hide': mobileHide }" popper-class="m-search-item"
				@select="handleSelect" placement="bottom" fit-input-width>
				<!-- <template #suffix>
					<i class="search icon el-input__icon"></i>
				</template> -->
				<template #default="{ item }">
					<div class="title">{{ item.title }}</div>
				</template>
			</el-autocomplete>
			<button class="ui menu black icon button m-right-top m-mobile-show" @click="toggle">
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
		siteName: {
			type: String,
			required: true
		},
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
			timer: null
		}
	},
	computed: {
		...mapState(['clientSize'])
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
	methods: {
		toggle() {
			this.mobileHide = !this.mobileHide
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
				return
			}
			getSearchArticleList(queryString).then(res => {
				if (res.code === 200) {
					this.queryResult = res.data
					if (this.queryResult.length === 0) {
						this.queryResult.push({ title: '无相关搜索结果' })
					}
					callback(this.queryResult)
				}
			}).catch(() => {
				this.msgError("请求失败")
			})
		},
		handleSelect(item) {
			if (item.id) {
				this.$router.push(`/article/${item.id}`)
			}
		}
	}
}
</script>

<style scoped>
.ui.header.logo {
	font-family: 'SimHei' !important;
	font-size: 23px;
	letter-spacing: 2px;
}

.ui.menu .container {
	width: 1400px !important;
	margin-left: auto !important;
	margin-right: auto !important;
	display: flex;
	justify-content: center;
	padding: 20px 0;
}

.ui.menu {
	transition: .3s ease-out;
	font-size: 1.2rem;
}

.ui.inverted.menu {
	background: none;
}

.ui.inverted.menu .item {
	margin: 0 15px;
	font-family: 'SimHei';
}

.ui.inverted.menu .item:not(h3):hover {
	color: #4e3bf4 !important;
}

.ui.inverted.menu .active.item {
	color: #4e3bf4 !important;
	font-weight: bolder;
}

.ui.inverted.menu .active.item:hover {
	color: #4e3bf4 !important;
}

.ui.inverted.pointing.menu .active.item:after {
	background: none !important;
}

.ui.inverted.pointing.menu .active.item:hover:after {
	background: none !important;
}

.ui.inverted.pointing.menu.transparent {
	background: transparent !important;
}

.ui.inverted.pointing.menu.transparent .active.item:after {
	background: transparent !important;
	transition: .3s ease-out;
}

.ui.inverted.pointing.menu.transparent .active.item:hover:after {
	background: transparent !important;
}

.el-popper .popper__arrow::after {
	content: none !important;
}

.popper__arrow {
	display: none !important;
}

.m-search-item {
	min-width: 350px !important;
}

.m-search-item li {
	line-height: normal !important;
	padding: 8px 10px !important;
}

.m-search-item li .title {
	text-overflow: ellipsis;
	overflow: hidden;
	color: rgba(0, 0, 0, 0.87);
}

.m-search-item li .content {
	text-overflow: ellipsis;
	font-size: 12px;
	color: rgba(0, 0, 0, .70);
}
</style>