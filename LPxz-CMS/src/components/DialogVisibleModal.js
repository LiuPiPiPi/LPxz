import { useEffect, useState } from 'react'
import { Modal, Form, Radio, Input, Switch, Row } from 'antd'

const DialogVisibleModal = props => {
    const [form] = Form.useForm()
    const { open } = props

    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        setModalOpen(open)
    }, [open])

    const handleCloseDialog = () => {
        setModalOpen(false)
    }

    return (
        <Modal
            open={modalOpen}
            okText="保存"
            // onOk={handleDialogSubmit}
            onCancel={handleCloseDialog}
        >
            <Form
                name="visivle_modal"
                form={form}
                initialValues={{
                    published: 1
                }}
            >
                <Form.Item name="published">
                    <Radio.Group>
                        <Radio value={1}>公开</Radio>
                        <Radio value={2}>私密</Radio>
                        <Radio value={3}>密码保护</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="password">
                    <Input />
                </Form.Item>
                <Row style={{ justifyContent: 'space-around' }}>
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
}

export default DialogVisibleModal