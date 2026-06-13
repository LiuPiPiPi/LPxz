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
					<div class="portrait-aura portrait-aura-cyan"></div>
					<div class="portrait-aura portrait-aura-violet"></div>
					<img class="hero-portrait" src="/img/hero/lpxz-neon-lines.png" alt="">
					<div class="portrait-glass portrait-glass-large"></div>
					<div class="portrait-glass portrait-glass-small"></div>
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

.hero-stats {
	display: flex;
	gap: 12px;
	margin-top: 24px;
	animation: fadeSlideIn .7s ease .36s both;
}

.stat-pill {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 14px;
	border: 1px solid rgba(15, 23, 42, .08);
	border-radius: 999px;
	background: #fff;
}

.stat-dot {
	width: 7px;
	height: 7px;
	border-radius: 999px;
	background: #0ea5e9;
}

.stat-dot.is-green {
	background: #22c55e;
}

.stat-dot.is-amber {
	background: #f59e0b;
}

.stat-label {
	color: #64748b;
	font-size: 12px;
	font-weight: 700;
}

.stat-value {
	color: #0f172a;
	font-size: 14px;
	font-weight: 800;
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

.portrait-panel::before {
	display: none;
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

.portrait-panel::after {
	display: none;
}

.portrait-aura {
	display: none;
	position: absolute;
	border-radius: 999px;
	filter: blur(22px);
	opacity: .38;
}

.portrait-aura-cyan {
	right: 18px;
	top: 42px;
	width: 190px;
	height: 170px;
	background: rgba(14, 165, 233, .3);
}

.portrait-aura-violet {
	right: -12px;
	bottom: -8px;
	width: 190px;
	height: 150px;
	background: rgba(139, 92, 246, .22);
}

.portrait-glass {
	display: none;
	position: absolute;
	border: 1px solid rgba(255, 255, 255, .58);
	border-radius: 36px;
	background: linear-gradient(135deg, rgba(255, 255, 255, .32), rgba(255, 255, 255, .04));
	box-shadow: inset 0 0 0 1px rgba(14, 165, 233, .08);
	backdrop-filter: blur(2px);
	opacity: .68;
}

.portrait-glass-large {
	top: 28px;
	right: 22px;
	width: 210px;
	height: 156px;
	transform: rotate(-12deg);
}

.portrait-glass-small {
	right: 188px;
	bottom: 36px;
	width: 110px;
	height: 82px;
	border-radius: 26px;
	transform: rotate(14deg);
	opacity: .42;
}

@keyframes portraitFloat {
	0%, 100% { transform: translate3d(0, 0, 0); }
	50% { transform: translate3d(0, 8px, 0); }
}

.panel-grid {
	position: absolute;
	inset: -40px -56px -52px -64px;
	background-image:
		linear-gradient(rgba(14, 165, 233, .055) 1px, transparent 1px),
		linear-gradient(90deg, rgba(14, 165, 233, .055) 1px, transparent 1px);
	background-size: 30px 30px;
	mask-image: radial-gradient(ellipse at 54% 48%, black 0 36%, transparent 72%);
}

.dev-bracket {
	position: absolute;
	width: 18px;
	height: 90px;
	border: 2px solid rgba(14, 165, 233, .15);
	border-radius: 4px;
	animation: bracketFloat 6s ease-in-out infinite;
	user-select: none;
}

.dev-bracket-open {
	top: 58px;
	right: 330px;
	animation-delay: 0s;
}

.dev-bracket-open::before,
.dev-bracket-open::after {
	content: "";
	position: absolute;
	height: 30px;
	width: 2px;
	background: rgba(14, 165, 233, .15);
}

.dev-bracket-open::before {
	top: 0;
	left: 0;
}

.dev-bracket-open::after {
	bottom: 0;
	left: 0;
}

.dev-bracket-close {
	top: 92px;
	right: 52px;
	animation-delay: 2s;
}

.dev-bracket-close::before,
.dev-bracket-close::after {
	content: "";
	position: absolute;
	height: 30px;
	width: 2px;
	background: rgba(14, 165, 233, .15);
}

.dev-bracket-close::before {
	top: 0;
	right: 0;
}

.dev-bracket-close::after {
	bottom: 0;
	right: 0;
}

@keyframes bracketFloat {
	0%, 100% { transform: translateY(0); opacity: .4; }
	50% { transform: translateY(-8px); opacity: .6; }
}

.dev-brain {
	position: absolute;
	top: 84px;
	right: 168px;
	width: 168px;
	height: 168px;
	border-radius: 999px;
	border: 2px solid rgba(14, 165, 233, .12);
	background:
		radial-gradient(circle at 50% 50%, rgba(255, 255, 255, .9), rgba(224, 242, 254, .46) 58%, rgba(14, 165, 233, .06) 100%);
	animation: brainPulse 5s ease-in-out infinite alternate;
}

.dev-brain::before {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	width: 28px;
	height: 28px;
	border-radius: 999px;
	background: #0ea5e9;
	transform: translate(-50%, -50%);
	animation: corePulse 2.5s ease-in-out infinite;
}

@keyframes brainPulse {
	0% { border-color: rgba(14, 165, 233, .12); background: rgba(14, 165, 233, .06); }
	100% { border-color: rgba(14, 165, 233, .2); background: rgba(14, 165, 233, .1); }
}

@keyframes corePulse {
	0%, 100% { transform: translate(-50%, -50%) scale(1); }
	50% { transform: translate(-50%, -50%) scale(1.15); }
}

.brain-orbit {
	position: absolute;
	border-radius: 999px;
	border: 1px solid rgba(14, 165, 233, .1);
	background: transparent;
}

.brain-orbit-inner {
	inset: 28px;
	animation: brainSpin 12s linear infinite;
}

.brain-orbit-outer {
	inset: 14px;
	animation: brainSpin 20s linear infinite reverse;
	border-color: rgba(139, 92, 246, .1);
}

.brain-orbit-tilted {
	inset: 20px;
	border-color: rgba(56, 189, 248, .1);
	animation: brainSpinTilted 14s linear infinite;
	transform: rotate(30deg) scaleX(1.1);
}

@keyframes brainSpin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@keyframes brainSpinTilted {
	from { transform: rotate(30deg) scaleX(1.1); }
	to { transform: rotate(390deg) scaleX(1.1); }
}

.brain-node {
	position: absolute;
	width: 8px;
	height: 8px;
	border-radius: 999px;
	animation: nodePulse 3s ease-in-out infinite;
}

.brain-node-1 {
	top: 28px;
	right: 50px;
	background: rgba(14, 165, 233, .5);
	animation-delay: 0s;
}

.brain-node-2 {
	top: 75px;
	left: 25px;
	background: rgba(139, 92, 246, .5);
	animation-delay: 1s;
}

.brain-node-3 {
	bottom: 28px;
	right: 30px;
	background: rgba(56, 189, 248, .5);
	animation-delay: .5s;
}

@keyframes nodePulse {
	0%, 100% { opacity: .5; transform: scale(1); }
	50% { opacity: 1; transform: scale(1.3); }
}

.brain-pulse-ring {
	position: absolute;
	top: 50%;
	left: 50%;
	border-radius: 999px;
	border: 1px solid rgba(14, 165, 233, .15);
	transform: translate(-50%, -50%);
	animation: pulseRingExpand 4s ease-out infinite;
}

@keyframes pulseRingExpand {
	0% { width: 28px; height: 28px; opacity: .5; }
	100% { width: 170px; height: 170px; opacity: 0; }
}

.dev-synapse {
	position: absolute;
	width: 10px;
	height: 10px;
	border-radius: 999px;
	animation: synapsePulse 3s ease-in-out infinite;
}

.dev-synapse::before {
	content: "";
	position: absolute;
	height: 1.5px;
	background: rgba(14, 165, 233, .12);
	transform-origin: left center;
}

.dev-synapse-1 {
	top: 132px;
	right: 96px;
	background: #0ea5e9;
	animation-delay: 0s;
}

.dev-synapse-1::before {
	width: 50px;
	top: 5px;
	right: 10px;
	transform: rotate(-35deg);
	background: rgba(14, 165, 233, .1);
}

.dev-synapse-2 {
	top: 232px;
	right: 284px;
	background: rgba(139, 92, 246, .6);
	animation-delay: 1s;
}

.dev-synapse-2::before {
	width: 60px;
	top: 5px;
	left: 10px;
	transform: rotate(20deg);
	background: rgba(139, 92, 246, .1);
}

.dev-synapse-3 {
	top: 172px;
	right: 382px;
	background: rgba(245, 158, 11, .5);
	animation-delay: 2s;
}

.dev-synapse-3::before {
	width: 45px;
	top: 5px;
	left: 10px;
	transform: rotate(-15deg);
	background: rgba(245, 158, 11, .1);
}

.dev-synapse-4 {
	top: 286px;
	right: 122px;
	width: 8px;
	height: 8px;
	background: rgba(56, 189, 248, .5);
	animation-delay: .5s;
}

.dev-synapse-4::before {
	width: 40px;
	top: 4px;
	left: 8px;
	transform: rotate(-25deg);
	background: rgba(56, 189, 248, .1);
}

.dev-synapse-5 {
	top: 276px;
	right: 392px;
	width: 7px;
	height: 7px;
	background: rgba(139, 92, 246, .5);
	animation-delay: 1.5s;
}

.dev-synapse-5::before {
	width: 35px;
	top: 3px;
	left: 7px;
	transform: rotate(40deg);
	background: rgba(139, 92, 246, .1);
}

.dev-synapse-6 {
	top: 76px;
	right: 124px;
	width: 6px;
	height: 6px;
	background: rgba(245, 158, 11, .4);
	animation-delay: 2.5s;
}

.dev-synapse-6::before {
	width: 30px;
	top: 3px;
	left: 6px;
	transform: rotate(10deg);
	background: rgba(245, 158, 11, .1);
}

@keyframes synapsePulse {
	0%, 100% { opacity: .5; transform: scale(1); }
	50% { opacity: 1; transform: scale(1.3); }
}

.dev-terminal {
	position: absolute;
	bottom: 72px;
	right: 36px;
	width: 190px;
	height: 76px;
	border-radius: 8px;
	border: 1px solid rgba(15, 23, 42, .08);
	background:
		linear-gradient(90deg, rgba(14, 165, 233, .22) 0 34%, transparent 34%),
		linear-gradient(90deg, rgba(139, 92, 246, .18) 0 58%, transparent 58%),
		linear-gradient(90deg, rgba(34, 197, 94, .16) 0 44%, transparent 44%),
		rgba(255, 255, 255, .94);
	background-position: 14px 28px, 14px 42px, 14px 56px, 0 0;
	background-repeat: no-repeat;
	background-size: 120px 6px, 150px 6px, 132px 6px, auto;
	animation: cardFloat 6s ease-in-out 1s infinite;
	overflow: hidden;
}

.dev-terminal::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 16px;
	background: rgba(15, 23, 42, .05);
	border-bottom: 1px solid rgba(15, 23, 42, .08);
}

.dev-terminal::after {
	content: "";
	position: absolute;
	top: 5px;
	left: 8px;
	width: 6px;
	height: 6px;
	border-radius: 999px;
	background: #22c55e;
}

.dev-card {
	position: absolute;
	border-radius: 8px;
	border: 1px solid rgba(15, 23, 42, .08);
	background: rgba(255, 255, 255, .94);
	overflow: hidden;
	animation: cardFloat 7s ease-in-out infinite;
}

.ai-model-map {
	position: absolute;
	top: 10px;
	right: 18px;
	width: 360px;
	height: 250px;
	padding: 18px;
	border: 1px solid rgba(14, 165, 233, .14);
	border-radius: 8px;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, .22), rgba(255, 255, 255, .05)),
		linear-gradient(90deg, rgba(14, 165, 233, .045), transparent 46%, rgba(139, 92, 246, .04));
	backdrop-filter: blur(2px);
	box-shadow: none;
	opacity: .92;
	animation: modelFloat 7s ease-in-out .8s infinite;
}

