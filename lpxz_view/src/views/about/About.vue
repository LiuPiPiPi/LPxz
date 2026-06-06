<template>
	<div class="about-page">
		<section class="about-hero">
			<div class="hero-bg">
				<div class="hero-gradient"></div>
				<div class="hero-grid"></div>
				<div class="hero-accent hero-accent-1"></div>
				<div class="hero-accent hero-accent-2"></div>
				<div class="hero-accent hero-accent-3"></div>
			</div>
			<div class="hero-decor" aria-hidden="true">
				<div class="decor-dot decor-dot-1"></div>
				<div class="decor-dot decor-dot-2"></div>
				<div class="decor-dot decor-dot-3"></div>
				<div class="decor-dot decor-dot-4"></div>
				<div class="decor-dot decor-dot-5"></div>
				<div class="decor-hex decor-hex-1"></div>
				<div class="decor-hex decor-hex-2"></div>
				<div class="decor-circuit decor-circuit-1"></div>
				<div class="decor-circuit decor-circuit-2"></div>
				<div class="decor-diamond decor-diamond-1"></div>
			</div>
			<div class="hero-inner">
				<div class="hero-profile">
					<div class="avatar-container" v-if="introduction.avatar">
						<div class="avatar-orbit avatar-orbit-inner"></div>
						<div class="avatar-orbit avatar-orbit-outer"></div>
						<div class="avatar-orbit avatar-orbit-tilted"></div>
						<div class="avatar-pulse-ring"></div>
						<div class="avatar-node avatar-node-1"></div>
						<div class="avatar-node avatar-node-2"></div>
						<div class="avatar-node avatar-node-3"></div>
						<div class="avatar-glow"></div>
						<img class="avatar-img" :src="introduction.avatar" :alt="introduction.name">
					</div>
					<h1 class="hero-name" v-if="introduction.name">{{ introduction.name }}</h1>
					<div class="hero-social">
						<a v-if="introduction.github" :href="introduction.github" target="_blank" class="social-link" aria-label="GitHub">
							<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 520.886c0-69.368 13.51-135.697 40.498-199.02 26.987-63.323 63.322-117.826 109.006-163.51 45.65-45.65 100.154-81.985 163.51-109.006A502.289 502.289 0 0 1 512 8.92c69.335 0 135.663 13.477 198.986 40.497 63.356 26.988 117.86 63.323 163.51 109.007 45.684 45.65 82.02 100.154 109.006 163.51A502.289 502.289 0 0 1 1024 520.852c0 111.318-32.504 211.472-97.511 300.494-64.975 88.989-148.48 150.825-250.484 185.476-5.351 0-9.348-0.99-11.99-2.973-2.676-1.982-4.196-3.997-4.526-6.012a59.458 59.458 0 0 1-0.495-8.984 7.663 7.663 0 0 1-0.991-3.006v-128.99c0-40.63-14.336-75.314-43.008-103.986 76.667-13.345 134.011-41.819 171.999-85.487 37.987-43.669 57.013-96.52 57.013-158.522 0-58.005-18.663-108.346-56.022-150.99 13.345-42.678 11-87.668-6.97-135.003-18.697-1.322-39.011 1.85-61.01 9.513-22 7.663-38.318 14.831-49.02 21.47-10.637 6.673-20.316 13.016-28.97 19.027-38.68-10.669-81.854-16.02-129.486-16.02-47.7 0-90.509 5.351-128.529 16.02-7.333-5.35-15.855-11.164-25.5-17.507-9.68-6.342-26.493-14.005-50.507-22.99-23.982-9.018-45.65-12.85-65.008-11.495-18.663 47.996-20.645 93.646-5.979 136.984-36.665 42.678-54.998 92.986-54.998 150.99 0 62.002 18.663 114.689 55.99 157.994 37.326 43.339 94.67 72.01 171.998 86.016a142.303 142.303 0 0 0-39.969 70.029c-56.683 13.972-96.355 3.963-119.015-30.06-42.017-61.308-79.674-83.307-113.003-65.965-4.69 4.657-3.997 9.48 1.982 14.501 6.012 4.988 14.996 11.66 27.02 19.985 11.99 8.357 20.976 17.507 26.987 27.515 0.661 1.322 2.51 6.177 5.517 14.502a831.917 831.917 0 0 0 8.985 23.981c2.973 7.663 8.654 16.186 17.011 25.5 8.324 9.349 18.003 17.178 29.003 23.52 11 6.309 26.161 11 45.485 14.006 19.324 2.972 41.323 3.138 65.998 0.495v100.484c0 0.991-0.165 2.643-0.495 5.021-0.33 2.312-0.991 3.964-1.982 4.955-0.991 1.024-2.345 2.015-4.03 3.039a12.52 12.52 0 0 1-6.474 1.486c-2.676 0-6.012-0.33-10.009-0.99-101.343-35.345-183.825-97.182-247.51-185.51C31.842 731.037 0 631.577 0 520.92z"/>
							</svg>
						</a>
						<a v-if="introduction.telegram" :href="introduction.telegram" target="_blank" class="social-link" aria-label="Telegram">
							<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
								<path d="M679.424 746.862l84.005-395.996c7.424-34.852-12.581-48.567-35.438-40.009L234.277 501.138c-33.72 13.13-33.134 32-5.706 40.558l126.282 39.424 293.156-184.576c13.714-9.143 26.295-3.986 16.018 5.157L426.898 615.973l-9.143 130.304c13.13 0 18.871-5.706 25.71-12.581l61.696-59.429 128 94.282c23.442 13.129 40.01 6.29 46.3-21.724zM1024 512c0 282.843-229.157 512-512 512S0 794.843 0 512 229.157 0 512 0s512 229.157 512 512z" fill="#1296DB"/>
							</svg>
						</a>
						<a v-if="introduction.bilibili" :href="introduction.bilibili" target="_blank" class="social-link" aria-label="Bilibili">
							<svg viewBox="0 0 1129 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
								<path d="M234.908525 9.656195a80.468288 80.468288 0 0 1 68.398044 0 167.374038 167.374038 0 0 1 41.84351 30.577949l160.936576 140.819503H621.156306L782.092881 40.234144a168.983404 168.983404 0 0 1 41.84351-30.577949 80.468288 80.468288 0 0 1 107.022823 66.788678 80.468288 80.468288 0 0 1-17.703024 53.913753 449.817728 449.817728 0 0 1-35.406046 32.187315 232.553351 232.553351 0 0 1-22.531121 18.507706h100.58536a170.59277 170.59277 0 0 1 118.288383 53.10907A171.397453 171.397453 0 0 1 1128.106519 352.4511v462.692655a325.896565 325.896565 0 0 1-4.023415 70.00741 178.639599 178.639599 0 0 1-80.468288 112.655603 173.006819 173.006819 0 0 1-92.53853 25.749852H212.377404a341.18554 341.18554 0 0 1-72.421459-4.023415 177.834916 177.834916 0 0 1-111.046237-80.468287A172.202136 172.202136 0 0 1 1.550491 846.526387V388.66183A360.497929 360.497929 0 0 1 1.550491 321.873151a177.030233 177.030233 0 0 1 160.936575-143.233552h105.413457c-16.89834-12.070243-31.382632-26.554535-46.671607-39.429461a80.468288 80.468288 0 0 1-25.749852-65.983996A80.468288 80.468288 0 0 1 234.908525 9.656195M216.400819 321.873151a80.468288 80.468288 0 0 0-63.569948 57.937167 108.632188 108.632188 0 0 0 0 30.577949v380.615001a80.468288 80.468288 0 0 0 55.523119 80.468288 106.21814 106.21814 0 0 0 34.601364 5.63278h654.207179a80.468288 80.468288 0 0 0 76.444873-47.47629 112.655603 112.655603 0 0 0 8.046829-53.10907v-354.060465a135.186723 135.186723 0 0 0 0-38.624779 80.468288 80.468288 0 0 0-52.304387-54.718435 129.553943 129.553943 0 0 0-49.890338-7.242146H254.220914a268.764081 268.764081 0 0 0-37.820095 0z m0 0" fill="#20B0E3"/>
								<path d="M348.368811 447.40368a80.468288 80.468288 0 0 1 55.523118 18.507706 80.468288 80.468288 0 0 1 28.163901 59.546533v80.468287a80.468288 80.468288 0 0 1-16.093658 51.499705 80.468288 80.468288 0 0 1-131.967992-9.656195 104.608774 104.608774 0 0 1-10.460877-54.718436v-80.468287a80.468288 80.468288 0 0 1 70.00741-67.593362z m416.021047 0a80.468288 80.468288 0 0 1 86.101068 75.64019v80.468288a94.147897 94.147897 0 0 1-12.070243 53.10907 80.468288 80.468288 0 0 1-132.772675 0 95.757262 95.757262 0 0 1-12.874926-57.132485v-80.468287a80.468288 80.468288 0 0 1 70.00741-70.812093z m0 0" fill="#20B0E3"/>
							</svg>
						</a>
						<a v-if="introduction.email" :href="emailHref" class="social-link" aria-label="Email">
							<svg viewBox="0 0 1365 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
								<path d="M684.00064 607.733333L1282.005973 9.728A133.077333 133.077333 0 0 0 1232.00064 0h-1098.666667c-16.938667 0-33.205333 3.2-48.138666 8.938667l598.805333 598.794666z"/>
								<path d="M684.00064 728.394667l-664.533333-664.533334A132.48 132.48 0 0 0 0.00064 133.333333v757.333334C0.00064 964.266667 59.733973 1024 133.333973 1024h1098.666667c73.6 0 133.333333-59.733333 133.333333-133.333333v-757.333334a133.013333 133.013333 0 0 0-18.528-67.733333L684.00064 728.394667z"/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</section>

		<div class="about-body">
			<div class="about-content-wrap" v-if="about.content">
				<div class="about-content-card">
					<div class="typo content" v-viewer v-html="about.content"></div>
				</div>
			</div>

			

			<div class="about-comments-wrap">
				<CommentList :page="1" :articleId="null" v-if="about.commentEnabled==='true'"/>
				<div class="comments-closed" v-else>
					<span class="comments-closed-text">评论已关闭</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getAbout } from "@/api/about";
