import {
    Link,
    Typography
} from '@mui/material'

const Copyright = (props) => (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © ' + new Date().getFullYear() + ' '}
        <Link color="inherit" href="http://lpxz.work/">
            LPxz's Blog
        </Link>
        {' | Powered by '}
        <Link color="inherit" href="https://reactjs.org/">
            React
        </Link>
        {' | Theme by '}
        <Link color="inherit" href="https://mui.com/zh/">
            Material UI
        </Link>
    </Typography>
)

export default Copyright