.model-row {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 2px;
}

.model-row-bottom {
	margin-top: 10px;
	justify-content: center;
}

.model-node,
.core-block {
	position: relative;
	border: 1px solid rgba(14, 165, 233, .12);
	border-radius: 8px;
	background: rgba(255, 255, 255, .1);
	color: #334155;
	font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	font-size: 10px;
	font-weight: 800;
}

.model-node {
	display: grid;
	place-items: center;
	height: 46px;
}

.model-node-small {
	width: 92px;
	height: 52px;
	grid-template-columns: repeat(3, 8px);
	grid-template-rows: 16px 10px;
	column-gap: 6px;
	row-gap: 6px;
	align-content: center;
	justify-content: center;
	padding: 0 12px;
	box-sizing: border-box;
}

.model-node-small span {
	grid-column: 1 / -1;
	justify-self: center;
	line-height: 1;
}

.model-node i {
	width: 8px;
	height: 8px;
	border-radius: 999px;
	background: rgba(14, 165, 233, .38);
}

.model-node i:nth-of-type(2) {
	background: rgba(139, 92, 246, .28);
}

.model-node i:nth-of-type(3) {
	background: rgba(34, 197, 94, .24);
}

.model-node-wide {
	width: 96px;
}

.model-arrow {
	position: relative;
	width: 34px;
	height: 1.5px;
	border-radius: 999px;
	background: linear-gradient(90deg, rgba(14, 165, 233, .08), rgba(14, 165, 233, .42));
}

