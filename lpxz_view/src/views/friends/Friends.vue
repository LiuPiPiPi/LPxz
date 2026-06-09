<template>
	<div class="friends-page" :class="{ 'friends-page-restored': hasPlayedEntrance }">
		<section class="friends-hero">
			<div class="hero-bg">
				<div class="hero-gradient"></div>
				<div class="hero-grid"></div>
				<div class="hero-accent hero-accent-1"></div>
				<div class="hero-accent hero-accent-2"></div>
			</div>
			<div class="hero-inner">
				<div class="hero-copy">
					<p class="hero-kicker">Friends</p>
					<div class="hero-title-row">
						<h2>友情链接</h2>
						<div class="hero-stats" v-if="friendList.length > 0">
							<div class="stat-pill">
								<span class="stat-dot"></span>
								<span class="stat-value">{{ friendList.length }}</span>
								<span class="stat-label">位好友</span>
							</div>
						</div>
					</div>
					<p class="hero-desc">那些值得相遇的角落，串联起更广阔的世界</p>
				</div>
				<div class="hero-ornament" aria-hidden="true">
					<div class="ornament-ring"></div>
					<div class="ornament-ring ornament-ring-inner"></div>
					<div class="ornament-dot ornament-dot-1"></div>
					<div class="ornament-dot ornament-dot-2"></div>
					<div class="ornament-circuit ornament-circuit-1"></div>
					<div class="ornament-circuit ornament-circuit-2"></div>
				</div>
			</div>
		</section>

		<section class="friends-feed">
			<div class="feed-inner">
				<div class="friends-grid" v-if="friendList.length > 0">
					<a class="friend-card" href="javascript:;" v-for="(item, index) in friendList" :key="index"
						@click.prevent="goFriend(item)"
						:style="{ animationDelay: `${index * 0.08}s` }">
						<div class="card-avatar">
							<img :src="item.avatar" @error="fallbackAvatar($event)">
							<div class="avatar-ring"></div>
						</div>
						<div class="card-body">
							<div class="card-name">{{ item.nickname }}</div>
							<div class="card-desc">{{ item.description }}</div>
						</div>
						<div class="card-arrow">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
					</a>
				</div>
				<div class="empty-state" v-else>
					<div class="empty-icon">
						<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
							<circle cx="24" cy="24" r="22" stroke="#e2e8f0" stroke-width="2"/>
							<path d="M16 24h16M24 16v16" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</div>
					<p>暂无友链</p>
				</div>
			</div>
		</section>

		<section class="friends-info" v-if="info.content">
			<div class="info-inner">
				<div class="info-card">
					<div class="typo content" v-viewer v-html="info.content"></div>
				</div>
			</div>
		</section>

		<section class="friends-comments" v-if="info.commentEnabled">
			<div class="comments-inner">
				<CommentList :page="2" :articleId="null" />
			</div>
		</section>
		<div class="comments-closed" v-if="!info.commentEnabled && info.content">
			<h3>评论已关闭</h3>
		</div>
	</div>
</template>

<script>
import { getData, addViewsByNickname } from "@/api/friend";
import CommentList from "@/components/comment/CommentList";

export default {
	name: "articleFriends",
	components: { CommentList },
	data() {
		return {
			friendList: [],
			info: {
				content: '',
				commentEnabled: false
			},
			hasPlayedEntrance: false
		}
	},
	created() {
		this.getData()
	},
	mounted() {
		setTimeout(() => { this.hasPlayedEntrance = true }, 1200)
	},
	methods: {
		getData() {
			getData().then(res => {
				if (res.code === 200) {
					this.friendList = res.data.friendList
					this.info = res.data.friendInfo
				} else {
					this.msgError(res.msg)
				}
			}).catch(() => {
				this.msgError("请求失败")
			})
		},
		goFriend(item) {
			addViewsByNickname(item.nickname)
			window.open(item.website, '_blank', 'noopener,noreferrer')
		},
		fallbackAvatar(e) {
			e.target.src = '/img/error.png'
		}
	}
}
</script>

<style scoped>
.friends-page {
	position: relative;
	isolation: isolate;
	color: #0f172a;
	font-family: "LXGW WenKai TC", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	overflow: hidden;
	background:
		linear-gradient(180deg, rgba(240, 249, 255, .95) 0%, rgba(248, 250, 252, .98) 42%, #ffffff 100%),
		linear-gradient(115deg, transparent 0 58%, rgba(139, 92, 246, .07) 58% 70%, transparent 70%),
		linear-gradient(24deg, transparent 0 22%, rgba(14, 165, 233, .06) 22% 34%, transparent 34%);
}

.friends-page::before {
	content: "";
	position: absolute;
	top: 340px;
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

.friends-hero {
	position: relative;
	min-height: 280px;
	overflow: hidden;
	background:
		linear-gradient(180deg, rgba(240, 249, 255, .96) 0%, rgba(248, 250, 252, .92) 50%, rgba(255, 255, 255, 0) 100%),
		linear-gradient(135deg, rgba(224, 242, 254, .42) 0%, rgba(245, 243, 255, .32) 50%, transparent 100%);
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
		linear-gradient(180deg, rgba(224, 242, 254, .72) 0%, rgba(240, 249, 255, .36) 60%, transparent 100%),
		linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #f5f3ff 70%, transparent 100%);
}

.hero-grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(14, 165, 233, .04) 1px, transparent 1px),
		linear-gradient(90deg, rgba(14, 165, 233, .04) 1px, transparent 1px);
	background-size: 28px 28px;
}

