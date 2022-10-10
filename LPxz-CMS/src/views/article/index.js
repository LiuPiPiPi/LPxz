import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
    Switch,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainCard from 'component/cards/MainCard'
import { getDataByQuery, deleteById, updateTop, updateRecommend, updateVisibility } from 'api/article'
import message from 'utils/message'
import formatTime from 'utils/format-time'

function createData(name, published, calories, fat, carbs, protein) {
    return { name, published, calories, fat, carbs, protein }
}

const Article = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    const [articleList, setArticleList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [isTop, setIsTop] = useState(false)
    const [isRecommend, setIsRecommend] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [openDialog, setOpenDialog] = useState(false)
    const [momentId, setMomentId] = useState(null)

    useEffect(() => {
        getArticleList()
    }, [])

    const getArticleList = () => {
        getDataByQuery({ title: '', categoryId: null, pageNum: 1, pageSize: 50 })
            .then((res) => {
                if (res.code === 200) {
                    message.success({ content: res.msg })
                    setArticleList(res.data.blogs.list)
                    setCategoryList(res.data.categories.list)
                    // this.total = res.data.blogs.total;
                } else {
                    message.error({ content: res.msg })
                }
            })
            .catch(() => {
                message.error({ content: '请求失败' })
            })
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - articleList.length) : 0
    const handleChangePage = (event, newPage) => {
        console.log(newPage)
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleTopChanged = (row) => {
        updateTop(row.id, !isTop).then(res => {
            if (res.code === 200) {
                message.success({ content: res.msg })
                setIsTop(!isTop)
            } else {
                message.error({ content: res.msg })
            }
        }).catch(() => {
            message.error({ content: '请求失败' })
        })
    }

    const handleRecommendChanged = (row) => {
        updateRecommend(row.id, !isRecommend).then(res => {
            if (res.code === 200) {
                message.success({ content: res.msg })
                setIsRecommend(!isRecommend)
            } else {
                message.error({ content: res.msg })
            }
        }).catch(() => {
            message.error({ content: '请求失败' })
        })
    }

    const handleEditMoment = (id) => {
        navigate(`/moment/edit/${id}`)
    }

    const handleDeleteMoment = (id) => {
        // deleteMomentById(id)
        //     .then((res) => {
        //         if (res.code === 200) {
        //             message.success({ content: res.msg })
        //             getArticleList()
        //         } else {
        //             message.error({ content: res.msg })
        //         }
        //     })
        //     .catch(() => {
        //         message.error({ content: '请求失败' })
        //     })
    }

    const handleOpenDialog = (id) => {
        setMomentId(id)
        setOpenDialog(true)
    }
    const handleCloseDialog = () => {
        setOpenDialog(false)
    }
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <MainCard title="文章管理">
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullScreen={fullScreen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'确认删除这条动态吗?'}</DialogTitle>
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
                                标题
                            </TableCell>
                            <TableCell align="center" width={100}>
                                分类
                            </TableCell>
                            <TableCell align="center" width={50}>
                                置顶
                            </TableCell>
                            <TableCell align="center" width={50}>
                                推荐
                            </TableCell>
                            <TableCell align="center" width={100}>
                                可见性
                            </TableCell>
                            <TableCell align="center" width={150}>
                                创建时间
                            </TableCell>
                            <TableCell align="center" width={150}>
                                最近更新
                            </TableCell>
                            <TableCell align="center" width={200}>
                                操作
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0 ? articleList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : articleList).map(
                            (article, index) => (
                                <TableRow key={article.id}>
                                    <TableCell align="center" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="center">{article.title}</TableCell>
                                    <TableCell align="center">{article.category.name}</TableCell>
                                    <TableCell align="center">
                                        <Switch checked={isTop} size="small" onChange={() => handleTopChanged(article)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch checked={isRecommend} size="small" onChange={() => handleRecommendChanged(article)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        {article.published ? (article.password !== '' ? '密码保护' : '公开') : '私密'}
                                    </TableCell>
                                    <TableCell align="center">{formatTime(article.createTime)}</TableCell>
                                    <TableCell align="center">{formatTime(article.updateTime)}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="outlined" size="small" onClick={() => handleEditMoment(article.id)}>
                                            编辑
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button variant="outlined" size="small" color="error" onClick={() => handleOpenDialog(article.id)}>
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
                                count={articleList.length}
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

export default Article
