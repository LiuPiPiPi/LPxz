<template>
	<div>
		<ArticleList :getArticleList="getArticleList" :articleList="articleList" :totalPage="totalPage" />
	</div>
</template>

<script>
import ArticleList from "@/components/article/ArticleList";
import { getArticleList } from "@/api/home";
import { SET_IS_ARTICLE_TO_HOME } from "../../store/mutations-types";

export default {
	name: "articleHome",
	components: { ArticleList },
	data() {
		return {
			articleList: [],
			totalPage: 0,
			getArticleListFinish: false
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.name !== 'article') {
				//其它页面跳转到首页时，重新请求数据
				//设置一个flag，让首页的分页组件指向正确的页码
				vm.$store.commit(SET_IS_ARTICLE_TO_HOME, false)
				vm.getArticleList()
			} else {
				//如果文章页面是起始访问页，首页将是第一次进入，即缓存不存在，要请求数据
				if (!vm.getArticleListFinish) {
					vm.getArticleList()
				}
				//从文章页面跳转到首页时，使用首页缓存
				vm.$store.commit(SET_IS_ARTICLE_TO_HOME, true)
			}
		})
	},
	methods: {
		getArticleList(pageNum) {
			getArticleList(pageNum).then(res => {
				if (res.code === 200) {
					this.articleList = res.data.list
					this.totalPage = res.data.totalPage
					this.$nextTick(() => {
						// eslint-disable-next-line no-undef
						Prism.highlightAll()
					})
					this.getArticleListFinish = true
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

<style scoped></style>