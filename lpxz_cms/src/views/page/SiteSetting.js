import { useState, useEffect, useCallback } from 'react'

import { Alert, Button, Form, Input, message, Spin, Switch, Tabs } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

import { getSiteSettingData, update } from "api/siteSetting"

// 控制前台导航各模块显示的开关，与后端 site_setting 表中 type=1 的记录对应
const MODULE_CONFIG = [
    { nameEn: 'momentModuleEnabled', nameZh: '动态模块显示', label: '动态', desc: '控制前台「动态」模块及导航入口的显示' },
    { nameEn: 'archiveModuleEnabled', nameZh: '归档模块显示', label: '归档', desc: '控制前台「归档」模块及导航入口的显示' },
    { nameEn: 'friendModuleEnabled', nameZh: '友链模块显示', label: '友链', desc: '控制前台「友链」模块及导航入口的显示' },
    { nameEn: 'aboutModuleEnabled', nameZh: '关于模块显示', label: '关于', desc: '控制前台「关于」模块及导航入口的显示' },
]

const MODULE_NAMES = new Set(MODULE_CONFIG.map(item => item.nameEn))
const CUSTOM_SETTING = { nameEn: 'favorite', nameZh: '自定义', type: 3 }
const BADGE_SETTING = { nameEn: 'badge', nameZh: '徽标', type: 2 }
const BADGE_FIELDS = [
    ['title', '标题'], ['url', '链接地址'], ['subject', '左侧文字'], ['value', '右侧文字'], ['color', '颜色'],
]

const EMPTY_BADGE = Object.fromEntries(BADGE_FIELDS.map(([field]) => [field, '']))

const fieldValues = rows => Object.fromEntries(rows.map(row => [row.nameEn, row.value]))
const updatedRows = (rows, values) => rows.map(row => ({ ...row, value: values[row.nameEn] }))
const removedIds = (rows, values) => rows
    .filter(row => row.id && !values.some(value => value.id === row.id))
    .map(row => row.id)

function badgeFields(row) {
    try {
        return { ...JSON.parse(row.value), id: row.id }
    } catch {
        return { id: row.id }
    }
}

