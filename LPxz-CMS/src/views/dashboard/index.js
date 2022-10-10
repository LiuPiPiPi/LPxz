import * as React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
    IconButton,
    Badge,
    Container,
    Grid,
    Paper,
    Popover
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'

import { mainListItems, writeListItems, pageListItems, systemListItems } from './menuItems'
import LOGO_IMG from 'assets/img/logo.png'

import Copyright from 'component/Copyright'
import message from 'utils/message'

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
)

const mdTheme = createTheme()

function DashboardContent() {
    const navigate = useNavigate()

    const [open, setOpen] = React.useState(true)
    const toggleDrawer = () => {
        setOpen(!open)
    }

    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const popoverOpen = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    const handleLogout = () => {
        window.localStorage.clear()
        navigate("login", { replace: true })
        message.success({ content: '退出成功' })
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Popover
                id={id}
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemText primary="退出登录" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Popover>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            后台管理面板
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon onClick={handleClick} />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: [1]
                        }}
                    >

                        <img src={LOGO_IMG} style={{ width: 60 }} alt="logo" />
                        <strong>LPxz's Blog</strong>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        {mainListItems}
                        <Divider sx={{ my: 1 }} />
                        {writeListItems}
                        <Divider sx={{ my: 1 }} />
                        {pageListItems}
                        <Divider sx={{ my: 1 }} />
                        {systemListItems}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                        <Outlet />
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider >
    )
}

export default function Dashboard() {
    return <DashboardContent />
}