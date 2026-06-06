const SCROLL_KEYS = {
	home: 'homeScrollY',
	archives: 'archivesScrollY'
}

export function saveHomeScrollPosition(from, scrollY, storage = window.sessionStorage) {
	const key = SCROLL_KEYS[from.name]
	if (key) {
		storage.setItem(key, String(scrollY))
	}
}

export function resolveScrollPosition(to, savedPosition, storage = window.sessionStorage) {
	if (savedPosition) return savedPosition

	const key = SCROLL_KEYS[to.name]
	if (key) {
		const y = parseInt(storage.getItem(key) || '0', 10)
		storage.removeItem(key)
		return { top: Number.isNaN(y) ? 0 : y }
	}

	return { top: 0 }
}
