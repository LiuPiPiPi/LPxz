import axios from '@/plugins/axios'

export function getArticleById(token, id) {
	return axios({
		url: 'article',
		method: 'GET',
		headers: {
			Authorization: token,
		},
		params: {
			id
		}
	})
}

export function checkArticlePassword(articlePasswordForm) {
	return axios({
		url: 'checkArticlePassword',
		method: 'POST',
		data: {
			...articlePasswordForm
		}
	})
}

export function getSearchArticleList(query) {
	return axios({
		url: 'searchArticle',
		method: 'GET',
		params: {
			query
		}
	})
}