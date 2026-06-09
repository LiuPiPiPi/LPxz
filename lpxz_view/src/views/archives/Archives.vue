<template>
	<div class="archives-page" :class="{ 'archives-page-restored': hasPlayedEntrance }">
		<section class="archives-hero">
			<div class="hero-bg">
				<div class="hero-gradient"></div>
				<div class="hero-grid"></div>
				<div class="hero-accent hero-accent-1"></div>
				<div class="hero-accent hero-accent-2"></div>
			</div>
			<div class="hero-inner">
				<div class="hero-copy">
					<p class="hero-kicker">Archives</p>
					<div class="hero-title-row">
						<h2>文章归档</h2>
						<div class="hero-stats" v-if="count > 0">
							<div class="stat-pill">
								<span class="stat-dot"></span>
								<span class="stat-value">{{ count }}</span>
								<span class="stat-label">篇文章</span>
							</div>
						</div>
					</div>
					<p class="hero-desc">以时间为线索，回溯每一篇留下的文字</p>
				</div>
				<div class="hero-ornament" aria-hidden="true">
					<div class="ornament-ring"></div>
					<div class="ornament-ring ornament-ring-inner"></div>
					<div class="ornament-dot ornament-dot-1"></div>
					<div class="ornament-dot ornament-dot-2"></div>
					<div class="ornament-circuit ornament-circuit-1"></div>
					<div class="ornament-circuit ornament-circuit-2"></div>
				</div>
			</div>
		</section>

		<section class="archives-feed">
			<div class="feed-layout">
				<div class="feed-main">
					<div v-if="!hasArchives" class="empty-state">
						<div class="empty-icon">
							<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
								<circle cx="24" cy="24" r="22" stroke="#e2e8f0" stroke-width="2" />
								<path d="M16 24h16M24 16v16" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" />
							</svg>
						</div>
						<p>暂无归档文章</p>
					</div>

					<div class="archive-timeline" v-else>
						<div class="timeline-rail"></div>

						<div class="archive-group" :class="colorObj[index % 5]"
							v-for="(value, key, index) in articleMap" :key="key"
							:style="{ animationDelay: `${index * 0.15}s` }">
							<div class="group-marker">
								<div class="marker-dot"></div>
								<div class="marker-card">
									<span class="marker-month">{{ key }}</span>
									<span class="marker-count">{{ value.length }} 篇</span>
								</div>
							</div>
							<div class="group-articles">
								<a class="article-entry" href="javascript:;" v-for="article in value" :key="article.id"
									@click.prevent="toArticle(article)">
									<span class="entry-date">{{ formatArchiveDate(key, article.day) }}</span>
									<span class="entry-title">{{ article.title }}</span>
									<span class="entry-arrow">&rarr;</span>
								</a>
							</div>
						</div>

						<div class="timeline-end">
							<div class="end-dot"></div>
							<span class="end-label">从这里开始</span>
						</div>
					</div>
				</div>

				<div class="feed-sidebar" v-if="tagList.length || categoryList.length">
					<div class="sidebar-card" v-if="categoryList.length">
						<div class="sidebar-title">
							<i class="folder open icon"></i>分类
						</div>
						<div class="sidebar-categories">
							<router-link v-for="(cat, i) in categoryList" :key="i" :to="`/category/${cat.name}`" class="sidebar-category">
								<span class="sidebar-cat-name">{{ cat.name }}</span>
								<span class="sidebar-cat-count" v-if="categoryNumList[i]">{{ categoryNumList[i] }}</span>
							</router-link>
						</div>
					</div>
					<div class="sidebar-card" v-if="tagList.length">
						<div class="sidebar-title">
							<i class="tags icon"></i>标签
						</div>
						<div class="sidebar-tags">
							<router-link v-for="(tag, i) in tagList" :key="i" :to="`/tag/${tag.name}`" class="sidebar-tag">{{ tag.name }}</router-link>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import { getArchives } from "@/api/archives";
import { getSite } from "@/api/index";

