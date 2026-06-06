<template>
	<div class="comment-section">
		<CommentForm v-if="parentCommentId===-1"/>
		<h3 class="comment-section-title">Comments | 共 {{ allComment }} 条评论<span v-if="closeComment!==0">（{{ closeComment }} 条评论被隐藏）</span></h3>
		<h3 class="comment-section-title" v-if="allComment===0">快来抢沙发！</h3>
		<div class="comment-item" v-for="comment in comments" :key="comment.id">
			<span class="anchor" :id="`comment-${comment.id}`"></span>
			<img class="comment-avatar" :src="comment.avatar" alt="">
			<div class="comment-body">
				<div class="comment-head">
					<a class="comment-nickname" :href="comment.website!=''&&comment.website!=null?comment.website:null" target="_blank" rel="external nofollow noopener">{{ comment.nickname }}</a>
					<span class="comment-badge" v-if="comment.adminComment">{{ $store.state.siteInfo.commentAdminFlag }}</span>
					<span class="comment-date">{{ dateFormat(comment.createTime,'YYYY-MM-DD HH:mm') }}</span>
					<button class="comment-reply-btn" @click="setReply(comment.id)">回复</button>
				</div>
				<div class="comment-text" v-html="comment.content"></div>
			</div>
			<div class="comment-replies" v-if="comment.replyComments.length>0">
				<div class="comment-item comment-reply" v-for="reply in comment.replyComments" :key="reply.id">
					<span class="anchor" :id="`comment-${reply.id}`"></span>
					<img class="comment-avatar comment-avatar-sm" :src="reply.avatar" alt="">
					<div class="comment-body">
						<div class="comment-head">
							<a class="comment-nickname" :href="reply.website!=''&&reply.website!=null?reply.website:null" target="_blank" rel="external nofollow noopener">{{ reply.nickname }}</a>
							<span class="comment-badge" v-if="reply.adminComment">{{ $store.state.siteInfo.commentAdminFlag }}</span>
							<span class="comment-date">{{ dateFormat(reply.createTime,'YYYY-MM-DD HH:mm') }}</span>
							<button class="comment-reply-btn" @click="setReply(reply.id)">回复</button>
						</div>
						<div class="comment-text">
							<a :href="`#comment-${reply.parentCommentId}`">@{{ reply.parentCommentNickname }}</a>
							<div v-html="reply.content"></div>
						</div>
					</div>
					<CommentForm v-if="parentCommentId===reply.id"/>
				</div>
			</div>
			<CommentForm v-if="parentCommentId===comment.id"/>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import CommentForm from "./CommentForm";
	import {SET_PARENT_COMMENT_ID} from "@/store/mutations-types";
	import {dateFormat} from "@/util/dateTimeFormatUtils";

	export default {
		name: "ArticleComment",
		components: {CommentForm},
		computed: {
			...mapState(['allComment', 'closeComment', 'comments', 'parentCommentId'])
		},
		methods: {
			dateFormat:dateFormat,
			setReply(id) {
				this.$store.commit(SET_PARENT_COMMENT_ID, id)
			}
		}
	}
</script>

<style scoped>
	.comment-section {
		padding: 0;
	}

	.comment-section-title {
		color: #0f172a;
		font-size: 16px;
		font-weight: 600;
		font-family: "LXGW WenKai TC", Inter, ui-sans-serif, system-ui, sans-serif;
		margin: 24px 0 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(15, 23, 42, .06);
	}

	.comment-item {
		display: flex;
		gap: 12px;
		padding: 16px 0;
		position: relative;
	}

	.comment-item + .comment-item {
		border-top: 1px solid rgba(15, 23, 42, .06);
	}

	.comment-item > .anchor {
		position: absolute;
		left: 0;
		top: -48px;
	}

	.comment-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		flex: 0 0 40px;
	}

	.comment-avatar-sm {
		width: 32px;
		height: 32px;
		flex: 0 0 32px;
	}

	.comment-body {
		flex: 1 1 auto;
		min-width: 0;
	}

	.comment-head {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
	}

	.comment-nickname {
		color: #0f172a;
		font-weight: 600;
		font-size: 14px;
		text-decoration: none;
	}

	.comment-nickname:hover {
		color: #0ea5e9;
	}

	.comment-badge {
		padding: 2px 6px;
		border-radius: 6px;
		background: #0f172a;
		color: #fff;
		font-size: 12px;
		font-weight: 500;
	}

	.comment-date {
		color: #94a3b8;
		font-size: 12px;
		font-weight: 400;
	}

	.comment-reply-btn {
		padding: 2px 8px;
		border: 1px solid rgba(14, 165, 233, .16);
		border-radius: 6px;
		background: transparent;
		color: #0ea5e9;
		font-size: 12px;
		cursor: pointer;
		transition: background .2s ease, color .2s ease;
	}

	.comment-reply-btn:hover {
		background: rgba(14, 165, 233, .08);
	}

	.comment-text {
		color: #475569;
		font-size: 14px;
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.comment-text a {
		color: #0ea5e9;
		font-weight: 600;
		cursor: pointer;
		margin-right: 8px;
		text-decoration: none;
	}

	.comment-text div {
		display: inline;
	}

	.comment-replies {
		margin-top: 8px;
		padding-left: 4px;
		border-left: 2px solid rgba(14, 165, 233, .12);
	}

	.comment-reply {
		padding: 12px 0;
		border-radius: 6px;
		background: rgba(14, 165, 233, .02);
		border-top: none;
	}

	.comment-replies .comment-reply + .comment-reply {
		border-top: 1px solid rgba(15, 23, 42, .04);
	}

	.comment-replies .comment-reply > .anchor {
		top: -55px;
	}
</style>