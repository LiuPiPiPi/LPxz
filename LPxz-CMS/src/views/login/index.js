import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    Typography,
    Container
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import Copyright from 'component/Copyright'
import { login } from 'api/login'
import message from 'utils/message'

const theme = createTheme()

export default function SignIn() {
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        let value = ({
            username: data.get('username'),
            password: data.get('password'),
        })
        try {
            // if (scriptedRef.current) {
            //     setStatus({ success: true });
            //     setSubmitting(true);
            // }
            login(value).then((res) => {
                if (res.code === 200) {
                    message.success({ content: res.msg })
                    window.localStorage.setItem('token', res.data.token)
                    window.localStorage.setItem('user', JSON.stringify(res.data.user))
                    navigate('/')
                } else {
                    message.error({ content: res.msg })
                }
            })
        } catch (err) {
            console.error(err)
            // if (scriptedRef.current) {
            //     setStatus({ success: false })
            //     setErrors({ submit: err.message })
            //     setSubmitting(false)
            // }
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        登&nbsp;&nbsp;录
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="用户名"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={"Admin"}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="密码"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={"123456"}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="记住我"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            登&nbsp;&nbsp;录
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    {"忘记密码？"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="register" variant="body2">
                                    {"还没有账号？注册"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    )
}
