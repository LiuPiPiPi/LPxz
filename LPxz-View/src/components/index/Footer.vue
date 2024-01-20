<template>
	<footer class="ui inverted vertical segment m-opacity">
		<div class="ui center aligned container">
			<!-- <div class="ui inverted divided stackable grid">

				<div class="three wide column">
					<div class="ui link list">
						<h4 class="ui inverted header m-text-thin m-text-spaced">{{ siteInfo.footerImgTitle }}</h4>
						<div class="item">
							<img :src="siteInfo.footerImgUrl" class="ui rounded image" alt="" style="width: 100px">
						</div>
					</div>
				</div>

				<div class="six wide column">
					<h4 class="ui inverted header m-text-thin m-text-spaced">最新文章</h4>
					<div class="ui inverted link list">
						<a href="javascript:;" @click.prevent="toArticle(item)" v-for="item in newArticleList"
							:key="item.id" class="item m-text-thin m-padded-tb-small">{{ item.title }}</a>
					</div>
				</div>

				<div class="seven wide column">
					<p id="hitokotoText" class="m-text-thin m-text-spaced m-opacity-mini">{{ hitokoto.hitokoto }}</p>
					<p id="hitokotoFrom" class="m-text-thin m-text-spaced m-opacity-mini" style="float: right"
						v-text="hitokoto.from ? `——《${hitokoto.from}》` : ''"></p>
				</div>
			</div>

			<div class="ui inverted section divider"></div> -->

			<p class="m-text-spaced m-margin-top" style="color: black;">
				<span v-if="siteInfo.copyright">{{ siteInfo.copyright.title }}&nbsp;</span>
				<router-link to="/" style="color:#d44335" v-if="siteInfo.copyright">
					{{ siteInfo.copyright.siteName }}
				</router-link>
				<span v-if="siteInfo.copyright && siteInfo.beian">. All Rights Reserved.&nbsp;&nbsp;|&nbsp;&nbsp;</span>
				<img src="/img/beian.png" alt="" class="beian" v-if="siteInfo.beian">
				<a rel="external nofollow noopener" href="http://www.beian.miit.gov.cn/" target="_blank">
					{{ siteInfo.beian }}</a>
			</p>

			<div class="github-badge" v-for="(item, index) in badges" :key="index">
				<a rel="external nofollow noopener" :href="item.url" target="_blank" :title="item.title">
					<span class="badge-subject">{{ item.subject }}</span>
					<span class="badge-value" :class="`bg-${item.color}`">{{ item.value }}</span>
				</a>
			</div>

		</div>
	</footer>
</template>

<script>
export default {
	name: "articleFooter",
	props: {
		siteInfo: {
			type: Object,
			required: true
		},
		badges: {
			type: Array,
			required: true
		},
		newArticleList: {
			type: Array,
			required: true
		},
		hitokoto: {
			type: Object,
			required: true
		}
	},
	methods: {
		toArticle(article) {
			this.$store.dispatch('goArticlePage', article)
		}
	}
}
</script>

<style scoped>
@import "../../assets/css/badge.css";

.github-badge a {
	color: #fff;
}

.beian {
	width: 17px;
	height: 17px;
	margin-bottom: -4px;
	margin-right: 5px;
}

.ui.inverted.segment,
.ui.primary.inverted.segment {
	background: #d4e6f4;
}
</style>