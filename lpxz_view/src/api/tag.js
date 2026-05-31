import axios from '@/plugins/axios'

export function getArticleListByTagName(tagName, pageNum) {
	return axios({
		url: 'tag',
		method: 'GET',
		params: {
			tagName,
			pageNum
		}
	})
}