.model-arrow::after {
	content: "";
	position: absolute;
	top: -3px;
	right: -1px;
	width: 7px;
	height: 7px;
	border-top: 1.5px solid rgba(14, 165, 233, .32);
	border-right: 1.5px solid rgba(14, 165, 233, .32);
	transform: rotate(45deg);
}

.model-core {
	margin-top: 12px;
	padding: 12px;
	border: 1px solid rgba(14, 165, 233, .12);
	border-radius: 8px;
	background:
		linear-gradient(180deg, rgba(224, 242, 254, .18), rgba(255, 255, 255, .04)),
		rgba(255, 255, 255, .08);
}

.core-label {
	margin-bottom: 8px;
	color: #0369a1;
	font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	font-size: 10px;
	font-weight: 900;
	text-transform: uppercase;
}

.core-block {
	display: grid;
	grid-template-columns: 74px repeat(3, 1fr);
	align-items: center;
	gap: 6px;
	min-height: 28px;
	margin-top: 6px;
	padding: 5px 8px;
}

.core-block span {
	color: #475569;
}

.core-block b {
	height: 5px;
	border-radius: 999px;
	background: rgba(14, 165, 233, .28);
}

.core-block b:nth-of-type(2) {
	background: rgba(139, 92, 246, .2);
}

