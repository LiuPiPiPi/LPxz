import axios from 'axios'

import { message } from 'antd'

const AUTH_ERROR_CODES = [401]

const request = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8090/admin/',
    timeout: 10000
})

let CancelToken = axios.CancelToken

function getStoredUser() {
    const userJson = window.localStorage.getItem('user')
    if (!userJson) {
        return null
    }

    try {
        return JSON.parse(userJson)
    } catch {
        return null
    }
}

function isLoginRequest(config = {}) {
    return String(config.url || '').includes('login')
}

function isAuthError(data = {}, status) {
    if (!data || typeof data !== 'object') {
        data = {}
    }

    const msg = data.msg || data.message || ''
    return AUTH_ERROR_CODES.includes(status) ||
        AUTH_ERROR_CODES.includes(data.code) ||
        (data.code === 403 && (msg.includes('请登录') || msg.includes('凭证已失效') || msg.includes('登录已过期')))
}

function redirectToLogin(msg) {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('user')

    if (window.location.pathname !== '/login') {
        message.warning(msg || '登录状态已失效，请重新登录')
        window.location.replace('/login')
    }
}

// 请求拦截
request.interceptors.request.use((config) => {
    // 对于访客模式，除GET请求外，都拦截并提示
    const user = getStoredUser()
    if (user && user.role !== 'ROLE_admin' && config.method !== 'get') {
        config.cancelToken = new CancelToken(function executor(cancel) {
            cancel('演示模式，不允许操作')
        })
        return config
    }
    const token = window.localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

// 响应拦截
request.interceptors.response.use(
    (response) => {
        const data = response.data
        if (!isLoginRequest(response.config) && isAuthError(data, response.status)) {
            redirectToLogin(data.msg || data.message)
        }
        return data
    },
    (error) => {
        if (error.message === '演示模式，不允许操作') {
            message.error(error)
            return Promise.reject(error)
        }

        const response = error.response
        const data = response && response.data

        if (response && !isLoginRequest(error.config) && isAuthError(data, response.status)) {
            redirectToLogin(data && (data.msg || data.message))
            return Promise.resolve(data)
        }

        return Promise.reject(error)
    }
)

export default request
