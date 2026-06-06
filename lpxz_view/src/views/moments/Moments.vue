<template>
	<div class="moments-page">
		<section class="moments-hero">
			<div class="hero-bg">
				<div class="hero-gradient"></div>
				<div class="hero-grid"></div>
				<div class="hero-accent hero-accent-1"></div>
				<div class="hero-accent hero-accent-2"></div>
			</div>
			<div class="hero-inner">
				<div class="hero-copy">
					<p class="hero-kicker">Moments</p>
					<h2>随记</h2>
					<p class="hero-desc">记录那些值得留存的瞬间与思绪</p>
				</div>
				<div class="hero-ornament" aria-hidden="true">
					<div class="ornament-ring"></div>
					<div class="ornament-ring ornament-ring-inner"></div>
					<div class="ornament-dot ornament-dot-1"></div>
					<div class="ornament-dot ornament-dot-2"></div>
					<div class="ornament-dot ornament-dot-3"></div>
					<div class="ornament-circuit ornament-circuit-1"></div>
					<div class="ornament-circuit ornament-circuit-2"></div>
				</div>
			</div>
		</section>

		<section class="moments-feed">
			<div class="feed-inner">
				<div v-if="momentList.length === 0" class="empty-state">
					<div class="empty-icon">
						<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
							<circle cx="24" cy="24" r="22" stroke="#e2e8f0" stroke-width="2" />
							<path d="M16 24h16M24 16v16" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" />
						</svg>
					</div>
					<p>暂无动态</p>
				</div>

				<div class="moment-card" v-for="(moment, index) in momentList" :key="index"
					:style="{ animationDelay: `${index * 0.12}s` }">
					<div class="card-rail">
						<img :src="$store.state.introduction.avatar" class="card-avatar" />
						<div class="rail-line"></div>
					</div>
					<div class="card-body" :class="{ 'card-privacy': !moment.published }">
						<div class="card-header">
							<span class="card-author">{{ $store.state.introduction.name }}</span>
							<span class="card-time">{{ dateFromNow(moment.gmtCreate) }}</span>
							<span v-if="!moment.published" class="card-badge">私密</span>
						</div>
						<div class="card-content typo" v-viewer v-html="moment.content"></div>
					</div>
				</div>

				<el-pagination @current-change="handleCurrentChange" :current-page="pageNum"
					:page-count="totalPage" layout="prev, pager, next" background hide-on-single-page
					class="moments-pagination">
				</el-pagination>
			</div>
		</section>
	</div>
</template>

<script>
import { getMomentListByPageNum } from "@/api/moment";
import { dateFromNow } from "@/util/dateTimeFormatUtils";

export default {
	name: "articleMoments",
	data() {
		return {
			momentList: [],
			pageNum: 1,
			totalPage: 0
		}
	},
	created() {
		this.getMomentList()
	},
	methods: {
		dateFromNow: dateFromNow,
		getMomentList() {
			const adminToken = window.localStorage.getItem('adminToken')
			const token = adminToken ? adminToken : ''
			getMomentListByPageNum(token, this.pageNum).then(res => {
				if (res.code === 200) {
					this.momentList = res.data.list
					this.totalPage = res.data.totalPage
				} else {
					this.msgError(res.msg)
				}
			}).catch(() => {
				this.msgError("请求失败")
			})
		},
		handleCurrentChange(newPage) {
			this.scrollToTop()
			this.pageNum = newPage
			this.getMomentList()
		},
	}
}
</script>

<style scoped>
.moments-page {
	position: relative;
	isolation: isolate;
	color: #0f172a;
	font-family: "LXGW WenKai TC", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	overflow: hidden;
}

.moments-hero {
	position: relative;
	min-height: 280px;
	overflow: hidden;
	background:
		linear-gradient(180deg, rgba(240, 249, 255, .96) 0%, rgba(248, 250, 252, .92) 50%, rgba(255, 255, 255, 0) 100%),
		linear-gradient(135deg, rgba(224, 242, 254, .42) 0%, rgba(245, 243, 255, .32) 50%, transparent 100%);
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
		linear-gradient(180deg, rgba(224, 242, 254, .72) 0%, rgba(240, 249, 255, .36) 60%, transparent 100%),
		linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #f5f3ff 70%, transparent 100%);
}

.hero-grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(14, 165, 233, .04) 1px, transparent 1px),
		linear-gradient(90deg, rgba(14, 165, 233, .04) 1px, transparent 1px);
	background-size: 28px 28px;
}

.hero-accent {
	position: absolute;
	border: 1px solid rgba(14, 165, 233, .08);
	background: transparent;
	animation: accentDrift 12s ease-in-out infinite alternate;
}

