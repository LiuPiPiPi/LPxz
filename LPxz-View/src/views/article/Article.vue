<template>
	<div>
		<div class="ui padded attached segment m-padded-tb-large">
			<div class="ui middle aligned mobile reversed stackable">
				<div class="ui grid m-margin-lr">
					<!--标题-->
					<div class="row m-padded-tb-small">
						<h2 class="ui header m-center">
							<span><i class="star red icon" v-if="article.top" /></span>
							{{ article.title }}
						</h2>
					</div>
					<!--文章简要信息-->
					<div class="row m-padded-tb-small">
						<div class="ui horizontal link list m-center">
							<div class="item m-datetime">
								<i class="small calendar icon"></i><span>{{ dateFormat(article.gmtCreate, 'YYYY-MM-DD')
									}}</span>
							</div>
							<div class="item m-views">
								<i class="small eye icon"></i><span>{{ article.views }}</span>
							</div>
							<div class="item m-common-black">
								<i class="small pencil alternate icon"></i><span>{{ article.words }} 字</span>
							</div>
							<div class="item m-common-black">
								<i class="small clock icon"></i><span>{{ article.readTime }} min</span>
							</div>
							<a class="item m-common-black" @click.prevent="bigFontSize = !bigFontSize">
								<div data-inverted="" data-tooltip="点击切换字体大小" data-position="top center">
									<i class="font icon"></i>
								</div>
							</a>
							<!-- <a class="item m-common-black" @click.prevent="changeFocusMode">
								<div data-inverted="" data-tooltip="专注模式" data-position="top center">
									<i class="book icon"></i>
								</div>
							</a> -->
						</div>
					</div>
					<!--分类-->
					<router-link :to="`/category/${article.category.name}`" class="ui orange large ribbon label"
						v-if="article.category">
						<i class="small folder open icon"></i><span class="m-text-500">{{ article.category.name
							}}</span>
					</router-link>
					<!--文章Markdown正文-->
					<div class="typo js-toc-content m-padded-tb-small match-braces rainbow-braces" id="content"
						v-viewer :class="{ 'm-big-fontsize': bigFontSize }" v-html="article.content"></div>
					<!--赞赏-->
					<div style="margin: 2em auto">
						<el-popover placement="top" width="220" trigger="click" v-if="article.appreciation">
							<div class="ui orange basic label" style="width: 100%">
								<div class="image">
									<div style="font-size: 12px;text-align: center;margin-bottom: 5px;">一毛是鼓励</div>
									<img :src="$store.state.siteInfo.reward" alt="" class="ui rounded bordered image"
										style="width: 100%">
									<div style="font-size: 12px;text-align: center;margin-top: 5px;">一块是真爱</div>
								</div>
							</div>
							<template v-slot:reference>
								<el-button class="ui orange inverted circular button m-text-500">赞赏</el-button>
							</template>
						</el-popover>
					</div>
					<!--横线-->
					<el-divider content-position="right">END</el-divider>
					<!--标签-->
					<div class="row m-padded-tb-no">
						<div class="column m-padding-left-no">
							<router-link :to="`/tag/${tag.name}`" class="ui tag label m-text-500 m-margin-small"
								:class="tag.color" v-for="(tag, index) in article.tags" :key="index">{{ tag.name
								}}</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--文章信息-->
		<div class="ui attached positive message">
			<ul class="list">
				<li>作者：{{ $store.state.introduction.name }}
					<router-link to="/about">（联系作者）</router-link>
				</li>
				<li>发表时间：{{ dateFormat(article.gmtCreate, 'YYYY-MM-DD HH:mm') }}</li>
				<li>最后修改：{{ dateFormat(article.gmtModified, 'YYYY-MM-DD HH:mm') }}</li>
				<li>本站点采用<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> 署名 4.0 国际 (CC BY 4.0)
					</a>创作共享协议。可自由转载、引用，并且允许商业性使用。但需署名作者且注明文章出处。</li>
			</ul>
		</div>
		<!--评论-->
		<div class="ui bottom teal attached segment threaded comments">
			<CommentList :page="0" :articleId="articleId" v-if="article.commentEnabled" />
			<h3 class="ui header" v-else>评论已关闭</h3>
		</div>
	</div>
</template>