import CommentList from "@/components/comment/CommentList";
import { mapState } from 'vuex';

export default {
	name: "aboutPage",
	components: { CommentList },
	data() {
		return {
			about: {
				title: '',
				musicId: '',
				content: '',
				commentEnabled: 'false'
			}
		}
	},
	computed: {
		...mapState(['introduction']),
		emailHref() {
			if (!this.introduction.email) return ''
			return this.introduction.email.startsWith('http') ? this.introduction.email : 'mailto:' + this.introduction.email
		}
	},
	created() {
		getAbout().then(res => {
			if (res.code === 200) {
				this.about = res.data
			}
		})
	}
}
</script>

<style scoped>
.about-page {
	position: relative;
	isolation: isolate;
	width: 100%;
	padding: 0 0 96px;
	color: #0f172a;
	font-family: "LXGW WenKai TC", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	background:
		linear-gradient(180deg, rgba(240, 249, 255, .95) 0%, rgba(248, 250, 252, .98) 42%, #ffffff 100%),
		linear-gradient(115deg, transparent 0 58%, rgba(139, 92, 246, .07) 58% 70%, transparent 70%),
		linear-gradient(24deg, transparent 0 22%, rgba(14, 165, 233, .06) 22% 34%, transparent 34%);
	overflow: hidden;
}

.about-page::before {
	content: "";
	position: absolute;
	top: 360px;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	background-image:
		linear-gradient(rgba(14, 165, 233, .035) 1px, transparent 1px),
		linear-gradient(90deg, rgba(14, 165, 233, .035) 1px, transparent 1px);
	background-size: 36px 36px;
	mask-image: linear-gradient(180deg, transparent 0, black 16%, black 72%, transparent 100%);
}

.about-hero {
	position: relative;
	min-height: 420px;
	overflow: visible;
}

.hero-bg {
	position: absolute;
	inset: 0;
	z-index: 0;
	overflow: hidden;
}

.hero-gradient {
	position: absolute;
	inset: 0;
	background:
		linear-gradient(180deg, rgba(224, 242, 254, .96) 0%, rgba(240, 249, 255, .72) 64%, rgba(248, 250, 252, 0) 100%),
		linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 35%, #f5f3ff 55%, #fdf4ff 75%, #fffbeb 100%);
}

.hero-grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(14, 165, 233, .06) 1px, transparent 1px),
		linear-gradient(90deg, rgba(14, 165, 233, .06) 1px, transparent 1px);
	background-size: 32px 32px;
}

