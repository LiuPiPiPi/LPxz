import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'component/cards/MainCard';
import { getMomentListByQuery, updatePublished, deleteMomentById } from 'api/moment';
import message from 'utils/message';
import formatTime from 'utils/format-time';

function createData(name, published, calories, fat, carbs, protein) {
    return { name, published, calories, fat, carbs, protein };
}

const Moment = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [momentList, setMomentList] = useState([]);

    const getMomentList = () => {
        getMomentListByQuery({ pageNum: 1, pageSize: 50 })
            .then((res) => {
                if (res.code === 200) {
                    message.success({ content: res.msg });
                    setMomentList(res.data.list);
                } else {
                    message.error({ content: res.msg });
                }
            })
            .catch(() => {
                message.error({ content: '请求失败' });
            });
    };

    useEffect(() => {
        getMomentList();
    }, []);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - momentList.length) : 0;
    const handleChangePage = (event, newPage) => {
        console.log(newPage);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditPublished = (row) => {
        updatePublished(row.id, row.published)
            .then((res) => {
                if (res.code === 200) {
                    message.success({ content: res.msg });
                } else {
                    message.error({ content: res.msg });
                }
            })
            .catch(() => {
                message.error({ content: '请求失败' });
            });
    };

    const handleEditMoment = (id) => {
        navigate(`/moment/edit/${id}`);
    };

    const handleDeleteMoment = (id) => {
        deleteMomentById(id)
            .then((res) => {
                if (res.code === 200) {
                    message.success({ content: res.msg });
                    getMomentList();
                } else {
                    message.error({ content: res.msg });
                }
            })
            .catch(() => {
                message.error({ content: '请求失败' });
            });
    };

    const [openDialog, setOpenDialog] = useState(false);
    const [momentId, setMomentId] = useState(null);
    const handleOpenDialog = (id) => {
        setMomentId(id);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <MainCard title="动态管理">
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
                            handleDeleteMoment(momentId);
                            handleCloseDialog();
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
                            <TableCell align="center">内容</TableCell>
                            <TableCell align="center" width={100}>
                                发布状态
                            </TableCell>
                            <TableCell align="center" width={100}>
                                点赞数
                            </TableCell>
                            <TableCell align="center" width={150}>
                                创建时间
                            </TableCell>
                            <TableCell align="center" width={200}>
                                操作
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0 ? momentList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : momentList).map(
                            (moment, index) => (
                                <TableRow key={moment.id}>
                                    <TableCell align="center" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="center">{moment.content}</TableCell>
                                    <TableCell align="center">
                                        <Switch checked={moment.published} size="small" onChange={() => handleEditPublished(moment)} />
                                    </TableCell>
                                    <TableCell align="center">{moment.likes}</TableCell>
                                    <TableCell align="center">{formatTime(moment.createTime)}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="outlined" size="small" onClick={() => handleEditMoment(moment.id)}>
                                            编辑
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button variant="outlined" size="small" color="error" onClick={() => handleOpenDialog(moment.id)}>
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
                                count={momentList.length}
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
    );
};

export default Moment;
