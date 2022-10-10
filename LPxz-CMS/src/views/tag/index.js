import { useState, useEffect } from 'react'

// material-ui
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainCard from 'component/cards/MainCard'
import { getData, addTag, editTag, deleteTagById } from 'api/tag'
import message from 'utils/message'

const Tag = () => {
    const theme = useTheme()

    const [tagList, setTagList] = useState([])

    const getTagList = () => {
        getData({ pageNum: 1, pageSize: 10 })
            .then((res) => {
                if (res.code === 200) {
                    message.success({ content: res.msg })
                    setTagList(res.data.list)
                } else {
                    message.error({ content: res.msg })
                }
            })
            .catch(() => {
                message.error({ content: '请求失败' })
            })
    }

    useEffect(() => {
        getTagList()
    }, [])

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tagList.length) : 0
    const handleChangePage = (event, newPage) => {
        console.log(newPage)
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleEditMoment = (id) => {
        // navigate(`/tag/edit/${id}`)
    }

    const handleDeleteMoment = (id) => {
        deleteTagById(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success({ content: res.msg })
                    getTagList()
                } else {
                    message.error({ content: res.msg })
                }
            })
            .catch(() => {
                message.error({ content: '请求失败' })
            })
    }

    const [openDialog, setOpenDialog] = useState(false)
    const [momentId, setMomentId] = useState(null)
    const handleOpenDialog = (id) => {
        setMomentId(id)
        setOpenDialog(true)
    }
    const handleCloseDialog = () => {
        setOpenDialog(false)
    }
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <MainCard title="标签管理">
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullScreen={fullScreen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'确认删除此标签吗?'}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>取消</Button>
                    <Button
                        onClick={() => {
                            handleDeleteMoment(momentId)
                            handleCloseDialog()
                        }}
                        color="error"
                    >
                        删除
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" width={80}>
                                序号
                            </TableCell>
                            <TableCell align="center">
                                名称
                            </TableCell>
                            <TableCell align="center">
                                颜色
                            </TableCell>
                            <TableCell align="center" width={300}>
                                操作
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0 ? tagList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : tagList).map(
                            (tag, index) => (
                                <TableRow key={tag.id}>
                                    <TableCell align="center" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="center">{tag.name}</TableCell>
                                    <TableCell align="center">{tag.color}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="outlined" size="small" onClick={() => handleEditMoment(tag.id)}>
                                            编辑
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button variant="outlined" size="small" color="error" onClick={() => handleOpenDialog(tag.id)}>
                                            删除
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 25]}
                                count={tagList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                labelRowsPerPage="每页行数："
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </MainCard>
    )
}

export default Tag
