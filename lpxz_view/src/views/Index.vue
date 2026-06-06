<template>
	<div class="site">
		<!--顶部导航-->
		<Nav :categoryList="categoryList" />

		<div class="main" :class="mainClass">
			<div class="main-inner">
				<div class="main-content">
					<router-view v-slot="{ Component }">
						<keep-alive include="Home,articleArchives">
							<component :is="Component" />
						</keep-alive>
					</router-view>
				</div>
				<div class="main-sidebar m-mobile-hide">
					<template v-if="$route.name === 'home'">
						<Introduction :class="{ 'm-display-none': focusMode }" />
						<Tags :tagList="tagList" :class="{ 'm-display-none': focusMode }" />
						<Categories :categoryList="categoryList" :categoryNumList="categoryNumList"
							:class="{ 'm-display-none': focusMode }" />
					</template>
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
		<el-backtop class="backtop-custom">
			<img src="/img/back-top.png" class="backtop-img">
		</el-backtop>
		<!--底部footer-->
		<Footer :siteInfo="siteInfo" :badges="badges" :hitokoto="hitokoto" />
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
import ArticlePasswordDialog from "@/components/index/ArticlePasswordDialog";
import { mapState } from 'vuex'
import { SAVE_CLIENT_SIZE, SAVE_INTRODUCTION, SAVE_SITE_INFO, RESTORE_COMMENT_FORM } from "@/store/mutations-types";

export default {
	name: "articleIndex",
	components: { Header, ArticlePasswordDialog, MyAPlayer, RandomArticle, Tags, Categories, Nav, Footer, Introduction },
	data() {
		return {
			siteInfo: {
				siteName: ''
			},
			categoryList: [],
			categoryNumList: [],
			tagList: [],
			// randomArticleList: [],
			badges: [],
			hitokoto: {},
		}
	},
	computed: {
		...mapState(['focusMode']),
		mainClass() {
			const name = this.$route.name
			return {
				'is-home-main': name === 'home',
				'is-article-main': name === 'article',
				'is-about-main': name === 'about',
				'is-friends-main': name === 'friends',
				'is-moments-main': name === 'moments',
				'is-archives-main': name === 'archives',
				'is-content-main': name !== 'home' && name !== 'about' && name !== 'friends' && name !== 'moments' && name !== 'archives'
			}
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
					this.categoryList = res.data.categoryList
					this.categoryNumList = res.data.categoryNumList
					this.tagList = res.data.tagList
					// this.randomArticleList = res.data.randomArticleList
					this.$store.commit(SAVE_SITE_INFO, this.siteInfo)
					this.$store.commit(SAVE_INTRODUCTION, res.data.introduction)
					document.title = this.$route.meta.title + this.siteInfo.webTitleSuffix
				}
			})
		}
	}
}
</script>
