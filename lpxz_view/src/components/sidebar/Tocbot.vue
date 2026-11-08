<template>
	<nav v-show="isArticleRenderComplete && available" class="toc-wrapper" aria-label="本文目录">
		<div class="toc-header m-mobile-hide">
			<i class="list ul icon" aria-hidden="true"></i>本文目录
		</div>
		<button class="toc-header toc-toggle m-mobile-show" type="button" :aria-expanded="expanded"
			aria-controls="article-toc-links" @click="expanded = !expanded">
			<i class="list ul icon" aria-hidden="true"></i>本文目录
			<i :class="expanded ? 'angle up icon' : 'angle down icon'" aria-hidden="true"></i>
		</button>
		<div id="article-toc-links" class="toc-body" :class="{ 'is-expanded': expanded }" @click="selectMobileHeading">
			<div class="js-toc"></div>
		</div>
	</nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: "articleTocbot",
	data() {
		return { expanded: false, available: Boolean(window.tocbot) }
	},
	computed: {
		...mapState(['isArticleRenderComplete'])
	},
	mounted() {
		if (this.isArticleRenderComplete && window.document.querySelector('.js-toc-content')) {
			this.initTocbot()
		}
	},
	watch: {
		isArticleRenderComplete() {
			this.expanded = false
			if (this.isArticleRenderComplete) {
				this.initTocbot()
			}
		}
	},
	methods: {
		selectMobileHeading(event) {
			if (!window.matchMedia('(max-width: 767px)').matches) return
			const href = event.target.closest('a.toc-link')?.getAttribute('href')
			if (!href?.startsWith('#')) return
			const heading = document.getElementById(href.slice(1))
			if (!heading) return

			event.preventDefault()
			event.stopPropagation()
			this.expanded = false
			this.$nextTick(() => {
				if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1
				heading.focus({ preventScroll: true })
				heading.scrollIntoView({ block: 'start' })
			})
		},
		initTocbot() {
			window.tocbot?.init({
				tocSelector: '.js-toc',
				contentSelector: '.js-toc-content',
				headingSelector: 'h1,h2,h3,h4',
				scrollSmooth: true,
				scrollSmoothDuration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420,
				scrollSmoothOffset: -72,
				headingsOffset: -18
			})
		}
	}
}
</script>
