<template>
	<div>
		<div class="ui attached segment m-padded-tb-large m-margin-bottom m-box" v-for="item in articleList"
			:key="item.id">
			<!-- 置顶 -->
			<!-- <div class="ui large red right corner label" v-if="item.top">
				<i class="arrow alternate circle up icon"></i>
			</div> -->
			<div class="ui middle aligned mobile reversed stackable">
				<div class="ui grid m-margin-lr">
					<!--标题-->
					<div class="row m-padded-tb-small">
						<h2 class="ui header m-left m-scaleup">
							<a href="javascript:;" @click.prevent="toArticle(item)" class="m-black">
								<i class="star red icon" v-if="item.top" />{{ item.title }}
							</a>
							<!--分类-->
							<router-link :to="`/category/${item.category.name}`" class="ui label small">
								<span class="m-text-500">{{ item.category.name }}</span>
							</router-link>
						</h2>
					</div>

					<!--文章简要信息-->
					<div class="row m-padded-tb-small">
						<div class="ui horizontal link list m-left">
							<div class="item m-datetime">
								<i class="small calendar icon"></i><span>{{ dateFormat(item.gmtCreate, 'YYYY/MM/DD')
								}}</span>
							</div>
							<div class="item m-views">
								<i class="small eye icon"></i><span>{{ item.views }}</span>
							</div>
							<!-- <div class="item m-common-black">
								<i class="small pencil alternate icon"></i><span>{{ item.words }} 字</span>
							</div> -->
							<!-- <div class="item m-common-black">
								<i class="small clock icon"></i><span>{{ item.readTime }} min</span>
							</div> -->
						</div>
					</div>

					<!--文章Markdown描述-->
					<div class="row typo m-padded-tb-small line-numbers match-braces rainbow-braces" v-html="item.description" />
					<!--标签-->
					<div class="row m-padded-tb-no">
						<div class="column m-padding-left-no">
							<router-link :to="`/tag/${tag.name}`" class="ui tag label tiny m-text-500 m-margin-small"
								:class="tag.color" v-for="(tag, index) in item.tags" :key="index">{{ tag.name }}
							</router-link>
						</div>
					</div>
					<!--阅读全文按钮-->
					<!-- <div class="row m-padded-tb-small m-margin-top">
						<a href="javascript:;" @click.prevent="toArticle(item)" class="ui olive button small">阅读全文</a>
					</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { dateFormat } from "@/util/dateTimeFormatUtils";

export default {
	name: "articleItem",
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

<style>

</style>