<template>
	<footer class="site-footer">
		<div class="footer-inner">
			<p class="footer-copyright">
				<span v-if="siteInfo.copyright">Copyright © 2020 – {{ new Date().getFullYear() }}&nbsp;</span>
				<router-link to="/" class="footer-brand" v-if="siteInfo.copyright">
					{{ siteInfo.copyright.siteName }}
				</router-link>
				<span v-if="siteInfo.copyright && siteInfo.beian">. All Rights Reserved.&nbsp;&nbsp;|&nbsp;&nbsp;</span>
				<img src="/img/beian.png" alt="" class="beian" v-if="siteInfo.beian">
				<a rel="external nofollow noopener" href="https://beian.miit.gov.cn/" target="_blank" class="footer-link">
					{{ siteInfo.beian }}</a>
			</p>

			<div class="footer-badges" v-for="(item, index) in badges" :key="index">
				<a rel="external nofollow noopener" :href="item.url" target="_blank" :title="item.title"
					class="badge-link">
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
		hitokoto: {
			type: Object,
			required: true
		}
	}
}
</script>

<style scoped>
@import "../../assets/css/badge.css";

.site-footer {
	border-top: 1px solid rgba(15, 23, 42, .06);
	background: rgba(248, 250, 252, .6);
	backdrop-filter: blur(8px);
}

.footer-inner {
	max-width: 960px;
	margin: 0 auto;
	padding: 32px 24px 28px;
	text-align: center;
	font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft Yahei", sans-serif;
}

.footer-copyright {
	margin: 0 0 16px;
	color: #64748b;
	font-size: 13px;
	font-weight: 500;
	line-height: 1.6;
}

.footer-brand {
	color: #0284c7;
	font-weight: 700;
	text-decoration: none;
	transition: color .2s ease;
}

.footer-brand:hover {
	color: #0369a1;
}

.footer-link {
	color: #64748b;
	text-decoration: none;
	transition: color .2s ease;
}

.footer-link:hover {
	color: #0284c7;
}

.beian {
	width: 17px;
	height: 17px;
	margin-bottom: -4px;
	margin-right: 5px;
}

.footer-badges {
	display: inline-flex;
}

.badge-link {
	color: #fff;
	text-decoration: none;
}

@media screen and (max-width: 767px) {
	.footer-inner {
		padding: 24px 16px 20px;
	}
}
</style>