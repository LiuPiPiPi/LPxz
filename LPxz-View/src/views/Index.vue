<template>
	<div class="site">
		<!--顶部导航-->
		<Nav :siteName="siteInfo.siteName" :categoryList="categoryList" />
		<!--首页大图 只在首页且pc端时显示-->
		<!-- <div class="m-mobile-hide">
			<Header v-if="$route.name==='home'"/>
		</div> -->

		<!-- TODO 手机端不能跳转顶部菜单 -->

		<div class="main">
			<div class="ui container">
				<div class="ui stackable grid">
					<!--左侧-->
					<div class="three wide column m-mobile-hide">
						<!-- TODO 简化界面 -->
						<!-- <Introduction :class="{ 'm-display-none': focusMode }" /> -->
					</div>
					<!--中间-->
					<div class="ten wide column">
						<router-view v-slot="{ Component }">
							<keep-alive include="Home">
								<component :is="Component" />
							</keep-alive>
						</router-view>
					</div>
					<!--右侧-->
					<div class="three wide column m-mobile-hide">
						<!-- TODO 随机文章改为推荐文章 -->
						<!-- <RandomArticle :randomArticleList="randomArticleList"
								:class="{ 'm-display-none': focusMode }" /> -->
						<Categories :categoryList="categoryList" :categoryNumList="categoryNumList"
							:class="{ 'm-display-none': focusMode }" />
						<Tags :tagList="tagList" :class="{ 'm-display-none': focusMode }" />
						<!--只在文章页面显示目录-->
						<Tocbot v-if="$route.name === 'article'" />
					</div>
				</div>
			</div>
		</div>

		<!--私密文章密码对话框-->
		<ArticlePasswordDialog />

		<!--APlayer-->
		<div class="m-mobile-hide">
			<MyAPlayer />
		</div>
		<!--回到顶部-->
		<el-backtop style="box-shadow: none;background: none;z-index: 9999;">
			<img src="/img/paper-plane.png" style="width: 40px;height: 40px;">
		</el-backtop>
		<!--底部footer-->
		<Footer :siteInfo="siteInfo" :badges="badges" :newArticleList="newArticleList" :hitokoto="hitokoto" />
	</div>
</template>

<script>
import { getSite } from '@/api/index'
import Nav from "@/components/index/Nav";
import Header from "@/components/index/Header";
import Footer from "@/components/index/Footer";
import Introduction from "@/components/sidebar/Introduction";
import Tags from "@/components/sidebar/Tags";
import Categories from "@/components/sidebar/Categories";
import RandomArticle from "@/components/sidebar/RandomArticle";
import MyAPlayer from "@/components/index/MyAPlayer";
import Tocbot from "@/components/sidebar/Tocbot";
import ArticlePasswordDialog from "@/components/index/ArticlePasswordDialog";
import { mapState } from 'vuex'
import { SAVE_CLIENT_SIZE, SAVE_INTRODUCTION, SAVE_SITE_INFO, RESTORE_COMMENT_FORM } from "@/store/mutations-types";

export default {
	name: "articleIndex",
	components: { Header, ArticlePasswordDialog, Tocbot, MyAPlayer, RandomArticle, Tags, Categories, Nav, Footer, Introduction },
	data() {
		return {
			siteInfo: {
				siteName: ''
			},
			categoryList: [],
			categoryNumList: [],
			tagList: [],
			randomArticleList: [],
			badges: [],
			newArticleList: [],
			hitokoto: {},
		}
	},
	computed: {
		...mapState(['focusMode'])
	},
	watch: {
		//路由改变时，页面滚动至顶部
		'$route.path'() {
			this.scrollToTop()
		}
	},
	created() {
		this.getSite()
		//从localStorage恢复之前的评论信息
		this.$store.commit(RESTORE_COMMENT_FORM)
	},
	mounted() {
		//保存可视窗口大小
		this.$store.commit(SAVE_CLIENT_SIZE, { clientHeight: document.body.clientHeight, clientWidth: document.body.clientWidth })
		window.onresize = () => {
			this.$store.commit(SAVE_CLIENT_SIZE, { clientHeight: document.body.clientHeight, clientWidth: document.body.clientWidth })
		}
	},
	methods: {
		getSite() {
			getSite().then(res => {
				if (res.code === 200) {
					this.siteInfo = res.data.siteInfo
					this.badges = res.data.badges
					this.newArticleList = res.data.newArticleList
					this.categoryList = res.data.categoryList
					this.categoryNumList = res.data.categoryNumList
					this.tagList = res.data.tagList
					this.randomArticleList = res.data.randomArticleList
					this.$store.commit(SAVE_SITE_INFO, this.siteInfo)
					this.$store.commit(SAVE_INTRODUCTION, res.data.introduction)
					document.title = this.$route.meta.title + this.siteInfo.webTitleSuffix
				}
			})
		}
	}
}
</script>

<style scoped>
.site {
	display: flex;
	min-height: 100vh;
	/* 没有元素时，也把页面撑开至100% */
	flex-direction: column;
}

.main {
	flex: 1;
}

.main .ui.container {
	width: 1400px !important;
	margin-left: auto !important;
	margin-right: auto !important;
}

.ui.grid .three.column {
	padding: 0;
}

.ui.grid .ten.column {
	padding-top: 0;
}

.m-display-none {
	display: none !important;
}
</style>