import { useNavigate } from "react-router-dom"
import { Button, Result } from "antd"

const NotNetwork = () => {
    const navigate = useNavigate()
    const goHome = () => {
        navigate('/')
    }
    return (
        <Result
            status="500"
            title="500"
            subTitle="抱歉，出错了."
            extra={
                <Button type="primary" onClick={goHome}>
                    回到首页
                </Button>
            }
        />
    )
}

export default NotNetwork