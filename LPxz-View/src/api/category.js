import axios from '@/plugins/axios'

export function getArticleListByCategoryName(categoryName, pageNum) {
	return axios({
		url: 'category',
		method: 'GET',
		params: {
			categoryName,
			pageNum
		}
	})
}