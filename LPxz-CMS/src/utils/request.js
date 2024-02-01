import axios from 'axios'

import { message } from 'antd'

const request = axios.create({
    baseURL: 'http://42.193.17.157:8090/admin/',
    // baseURL: 'http://localhost:8090/admin/',
    timeout: 10000
})

let CancelToken = axios.CancelToken

// 请求拦截
request.interceptors.request.use((config) => {
    // 对于访客模式，除GET请求外，都拦截并提示
    const userJson = window.localStorage.getItem('user') || '{}'
    const user = JSON.parse(userJson)
    if (userJson !== '{}' && user.role !== 'ROLE_admin' && config.method !== 'get') {
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
    (config) => {
        return config.data
    },
    (error) => {
        if (error.message === '演示模式，不允许操作') {
            message.error(error)
        }
    }
)

export default request
