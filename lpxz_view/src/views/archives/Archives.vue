<template>
	<div class="archives-page m-font-ali">
		<section class="archive-hero">
			<div>
				<p class="archive-kicker">Archives</p>
				<h2>文章归档</h2>
			</div>
			<div class="archive-count">
				<strong>{{ count }}</strong>
				<span>篇文章</span>
			</div>
		</section>

		<section class="archive-panel">
			<div class="timeline" v-if="hasArchives">
				<div class="archive-group" :class="colorObj[index % 5]" v-for="(value, key, index) in articleMap"
					:key="key">
					<div class="month-marker">
						<span>{{ key }}</span>
						<small>{{ value.length }} 篇</small>
					</div>
					<div class="article-list">
						<a class="article-row" href="javascript:;" v-for="article in value" :key="article.id"
							@click.prevent="toArticle(article)">
							<span class="article-day">{{ article.day }}</span>
							<span class="article-title">{{ article.title }}</span>
							<i class="angle right icon" aria-hidden="true"></i>
						</a>
					</div>
				</div>

				<div class="timeline-start">从这里开始</div>
			</div>
			<div class="empty-archive" v-else>
				<span>暂无归档文章</span>
			</div>
		</section>
	</div>
</template>

<script>
import { getArchives } from "@/api/archives";

export default {
	name: "articleArchives",
	data() {
		return {
			articleMap: {},
			count: 0,
			colorObj: {
				0: 'tl-blue',
				1: 'tl-dark',
				2: 'tl-green',
				3: 'tl-purple',
				4: 'tl-red',
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
		toArticle(article) {
			this.$store.dispatch('goArticlePage', article)
		}
	}
}
</script>

<style scoped>
.archives-page {
	color: #2f343b;
}

.archive-hero {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24px;
	padding: 30px 34px;
	border: 1px solid rgba(34, 36, 38, 0.08);
	border-radius: 8px 8px 0 0;
	background:
		linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(248, 251, 255, 0.9)),
		linear-gradient(135deg, rgba(32, 136, 216, 0.16), rgba(242, 151, 62, 0.12));
	box-shadow: 0 12px 30px rgba(31, 45, 61, 0.08);
}

.archive-kicker {
	margin: 0 0 8px;
	color: #cf6a2c;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0 !important;
	text-transform: uppercase;
}

.archive-hero h2 {
	margin: 0;
	color: #20242a;
	font-size: 28px;
	font-weight: 700;
	line-height: 1.25;
}

.archive-count {
	display: flex;
	align-items: flex-end;
	gap: 8px;
	flex-shrink: 0;
	padding: 12px 18px;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.72);
	border: 1px solid rgba(34, 36, 38, 0.08);
}

.archive-count strong {
	color: #1f77b4;
	font-size: 32px;
	line-height: 1;
}

.archive-count span {
	color: #6b7280;
	font-size: 14px;
	line-height: 1.2;
}

.archive-panel {
	padding: 30px 34px 36px;
	border: 1px solid rgba(34, 36, 38, 0.08);
	border-top: 0;
	border-radius: 0 0 8px 8px;
	background: rgba(255, 255, 255, 0.94);
	box-shadow: 0 16px 36px rgba(31, 45, 61, 0.08);
}

.timeline {
	position: relative;
}

.timeline:before {
	position: absolute;
	top: 8px;
	bottom: 22px;
	left: 115px;
	width: 2px;
	background: linear-gradient(180deg, rgba(38, 132, 198, 0.5), rgba(242, 151, 62, 0.42));
	content: "";
}

.archive-group {
	position: relative;
	display: grid;
	grid-template-columns: 92px minmax(0, 1fr);
	gap: 36px;
	padding-bottom: 30px;
}

.archive-group:last-of-type {
	padding-bottom: 22px;
}

.month-marker {
	position: sticky;
	top: 76px;
	align-self: start;
	z-index: 1;
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-height: 56px;
	padding: 10px 12px;
	border-radius: 8px;
	background: #fff;
	border: 1px solid rgba(34, 36, 38, 0.08);
	box-shadow: 0 8px 18px rgba(31, 45, 61, 0.07);
}