.core-block b:nth-of-type(3) {
	background: rgba(34, 197, 94, .18);
}

@keyframes modelFloat {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(5px); }
}

.dev-card-data {
	top: 54px;
	right: 286px;
	width: 146px;
	padding-top: 14px;
	animation-delay: 3s;
}

.card-bar {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 20px;
	background: rgba(15, 23, 42, .04);
	border-bottom: 1px solid rgba(15, 23, 42, .08);
}

.card-bar::before {
	content: "";
	position: absolute;
	top: 7px;
	left: 10px;
	width: 6px;
	height: 6px;
	border-radius: 999px;
	background: #ef4444;
}

.card-bar::after {
	content: "";
	position: absolute;
	top: 7px;
	left: 22px;
	width: 6px;
	height: 6px;
	border-radius: 999px;
	background: #22c55e;
}

.card-line {
	height: 7px;
	margin: 8px 16px;
	border-radius: 3px;
	opacity: .5;
}

.card-line-keyword {
	width: 40%;
	background: rgba(139, 92, 246, .3);
}

.card-line-func {
	width: 60%;
	background: rgba(14, 165, 233, .25);
	margin-left: 32px;
}

.card-line-string {
	width: 50%;
	background: rgba(34, 197, 94, .2);
	margin-left: 24px;
}