<script>
import { getArticleById } from "@/api/article"
import CommentList from "@/components/comment/CommentList"
import { mapState } from "vuex"
import { SET_FOCUS_MODE, SET_IS_ARTICLE_RENDER_COMPLETE } from '@/store/mutations-types'
import { dateFormat } from "@/util/dateTimeFormatUtils"
import MathJax from '@/plugins/MathJax'
import { getArticleToken } from '@/util/localStorageToken'

export default {
	name: "articleArticle",
	components: { CommentList },
	data() {
		return {
			article: {},
			bigFontSize: false
		}
	},
	computed: {
		articleId() {
			return parseInt(this.$route.params.id)
		},
		...mapState(['siteInfo', 'focusMode'])
	},
	watch: {
		article() {
			// 使用$nextTick等组件数据渲染完之后再调用MathJax渲染方法，要不然会获取不到数据
			this.$nextTick(function () {
				// 判断是否初始配置，若无则配置
				if (!MathJax.isMathjaxConfig) {
					MathJax.initMathjaxConfig()
				}
				MathJax.MathQueue("content") // 传入组件id，让组件被MathJax渲染
			})
		}
	},
	beforeRouteEnter(to, from, next) {
		// 路由到文章文章页面之前，应将文章的渲染完成状态置为 false
		next(vm => {
			// 当 beforeRouteEnter 钩子执行前，组件实例尚未创建
			// vm 就是当前组件的实例，可以在 next 方法中把 vm 当做 this用
			vm.$store.commit(SET_IS_ARTICLE_RENDER_COMPLETE, false)
		})
	},
	beforeRouteLeave(to, from, next) {
		this.$store.commit(SET_FOCUS_MODE, false)
		// 从文章页面路由到其它页面时，销毁当前组件的同时，要销毁tocbot实例
		// 否则tocbot一直在监听页面滚动事件，而文章页面的锚点已经不存在了，会报"Uncaught TypeError: Cannot read property 'className' of null"
		// eslint-disable-next-line no-undef
		tocbot.destroy()
		next()
	},
	beforeRouteUpdate(to, from, next) {
		// 一般有两种情况会触发这个钩子
		// 1、当前文章页面跳转到其它文章页面
		// 2、点击目录跳转锚点时，路由hash值会改变，导致当前页面会重新加载，这种情况是不希望出现的
		// 在路由 beforeRouteUpdate 中判断路径是否改变
		// 如果跳转到其它页面，to.path!==from.path 就放行 next()
		// 如果是跳转锚点，path不会改变，hash会改变，to.path===from.path, to.hash!==from.path 不放行路由跳转，就能让锚点正常跳转
		if (to.path !== from.path) {
			this.$store.commit(SET_FOCUS_MODE, false)
			//在当前组件内路由到其它文章时，要重新获取文章
			this.getArticle(to.params.id)
			//只要路由路径有改变，且停留在当前Article组件内，就把文章的渲染完成状态置为 false
			this.$store.commit(SET_IS_ARTICLE_RENDER_COMPLETE, false)
			next()
		}
	},
	created() {
		this.getArticle()
	},
	methods: {
		dateFormat: dateFormat,
		getArticle(id = this.articleId) {
			// 密码保护的文章，需要发送密码验证通过后保存在localStorage的Token
			const articleToken = getArticleToken(`article${id}`)
			// 如果有则发送博主身份Token
			const adminToken = getArticleToken('adminToken')
			const token = adminToken ? adminToken : (articleToken ? articleToken : '')
			getArticleById(token, id).then(res => {
				if (res.code === 200) {
					this.article = res.data
					document.title = this.article.title + this.siteInfo.webTitleSuffix
					// v-html渲染完毕后，渲染代码块样式
					this.$nextTick(() => {
						// eslint-disable-next-line no-undef
						Prism.highlightAll()
						// 将文章渲染完成状态置为 true
						this.$store.commit(SET_IS_ARTICLE_RENDER_COMPLETE, true)
					})
				} else {
					this.msgError(res.msg)
				}
			}).catch(() => {
				this.msgError("请求失败")
			})
		},
		changeFocusMode() {
			this.$store.commit(SET_FOCUS_MODE, !this.focusMode)
		}
	}
}
</script>

<style scoped>
.el-divider {
	margin: 1rem 0 !important;
}

h1::before,
h2::before,
h3::before,
h4::before,
h5::before,
h6::before {
	display: block;
	content: " ";
	height: 55px;
	margin-top: -55px;
	visibility: hidden;
}
</style>