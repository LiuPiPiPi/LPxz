import { memo, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Radio, Input, Switch, Row, message } from 'antd'

const DialogVisibleModal = memo(forwardRef((props, ref) => {
    const [form] = Form.useForm()
    const { article } = props

    const [modalOpen, setModalOpen] = useState(false)
    const [radio, setRadio] = useState(1)

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            setModalOpen(true)
        },
        handleClose: () => {
            handleClose()
        }
    }))

    useEffect(() => {
        if (article !== null) {
            let published = article.published ? (article.password !== '' ? 3 : 1) : 2
            form.setFieldsValue({ ...article, published })
        } else {
            form.setFieldsValue({ published: 1 })
        }
    }, [article, form])

    const handleSubmit = () => {
        if (form.getFieldValue('published') === 3 && (form.getFieldValue('password') === '')) {
            message.error("密码保护模式必须填写密码！")
        } else {
            let values = {
                ...form.getFieldsValue(),
                ...{ published: form.getFieldValue('published') === 2 ? false : true }
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
                name="visivle_modal"
                form={form}
                initialValues={{
                    published: 1,
                    password: '',
                    appreciation: false,
                    commentEnabled: false,
                    recommend: false,
                    top: false
                }}
            >
                <Form.Item name="published">
                    <Radio.Group optionType="button" onChange={e => {
                        if (e.target.value !== 3) {
                            form.setFieldValue('password', '')
                        }
                        setRadio(e.target.value)
                    }}>
                        <Radio value={1}>公开</Radio>
                        <Radio value={2}>私密</Radio>
                        <Radio value={3}>密码保护</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="password" hidden={radio !== 3}>
                    <Input placeholder='请在此输入密码' />
                </Form.Item>
                <Row style={{ justifyContent: 'space-around' }} hidden={radio === 2}>
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
        </Modal >
    )
}))

export default DialogVisibleModal