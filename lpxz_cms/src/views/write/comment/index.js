// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'

// import { Divider, Switch, Table, Button, message, Popconfirm } from 'antd'
// import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

// // project imports
// import { getData, addCategory, editCategory, deleteCategoryById } from 'api/category'

// const Category = () => {
//     const [categoryList, setCategoryList] = useState([])

//     useEffect(() => {
//         getCategoryList()
//     }, [])

//     const getCategoryList = () => {
//         getData({ pageNum: 1, pageSize: 10 })
//             .then((res) => {
//                 if (res.code === 200) {
//                     message.success(res.msg)
//                     setCategoryList(res.data.list)
//                 } else {
//                     message.error(res.msg)
//                 }
//             })
//             .catch(() => {
//                 message.error('请求失败')
//             })
//     }

//     const handleEditMoment = (id) => {
//         // navigate(`/category/edit/${id}`)
//     }

//     const handleDeleteMoment = (id) => {
//         deleteCategoryById(id)
//             .then((res) => {
//                 if (res.code === 200) {
//                     message.success(res.msg)
//                     getCategoryList()
//                 } else {
//                     message.error(res.msg)
//                 }
//             })
//             .catch(() => {
//                 message.error('请求失败')
//             })
//     }

//     const [openDialog, setOpenDialog] = useState(false)
//     const [momentId, setMomentId] = useState(null)
//     const handleOpenDialog = (id) => {
//         setMomentId(id)
//         setOpenDialog(true)
//     }
//     const handleCloseDialog = () => {
//         setOpenDialog(false)
//     }

//     return (
//         <></>
//     )
// }

// export default Category
