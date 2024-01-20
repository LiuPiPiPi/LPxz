<template>
	<div>
		<div class="ui top segment" style="text-align: center">
			<h2 class="m-font-ali">标签【{{ tagName }}】下的文章</h2>
		</div>
		<ArticleList :getArticleList="getArticleList" :articleList="articleList" :totalPage="totalPage"/>
	</div>
</template>

<script>
	import ArticleList from "@/components/article/ArticleList";
	import {getArticleListByTagName} from "@/api/tag";

	export default {
		name: "articleTag",
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
				if (this.$route.name === 'tag') {
					this.getArticleList()
				}
			}
		},
		created() {
			this.getArticleList()
		},
		computed: {
			tagName() {
				return this.$route.params.name
			}
		},
		methods: {
			getArticleList(pageNum) {
				getArticleListByTagName(this.tagName, pageNum).then(res => {
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