.hero-accent {
	position: absolute;
	border: 1px solid rgba(14, 165, 233, .08);
	background: transparent;
}

.hero-accent-1 {
	top: -40px;
	left: 12%;
	width: 240px;
	height: 120px;
	transform: rotate(-8deg);
	animation: accentDrift 12s ease-in-out infinite alternate;
}

.hero-accent-2 {
	bottom: -20px;
	right: 14%;
	width: 180px;
	height: 100px;
	border-color: rgba(139, 92, 246, .08);
	transform: rotate(12deg);
	animation: accentDrift 12s ease-in-out 4s infinite alternate;
}

.hero-accent-3 {
	top: 35%;
	right: 38%;
	width: 140px;
	height: 78px;
	border-color: rgba(56, 189, 248, .08);
	transform: rotate(18deg);
	animation: accentDrift 12s ease-in-out 8s infinite alternate;
}

@keyframes accentDrift {
	0% { transform: translate(0, 0); }
	50% { transform: translate(16px, -10px); }
	100% { transform: translate(-10px, 14px); }
}

.hero-decor {
	position: absolute;
	inset: 0;
	z-index: 0;
	pointer-events: none;
}

.decor-dot {
	position: absolute;
	width: 4px;
	height: 4px;
	border-radius: 999px;
	background: rgba(14, 165, 233, .2);
	animation: dotPulse 4s ease-in-out infinite;
}

