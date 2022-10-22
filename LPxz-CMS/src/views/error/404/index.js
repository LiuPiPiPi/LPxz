import { useNavigate } from "react-router-dom"
import { Button, Result } from "antd"

const NotFound = () => {
    const navigate = useNavigate()
    const goHome = () => {
        navigate('/')
    }
    return (
        <Result
            status="404"
            title="404"
            subTitle="很抱歉，您查找的界面不存在."
            extra={
                <Button type="primary" onClick={goHome}>
                    回到首页
                </Button>
            }
        />
    )
}

export default NotFound