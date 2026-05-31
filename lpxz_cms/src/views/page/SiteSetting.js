import { useState, useEffect, useCallback } from 'react'

import { Form, Input, Row, Col, Button, message, Card, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

import { getSiteSettingData, update } from "api/siteSetting"

const SiteSetting = () => {
    const [baseForm] = Form.useForm()
    const [infoForm] = Form.useForm()
    const [footerForm] = Form.useForm()

    const [baseFormList, setBaseFormList] = useState([])
    const [infoFormList, setInfoFormList] = useState([])
    const [customFormList, setCustomFormList] = useState([])
    const [footerFormList, setFooterFormList] = useState([])
    const [deleteIds, setDeleteIds] = useState([])

    const init = useCallback(() => {
        getSiteSettingData().then(res => {
            if (res.code === 200) {
                setBaseFormList(res.data.type1)
                baseForm.setFieldsValue(copyValue(res.data.type1))

                let arr3 = [], arr4 = []
                res.data.type3.forEach(item => {
                    if (item.nameEn !== 'favorite') {
                        arr3.push(item)
                    } else {
                        arr4.push(item)
                    }
                })
                setInfoFormList(arr3)
                setCustomFormList(arr4)
                infoForm.setFieldsValue(copyValue(arr3))
                infoForm.setFieldValue('custom', arr4)

                let arr2 = []
                res.data.type2.forEach(item => {
                    item.value = JSON.parse(item.value)
                    arr2.push(item.value)
                })
                setFooterFormList(res.data.type2)
                footerForm.setFieldValue('badges', arr2)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
        })
    }, [baseForm, infoForm, footerForm])

    useEffect(() => {
        init()
    }, [init])

    const handleSubmitBase = values => {
        const submitList = [...baseFormList]
        submitList.forEach(ele => {
            ele.value = values[ele.nameEn]
        })
        submit(submitList)
    }

    const handleSubmitInfo = values => {
        const infoTmpList = [...infoFormList]
        infoTmpList.forEach(ele => {
            ele.value = values[ele.nameEn]
        })
        const customTmpList = [...customFormList]
        values.custom.forEach((ele, i) => {
            customTmpList[i].value = ele.value
        })
        const submitList = [...infoTmpList, ...customTmpList]
        submit(submitList)
    }

    const handleSubmitFooter = values => {
        const submitList = [...footerFormList]
        values.badges.forEach((ele, i) => {
            submitList[i].value = JSON.stringify(ele)
        })
        submit(submitList)
    }

    const copyValue = formList => {
        let obj = {}
        formList.forEach(ele => obj[ele.nameEn] = ele.value)
        return obj
    }

    const submit = updateArr => {
        update(updateArr, deleteIds).then(res => {
            if (res.code === 200) {
                setDeleteIds([])
                init()
                message.success(res.msg)
            } else {
                message.error(res.msg)
            }
        }).catch(() => {
            message.error("请求失败")
        })
    }

    return (
        <>
            <Row gutter={20} justify='space-between'>
                <Col span={12}>
                    <Card title="基础设置">
                        <Form
                            name="base_form"
                            form={baseForm}
                            layout="horizontal"
                            labelCol={{ span: 5 }}
                            onFinish={handleSubmitBase}
                        >
                            {baseFormList.map((item, index) => (
                                <Form.Item key={index} name={item.nameEn} label={item.nameZh}>
                                    <Input placeholder={`请输入${item.nameZh}`} />
                                </Form.Item>
                            ))}
                            <Form.Item style={{ textAlign: 'right' }}>
                                <Button htmlType="submit" type='primary'>保存</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="资料卡设置">
                        <Form
                            name="info_form"
                            form={infoForm}
                            layout="horizontal"
                            labelCol={{ span: 5 }}
                            onFinish={handleSubmitInfo}
                        >
                            {infoFormList.map((item, index) => (
                                <Form.Item key={index} name={item.nameEn} label={item.nameZh}>
                                    <Input placeholder={`请输入${item.nameZh}`} />
                                </Form.Item>
                            ))}
                            <Form.List name="custom">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space.Compact key={key} block={true}>
                                                <Form.Item name={[name, 'value']} label="自定义" style={{ width: "100%" }}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button danger onClick={() => {
                                                        remove(name)
                                                        if (customFormList[key].id) {
                                                            const tmpId = customFormList[key].id
                                                            deleteIds.push(tmpId)
                                                            customFormList.forEach((item, index) => {
                                                                if (item.id === tmpId) {
                                                                    customFormList.splice(index, 1)
                                                                    return
                                                                }
                                                            })
                                                        } else {
                                                            customFormList.forEach((item, index) => {
                                                                if (item.key === key) {
                                                                    customFormList.splice(index, 1)
                                                                    return
                                                                }
                                                            })
                                                        }
                                                    }}
                                                        icon={<MinusCircleOutlined />}>删除</Button>
                                                </Form.Item>
                                            </Space.Compact>
                                        ))}
                                        <Form.Item style={{ textAlign: 'right' }}>
                                            <Space size='middle'>
                                                <Button type='dashed' icon={<PlusOutlined />} onClick={() => {
                                                    add({ value: '{"title":"","content":""}' });
                                                    customFormList.push({
                                                        nameEn: "favorite",
                                                        nameZh: "自定义",
                                                        type: 3,
                                                        value: "{\"title\":\"\",\"content\":\"\"}"
                                                    })
                                                }}>
                                                    添加自定义</Button>
                                                <Button htmlType="submit" type='primary'>保存</Button>
                                            </Space>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <br />
            <Card title="页脚徽标">
                <Form
                    name="footer_form"
                    form={footerForm}
                    onFinish={handleSubmitFooter}
                >
                    <Form.List name="badges">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} align='baseline'>
                                        <Form.Item name={[name, 'title']} label="标题">
                                            <Input placeholder="标题" />
                                        </Form.Item>
                                        <Form.Item name={[name, 'url']} label="URL">
                                            <Input placeholder="URL" />
                                        </Form.Item>
                                        <Form.Item name={[name, 'subject']} label="subject">
                                            <Input placeholder="subject" />
                                        </Form.Item>
                                        <Form.Item name={[name, 'value']} label="value">
                                            <Input placeholder="value" />
                                        </Form.Item>
                                        <Form.Item name={[name, 'color']} label="颜色">
                                            <Input placeholder="颜色" />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button danger onClick={() => {
                                                remove(name)
                                                if (footerFormList[key].id) {
                                                    const tmpId = footerFormList[key].id
                                                    deleteIds.push(tmpId)
                                                    footerFormList.forEach((item, index) => {
                                                        if (item.id === tmpId) {
                                                            footerFormList.splice(index, 1)
                                                            return
                                                        }
                                                    })
                                                } else {
                                                    footerFormList.forEach((item, index) => {
                                                        if (item.key === key) {
                                                            footerFormList.splice(index, 1)
                                                            return
                                                        }
                                                    })
                                                }
                                            }}
                                                icon={<MinusCircleOutlined />}>删除</Button>
                                        </Form.Item>
                                    </Space>
                                ))}
                                <Form.Item style={{ textAlign: 'right' }}>
                                    <Space size='middle'>
                                        <Button type='dashed' icon={<PlusOutlined />} onClick={() => {
                                            add()
                                            footerFormList.push({
                                                nameEn: "badge",
                                                nameZh: "徽标",
                                                type: 2,
                                                value: {
                                                    color: "",
                                                    subject: "",
                                                    title: "",
                                                    url: "",
                                                    value: ""
                                                }
                                            })
                                        }}>
                                            添加 badge</Button>
                                        <Button htmlType='submit' type='primary'>保存</Button>
                                    </Space>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Card>
        </>
    )
}

export default SiteSetting