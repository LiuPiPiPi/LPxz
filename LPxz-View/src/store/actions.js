import {
	SAVE_COMMENT_RESULT,
	SET_PARENT_COMMENT_ID,
	RESET_COMMENT_FORM,
	SET_ARTICLE_PASSWORD_DIALOG_VISIBLE,
	SET_ARTICLE_PASSWORD_FORM
} from "./mutations-types";

import { getCommentListByQuery, submitComment } from "@/api/comment";
import { ElMessage, ElNotification } from "element-plus";
import router from "../router";
import tvMapper from '@/plugins/tvMapper.json'
import aruMapper from '@/plugins/aruMapper.json'
import paopaoMapper from '@/plugins/paopaoMapper.json'
import sanitizeHtml from 'sanitize-html'
import { getArticleToken } from '@/util/localStorageToken'

export default {
	getCommentList({ commit, rootState }) {
		//密码保护的文章，需要发送密码验证通过后保存在localStorage的Token
		const articleToken = window.localStorage.getItem(`article${rootState.commentQuery.articleId}`)
		//如果有则发送博主身份Token
		const adminToken = window.localStorage.getItem('adminToken')
		const token = adminToken ? adminToken : (articleToken ? articleToken : '')

		function replaceEmoji(comment, emoji) {
			comment.content = comment.content.replace(new RegExp(emoji.reg, 'g'), `<img src="${emoji.src}">`)
		}

		function convertEmoji(comment) {
			tvMapper.forEach(emoji => {
				replaceEmoji(comment, emoji)
			})
			aruMapper.forEach(emoji => {
				replaceEmoji(comment, emoji)
			})
			paopaoMapper.forEach(emoji => {
				replaceEmoji(comment, emoji)
			})
		}

		getCommentListByQuery(token, rootState.commentQuery).then(res => {
			if (res.code === 200) {
				let sanitizeHtmlConfig = {
					allowedTags: [],
					allowedAttributes: false,
					disallowedTagsMode: 'recursiveEscape'
				}
				res.data.comments.list.forEach(comment => {
					//转义评论中的html
					comment.content = sanitizeHtml(comment.content, sanitizeHtmlConfig)
					//查找评论中是否有表情
					if (comment.content.indexOf('@[') != -1) {
						convertEmoji(comment)
					}
					comment.replyComments.forEach(comment => {
						//转义评论中的html
						comment.content = sanitizeHtml(comment.content, sanitizeHtmlConfig)
						//查找评论中是否有表情
						if (comment.content.indexOf('@[') != -1) {
							convertEmoji(comment)
						}
					})
				})
				commit(SAVE_COMMENT_RESULT, res.data)
			}
		}).catch(() => {
			ElMessage.error("请求失败")
		})
	},
	submitCommentForm({ rootState, dispatch, commit }, token) {
		let form = { ...rootState.commentForm }
		form.page = rootState.commentQuery.page
		form.articleId = rootState.commentQuery.articleId
		form.parentCommentId = rootState.parentCommentId
		submitComment(token, form).then(res => {
			if (res.code === 200) {
				ElNotification({
					title: res.msg,
					type: 'success'
				})
				commit(SET_PARENT_COMMENT_ID, -1)
				commit(RESET_COMMENT_FORM)
				dispatch('getCommentList')
			} else {
				ElNotification({
					title: '评论失败',
					message: res.msg,
					type: 'error'
				})
			}
		}).catch(() => {
			ElNotification({
				title: '评论失败',
				message: '异常错误',
				type: 'error'
			})
		})
	},
	goArticlePage({ commit }, article) {
		if (article.privacy) {
			const adminToken = getArticleToken('adminToken')
			const articleToken = getArticleToken(`article${article.id}`)
			//对于密码保护文章，博主身份Token和经过密码验证后的Token都可以跳转路由，再由后端验证Token有效性
			if (adminToken || articleToken) {
				return router.push(`/article/${article.id}`)
			}
			commit(SET_ARTICLE_PASSWORD_FORM, { articleId: article.id, password: '' })
			commit(SET_ARTICLE_PASSWORD_DIALOG_VISIBLE, true)
		} else {
			return router.push(`/article/${article.id}`)
		}
	}

}