.hero-accent {
	position: absolute;
	border: 1px solid rgba(14, 165, 233, .08);
	background: transparent;
	animation: accentDrift 12s ease-in-out infinite alternate;
}

.hero-accent-1 {
	top: -24px;
	left: 6%;
	width: 180px;
	height: 90px;
	transform: rotate(-8deg);
}

.hero-accent-2 {
	bottom: 20px;
	right: 12%;
	width: 120px;
	height: 68px;
	border-color: rgba(139, 92, 246, .08);
	transform: rotate(12deg);
	animation-delay: 4s;
}

@keyframes accentDrift {
	0% { transform: translate(0, 0); }
	50% { transform: translate(12px, -8px); }
	100% { transform: translate(-8px, 10px); }
}

.hero-inner {
	position: relative;
	z-index: 1;
	max-width: 960px;
	margin: 0 auto;
	padding: 56px 40px 44px;
	display: flex;
	align-items: flex-start;
	gap: 24px;
}

.hero-copy {
	flex: 1;
	max-width: 560px;
}

.hero-kicker {
	margin: 0 0 8px;
	color: #cf6a2c;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	font-size: 12px;
	font-weight: 800;
	letter-spacing: 0;
	text-transform: uppercase;
	animation: fadeSlideIn .5s ease both;
}

.hero-title-row {
	display: flex;
	align-items: center;
	gap: 14px;
	flex-wrap: wrap;
	animation: fadeSlideIn .5s ease .08s both;
}