.card-line-comment {
	width: 35%;
	background: rgba(148, 163, 184, .2);
}

.card-line-blank {
	height: 3px;
	background: transparent;
}

.card-line-return {
	width: 45%;
	background: rgba(245, 158, 11, .25);
	margin-left: 24px;
}

.card-chart {
	display: flex;
	align-items: flex-end;
	gap: 4px;
	height: 28px;
	margin: 6px 10px 6px;
}

.chart-bar {
	flex: 1;
	border-radius: 2px 2px 0 0;
	animation: chartGrow 3s ease-in-out infinite alternate;
}

.chart-bar-1 { height: 40%; background: rgba(14, 165, 233, .3); animation-delay: 0s; }
.chart-bar-2 { height: 65%; background: rgba(139, 92, 246, .3); animation-delay: .3s; }
.chart-bar-3 { height: 50%; background: rgba(56, 189, 248, .3); animation-delay: .6s; }
.chart-bar-4 { height: 80%; background: rgba(14, 165, 233, .35); animation-delay: .9s; }
.chart-bar-5 { height: 55%; background: rgba(139, 92, 246, .25); animation-delay: 1.2s; }
.chart-bar-6 { height: 70%; background: rgba(56, 189, 248, .3); animation-delay: 1.5s; }

@keyframes chartGrow {
	0% { transform: scaleY(1); }
	100% { transform: scaleY(1.1); }
}

.dev-connection {
	position: absolute;
	border-radius: 999px;
}

.dev-connection-1 {
	top: 156px;
	right: 128px;
	width: 90px;
	height: 1.5px;
	background: rgba(14, 165, 233, .12);
	transform: rotate(168deg);
	animation: connectionPulse 4s ease-in-out infinite;
}

.dev-connection-2 {
	top: 242px;
	right: 320px;
	width: 82px;
	height: 1.5px;
	background: rgba(139, 92, 246, .12);
	transform: rotate(-138deg);
	animation: connectionPulse 4s ease-in-out 1.5s infinite;
}

.dev-connection-3 {
	top: 278px;
	right: 168px;
	width: 104px;
	height: 1.5px;
	background: rgba(56, 189, 248, .12);
	transform: rotate(-56deg);
	animation: connectionPulse 4s ease-in-out .8s infinite;
}

.dev-connection-4 {
	top: 108px;
	right: 312px;
	width: 64px;
	height: 1.5px;
	background: rgba(245, 158, 11, .1);
	transform: rotate(54deg);
	animation: connectionPulse 4s ease-in-out 2s infinite;
}

.dev-connection-5 {
	top: 332px;
	right: 184px;
	width: 80px;
	height: 1.5px;
	background: rgba(14, 165, 233, .1);
	transform: rotate(18deg);
	animation: connectionPulse 4s ease-in-out 1.2s infinite;
}

@keyframes connectionPulse {
	0%, 100% { opacity: .3; }
	50% { opacity: .6; }
}

.dev-hex {
	position: absolute;
	width: 28px;
	height: 28px;
	border: 1.5px solid rgba(14, 165, 233, .12);
	transform: rotate(45deg);
	animation: hexFloat 8s ease-in-out infinite;
}

.dev-hex::before {
	content: "";
	position: absolute;
	inset: 4px;
	border: 1px solid rgba(14, 165, 233, .08);
}

.dev-hex-1 {
	top: 190px;
	right: 44px;
	animation-delay: 0s;
}

.dev-hex-2 {
	top: 346px;
	right: 382px;
	border-color: rgba(139, 92, 246, .12);
	animation-delay: 2s;
}

.dev-hex-2::before {
	border-color: rgba(139, 92, 246, .08);
}

.dev-hex-3 {
	top: 94px;
	right: 440px;
	width: 20px;
	height: 20px;
	border-color: rgba(56, 189, 248, .12);
	animation-delay: 1s;
}

.dev-hex-3::before {
	inset: 3px;
	border-color: rgba(56, 189, 248, .08);
}

