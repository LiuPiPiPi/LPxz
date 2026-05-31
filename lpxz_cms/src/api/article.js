import axios from 'utils/request';

export function getDataByQuery(queryInfo) {
    return axios({
        url: 'articles',
        method: 'GET',
        params: {
            ...queryInfo
        }
    });
}

export function deleteById(id) {
    return axios({
        url: 'article',
        method: 'DELETE',
        params: {
            id
        }
    });
}

export function getCategoryAndTag() {
    return axios({
        url: 'categoryAndTag',
        method: 'GET'
    });
}

export function saveArticle(article) {
    return axios({
        url: 'article',
        method: 'POST',
        data: {
            ...article
        }
    });
}

export function updateTop(id, top) {
    return axios({
        url: 'article/top',
        method: 'PUT',
        params: {
            id,
            top
        }
    });
}

export function updateRecommend(id, recommend) {
    return axios({
        url: 'article/recommend',
        method: 'PUT',
        params: {
            id,
            recommend
        }
    });
}

export function updateVisibility(id, form) {
    return axios({
        url: `article/${id}/visibility`,
        method: 'PUT',
        data: {
            ...form
        }
    });
}

export function getArticleById(id) {
    return axios({
        url: 'article',
        method: 'GET',
        params: {
            id
        }
    });
}

export function updateArticle(article) {
    return axios({
        url: 'article',
        method: 'PUT',
        data: {
            ...article
        }
    });
}
