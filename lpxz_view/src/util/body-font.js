const BODY_FONT = '400 1em "LXGW WenKai"'
const MAX_WAIT_MS = 300
const pending = new WeakMap()

function showText(element) {
	clearTimeout(pending.get(element))
	pending.delete(element)
	element.removeAttribute('data-body-font-pending')
}

function waitForBodyFont(element, { value, oldValue }) {
	if (value === oldValue) return
	showText(element)

	const fonts = document.fonts
	if (!value || !fonts || element.getBoundingClientRect().top >= window.innerHeight) return

	// 用实际文字触发 Unicode 分片下载，长文只取开头以免预加载整篇的字库。
	const text = element.innerText.trim().slice(0, 1000)
	if (!text || fonts.check(BODY_FONT, text)) return

	element.setAttribute('data-body-font-pending', '')
	const timer = setTimeout(() => showText(element), MAX_WAIT_MS)
	pending.set(element, timer)

	const finish = () => {
		if (pending.get(element) === timer) showText(element)
	}
	fonts.load(BODY_FONT, text).then(finish, finish)
}

export default {
	mounted: waitForBodyFont,
	updated: waitForBodyFont,
	beforeUnmount: showText
}
