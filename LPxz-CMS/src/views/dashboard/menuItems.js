import * as React from 'react'
import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader
} from '@mui/material'

import DashboardIcon from '@mui/icons-material/Dashboard'
import PendingIcon from '@mui/icons-material/Pending';
import LabelIcon from '@mui/icons-material/Label'
import ClassIcon from '@mui/icons-material/Class'
import AssignmentIcon from '@mui/icons-material/Assignment'
import EditIcon from '@mui/icons-material/Edit'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import FaceIcon from '@mui/icons-material/Face'

export const mainListItems = (
    <React.Fragment>
        <ListItemButton to="/">
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItemButton>
    </React.Fragment>
)

export const writeListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            写作管理
        </ListSubheader>
        <ListItemButton to="/article/create">
            <ListItemIcon>
                <EditIcon />
            </ListItemIcon>
            <ListItemText primary="写文章" />
        </ListItemButton>
        <ListItemButton to="/moment/create">
            <ListItemIcon>
                <EditIcon />
            </ListItemIcon>
            <ListItemText primary="写动态" />
        </ListItemButton>
        <ListItemButton to="/article/manage">
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="文章管理" />
        </ListItemButton>
        <ListItemButton to="/moment/manage">
            <ListItemIcon>
                <FaceIcon />
            </ListItemIcon>
            <ListItemText primary="动态管理" />
        </ListItemButton>
        <ListItemButton to="/category/manage">
            <ListItemIcon>
                <ClassIcon />
            </ListItemIcon>
            <ListItemText primary="分类管理" />
        </ListItemButton>
        <ListItemButton to="/tag/manage">
            <ListItemIcon>
                <LabelIcon />
            </ListItemIcon>
            <ListItemText primary="标签管理" />
        </ListItemButton>
        <ListItemButton to="/comment/manage">
            <ListItemIcon>
                <PendingIcon />
            </ListItemIcon>
            <ListItemText primary="评论管理" />
        </ListItemButton>
    </React.Fragment>
)

export const pageListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            页面管理
        </ListSubheader>
        <ListItemButton to="/moment/manage">
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="站点设置" />
        </ListItemButton>

    </React.Fragment>
)

export const systemListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            系统管理
        </ListSubheader>
        <ListItemButton to="/moment/manage">
            <ListItemIcon>
                <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText primary="定时任务" />
        </ListItemButton>

    </React.Fragment>
)