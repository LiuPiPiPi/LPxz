import { memo, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Radio, Input, Switch, Row, message } from 'antd'

const ArticleVisibleModal = memo(forwardRef((props, ref) => {
    const [form] = Form.useForm()
    const { article } = props

    const [modalOpen, setModalOpen] = useState(false)
    const [radio, setRadio] = useState('a')

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            setModalOpen(true)
        },
        handleClose: () => {
            handleClose()
        }
    }))

    useEffect(() => {
        if (article !== null && JSON.stringify(article) !== '{}') {
            let publish = article.published ? (article.password !== '' ? 'c' : 'a') : 'b'
            form.setFieldsValue({ ...article, publish })
            setRadio(publish)
        } else {
            form.setFieldsValue({ publish: 'a' })
        }
    }, [article, form])

    const handleSubmit = () => {
        if (form.getFieldValue('publish') === 'c' && (form.getFieldValue('password') === '')) {
            message.error("密码保护模式必须填写密码！")
        } else {
            let values = {
                ...form.getFieldsValue(),
                ...{ published: form.getFieldValue('publish') === 'b' ? false : true }
            }
            props.handleSubmit(article, values)
            handleClose()
        }
    }

    const handleClose = () => {
        setModalOpen(false)
    }

    return (
        <Modal
            open={modalOpen}
            okText="保存"
            onOk={handleSubmit}
            onCancel={handleClose}
            forceRender
            destroyOnClose
        >
            <Form
                name="visible_modal"
                form={form}
                initialValues={{
                    publish: 'a',
                    password: '',
                    appreciation: false,
                    commentEnabled: false,
                    recommend: false,
                    top: false
                }}
            >
                <Form.Item name="publish">
                    <Radio.Group optionType="button" onChange={e => {
                        if (e.target.value !== 'c') {
                            form.setFieldValue('password', '')
                        }
                        setRadio(e.target.value)
                    }}>
                        <Radio value='a'>公开</Radio>
                        <Radio value='b'>私密</Radio>
                        <Radio value='c'>密码保护</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="password" hidden={radio !== 'c'}>
                    <Input placeholder='请在此输入密码' />
                </Form.Item>
                <Row style={{ justifyContent: 'space-around' }} hidden={radio === 'b'}>
                    <Form.Item name="appreciation" label="赞赏" valuePropName='checked'>
                        <Switch />
                    </Form.Item>
                    <Form.Item name="recommend" label="推荐" valuePropName='checked'>
                        <Switch />
                    </Form.Item>
                    <Form.Item name="commentEnabled" label="评论" valuePropName='checked'>
                        <Switch />
                    </Form.Item>
                    <Form.Item name="top" label="置顶" valuePropName='checked'>
                        <Switch />
                    </Form.Item>
                </Row>
            </Form>
        </Modal>
    )
}))

export default ArticleVisibleModal