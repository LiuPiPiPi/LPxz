import axios from '@/plugins/axios'

export function getArticleList(pageNum) {
	return axios({
		url: 'articles',
		method: 'GET',
		params: {
			pageNum
		}
	})
}