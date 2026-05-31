/**
 * 读取对应键的值数据
 * @param key 键
 * @returns {null|*} 对应键的值
 */
export function getArticleToken(key) {
    key = 'lsc_' + key
    let val = window.localStorage.getItem(key)
    if (!val) {
        return null;
    }
    val = JSON.parse(val)
    if (val.expires < new Date().getTime()) {
        console.log("文章token已过期，请重新输入密码！")
        window.localStorage.removeItem(key)
        return null
    }
    return val.val
}

/**
 * 增加一个键值对数据
 * @param key 键
 * @param token 值
 * @param expires 过期时间，单位为秒
 */
export function setArticleToken(key, token, expires) {
    key = 'lsc_' + key
    token = JSON.stringify({ 'val': token, 'expires': new Date().getTime() + expires * 1000 })
    window.localStorage.setItem(key, token)
}