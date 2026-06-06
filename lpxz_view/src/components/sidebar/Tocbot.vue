<template>
	<div class="toc-wrapper">
		<div class="toc-header">
			<i class="list ul icon"></i>本文目录
		</div>
		<div class="toc-body">
			<div class="js-toc"></div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: "articleTocbot",
	computed: {
		...mapState(['isArticleRenderComplete'])
	},
	mounted() {
		if (this.isArticleRenderComplete && window.document.querySelector('.js-toc-content')) {
			this.initTocbot()
		}
	},
	beforeDestroy() {
		tocbot.destroy()
	},
	watch: {
		isArticleRenderComplete() {
			if (this.isArticleRenderComplete) {
				this.initTocbot()
			}
		}
	},
	methods: {
		initTocbot() {
			tocbot.init({
				tocSelector: '.js-toc',
				contentSelector: '.js-toc-content',
				headingSelector: 'h1,h2,h3,h4',
				scrollSmooth: true,
				scrollSmoothDuration: 420,
				scrollSmoothOffset: -55,
				headingsOffset: -18
			})
		}
	}
}
</script>