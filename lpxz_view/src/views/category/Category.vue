<template>
	<div>
		<div class="ui segment top" style="text-align: center">
			<h2 class="m-font-ali">分类【{{ categoryName }}】下的文章</h2>
		</div>
		<ArticleList :getArticleList="getArticleList" :articleList="articleList" :totalPage="totalPage"/>
	</div>
</template>

<script>
	import ArticleList from "@/components/article/ArticleList";
	import {getArticleListByCategoryName} from "@/api/category";

	export default {
		name: "articleCategory",
		components: {ArticleList},
		data() {
			return {
				articleList: [],
				totalPage: 0
			}
		},
		watch: {
			//在当前组件被重用时，要重新获取文章列表
			'$route.fullPath'() {
				if (this.$route.name === 'category') {
					this.getArticleList()
				}
			}
		},
		created() {
			this.getArticleList()
		},
		computed: {
			categoryName() {
				return this.$route.params.name
			}
		},
		methods: {
			getArticleList(pageNum) {
				getArticleListByCategoryName(this.categoryName, pageNum).then(res => {
					if (res.code === 200) {
						this.articleList = res.data.list
						this.totalPage = res.data.totalPage
						this.$nextTick(() => {
              // eslint-disable-next-line no-undef
							Prism.highlightAll()
						})
					} else {
						this.msgError(res.msg)
					}
				}).catch(() => {
					this.msgError("请求失败")
				})
			}
		}
	}
</script>

<style scoped>

</style>