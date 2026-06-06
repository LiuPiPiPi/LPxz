<template>
	<div class="article-pagination">
		<el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-count="totalPage"
			layout="prev, pager, next" hide-on-single-page>
		</el-pagination>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: "ArticlePagination",
	props: {
		getArticleList: {
			type: Function,
			required: true
		},
		totalPage: {
			type: Number,
			required: true
		}
	},
	//目前只有首页被缓存，所以这个钩子只会被首页调用
	activated() {
		this.$nextTick(() => {
			if (!this.isArticleToHome) {
				//从其它页面路由到首页时，让首页的分页组件页码重置到第一页
				this.pageNum = 1
			}
		})
	},
	computed: {
		...mapState(['isArticleToHome', 'clientSize'])
	},
	data() {
		return {
			pageNum: 1
		}
	},
	methods: {
		//监听页码改变的事件
		handleCurrentChange(newPage) {
			//如果是首页，则滚动至Header下方
			if (this.$route.name === 'home') {
				window.scrollTo({ top: this.clientSize.clientHeight, behavior: 'smooth' })
			} else {
				//其它页面（分类和标签页）滚动至顶部
				this.scrollToTop()
			}
			this.pageNum = newPage
			this.getArticleList(newPage)
		},
	}
}
</script>

<style scoped>
.article-pagination {
	display: flex;
	justify-content: center;
	padding-top: 48px;
}

.article-pagination :deep(.el-pagination) {
	--el-pagination-button-bg-color: transparent;
	--el-pagination-bg-color: transparent;
	--el-pagination-hover-color: #0284c7;
	font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft Yahei", sans-serif;
}

.article-pagination :deep(.btn-prev),
.article-pagination :deep(.btn-next),
.article-pagination :deep(.el-pager li) {
	min-width: 34px;
	height: 34px;
	border-radius: 999px;
	color: #475569;
	font-weight: 700;
}

.article-pagination :deep(.el-pager li:not(.disabled).active) {
	background-color: #0f172a !important;
	color: #ffffff !important;
}

.article-pagination :deep(.btn-prev:hover),
.article-pagination :deep(.btn-next:hover),
.article-pagination :deep(.el-pager li:hover) {
	background: #f1f5f9;
}
</style>