.hero-accent-1 {
	top: -24px;
	left: 6%;
	width: 180px;
	height: 90px;
	transform: rotate(-8deg);
}

.hero-accent-2 {
	bottom: 20px;
	right: 12%;
	width: 120px;
	height: 68px;
	border-color: rgba(139, 92, 246, .08);
	transform: rotate(12deg);
	animation-delay: 4s;
}

@keyframes accentDrift {
	0% { transform: translate(0, 0) rotate(var(--accent-rotate, -8deg)); }
	50% { transform: translate(12px, -8px) rotate(var(--accent-rotate, -8deg)); }
	100% { transform: translate(-8px, 10px) rotate(var(--accent-rotate, -8deg)); }
}

.hero-inner {
	position: relative;
	z-index: 1;
	max-width: 960px;
	margin: 0 auto;
	padding: 56px 40px 44px;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.hero-copy {
	max-width: 560px;
}

.hero-kicker {
	margin: 0 0 8px;
	color: #cf6a2c;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	font-size: 12px;
	font-weight: 800;
	letter-spacing: 0;
	text-transform: uppercase;
	animation: fadeSlideIn .5s ease both;
}

.hero-copy h2 {
	margin: 0;
	color: #020617;
	font-family: "Noto Serif SC", serif;
	font-size: 42px;
	font-weight: 900;
	line-height: 1.15;
	background: linear-gradient(135deg, #0f172a 0%, #0284c7 60%, #8b5cf6 100%);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
	animation: fadeSlideIn .5s ease .08s both;
}

.hero-desc {
	margin: 16px 0 0;
	color: #475569;
	font-size: 16px;
	font-weight: 500;
	line-height: 1.7;
	animation: fadeSlideIn .5s ease .16s both;
}

.hero-ornament {
	position: relative;
	width: 160px;
	height: 160px;
	flex-shrink: 0;
	pointer-events: none;
}

.ornament-ring {
	position: absolute;
	inset: 0;
	border-radius: 999px;
	border: 1.5px solid rgba(14, 165, 233, .1);
	animation: ringPulse 5s ease-in-out infinite alternate;
}

.ornament-ring-inner {
	inset: 32px;
	border-color: rgba(139, 92, 246, .1);
	animation-delay: 2s;
	animation-direction: reverse;
}

@keyframes ringPulse {
	0% { opacity: .3; transform: scale(1); }
	100% { opacity: .6; transform: scale(1.04); }
}

.ornament-dot {
	position: absolute;
	width: 6px;
	height: 6px;
	border-radius: 999px;
	animation: dotFloat 4s ease-in-out infinite;
}

.ornament-dot-1 {
	top: 18px;
	right: 28px;
	background: rgba(14, 165, 233, .4);
	animation-delay: 0s;
}

.ornament-dot-2 {
	bottom: 24px;
	left: 32px;
	background: rgba(139, 92, 246, .4);
	animation-delay: 1s;
}

.ornament-dot-3 {
	top: 50%;
	left: 8px;
	width: 5px;
	height: 5px;
	background: rgba(56, 189, 248, .4);
	animation-delay: .5s;
}

@keyframes dotFloat {
	0%, 100% { opacity: .4; transform: translateY(0); }
	50% { opacity: .8; transform: translateY(-4px); }
}

.ornament-circuit {
	position: absolute;
	height: 1px;
	border-radius: 999px;
	background: rgba(14, 165, 233, .1);
	animation: circuitPulse 5s ease-in-out infinite;
}

.ornament-circuit-1 {
	top: 64px;
	right: 0;
	width: 60px;
	transform: rotate(-18deg);
}

.ornament-circuit-2 {
	bottom: 40px;
	left: 0;
	width: 48px;
	background: rgba(139, 92, 246, .1);
	transform: rotate(12deg);
	animation-delay: 1.5s;
}

@keyframes circuitPulse {
	0%, 100% { opacity: .2; }
	50% { opacity: .5; }
}

@keyframes fadeSlideIn {
	from { opacity: 0; transform: translateY(12px); }
	to { opacity: 1; transform: translateY(0); }
}

.moments-feed {
	position: relative;
	z-index: 2;
	background:
		linear-gradient(180deg, transparent 0%, rgba(248, 250, 252, .5) 20%, #fff 100%);
}

.moments-feed::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	background-image:
		linear-gradient(rgba(14, 165, 233, .02) 1px, transparent 1px),
		linear-gradient(90deg, rgba(14, 165, 233, .02) 1px, transparent 1px);
	background-size: 36px 36px;
	mask-image: linear-gradient(180deg, transparent 0, black 12%, black 72%, transparent 100%);
}

.feed-inner {
	max-width: 780px;
	margin: -36px auto 0;
	padding: 0 32px 64px;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	padding: 72px 0;
	color: #94a3b8;
	font-size: 15px;
}

.empty-icon {
	animation: fadeSlideIn .5s ease both;
}

.moment-card {
	display: grid;
	grid-template-columns: 48px minmax(0, 1fr);
	gap: 20px;
	padding: 0 0 0 12px;
	margin-bottom: 28px;
	animation: momentEnter .5s ease both;
}

.moment-card:last-of-type {
	margin-bottom: 0;
}

@keyframes momentEnter {
	from { opacity: 0; transform: translateY(16px); }
	to { opacity: 1; transform: translateY(0); }
}

.card-rail {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0;
	position: relative;
}

.card-avatar {
	width: 40px;
	height: 40px;
	border-radius: 999px;
	border: 2px solid rgba(14, 165, 233, .12);
	object-fit: cover;
	flex-shrink: 0;
	box-shadow: 0 0 0 4px rgba(14, 165, 233, .04);
}

.rail-line {
	flex: 1;
	width: 2px;
	min-height: 32px;
	border-radius: 999px;
	background: linear-gradient(180deg, rgba(14, 165, 233, .18), rgba(139, 92, 246, .1), rgba(14, 165, 233, .06));
}

.card-body {
	border-radius: 12px;
	border: 1px solid rgba(15, 23, 42, .06);
	background: rgba(255, 255, 255, .88);
	box-shadow: 0 8px 24px rgba(15, 23, 42, .04), 0 2px 6px rgba(15, 23, 42, .03);
	transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.moment-card:hover .card-body {
	border-color: rgba(14, 165, 233, .14);
	box-shadow: 0 12px 28px rgba(15, 23, 42, .07), 0 4px 10px rgba(14, 165, 233, .04);
	transform: translateY(-2px);
}

.card-privacy {
	background: repeating-linear-gradient(135deg, #f8fafc, #f8fafc 16px, #fff 0, #fff 32px);
	border-color: rgba(15, 23, 42, .1);
}

.card-header {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8px;
	padding: 14px 18px 10px;
	border-bottom: 1px solid rgba(15, 23, 42, .04);
}

.card-author {
	color: #0f172a;
	font-size: 14px;
	font-weight: 800;
}

.card-time {
	color: #94a3b8;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	font-size: 12px;
	font-weight: 700;
}

.card-badge {
	display: inline-flex;
	align-items: center;
	min-height: 20px;
	padding: 2px 8px;
	border-radius: 6px;
	background: #f1f5f9;
	color: #64748b;
	font-size: 11px;
	font-weight: 800;
}

.card-content {
	padding: 14px 18px 16px;
	color: #334155;
	font-size: 15px;
	line-height: 1.75;
}

.card-content :deep(p) {
	margin: 0 0 8px;
}

.card-content :deep(p:last-child) {
	margin-bottom: 0;
}

.card-content :deep(img) {
	max-width: 100%;
	border-radius: 8px;
	margin: 8px 0;
}

.card-content :deep(a) {
	color: #0284c7;
	text-decoration: none;
	transition: color .2s ease;
}

.card-content :deep(a:hover) {
	color: #0369a1;
}

.moments-pagination {
	display: flex;
	justify-content: center;
	margin-top: 40px;
}

@media screen and (max-width: 767px) {
	.moments-hero {
		min-height: auto;
	}

	.hero-inner {
		padding: 40px 20px 32px;
	}

	.hero-ornament {
		display: none;
	}

	.hero-copy h2 {
		font-size: 32px;
	}

	.hero-desc {
		font-size: 14px;
	}

	.hero-accent {
		display: none;
	}

	.feed-inner {
		margin: -20px auto 0;
		padding: 0 16px 48px;
	}

	.moment-card {
		grid-template-columns: 36px minmax(0, 1fr);
		gap: 14px;
		padding: 0 0 0 6px;
		margin-bottom: 20px;
		animation-delay: 0s !important;
	}

	.card-avatar {
		width: 32px;
		height: 32px;
	}

	.card-body {
		border-radius: 10px;
	}

	.card-header {
		padding: 10px 14px 8px;
	}

	.card-content {
		padding: 10px 14px 12px;
		font-size: 14px;
	}
}

@media screen and (min-width: 768px) and (max-width: 1024px) {
	.hero-inner {
		padding: 44px 28px 36px;
	}

	.hero-ornament {
		width: 100px;
		height: 100px;
		opacity: .5;
	}

	.feed-inner {
		padding: 0 24px 48px;
	}
}
</style>