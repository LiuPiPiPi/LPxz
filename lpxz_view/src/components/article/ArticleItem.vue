<template>
	<div class="article-feed" :class="{ 'article-feed-no-enter': disableEntranceAnimation }">
		<article class="article-update" v-for="item in articleList" :key="item.id">
			<div class="article-timeline">
				<span class="timeline-dot"></span>
				<time class="article-date" :datetime="dateFormat(item.gmtCreate, 'YYYY-MM-DD')">
					{{ englishDate(item.gmtCreate) }}
				</time>
			</div>

			<div class="article-body">
				<div class="article-meta">
					<span class="pinned-label" v-if="item.top">Pinned</span>
					<router-link :to="`/category/${item.category.name}`" class="category-link">
						{{ item.category.name }}
					</router-link>
					<span class="views-label">{{ item.views }} views</span>
				</div>

				<h2 class="article-title">
					<a href="javascript:;" @click.prevent="toArticle(item)">
						{{ item.title }}
					</a>
				</h2>

				<div class="article-description typo line-numbers match-braces rainbow-braces" v-html="item.description" />

				<div class="article-footer">
					<div class="article-tags" v-if="item.tags && item.tags.length">
						<router-link :to="`/tag/${tag.name}`" class="tag-link"
							v-for="(tag, index) in item.tags" :key="index">
							{{ tag.name }}
						</router-link>
					</div>
					<a href="javascript:;" class="read-more" @click.prevent="toArticle(item)">Read more &rarr;</a>
				</div>
			</div>
		</article>
	</div>
</template>

<script>
import moment from 'moment';
import { dateFormat } from "@/util/dateTimeFormatUtils";

export default {
	name: "articleItem",
	props: {
		articleList: {
			type: Array,
			required: true
		},
		disableEntranceAnimation: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		toArticle(article) {
			this.$store.dispatch('goArticlePage', article)
		},
		englishDate(value) {
			if (!value) {
				return ''
			}
			return moment(value).locale('en').format('MMMM D, YYYY')
		},
		dateFormat: dateFormat
	}
}
</script>

<style scoped>
.article-feed {
	border-top: none;
}

.article-update {
	display: grid;
	grid-template-columns: 140px minmax(0, 1fr);
	gap: 24px;
	padding: 10px 0;
	border-bottom: 1px solid rgba(15, 23, 42, .06);
	animation: articleEnter .5s ease both;
}

.article-update:nth-child(1) { animation-delay: .7s; }
.article-update:nth-child(2) { animation-delay: .85s; }
.article-update:nth-child(3) { animation-delay: 1s; }
.article-update:nth-child(4) { animation-delay: 1.15s; }
.article-update:nth-child(5) { animation-delay: 1.3s; }
.article-update:nth-child(6) { animation-delay: 1.45s; }
.article-update:nth-child(n+7) { animation-delay: 1.6s; }

.article-feed-no-enter .article-update {
	animation: none;
}

@keyframes articleEnter {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.article-timeline {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
	padding-top: 4px;
}

.timeline-dot {
	width: 10px;
	height: 10px;
	border-radius: 999px;
	background: #e2e8f0;
	border: 2px solid #fff;
	transition: background .2s ease;
}

.article-update:hover .timeline-dot {
	background: #0ea5e9;
}

.article-date {
	color: #64748b;
	font-size: 13px;
	font-weight: 700;
	line-height: 1.4;
	white-space: nowrap;
}

.article-body {
	min-width: 0;
}

.article-meta {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 10px;
	color: #64748b;
	font-size: 13px;
	font-weight: 700;
}

.views-label {
	display: inline-flex;
	align-items: center;
	gap: 4px;
}

.pinned-label,
.category-link {
	display: inline-flex;
	align-items: center;
	min-height: 22px;
	padding: 2px 8px;
	border-radius: 6px;
	text-decoration: none;
	transition: all .2s ease;
}

.pinned-label {
	background: #fff1f2;
	color: #be123c;
}

.category-link {
	background: #f1f5f9;
	color: #334155;
}

.category-link:hover {
	background: #e0f2fe;
	color: #0369a1;
}

.article-title {
	margin: 0;
	font-family: "Noto Serif SC", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	font-size: 24px;
	font-weight: 800;
	line-height: 1.3;
	letter-spacing: 0;
}

.article-title a {
	color: #0f172a;
	text-decoration: none;
	transition: color .2s ease;
}

.article-title a:hover {
	color: #0284c7;
}

.article-description {
	display: -webkit-box;
	overflow: hidden;
	margin-top: 10px;
	color: #475569;
	font-size: 15px;
	line-height: 1.7;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
}

.article-description :deep(p) {
	margin: 0;
}

.article-description :deep(pre),
.article-description :deep(table),
.article-description :deep(img) {
	display: none;
}

.article-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	margin-top: 16px;
}

.article-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	min-width: 0;
}

.tag-link {
	color: #64748b;
	font-size: 12px;
	font-weight: 700;
	text-decoration: none;
	transition: color .2s ease;
}

.tag-link::before {
	content: "#";
	color: #94a3b8;
}

.tag-link:hover {
	color: #0284c7;
}

.read-more {
	flex: 0 0 auto;
	font-size: 13px;
	font-weight: 800;
	text-decoration: none;
	background: linear-gradient(90deg, #0ea5e9, #8b5cf6);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
	transition: transform .2s ease;
}

.read-more:hover {
	transform: translateX(2px);
}

@media screen and (max-width: 767px) {
	.article-update {
		grid-template-columns: 1fr;
		gap: 8px;
		padding: 24px 0;
		animation-delay: 0s !important;
	}

	.article-timeline {
		flex-direction: row;
		align-items: center;
		gap: 8px;
		padding-top: 0;
	}

	.article-date {
		font-size: 12px;
	}

	.article-title {
		font-size: 20px;
		line-height: 1.35;
	}

	.article-footer {
		align-items: flex-start;
		flex-direction: column;
		gap: 12px;
	}
}
</style>
