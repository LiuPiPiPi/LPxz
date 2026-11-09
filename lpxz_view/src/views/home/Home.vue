<template>
	<div class="home-feed" :class="{ 'home-feed-restored': hasPlayedEntrance }">
		<section class="home-hero">
			<div class="hero-bg">
				<div class="hero-gradient"></div>
				<div class="hero-grid"></div>
				<div class="hero-accent hero-accent-1"></div>
				<div class="hero-accent hero-accent-2"></div>
				<div class="hero-accent hero-accent-3"></div>
			</div>
			<div class="hero-inner">
				<div class="home-copy">
					<h1>热爱生活，从容面对</h1>
					<p class="home-summary">Success is not final. Failure is not fatal.<br>It is the courage to continue that counts.</p>
				</div>
				<div class="insight-panel portrait-panel" aria-hidden="true">
					<img class="hero-portrait" src="/img/hero/lpxz-neon-lines.png" alt="">
				</div>
			</div>
		</section>
		<div class="updates-column" :class="{ 'has-pinned': pinnedArticles.length }">
			<aside v-if="pinnedArticles.length" class="pinned-articles" aria-label="置顶">
				<ArticleItem :articleList="pinnedArticles" v-viewer />
			</aside>
			<ArticleItem class="latest-articles" :articleList="latestArticles" v-viewer />
			<Pagination :getArticleList="getArticleList" :totalPage="totalPage" />
		</div>
	</div>
</template>

<script>
import ArticleItem from "@/components/article/ArticleItem";
import Pagination from "@/components/article/Pagination";
import { getArticleList } from "@/api/home";

export default {
	name: "BlogHome",
	components: { ArticleItem, Pagination },
	data() {
		return {
			articleList: [],
			totalPage: 0,
			getArticleListFinish: false,
			hasPlayedEntrance: false
		}
	},
	computed: {
		latestArticles() {
			return this.articleList.filter(article => !article.top)
		},
		pinnedArticles() {
			return this.articleList.filter(article => article.top)
		},
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.ensureArticleList()
		})
	},
	mounted() {
		this.ensureArticleList()
	},
	activated() {
		this.ensureArticleList()
	},
	deactivated() {
		this.hasPlayedEntrance = true
	},
	methods: {
		ensureArticleList() {
			if (!this.getArticleListFinish || this.articleList.length === 0) {
				this.getArticleList()
			}
		},
		getArticleList(pageNum) {
			getArticleList(pageNum).then(res => {
				if (res.code === 200) {
					this.articleList = res.data.list
					this.totalPage = res.data.totalPage
					this.$nextTick(() => {
						// eslint-disable-next-line no-undef
						Prism.highlightAll()
					})
					this.getArticleListFinish = true
				} else {
					this.msgError(res.msg)
				}
			}).catch(() => {
				this.msgError("请求失败")
			})
		},
	}
}
</script>

<style scoped>
.home-feed {
	position: relative;
	isolation: isolate;
	width: 100%;
	padding: 0 0 96px;
	color: #0f172a;
	font-family: var(--site-body-font);
	background: #fff;
	overflow: hidden;
}

.home-hero {
	position: relative;
	width: min(1440px, calc(100% - 6vw));
	margin: 0 auto;
}

.hero-bg {
	position: absolute;
	inset: 0;
	z-index: 0;
	overflow: hidden;
}

.hero-gradient {
	position: absolute;
	inset: 0;
	background:
		linear-gradient(180deg, rgba(224, 242, 254, .96) 0%, rgba(240, 249, 255, .72) 64%, rgba(248, 250, 252, 0) 100%),
		linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 35%, #f5f3ff 55%, #fdf4ff 75%, #fffbeb 100%);
}

.hero-grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(14, 165, 233, .06) 1px, transparent 1px),
		linear-gradient(90deg, rgba(14, 165, 233, .06) 1px, transparent 1px);
	background-size: 32px 32px;
}

.hero-accent {
	position: absolute;
	border: 1px solid rgba(14, 165, 233, .08);
	background: transparent;
}

.hero-accent-1 {
	top: -60px;
	left: 8%;
	width: 280px;
	height: 140px;
	transform: rotate(-10deg);
	animation: accentDrift 12s ease-in-out infinite alternate;
}

.hero-accent-2 {
	bottom: -40px;
	right: 18%;
	width: 200px;
	height: 110px;
	border-color: rgba(139, 92, 246, .08);
	transform: rotate(14deg);
	animation: accentDrift 12s ease-in-out 4s infinite alternate;
}