.month-marker:after {
	position: absolute;
	top: 22px;
	right: -43px;
	width: 14px;
	height: 14px;
	border: 3px solid #fff;
	border-radius: 50%;
	background: var(--archive-color);
	box-shadow: 0 0 0 4px rgba(31, 45, 61, 0.06);
	content: "";
}

.month-marker span {
	color: var(--archive-color);
	font-size: 16px;
	font-weight: 700;
	line-height: 1.2;
}

.month-marker small {
	color: #858b94;
	font-size: 12px;
}

.article-list {
	display: grid;
	gap: 12px;
	min-width: 0;
}

.article-row {
	display: grid;
	grid-template-columns: 46px minmax(0, 1fr) 18px;
	align-items: center;
	gap: 14px;
	min-height: 54px;
	padding: 13px 16px;
	border: 1px solid rgba(34, 36, 38, 0.07);
	border-radius: 8px;
	background: #fff;
	color: #303740;
	box-shadow: 0 8px 20px rgba(31, 45, 61, 0.05);
	transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.article-row:hover {
	color: #20242a;
	border-color: color-mix(in srgb, var(--archive-color), #ffffff 45%);
	box-shadow: 0 14px 26px rgba(31, 45, 61, 0.1);
	transform: translateY(-2px);
}

.article-day {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 42px;
	height: 30px;
	border-radius: 6px;
	background: color-mix(in srgb, var(--archive-color), #ffffff 88%);
	color: var(--archive-color);
	font-size: 13px;
	font-weight: 700;
}

.article-title {
	overflow: hidden;
	font-size: 15px;
	font-weight: 600;
	line-height: 1.45;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.article-row i {
	margin: 0 !important;
	color: #a0a7b1;
	transition: color 0.2s ease, transform 0.2s ease;
}

.article-row:hover i {
	color: var(--archive-color);
	transform: translateX(2px);
}

.timeline-start {
	position: relative;
	width: fit-content;
	margin-left: 62px;
	padding: 9px 14px;
	border-radius: 8px;
	background: #242932;
	color: #fff;
	font-size: 13px;
	font-weight: 600;
}

.timeline-start:after {
	position: absolute;
	top: 50%;
	right: -60px;
	width: 14px;
	height: 14px;
	border: 3px solid #fff;
	border-radius: 50%;
	background: #242932;
	box-shadow: 0 0 0 4px rgba(31, 45, 61, 0.08);
	content: "";
	transform: translateY(-50%);
}

.empty-archive {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 180px;
	border: 1px dashed rgba(34, 36, 38, 0.18);
	border-radius: 8px;
	color: #858b94;
	font-size: 15px;
}

.tl-blue {
	--archive-color: #2088d8;
}

.tl-dark {
	--archive-color: #3f4652;
}

.tl-green {
	--archive-color: #2d9c65;
}

.tl-purple {
	--archive-color: #7a5dbb;
}

.tl-red {
	--archive-color: #d95f4d;
}

@media (max-width: 767px) {
	.archive-hero {
		align-items: flex-start;
		flex-direction: column;
		padding: 24px 20px;
	}

	.archive-panel {
		padding: 22px 18px 28px;
	}

	.timeline:before {
		left: 10px;
	}

	.archive-group {
		display: block;
		padding-left: 28px;
	}

	.month-marker {
		position: relative;
		top: auto;
		width: fit-content;
		margin-bottom: 14px;
	}

	.month-marker:after {
		left: -25px;
		right: auto;
	}

	.article-row {
		grid-template-columns: 42px minmax(0, 1fr);
		gap: 12px;
		padding: 12px;
	}

	.article-row i {
		display: none;
	}

	.article-title {
		white-space: normal;
	}

	.timeline-start {
		margin-left: 28px;
	}

	.timeline-start:after {
		left: -25px;
		right: auto;
	}
}
</style>