export default {
	name: "articleArchives",
	data() {
		return {
			articleMap: {},
			count: 0,
			tagList: [],
			categoryList: [],
			categoryNumList: [],
			hasPlayedEntrance: false,
			colorObj: {
				0: 'tl-sky',
				1: 'tl-purple',
				2: 'tl-teal',
				3: 'tl-indigo',
				4: 'tl-amber',
			}
		}
	},
	computed: {
		hasArchives() {
			return Object.keys(this.articleMap).length > 0
		}
	},
	created() {
		this.getArchives()
		this.getSiteData()
	},
	activated() {
		if (!this.hasArchives) {
			this.getArchives()
		}
		if (!this.tagList.length && !this.categoryList.length) {
			this.getSiteData()
		}
	},
	deactivated() {
		this.hasPlayedEntrance = true
	},
	methods: {
		getArchives() {
			getArchives().then(res => {
				if (res.code === 200) {
					this.articleMap = res.data.articleMap
					this.count = res.data.count
				} else {
					this.msgError(res.msg);
				}
			}).catch(() => {
				this.msgError("请求失败");
			})
		},
		getSiteData() {
			getSite().then(res => {
				if (res.code === 200) {
					this.tagList = res.data.tagList || []
					this.categoryList = res.data.categoryList || []
					this.categoryNumList = res.data.categoryNumList || []
				}
			})
		},
		toArticle(article) {
			this.$store.dispatch('goArticlePage', article)
		},
		formatArchiveDate(month, day) {
			const date = new Date(`${month}-${day}T00:00:00`)
			if (Number.isNaN(date.getTime())) return day
			return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
		}
	}
}
</script>

<style scoped>
.archives-page {
	position: relative;
	isolation: isolate;
	color: #0f172a;
	font-family: "LXGW WenKai TC", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	overflow: hidden;
}

.archives-hero {
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
	0% { transform: translate(0, 0); }
	50% { transform: translate(12px, -8px); }
	100% { transform: translate(-8px, 10px); }
}

.hero-inner {
	position: relative;
	z-index: 1;
	max-width: 960px;
	margin: 0 auto;
	padding: 56px 40px 44px;
	display: flex;
	align-items: flex-start;
	gap: 24px;
}

