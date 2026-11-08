<template>
	<section class="topic-page">
		<header class="topic-header">
			<p class="topic-kind">{{ kindLabel }}</p>
			<div class="topic-heading">
				<h1>{{ topicName }}</h1>
				<span v-if="total !== null" class="topic-count">{{ total }} 篇文章</span>
			</div>
			<details v-if="topics.length" :key="topicKey" class="topic-picker">
				<summary>全部{{ kindLabel }}</summary>
				<nav :aria-label="`全部${kindLabel}`">
					<router-link v-for="topic in topics" :key="topic.name"
						:to="{ name: $route.name, params: { name: topic.name } }">
						{{ topic.name }}
					</router-link>
				</nav>
			</details>
		</header>
		<p v-if="error" class="topic-status" role="status">{{ error }}</p>
		<p v-else-if="loading && !articleList.length" class="topic-status" role="status">正在加载文章…</p>
		<p v-else-if="!articleList.length" class="topic-status" role="status">这个{{ kindLabel }}下还没有文章。</p>
		<ArticleList v-show="articleList.length" :key="topicKey" :getArticleList="getArticleList"
			:articleList="articleList" :totalPage="totalPage" :aria-busy="loading"/>
	</section>
</template>

<script>
import ArticleList from '@/components/article/ArticleList'
import { getArticleListByCategoryName } from '@/api/category'
import { getArticleListByTagName } from '@/api/tag'

export default {
	name: 'ArticleTopic',
	components: { ArticleList },
	props: {
		categoryList: { type: Array, required: true },
		tagList: { type: Array, required: true }
	},
	data() {
		return {
			articleList: [],
			totalPage: 0,
			total: null,
			loading: false,
			error: '',
			requestId: 0
		}
	},
	computed: {
		isCategory() {
			return this.$route.name === 'category'
		},
		topicName() {
			return this.$route.params.name
		},
		topicKey() {
			return `${this.$route.name}/${this.topicName}`
		},
		kindLabel() {
			return this.isCategory ? '分类' : '标签'
		},
		topics() {
			return this.isCategory ? this.categoryList : this.tagList
		}
	},
	watch: {
		topicKey: {
			immediate: true,
			handler() {
				if (!this.topicName) return
				this.articleList = []
				this.totalPage = 0
				this.total = null
				this.getArticleList()
			}
		}
	},
	methods: {
		async getArticleList(pageNum) {
			const requestId = ++this.requestId
			this.loading = true
			this.error = ''
			const fetchArticles = this.isCategory ? getArticleListByCategoryName : getArticleListByTagName
			try {
				const response = await fetchArticles(this.topicName, pageNum)
				if (requestId !== this.requestId) return
				if (response.code !== 200) {
					this.error = response.msg || '文章加载失败，请刷新后重试'
					return
				}
				const { list, total, totalPage } = response.data
				this.articleList = list
				this.totalPage = totalPage
				this.total = total ?? (totalPage <= 1 ? list.length : null)
			} catch {
				if (requestId === this.requestId) this.error = '文章加载失败，请刷新后重试'
			} finally {
				if (requestId === this.requestId) this.loading = false
			}
		}
	}
}
</script>

<style scoped>
.topic-page {
	max-width: 840px;
	margin: 0 auto;
}

.topic-header {
	padding: 24px 0;
	border-bottom: 1px solid #e2e8f0;
}

.topic-kind {
	margin: 0 0 6px;
	color: var(--site-link);
	font-size: 14px;
	font-weight: 700;
}

.topic-heading {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 4px 12px;
	overflow-wrap: anywhere;
}

.topic-heading h1 {
	margin: 0;
	color: #0f172a;
	font-family: "Noto Serif SC", serif;
	font-size: clamp(26px, 4vw, 38px);
	line-height: 1.3;
}

.topic-count,
.topic-status {
	color: #475569;
}

.topic-status {
	padding: 24px 0;
}

.topic-picker {
	margin-top: 12px;
}

.topic-picker summary {
	width: fit-content;
	padding: 12px 0;
	color: var(--site-link);
	cursor: pointer;
}

.topic-picker nav {
	display: flex;
	flex-wrap: wrap;
	gap: 4px 16px;
}

.topic-picker a {
	padding: 8px 0;
	color: var(--site-link);
	overflow-wrap: anywhere;
}

.topic-picker a:hover,
.topic-picker a[aria-current="page"] {
	text-decoration: underline;
}
</style>
