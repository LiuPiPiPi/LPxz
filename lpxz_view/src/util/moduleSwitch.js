// 前台模块显示开关：与后端 site_setting 表中 type=1 的布尔记录对应
// key 为 siteInfo 上的字段名，value 为对应的前台路由 name
export const MODULE_ROUTE_KEYS = {
	momentModuleEnabled: 'moments',
	archiveModuleEnabled: 'archives',
	friendModuleEnabled: 'friends',
	aboutModuleEnabled: 'about',
}

// 判断模块是否启用：未配置时视为启用，仅当显式置为 false/'false'/0/'0' 时才禁用
export function isModuleEnabled(value) {
	return !(value === false || value === 'false' || value === 0 || value === '0')
}

// 由路由 name 反查对应的开关字段名，用于路由守卫判断
export function routeNameToSwitchKey(routeName) {
	for (const [key, name] of Object.entries(MODULE_ROUTE_KEYS)) {
		if (name === routeName) return key
	}
	return null
}
