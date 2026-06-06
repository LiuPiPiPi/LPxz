<template>
	<div>
		<!--content-->
		<ArticleItem :articleList="articleList" :disableEntranceAnimation="disableEntranceAnimation" v-viewer />
		<!--分页-->
		<Pagination :getArticleList="getArticleList" :totalPage="totalPage" />
	</div>
</template>

<script>
import ArticleItem from "./ArticleItem";
import Pagination from "./Pagination";

export default {
	name: "ArticleList",
	components: { Pagination, ArticleItem },
	props: {
		getArticleList: {
			type: Function,
			required: true
		},
		articleList: {
			type: Array,
			required: true
		},
		totalPage: {
			type: Number,
			required: true
		},
		disableEntranceAnimation: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<style scoped></style>