@keyframes hexFloat {
	0%, 100% { transform: rotate(45deg) translateY(0); opacity: .5; }
	50% { transform: rotate(45deg) translateY(-6px); opacity: .7; }
}

.dev-diamond {
	position: absolute;
	width: 16px;
	height: 16px;
	border-radius: 2px;
	border: 1px solid rgba(245, 158, 11, .12);
	transform: rotate(45deg);
	animation: diamondSpin 10s linear infinite;
}

.dev-diamond-1 {
	top: 350px;
	right: 102px;
	animation-delay: 0s;
}

.dev-diamond-2 {
	top: 46px;
	right: 114px;
	border-color: rgba(14, 165, 233, .12);
	animation-delay: 3s;
}

@keyframes diamondSpin {
	from { transform: rotate(45deg); opacity: .4; }
	50% { transform: rotate(225deg); opacity: .5; }
	to { transform: rotate(405deg); opacity: .4; }
}

.dev-wave {
	position: absolute;
	top: 316px;
	right: 52px;
	width: 142px;
	height: 40px;
	background: repeating-linear-gradient(
		90deg,
		rgba(14, 165, 233, .06) 0px,
		rgba(14, 165, 233, .06) 2px,
		transparent 2px,
		transparent 8px
	);
	border-radius: 20px;
	mask-image: linear-gradient(90deg, transparent, black 20%, black 80%, transparent);
	animation: waveShift 6s ease-in-out infinite alternate;
}

@keyframes waveShift {
	0% { opacity: .4; transform: scaleX(1); }
	100% { opacity: .5; transform: scaleX(1.03); }
}

.dev-dot {
	position: absolute;
	width: 4px;
	height: 4px;
	border-radius: 999px;
	background: rgba(14, 165, 233, .2);
	animation: dotPulse 4s ease-in-out infinite;
}

.dev-dot-1 { top: 122px; right: 58px; animation-delay: 0s; }
.dev-dot-2 { top: 326px; right: 454px; background: rgba(139, 92, 246, .15); animation-delay: 1s; }
.dev-dot-3 { top: 398px; right: 176px; background: rgba(56, 189, 248, .15); animation-delay: 2s; }
.dev-dot-4 { top: 46px; right: 242px; background: rgba(245, 158, 11, .15); animation-delay: .5s; }
.dev-dot-5 { top: 386px; right: 54px; animation-delay: 1.5s; }

@keyframes dotPulse {
	0%, 100% { opacity: .3; transform: scale(1); }
	50% { opacity: .6; transform: scale(1.6); }
}

.dev-circuit {
	position: absolute;
	height: 1px;
	background: rgba(14, 165, 233, .08);
	border-radius: 999px;
}

.dev-circuit::before {
	content: "";
	position: absolute;
	right: -3px;
	top: -3px;
	width: 6px;
	height: 6px;
	border-radius: 999px;
	border: 1px solid rgba(14, 165, 233, .1);
	background: rgba(14, 165, 233, .06);
}

.dev-circuit-1 {
	top: 230px;
	right: 42px;
	width: 108px;
	transform: rotate(-22deg);
	animation: circuitPulse 5s ease-in-out infinite;
}

.dev-circuit-2 {
	top: 384px;
	right: 314px;
	width: 82px;
	background: rgba(139, 92, 246, .08);
	transform: rotate(15deg);
	animation: circuitPulse 5s ease-in-out 1s infinite;
}

.dev-circuit-2::before {
	border-color: rgba(139, 92, 246, .1);
	background: rgba(139, 92, 246, .06);
}

.dev-circuit-3 {
	top: 132px;
	right: 438px;
	width: 62px;
	background: rgba(56, 189, 248, .08);
	transform: rotate(30deg);
	animation: circuitPulse 5s ease-in-out 2s infinite;
}

.dev-circuit-3::before {
	border-color: rgba(56, 189, 248, .1);
	background: rgba(56, 189, 248, .06);
}

@keyframes circuitPulse {
	0%, 100% { opacity: .4; }
	50% { opacity: .6; }
}

@keyframes cardFloat {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-5px); }
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

	.hero-stats {
		display: none;
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
