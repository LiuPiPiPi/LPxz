<template>
	<div class="article-page">
		<div class="article-header">
			<div class="article-header-inner">
				<button class="article-back-btn" type="button" @click="goBack" title="返回上一页">
					<i class="angle left icon"></i>
					<span>返回</span>
				</button>
				<div class="article-title-row">
					<h1 class="article-title">{{ article.title }}</h1>
					<div class="article-badge" v-if="article.top">
						<i class="star icon"></i>置顶
					</div>
				</div>
				<div class="article-meta">
					<span class="meta-item">
						<i class="calendar icon"></i>{{ dateFormat(article.gmtCreate, 'YYYY-MM-DD') }}
					</span>
					<span class="meta-item">
						<i class="eye icon"></i>{{ article.views }}
					</span>
					<span class="meta-item">
						<i class="pencil alternate icon"></i>{{ article.words }} 字
					</span>
					<span class="meta-item">
						<i class="clock icon"></i>{{ article.readTime }} min
					</span>
					<button class="meta-item meta-toggle" @click.prevent="bigFontSize = !bigFontSize" title="切换字体大小">
						<i class="font icon"></i>
					</button>
				</div>
				<router-link :to="`/category/${article.category.name}`" class="article-category"
					v-if="article.category">
					<i class="folder open icon"></i>{{ article.category.name }}
				</router-link>
			</div>
		</div>

		<div class="article-content-row" :class="{ 'no-toc': !hasToc }">
			<div class="article-body">
				<div class="typo js-toc-content m-padded-tb-small match-braces rainbow-braces" id="content"
					v-viewer :class="{ 'm-big-fontsize': bigFontSize }" v-html="article.content"></div>

				<div class="article-appreciation" v-if="article.appreciation">
					<el-popover placement="top" width="220" trigger="click">
						<div class="appreciation-inner">
							<div class="appreciation-hint">一毛是鼓励</div>
							<img :src="$store.state.siteInfo.reward" alt="" class="appreciation-reward-img">
							<div class="appreciation-hint">一块是真爱</div>
						</div>
						<template v-slot:reference>
							<button class="appreciation-btn">赞赏</button>
						</template>
					</el-popover>
				</div>

				<div class="article-divider-end"></div>

				<div class="article-tags" v-if="article.tags && article.tags.length">
					<router-link :to="`/tag/${tag.name}`" class="article-tag-pill"
						v-for="(tag, index) in article.tags" :key="index">{{ tag.name }}</router-link>
				</div>
			</div>

			<div class="article-toc" v-if="hasToc">
				<Tocbot />
			</div>
		</div>

		<div class="article-support-row" :class="{ 'no-toc': !hasToc }">
			<div class="article-support-body">
				<div class="article-info">
					<ul>
						<li>作者：{{ $store.state.introduction.name }}
							<router-link to="/about">（联系作者）</router-link>
						</li>
						<li>发表时间：{{ dateFormat(article.gmtCreate, 'YYYY-MM-DD HH:mm') }}</li>
						<li>最后修改：{{ dateFormat(article.gmtModified, 'YYYY-MM-DD HH:mm') }}</li>
						<li>本站点采用<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> 署名 4.0 国际 (CC BY 4.0)
							</a>创作共享协议。可自由转载、引用，并且允许商业性使用。但需署名作者且注明文章出处。</li>
					</ul>
				</div>

				<div class="article-comments">
					<CommentList :page="0" :articleId="articleId" v-if="article.commentEnabled" />
					<h3 class="comments-closed" v-else>评论已关闭</h3>
				</div>
			</div>
			<div class="article-support-spacer" v-if="hasToc"></div>
		</div>
	</div>
</template>

<script>
import { getArticleById } from "@/api/article"
import CommentList from "@/components/comment/CommentList"
import Tocbot from "@/components/sidebar/Tocbot"
import { mapState } from "vuex"
import { SET_FOCUS_MODE, SET_IS_ARTICLE_RENDER_COMPLETE } from '@/store/mutations-types'
import { dateFormat } from "@/util/dateTimeFormatUtils"
import MathJax from '@/plugins/MathJax'
import { getArticleToken } from '@/util/localStorageToken'

export default {
	name: "articleArticle",
	components: { CommentList, Tocbot },
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
		hasToc() {
			if (!this.article.content) return false
			return /<h[1-4]/i.test(this.article.content)
		},
		...mapState(['siteInfo', 'focusMode'])
	},
	watch: {
		article() {
			this.$nextTick(function () {
				if (!MathJax.isMathjaxConfig) {
					MathJax.initMathjaxConfig()
				}
				MathJax.MathQueue("content")
			})
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.$store.commit(SET_IS_ARTICLE_RENDER_COMPLETE, false)
		})
	},
	beforeRouteLeave(to, from, next) {
		this.$store.commit(SET_FOCUS_MODE, false)
		tocbot.destroy()
		next()
	},
	beforeRouteUpdate(to, from, next) {
		if (to.path !== from.path) {
			this.$store.commit(SET_FOCUS_MODE, false)
			tocbot.destroy()
			this.getArticle(to.params.id)
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
			const articleToken = getArticleToken(`article${id}`)
			const adminToken = getArticleToken('adminToken')
			const token = adminToken ? adminToken : (articleToken ? articleToken : '')
			getArticleById(token, id).then(res => {
				if (res.code === 200) {
					this.article = res.data
					document.title = this.article.title + this.siteInfo.webTitleSuffix
					this.$nextTick(() => {
						Prism.highlightAll()
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
		},
		goBack() {
			if (window.history.length > 1) {
				this.$router.back()
			} else {
				this.$router.push('/home')
			}
		}
	}
}
</script>