.hero-copy h2 {
	margin: 0;
	color: #020617;
	font-family: "Noto Serif SC", serif;
	font-size: 42px;
	font-weight: 900;
	line-height: 1.15;
	background: linear-gradient(135deg, #0f172a 0%, #0284c7 60%, #8b5cf6 100%);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}

.hero-desc {
	margin: 16px 0 0;
	color: #475569;
	font-size: 16px;
	font-weight: 500;
	line-height: 1.7;
	animation: fadeSlideIn .5s ease .16s both;
}

.hero-stats {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
	flex: 0 0 auto;
}

.stat-pill {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 16px;
	border-radius: 999px;
	border: 1px solid rgba(15, 23, 42, .06);
	background: rgba(255, 255, 255, .72);
	box-shadow: 0 4px 12px rgba(15, 23, 42, .04);
}

.stat-dot {
	width: 7px;
	height: 7px;
	border-radius: 999px;
	background: #8b5cf6;
}

.stat-value {
	color: #0f172a;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	font-size: 18px;
	font-weight: 800;
	line-height: 1;
}

.stat-label {
	color: #64748b;
	font-size: 13px;
	font-weight: 700;
}

.hero-ornament {
	position: relative;
	width: 140px;
	height: 140px;
	flex-shrink: 0;
	pointer-events: none;
}

.ornament-ring {
	position: absolute;
	inset: 0;
	border-radius: 999px;
	border: 1.5px solid rgba(14, 165, 233, .1);
	animation: ringPulse 5s ease-in-out infinite alternate;
}

.ornament-ring-inner {
	inset: 28px;
	border-color: rgba(139, 92, 246, .1);
	animation-delay: 2s;
	animation-direction: reverse;
}

@keyframes ringPulse {
	0% { opacity: .3; transform: scale(1); }
	100% { opacity: .6; transform: scale(1.04); }
}

.ornament-dot {
	position: absolute;
	width: 6px;
	height: 6px;
	border-radius: 999px;
	animation: dotFloat 4s ease-in-out infinite;
}

.ornament-dot-1 {
	top: 16px;
	right: 24px;
	background: rgba(14, 165, 233, .4);
}

.ornament-dot-2 {
	bottom: 20px;
	left: 28px;
	background: rgba(139, 92, 246, .4);
	animation-delay: 1s;
}

@keyframes dotFloat {
	0%, 100% { opacity: .4; transform: translateY(0); }
	50% { opacity: .8; transform: translateY(-4px); }
}

.ornament-circuit {
	position: absolute;
	height: 1px;
	border-radius: 999px;
	background: rgba(14, 165, 233, .1);
	animation: circuitPulse 5s ease-in-out infinite;
}

.ornament-circuit-1 {
	top: 56px;
	right: 0;
	width: 56px;
	transform: rotate(-16deg);
}

.ornament-circuit-2 {
	bottom: 36px;
	left: 0;
	width: 44px;
	background: rgba(139, 92, 246, .1);
	transform: rotate(10deg);
	animation-delay: 1.5s;
}

@keyframes circuitPulse {
	0%, 100% { opacity: .2; }
	50% { opacity: .5; }
}

@keyframes fadeSlideIn {
	from { opacity: 0; transform: translateY(12px); }
	to { opacity: 1; transform: translateY(0); }
}

.friends-page-restored .hero-kicker,
.friends-page-restored .hero-title-row,
.friends-page-restored .hero-copy h2,
.friends-page-restored .hero-desc,
.friends-page-restored .friend-card {
	animation: none;
}

.friends-feed {
	position: relative;
	z-index: 2;
	background:
		linear-gradient(180deg, transparent 0%, rgba(248, 250, 252, .5) 20%, #fff 100%);
}

.friends-feed::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	background-image:
		linear-gradient(rgba(14, 165, 233, .02) 1px, transparent 1px),
		linear-gradient(90deg, rgba(14, 165, 233, .02) 1px, transparent 1px);
	background-size: 36px 36px;
	mask-image: linear-gradient(180deg, transparent 0, black 12%, black 72%, transparent 100%);
}

.feed-inner {
	max-width: 780px;
	margin: -36px auto 0;
	padding: 0 40px 64px;
}

.friends-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 18px;
}

.friend-card {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 20px;
	border-radius: 12px;
	border: 1px solid rgba(15, 23, 42, .06);
	background: rgba(255, 255, 255, .88);
	backdrop-filter: blur(12px) saturate(140%);
	box-shadow: 0 4px 12px rgba(15, 23, 42, .03);
	text-decoration: none;
	color: #0f172a;
	transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
	animation: fadeSlideIn .45s ease both;
	cursor: pointer;
}

.friend-card:hover {
	border-color: rgba(139, 92, 246, .22);
	box-shadow: 0 8px 24px rgba(15, 23, 42, .08), 0 0 0 1px rgba(139, 92, 246, .06);
	transform: translateY(-3px);
}

.card-avatar {
	position: relative;
	width: 52px;
	height: 52px;
	flex-shrink: 0;
}

.card-avatar img {
	width: 52px;
	height: 52px;
	border-radius: 999px;
	object-fit: cover;
	display: block;
}

.avatar-ring {
	position: absolute;
	inset: -3px;
	border-radius: 999px;
	border: 1.5px solid rgba(14, 165, 233, .12);
	transition: border-color .25s ease;
}

.friend-card:hover .avatar-ring {
	border-color: rgba(139, 92, 246, .25);
}

.card-body {
	flex: 1 1 0;
	min-width: 0;
}

.card-name {
	font-weight: 700;
	font-size: 15px;
	line-height: 1.3;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.card-desc {
	margin-top: 4px;
	color: #64748b;
	font-size: 13px;
	font-weight: 500;
	line-height: 1.45;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.card-arrow {
	flex-shrink: 0;
	color: #94a3b8;
	transition: color .2s ease, transform .2s ease;
}

.friend-card:hover .card-arrow {
	color: #8b5cf6;
	transform: translateX(2px);
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	padding: 80px 0;
	color: #94a3b8;
	font-size: 15px;
	font-weight: 500;
}

.friends-info {
	position: relative;
	z-index: 2;
}

.info-inner {
	max-width: 780px;
	margin: 0 auto;
	padding: 0 40px 32px;
}

.info-card {
	padding: 28px 32px;
	border-radius: 12px;
	border: 1px solid rgba(15, 23, 42, .06);
	background: rgba(255, 255, 255, .92);
	backdrop-filter: blur(12px) saturate(140%);
	box-shadow: 0 4px 12px rgba(15, 23, 42, .03);
}

.friends-comments {
	position: relative;
	z-index: 2;
}

.comments-inner {
	max-width: 780px;
	margin: 0 auto;
	padding: 0 40px 64px;
}

.comments-closed {
	text-align: center;
	padding: 24px 40px 64px;
	color: #94a3b8;
	font-size: 14px;
	font-weight: 500;
	max-width: 780px;
	margin: 0 auto;
}

.comments-closed h3 {
	font-size: 15px;
	font-weight: 600;
	color: #94a3b8;
}

@media screen and (max-width: 767px) {
	.friends-hero {
		min-height: auto;
	}

	.hero-inner {
		padding: 40px 20px 32px;
		flex-wrap: wrap;
	}

	.hero-stats {
		align-items: flex-start;
	}

	.hero-ornament {
		display: none;
	}

	.hero-copy h2 {
		font-size: 32px;
	}

	.hero-desc {
		font-size: 14px;
	}

	.hero-accent {
		display: none;
	}

	.feed-inner {
		margin: -20px auto 0;
		padding: 0 16px 48px;
	}

	.friends-grid {
		grid-template-columns: 1fr;
		gap: 14px;
	}

	.friend-card {
		padding: 16px;
		animation-delay: 0s !important;
	}

	.info-inner {
		padding: 0 16px 24px;
	}

	.comments-inner {
		padding: 0 16px 48px;
	}
}

@media screen and (min-width: 768px) and (max-width: 1024px) {
	.hero-inner {
		padding: 48px 32px 36px;
	}

	.feed-inner {
		padding: 0 24px 56px;
	}

	.info-inner {
		padding: 0 24px 28px;
	}

	.comments-inner {
		padding: 0 24px 56px;
	}
}
</style>
