<template>
	<div class="article-feed">
		<article class="article-update" v-for="item in articleList" :key="item.id">
			<h2 class="feed-title">
				<button v-if="item.privacy" type="button" @click="toArticle(item)">{{ item.title }}</button>
				<router-link v-else :to="`/article/${item.id}`">{{ item.title }}</router-link>
			</h2>
			<div class="feed-meta">
				<time :datetime="dateFormat(item.gmtCreate, 'YYYY-MM-DD')">
					{{ dateFormat(item.gmtCreate, 'YYYY-MM-DD') }}
				</time>
				<router-link v-if="item.category && item.category.name && $route.name !== 'category'"
					:to="{ name: 'category', params: { name: item.category.name } }">
					{{ item.category.name }}
				</router-link>
				<span v-if="item.top" class="pinned-label">置顶</span>
				<span>{{ item.views }} 次浏览</span>
			</div>
			<div v-if="item.description" class="article-description typo"
				v-body-font="$route.name === 'home' ? item.description : null" v-html="item.description" />
			<div class="article-tags" v-if="item.tags && item.tags.length">
				<router-link v-for="tag in item.tags" :key="tag.name"
					:to="{ name: 'tag', params: { name: tag.name } }" class="tag-link">
					{{ tag.name }}
				</router-link>
			</div>
		</article>
	</div>
</template>

<script>
import { dateFormat } from "@/util/dateTimeFormatUtils";
import bodyFont from "@/util/body-font";

export default {
	name: "articleItem",
	directives: { bodyFont },
	props: {
		articleList: {
			type: Array,
			required: true
		}
	},
	methods: {
		toArticle(article) {
			this.$store.dispatch('goArticlePage', article)
		},
		dateFormat: dateFormat
	}
}
</script>

<style scoped>
.article-update {
	min-width: 0;
	padding: 24px 0;
	border-bottom: 1px solid #e2e8f0;
}

.feed-title {
	margin: 0;
	font-family: "Noto Serif SC", serif;
	font-size: 24px;
	font-weight: 700;
	line-height: 1.35;
	overflow-wrap: anywhere;
}

.feed-title a,
.feed-title button {
	color: #0f172a;
}

.feed-title button {
	display: inline;
	padding: 0;
	border: 0;
	background: none;
	font: inherit;
	text-align: left;
	cursor: pointer;
}

.feed-title a:hover,
.feed-title button:hover {
	color: var(--site-link);
	text-decoration: underline;
}

.feed-meta,
.article-tags {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 4px 12px;
	margin-top: 8px;
	color: #475569;
	font-size: 13px;
	line-height: 1.55;
	overflow-wrap: anywhere;
}

.feed-meta a,
.article-tags a {
	color: var(--site-link);
}

.feed-meta a:hover,
.article-tags a:hover {
	text-decoration: underline;
}

.pinned-label {
	padding: 0 6px;
	border-radius: 4px;
	background: #fff1f2;
	color: #9f1239;
}

.article-description {
	display: -webkit-box;
	overflow: hidden;
	margin-top: 8px;
	color: #334155;
	font-size: 16px;
	line-height: 1.65;
	overflow-wrap: anywhere;
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

.tag-link::before {
	content: "#";
}

@media (max-width: 767px) {
	.article-update {
		padding: 20px 0;
	}

	.feed-title {
		font-size: 20px;
	}
}
</style>