.decor-dot-1 { top: 80px; left: 8%; animation-delay: 0s; }
.decor-dot-2 { bottom: 60px; right: 10%; background: rgba(139, 92, 246, .15); animation-delay: 1s; }
.decor-dot-3 { top: 40%; right: 22%; background: rgba(56, 189, 248, .15); animation-delay: 2s; }
.decor-dot-4 { bottom: 30%; left: 18%; background: rgba(245, 158, 11, .15); animation-delay: .5s; }
.decor-dot-5 { top: 20%; right: 6%; animation-delay: 1.5s; }

.decor-hex {
	position: absolute;
	width: 24px;
	height: 24px;
	border: 1.5px solid rgba(14, 165, 233, .12);
	transform: rotate(45deg);
	animation: hexFloat 8s ease-in-out infinite;
}

.decor-hex::before {
	content: "";
	position: absolute;
	inset: 4px;
	border: 1px solid rgba(14, 165, 233, .08);
}

.decor-hex-1 {
	top: 18%;
	right: 6%;
	animation-delay: 0s;
}

.decor-hex-2 {
	bottom: 15%;
	left: 10%;
	border-color: rgba(139, 92, 246, .12);
	animation-delay: 2s;
}

.decor-hex-2::before {
	border-color: rgba(139, 92, 246, .08);
}

.decor-circuit {
	position: absolute;
	height: 1px;
	background: rgba(14, 165, 233, .08);
	border-radius: 999px;
	animation: circuitPulse 5s ease-in-out infinite;
}

.decor-circuit::before {
	content: "";
	position: absolute;
	right: -3px;
	top: -3px;
	width: 6px;
	height: 6px;
	border-radius: 999px;
	border: 1px solid rgba(14, 165, 233, .1);
	background: rgba(14, 165, 233, .06);
}

.decor-circuit-1 {
	top: 25%;
	left: 5%;
	width: 80px;
	transform: rotate(15deg);
	animation-delay: 0s;
}

.decor-circuit-2 {
	bottom: 20%;
	right: 8%;
	width: 64px;
	background: rgba(139, 92, 246, .08);
	transform: rotate(-20deg);
	animation-delay: 1s;
}

.decor-circuit-2::before {
	border-color: rgba(139, 92, 246, .1);
	background: rgba(139, 92, 246, .06);
}

.decor-diamond {
	position: absolute;
	width: 14px;
	height: 14px;
	border-radius: 2px;
	border: 1px solid rgba(245, 158, 11, .12);
	transform: rotate(45deg);
	animation: diamondSpin 10s linear infinite;
}

.decor-diamond-1 {
	top: 50%;
	right: 12%;
	animation-delay: 0s;
}