export default function SiteSetting() {
    const [baseForm] = Form.useForm()
    const [infoForm] = Form.useForm()
    const [moduleForm] = Form.useForm()
    const [footerForm] = Form.useForm()
    const [rows, setRows] = useState({})
    const [pending, setPending] = useState(true)
    const [reload, setReload] = useState(null)

    const load = useCallback(async section => {
        const response = await getSiteSettingData()
        if (response.code !== 200) throw new Error(response.msg || '读取站点设置失败')

        const { type1, type2, type3 } = response.data
        const nextRows = {}
        if (!section || section === 'base') {
            nextRows.base = type1.filter(row => !MODULE_NAMES.has(row.nameEn))
            baseForm.setFieldsValue(fieldValues(nextRows.base))
        }
        if (!section || section === 'info') {
            nextRows.info = type3.filter(row => row.nameEn !== CUSTOM_SETTING.nameEn)
            nextRows.custom = type3.filter(row => row.nameEn === CUSTOM_SETTING.nameEn)
            infoForm.setFieldsValue({
                ...fieldValues(nextRows.info),
                custom: nextRows.custom.map(({ id, value }) => ({ id, value })),
            })
        }
        if (!section || section === 'modules') {
            nextRows.modules = Object.fromEntries(type1
                .filter(row => MODULE_NAMES.has(row.nameEn)).map(row => [row.nameEn, row]))
            moduleForm.setFieldsValue(Object.fromEntries(MODULE_CONFIG.map(({ nameEn }) => [
                nameEn, String(nextRows.modules[nameEn]?.value).toLowerCase() === 'true',
            ])))
        }
        if (!section || section === 'footer') {
            nextRows.footer = type2
            footerForm.setFieldValue('badges', type2.map(badgeFields))
        }
        setRows(previous => ({ ...previous, ...nextRows }))
    }, [baseForm, infoForm, moduleForm, footerForm])

    const reloadSettings = useCallback(async (section = '') => {
        setPending(true)
        try {
            await load(section)
            setReload(null)
        } catch {
            setReload(section)
        } finally {
            setPending(false)
        }
    }, [load])

    useEffect(() => {
        reloadSettings()
    }, [reloadSettings])

    const save = async (section, settings, deleted = []) => {
        setPending(true)
        try {
            const response = await update(settings, deleted)
            if (response.code !== 200) {
                message.error(response.msg)
                return
            }
            message.success(response.msg)
            await reloadSettings(section)
        } catch {
            message.error('保存请求失败')
        } finally {
            setPending(false)
        }
    }

    const disabled = pending || reload !== null
    const saveButton = <Button type="primary" htmlType="submit">保存此分区</Button>
    const settingsFields = items => items?.map(({ nameEn, nameZh }) => (
        <Form.Item key={nameEn} name={nameEn} label={nameZh}>
            <Input placeholder={`请输入${nameZh}`} />
        </Form.Item>
    ))
    const items = [
        {
            key: 'base', label: '基础设置', forceRender: true,
            children: (
                <Form form={baseForm} name="base_settings" layout="vertical" disabled={disabled}
                    onFinish={values => save('base', updatedRows(rows.base, values))}>
                    <div className="cms-settings-fields">{settingsFields(rows.base)}</div>
                    <div className="cms-editor-actions">{saveButton}</div>
                </Form>
            ),
        },
        {
            key: 'info', label: '资料卡设置', forceRender: true,
            children: (
                <Form form={infoForm} name="profile_settings" layout="vertical" disabled={disabled}
                    onFinish={({ custom = [], ...values }) => save('info', [
                        ...updatedRows(rows.info, values),
                        ...custom.map(value => ({ ...CUSTOM_SETTING, ...value })),
                    ], removedIds(rows.custom, custom))}>
                    <div className="cms-settings-fields">{settingsFields(rows.info)}</div>
                    <Form.List name="custom">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name }) => (
                                    <div className="cms-settings-badge" key={key}>
                                        <Form.Item name={[name, 'id']} hidden><Input /></Form.Item>
                                        <Form.Item name={[name, 'value']} label="自定义"><Input /></Form.Item>
                                        <Button type="text" danger icon={<MinusCircleOutlined />}
                                            aria-label={`删除第 ${name + 1} 个自定义项`}
                                            onClick={() => remove(name)}>删除</Button>
                                    </div>
                                ))}
                                <div className="cms-editor-actions">
                                    <Button icon={<PlusOutlined />}
                                        onClick={() => add({ value: '{"title":"","content":""}' })}>添加自定义项</Button>
                                    {saveButton}
                                </div>
                            </>
                        )}
                    </Form.List>
                </Form>
            ),
        },
        {
            key: 'modules', label: '模块显示开关', forceRender: true,
            children: (
                <Form form={moduleForm} name="module_settings" disabled={disabled}
                    onFinish={values => save('modules', MODULE_CONFIG.map(({ nameEn, nameZh }) => ({
                        ...rows.modules[nameEn], nameEn, nameZh, type: 1, value: String(!!values[nameEn]),
                    })))}>
                    {MODULE_CONFIG.map(({ nameEn, label, desc }) => (
                        <div className="cms-setting-row" key={nameEn}>
                            <div>{label}<small>{desc}</small></div>
                            <Form.Item name={nameEn} valuePropName="checked" noStyle>
                                <Switch aria-label={`显示${label}模块`} />
                            </Form.Item>
                        </div>
                    ))}
                    <div className="cms-editor-actions">{saveButton}</div>
                </Form>
            ),
        },
        {
            key: 'footer', label: '页脚徽标', forceRender: true,
            children: (
                <Form form={footerForm} name="footer_settings" className="cms-footer-settings"
                    layout="vertical" disabled={disabled}
                    onFinish={({ badges = [] }) => save('footer', badges.map(({ id, ...value }) => ({
                        ...BADGE_SETTING, id, value: JSON.stringify(value),
                    })), removedIds(rows.footer, badges))}>
                    <Form.List name="badges">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name }) => (
                                    <div className="cms-settings-badge cms-footer-badge" key={key}>
                                        <Form.Item name={[name, 'id']} hidden><Input /></Form.Item>
                                        {BADGE_FIELDS.map(([field, label]) => (
                                            <Form.Item key={field} name={[name, field]} label={label}
                                                className={`cms-badge-${field}`}>
                                                <Input />
                                            </Form.Item>
                                        ))}
                                        <Button className="cms-badge-action" type="text" danger
                                            icon={<MinusCircleOutlined />}
                                            aria-label={`删除第 ${name + 1} 个徽标`}
                                            onClick={() => remove(name)}>删除</Button>
                                    </div>
                                ))}
                                <div className="cms-editor-actions">
                                    <Button icon={<PlusOutlined />} onClick={() => add({ ...EMPTY_BADGE })}>添加徽标</Button>
                                    {saveButton}
                                </div>
                            </>
                        )}
                    </Form.List>
                </Form>
            ),
        },
    ]

    return (
        <div className="cms-panel cms-settings">
            <Spin spinning={pending}>
                {reload !== null && (
                    <Alert type="error" showIcon message="读取站点设置失败"
                        action={<Button size="small" onClick={() => reloadSettings(reload)}>重试</Button>} />
                )}
                <Tabs items={items} />
            </Spin>
        </div>
    )
}