.hero-accent-3 {
	top: 30%;
	right: 40%;
	width: 160px;
	height: 88px;
	border-color: rgba(56, 189, 248, .08);
	transform: rotate(20deg);
	animation: accentDrift 12s ease-in-out 8s infinite alternate;
}

@keyframes accentDrift {
	0% { transform: translate(0, 0); }
	50% { transform: translate(16px, -10px); }
	100% { transform: translate(-10px, 14px); }
}

.hero-inner {
	position: relative;
	z-index: 1;
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: 32px;
	min-height: 320px;
	width: min(1280px, 88vw);
	margin: 0 auto;
	padding: 24px clamp(16px, 2vw, 28px);
}

.home-copy h1 {
	margin: 0;
	color: #020617;
	font-family: "Noto Serif SC", serif;
	font-size: clamp(40px, 4.6vw, 68px);
	font-weight: 900;
	line-height: 1.08;
	letter-spacing: 0;
	white-space: normal;
	animation: fadeSlideIn .7s ease both;
	background: linear-gradient(135deg, #0f172a 0%, #0284c7 60%, #8b5cf6 100%);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}

@keyframes fadeSlideIn {
	from {
		opacity: 0;
		transform: translateY(16px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.home-summary {
	max-width: 560px;
	margin: 20px 0 0;
	color: #475569;
	font-size: 18px;
	font-weight: 500;
	line-height: 1.75;
	letter-spacing: 0;
	animation: fadeSlideIn .7s ease .24s both;
}

.home-feed-restored .home-copy h1,
.home-feed-restored .home-summary,
.home-feed-restored .updates-column {
	animation: none;
}

.insight-panel {
	position: relative;
	width: clamp(160px, 20vw, 300px);
	aspect-ratio: 1 / 1;
	pointer-events: none;
}

.portrait-panel {
	overflow: visible;
	border-radius: 0;
	opacity: 1;
	background: none;
	box-shadow: none;
	animation: portraitFloat 8s ease-in-out .5s infinite;
}

.hero-portrait {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: contain;
	object-position: center;
	opacity: 1;
	filter: saturate(1.02) contrast(1.03) brightness(1.01);
	mix-blend-mode: normal;
}

@keyframes portraitFloat {
	0%, 100% { transform: translate3d(0, 0, 0); }
	50% { transform: translate3d(0, 8px, 0); }
}

.updates-column {
	scroll-margin-top: 72px;
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	align-items: start;
	width: min(1280px, calc(100% - 12vw));
	margin: 40px auto 0;
	animation: feedSlideIn .6s ease .6s both;
}

.updates-column:not(.has-pinned) {
	max-width: 840px;
}

.latest-articles :deep(.article-update:first-child) {
	padding-top: 0;
}

.pinned-articles {
	min-width: 0;
	padding: 4px 24px;
	border-radius: 12px;
	background: #eaf4fc;
}

.pinned-articles :deep(.article-update:last-child) {
	border-bottom: 0;
}

@media screen and (min-width: 961px) {
	.updates-column.has-pinned {
		grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
		column-gap: clamp(32px, 4vw, 56px);
	}

	.pinned-articles {
		grid-area: 1 / 2 / span 2;
	}

	.latest-articles :deep(.article-update) {
		padding-block: 32px;
	}

	.latest-articles :deep(.feed-title) {
		font-size: clamp(24px, 2.35vw, 34px);
	}
}

@media screen and (max-width: 960px) {
	.pinned-articles + .latest-articles:not(:empty) {
		margin-top: 24px;
	}
}

@keyframes feedSlideIn {
	from {
		opacity: 0;
		transform: translateY(24px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@media screen and (max-width: 767px) {
	.home-feed {
		padding: 0 0 64px;
	}

	.home-hero {
		width: 100%;
	}

	.hero-inner {
		display: block;
		min-height: auto;
		width: auto;
		padding: 40px 20px 36px;
	}

	.hero-accent {
		display: none;
	}

	.home-copy h1 {
		font-size: clamp(32px, 9vw, 38px);
		line-height: 1.12;
		white-space: normal;
	}

	.home-summary {
		font-size: 15px;
		line-height: 1.7;
	}

	.insight-panel {
		display: none;
	}

	.updates-column {
		width: calc(100% - 40px);
		margin-top: 28px;
	}
}

@media screen and (min-width: 768px) and (max-width: 960px) {
	.hero-inner {
		min-height: 260px;
	}
}
@media (prefers-reduced-motion: reduce) {
	.hero-accent,
	.portrait-panel,
	.home-copy h1,
	.home-summary,
	.updates-column {
		animation: none;
	}
}
</style>
