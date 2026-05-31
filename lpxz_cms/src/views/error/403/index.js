import { useNavigate } from "react-router-dom"
import { Button, Result } from "antd"

const NotAuth = () => {
    const navigate = useNavigate()
    const goHome = () => {
        navigate('/')
    }
    return (
        <Result
            status="403"
            title="403"
            subTitle="抱歉，无权限访问此页面."
            extra={
                <Button type="primary" onClick={goHome}>
                    回到首页
                </Button>
            }
        />
    )
}

export default NotAuth