.hero-copy {
	flex: 1;
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

.hero-title-row {
	display: flex;
	align-items: center;
	gap: 14px;
	flex-wrap: wrap;
	animation: fadeSlideIn .5s ease .08s both;
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
}

.hero-desc {
	margin: 16px 0 0;
	color: #475569;
	font-size: 16px;
	font-weight: 500;
	line-height: 1.7;
	animation: fadeSlideIn .5s ease .16s both;
}

.hero-stats {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
	flex: 0 0 auto;
}

.archives-page-restored .hero-kicker,
.archives-page-restored .hero-title-row,
.archives-page-restored .hero-copy h2,
.archives-page-restored .hero-desc,
.archives-page-restored .feed-sidebar,
.archives-page-restored .empty-state,
.archives-page-restored .archive-group,
.archives-page-restored .timeline-end {
	animation: none;
}

.stat-pill {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 16px;
	border-radius: 999px;
	border: 1px solid rgba(15, 23, 42, .06);
	background: rgba(255, 255, 255, .72);
	box-shadow: 0 4px 12px rgba(15, 23, 42, .04);
}

.stat-dot {
	width: 7px;
	height: 7px;
	border-radius: 999px;
	background: #0ea5e9;
}

.stat-value {
	color: #0f172a;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	font-size: 18px;
	font-weight: 800;
	line-height: 1;
}

.stat-label {
	color: #64748b;
	font-size: 13px;
	font-weight: 700;
}

.hero-ornament {
	position: relative;
	width: 140px;
	height: 140px;
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
	inset: 28px;
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
	top: 16px;
	right: 24px;
	background: rgba(14, 165, 233, .4);
	animation-delay: 0s;
}

.ornament-dot-2 {
	bottom: 20px;
	left: 28px;
	background: rgba(139, 92, 246, .4);
	animation-delay: 1s;
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
	top: 56px;
	right: 0;
	width: 56px;
	transform: rotate(-16deg);
}

.ornament-circuit-2 {
	bottom: 36px;
	left: 0;
	width: 44px;
	background: rgba(139, 92, 246, .1);
	transform: rotate(10deg);
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

.archives-feed {
	position: relative;
	z-index: 2;
	background:
		linear-gradient(180deg, transparent 0%, rgba(248, 250, 252, .5) 20%, #fff 100%);
}

.archives-feed::before {
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

.feed-layout {
	display: flex;
	max-width: 1080px;
	margin: -36px auto 0;
	padding: 0 32px 64px;
	gap: 32px;
}

.feed-main {
	flex: 1 1 0;
	min-width: 0;
}

.feed-sidebar {
	flex: 0 0 260px;
	align-self: flex-start;
	position: sticky;
	top: 76px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	animation: fadeSlideIn .5s ease .3s both;
}

.sidebar-card {
	padding: 20px;
	border-radius: 10px;
	border: 1px solid rgba(15, 23, 42, .06);
	background: rgba(255, 255, 255, .92);
	backdrop-filter: blur(12px) saturate(140%);
	box-shadow: 0 4px 12px rgba(15, 23, 42, .03);
}

.sidebar-title {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
	color: #0f172a;
	font-family: "Noto Serif SC", serif;
	font-size: 15px;
	font-weight: 700;
}

.sidebar-title i {
	color: #0ea5e9;
	font-size: 14px;
}

.sidebar-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}

.sidebar-tag {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 999px;
	border: 1px solid rgba(15, 23, 42, .06);
	background: rgba(14, 165, 233, .04);
	color: #475569;
	font-size: 13px;
	font-weight: 500;
	text-decoration: none;
	transition: border-color .2s ease, color .2s ease, background .2s ease, transform .2s ease;
}

.sidebar-tag:hover {
	border-color: rgba(14, 165, 233, .2);
	background: rgba(14, 165, 233, .08);
	color: #0f172a;
	transform: translateY(-1px);
}

.sidebar-categories {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.sidebar-category {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	border-radius: 8px;
	color: #475569;
	font-size: 14px;
	font-weight: 500;
	text-decoration: none;
	transition: background .2s ease, color .2s ease;
}

.sidebar-category:hover {
	background: rgba(14, 165, 233, .06);
	color: #0f172a;
}

.sidebar-cat-name {
	font-weight: 600;
}

.sidebar-cat-count {
	padding: 2px 8px;
	border-radius: 999px;
	background: rgba(14, 165, 233, .08);
	color: #0284c7;
	font-size: 12px;
	font-weight: 600;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	padding: 72px 0;
	color: #94a3b8;
	font-size: 15px;
	animation: fadeSlideIn .5s ease both;
}

.archive-timeline {
	position: relative;
	padding-left: 48px;
}

.timeline-rail {
	position: absolute;
	top: 8px;
	bottom: 40px;
	left: 23px;
	width: 2px;
	border-radius: 999px;
	background: linear-gradient(180deg, rgba(14, 165, 233, .28), rgba(139, 92, 246, .18), rgba(14, 165, 233, .08));
}

.archive-group {
	position: relative;
	padding-bottom: 32px;
	animation: groupEnter .5s ease both;
}

.archive-group:last-of-type {
	padding-bottom: 16px;
}

@keyframes groupEnter {
	from { opacity: 0; transform: translateY(16px); }
	to { opacity: 1; transform: translateY(0); }
}

.group-marker {
	position: sticky;
	top: 76px;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: 14px;
	margin-bottom: 14px;
}

.marker-dot {
	width: 10px;
	height: 10px;
	border-radius: 999px;
	border: 3px solid #fff;
	background: var(--tl-color);
	box-shadow: 0 0 0 3px rgba(15, 23, 42, .05);
	flex-shrink: 0;
	position: relative;
	z-index: 2;
}

.marker-card {
	display: flex;
	align-items: baseline;
	gap: 6px;
	padding: 8px 14px;
	border-radius: 8px;
	border: 1px solid rgba(15, 23, 42, .06);
	background: rgba(255, 255, 255, .92);
	box-shadow: 0 6px 16px rgba(15, 23, 42, .04);
}

.marker-month {
	color: var(--tl-color);
	font-size: 15px;
	font-weight: 800;
	line-height: 1.2;
}

.marker-count {
	color: #94a3b8;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	font-size: 11px;
	font-weight: 700;
}

.group-articles {
	display: grid;
	gap: 10px;
	min-width: 0;
}

.article-entry {
	display: grid;
	grid-template-columns: 58px minmax(0, 1fr) 20px;
	align-items: center;
	gap: 14px;
	min-height: 48px;
	padding: 12px 16px;
	border-radius: 10px;
	border: 1px solid rgba(15, 23, 42, .06);
	background: rgba(255, 255, 255, .88);
	color: #334155;
	box-shadow: 0 4px 12px rgba(15, 23, 42, .03);
	transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
	text-decoration: none;
}

.article-entry:hover {
	color: #0f172a;
	border-color: color-mix(in srgb, var(--tl-color, #0ea5e9) 28%, rgba(15, 23, 42, .06));
	box-shadow: 0 8px 20px rgba(15, 23, 42, .06);
	transform: translateY(-2px);
}

.entry-date {
	display: inline-flex;
	align-items: center;
	justify-content: flex-start;
	color: #94a3b8;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	font-size: 12px;
	font-weight: 700;
	line-height: 1.2;
	white-space: nowrap;
}

.entry-title {
	overflow: hidden;
	font-size: 15px;
	font-weight: 600;
	line-height: 1.45;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.entry-arrow {
	color: #94a3b8;
	font-size: 14px;
	font-weight: 700;
	transition: color .2s ease, transform .2s ease;
}

.article-entry:hover .entry-arrow {
	color: var(--tl-color);
	transform: translateX(3px);
}

.timeline-end {
	position: relative;
	display: flex;
	align-items: center;
	gap: 14px;
	padding-top: 16px;
	animation: fadeSlideIn .5s ease both;
}

.end-dot {
	width: 10px;
	height: 10px;
	border-radius: 999px;
	border: 3px solid #fff;
	background: #0f172a;
	box-shadow: 0 0 0 3px rgba(15, 23, 42, .05);
	flex-shrink: 0;
	position: relative;
	z-index: 2;
}

.end-label {
	display: inline-flex;
	padding: 6px 14px;
	border-radius: 999px;
	background: #0f172a;
	color: #fff;
	font-size: 12px;
	font-weight: 800;
}

.tl-sky   { --tl-color: #0ea5e9; }
.tl-purple { --tl-color: #8b5cf6; }
.tl-teal   { --tl-color: #14b8a6; }
.tl-indigo { --tl-color: #6366f1; }
.tl-amber  { --tl-color: #f59e0b; }

@media screen and (max-width: 767px) {
	.archives-hero {
		min-height: auto;
	}

	.hero-inner {
		padding: 40px 20px 32px;
		flex-wrap: wrap;
	}

	.hero-stats {
		align-items: flex-start;
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

	.feed-layout {
		flex-direction: column;
		margin: -20px auto 0;
		padding: 0 16px 48px;
		gap: 0;
	}

	.feed-sidebar {
		flex: 0 0 auto;
		position: static;
		display: flex;
		flex-direction: row;
		gap: 16px;
		animation-delay: 0s;
	}

	.sidebar-card {
		flex: 1;
		padding: 16px;
	}

	.archive-timeline {
		padding-left: 28px;
	}

	.timeline-rail {
		left: 11px;
	}

	.group-marker {
		position: relative;
		top: auto;
	}

	.article-entry {
		grid-template-columns: auto minmax(0, 1fr);
		gap: 12px;
		padding: 10px 12px;
		animation-delay: 0s !important;
	}

	.entry-arrow {
		display: none;
	}

	.entry-title {
		white-space: normal;
	}

	.archive-group {
		animation-delay: 0s !important;
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

	.feed-layout {
		padding: 0 24px 48px;
	}

	.feed-sidebar {
		flex: 0 0 220px;
	}
}
</style>
