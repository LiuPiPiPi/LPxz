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
		<div class="updates-column">
			<ArticleList
				:getArticleList="getArticleList"
				:articleList="articleList"
				:totalPage="totalPage"
				:disableEntranceAnimation="hasPlayedEntrance"
			/>
		</div>
	</div>
</template>

<script>
import ArticleList from "@/components/article/ArticleList";
import { getArticleList } from "@/api/home";

export default {
	name: "Home",
	components: { ArticleList },
	data() {
		return {
			articleList: [],
			totalPage: 0,
			getArticleListFinish: false,
			hasPlayedEntrance: false
		}
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
	font-family: "LXGW WenKai TC", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	background:
		linear-gradient(180deg, rgba(240, 249, 255, .95) 0%, rgba(248, 250, 252, .98) 42%, #ffffff 100%),
		linear-gradient(115deg, transparent 0 58%, rgba(139, 92, 246, .07) 58% 70%, transparent 70%),
		linear-gradient(24deg, transparent 0 22%, rgba(14, 165, 233, .06) 22% 34%, transparent 34%);
	overflow: hidden;
}

.home-feed::before {
	content: "";
	position: absolute;
	top: 420px;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	background-image:
		linear-gradient(rgba(14, 165, 233, .035) 1px, transparent 1px),
		linear-gradient(90deg, rgba(14, 165, 233, .035) 1px, transparent 1px);
	background-size: 36px 36px;
	mask-image: linear-gradient(180deg, transparent 0, black 16%, black 72%, transparent 100%);
}

.home-hero {
	position: relative;
	min-height: 500px;
	margin-bottom: 0;
	overflow: visible;
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
	max-width: 1536px;
	margin: 0 auto;
	padding: 92px 80px 88px;
}

.home-copy {
	position: relative;
	z-index: 2;
	width: min(100%, calc(100vw - min(28vw, 340px) - clamp(180px, 20vw, 300px)));
	max-width: 800px;
	padding-top: 24px;
}

.home-copy h1 {
	margin: 0;
	padding: 12px 0;
	color: #020617;
	font-family: "Noto Serif SC", serif;
	font-size: clamp(48px, 5vw, 76px);
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
	margin: 28px 0 0;
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
	position: absolute;
	top: 86px;
	right: clamp(84px, 10vw, 150px);
	z-index: 1;
	width: min(28vw, 340px);
	aspect-ratio: 1 / 1;
	height: auto;
	pointer-events: none;
	color: #0f172a;
	filter: none;
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
	position: relative;
	z-index: 2;
	width: min(70%, calc(100% - 64px));
	max-width: 1180px;
	margin: -74px auto 0;
	padding: 42px 0 0;
	animation: feedSlideIn .6s ease .6s both;
}

.updates-column::before {
	content: "";
	position: absolute;
	top: 0;
	left: -40px;
	right: -40px;
	height: 1px;
	background: linear-gradient(90deg, rgba(14, 165, 233, .34), rgba(139, 92, 246, .16), transparent);
}

.updates-column::after {
	content: "";
	position: absolute;
	top: -72px;
	left: -80px;
	right: -360px;
	height: 220px;
	z-index: -1;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, .2), rgba(255, 255, 255, .74) 42%, rgba(255, 255, 255, 0) 100%),
		linear-gradient(98deg, rgba(14, 165, 233, .08), transparent 58%);
	mask-image: linear-gradient(180deg, transparent 0, black 28%, black 88%, transparent 100%);
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
		min-height: auto;
		margin-bottom: 0;
	}

	.hero-inner {
		padding: 56px 20px 52px;
	}

	.hero-accent {
		display: none;
	}

	.home-copy {
		width: 100%;
		max-width: 100%;
		padding-top: 0;
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
		width: auto;
		max-width: none;
		margin: -14px 20px 0;
		padding: 30px 0 0;
	}
}

@media screen and (min-width: 1121px) and (max-width: 1320px) {
	.home-copy {
		width: min(100%, calc(100vw - min(26vw, 300px) - 230px));
	}

	.insight-panel {
		top: 94px;
		right: clamp(48px, 6vw, 84px);
		width: min(26vw, 300px);
	}
}

@media screen and (min-width: 961px) and (max-width: 1120px) {
	.home-copy {
		width: min(100%, calc(100vw - 280px));
		max-width: 720px;
	}

	.home-copy h1 {
		font-size: clamp(48px, 6vw, 64px);
		line-height: 1.1;
	}

	.insight-panel {
		top: 108px;
		right: 28px;
		width: 240px;
		opacity: .72;
	}
}

@media screen and (min-width: 768px) and (max-width: 1120px) {
	.hero-inner {
		padding-left: 32px;
		padding-right: 32px;
	}

	.insight-panel {
		transform-origin: top right;
	}

	.updates-column {
		width: calc(100% - 96px);
	}
}

@media screen and (min-width: 768px) and (max-width: 960px) {
	.home-copy {
		width: 100%;
		max-width: 760px;
	}

	.home-copy h1 {
		font-size: clamp(42px, 8vw, 58px);
		line-height: 1.12;
	}

	.insight-panel {
		display: none;
	}
}
</style>