@keyframes hexFloat {
	0%, 100% { transform: rotate(45deg) translateY(0); opacity: .5; }
	50% { transform: rotate(45deg) translateY(-6px); opacity: .7; }
}

@keyframes dotPulse {
	0%, 100% { opacity: .3; transform: scale(1); }
	50% { opacity: .6; transform: scale(1.6); }
}

@keyframes circuitPulse {
	0%, 100% { opacity: .4; }
	50% { opacity: .6; }
}

@keyframes diamondSpin {
	from { transform: rotate(45deg); opacity: .4; }
	50% { transform: rotate(225deg); opacity: .5; }
	to { transform: rotate(405deg); opacity: .4; }
}

.hero-inner {
	position: relative;
	z-index: 1;
	max-width: 1536px;
	margin: 0 auto;
	padding: 92px 80px 72px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.hero-profile {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	animation: fadeSlideIn .7s ease both;
}

@keyframes fadeSlideIn {
	from {
		opacity: 0;
		transform: translateY(16px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.avatar-container {
	position: relative;
	width: 160px;
	height: 160px;
}

.avatar-orbit {
	position: absolute;
	border-radius: 999px;
	border: 1px solid rgba(14, 165, 233, .1);
	background: transparent;
}

.avatar-orbit-inner {
	inset: 18px;
	animation: ringSpin 12s linear infinite;
}

.avatar-orbit-outer {
	inset: -4px;
	animation: ringSpin 20s linear infinite reverse;
	border-color: rgba(139, 92, 246, .1);
}

.avatar-orbit-tilted {
	inset: 8px;
	border-color: rgba(56, 189, 248, .1);
	animation: ringSpinTilted 14s linear infinite;
	transform: rotate(30deg) scaleX(1.1);
}

@keyframes ringSpin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@keyframes ringSpinTilted {
	from { transform: rotate(30deg) scaleX(1.1); }
	to { transform: rotate(390deg) scaleX(1.1); }
}

.avatar-pulse-ring {
	position: absolute;
	top: 50%;
	left: 50%;
	border-radius: 999px;
	border: 1px solid rgba(14, 165, 233, .15);
	transform: translate(-50%, -50%);
	animation: pulseRingExpand 4s ease-out infinite;
}

@keyframes pulseRingExpand {
	0% { width: 96px; height: 96px; opacity: .5; }
	100% { width: 170px; height: 170px; opacity: 0; }
}

.avatar-node {
	position: absolute;
	width: 8px;
	height: 8px;
	border-radius: 999px;
	animation: nodePulse 3s ease-in-out infinite;
}

.avatar-node-1 {
	top: 18px;
	right: 28px;
	background: rgba(14, 165, 233, .5);
	animation-delay: 0s;
}

.avatar-node-2 {
	bottom: 18px;
	left: 28px;
	background: rgba(139, 92, 246, .5);
	animation-delay: 1s;
}

.avatar-node-3 {
	top: 50%;
	right: -2px;
	background: rgba(56, 189, 248, .5);
	animation-delay: .5s;
}

@keyframes nodePulse {
	0%, 100% { opacity: .5; transform: scale(1); }
	50% { opacity: 1; transform: scale(1.3); }
}

.avatar-glow {
	position: absolute;
	inset: 16px;
	border-radius: 999px;
	background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, .9), rgba(224, 242, 254, .46) 58%, rgba(14, 165, 233, .06) 100%);
}

.avatar-img {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 96px;
	height: 96px;
	border-radius: 999px;
	transform: translate(-50%, -50%);
	border: 2px solid rgba(255, 255, 255, .8);
	object-fit: cover;
	z-index: 2;
}

.hero-name {
	margin: 28px 0 0;
	padding: 0;
	color: #020617;
	font-family: "Noto Serif SC", serif;
	font-size: 48px;
	font-weight: 900;
	line-height: 1.2;
	animation: fadeSlideIn .7s ease .2s both;
	background: linear-gradient(135deg, #0f172a 0%, #0284c7 60%, #8b5cf6 100%);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}

.hero-social {
	display: flex;
	justify-content: center;
	gap: 14px;
	margin-top: 22px;
	animation: fadeSlideIn .7s ease .36s both;
}

.social-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 42px;
	height: 42px;
	border-radius: 999px;
	border: 1px solid rgba(15, 23, 42, .08);
	background: rgba(255, 255, 255, .94);
	backdrop-filter: blur(12px) saturate(140%);
	color: #475569;
	text-decoration: none;
	transition: transform .25s ease, border-color .25s ease, background .25s ease, box-shadow .25s ease;
}

.social-link svg {
	width: 18px;
	height: 18px;
}

.social-link:hover {
	transform: translateY(-3px);
	border-color: rgba(14, 165, 233, .2);
	background: rgba(255, 255, 255, 1);
	box-shadow: 0 8px 24px rgba(14, 165, 233, .12);
	color: #0f172a;
}

.about-body {
	position: relative;
	z-index: 2;
	max-width: 860px;
	margin: -56px auto 0;
	padding: 0 clamp(24px, 4vw, 48px) 0;
}

.about-body::before {
	content: "";
	position: absolute;
	top: 0;
	left: -40px;
	right: -40px;
	height: 1px;
	background: linear-gradient(90deg, rgba(14, 165, 233, .34), rgba(139, 92, 246, .16), transparent);
}

.about-body::before,
.about-body::after {
	pointer-events: none;
}

.about-body::after {
	content: "";
	position: absolute;
	top: -72px;
	left: -80px;
	right: -80px;
	height: 220px;
	z-index: -1;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, .2), rgba(255, 255, 255, .74) 42%, rgba(255, 255, 255, 0) 100%),
		linear-gradient(98deg, rgba(14, 165, 233, .08), transparent 58%);
	mask-image: linear-gradient(180deg, transparent 0, black 28%, black 88%, transparent 100%);
}

.about-content-wrap {
	padding: 42px 0 0;
	animation: fadeSlideIn .6s ease .6s both;
}

.about-content-card {
	padding: 48px 56px;
	border: 1px solid rgba(15, 23, 42, .06);
	border-radius: 12px;
	background: rgba(255, 255, 255, .94);
	backdrop-filter: blur(12px) saturate(140%);
}



.about-comments-wrap {
	padding: 24px 0 0;
}

.comments-closed {
	padding: 24px 0;
	text-align: center;
}

.comments-closed-text {
	color: #64748b;
	font-size: 15px;
	font-weight: 500;
}

@media screen and (max-width: 767px) {
	.about-page {
		padding: 0 0 64px;
	}

	.about-hero {
		min-height: auto;
	}

	.hero-inner {
		padding: 56px 20px 48px;
	}

	.hero-accent,
	.hero-decor {
		display: none;
	}

	.avatar-container {
		width: 120px;
		height: 120px;
	}

	.avatar-img {
		width: 76px;
		height: 76px;
	}

	.avatar-orbit-inner {
		inset: 14px;
	}

	.avatar-orbit-outer {
		inset: -2px;
	}

	.avatar-orbit-tilted {
		inset: 6px;
	}

	.avatar-pulse-ring {
		animation-name: pulseRingExpandMobile;
	}

	@keyframes pulseRingExpandMobile {
		0% { width: 76px; height: 76px; opacity: .5; }
		100% { width: 130px; height: 130px; opacity: 0; }
	}

	.hero-name {
		font-size: 32px;
		margin-top: 20px;
	}

	.hero-social {
		gap: 10px;
		margin-top: 16px;
	}

	.social-link {
		width: 38px;
		height: 38px;
	}

	.social-link svg {
		width: 16px;
		height: 16px;
	}

	.about-body {
		margin: -20px 20px 0;
		padding: 0;
	}

	.about-body::before {
		left: -20px;
		right: -20px;
	}

	.about-body::after {
		left: -20px;
		right: -20px;
	}

	.about-content-card {
		padding: 32px 24px;
		border-radius: 8px;
	}
}

@media screen and (min-width: 768px) and (max-width: 1120px) {
	.hero-inner {
		padding-left: 32px;
		padding-right: 32px;
	}

	.hero-accent-1,
	.hero-accent-2 {
		opacity: .44;
		transform: scale(.92);
	}

	.hero-name {
		font-size: 38px;
	}

	.about-content-card {
		padding: 36px 32px;
	}
}
</style>

<style>
.content ul li {
	letter-spacing: 1px !important;
}
</style>