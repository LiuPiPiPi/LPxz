<template>
	<!--私密文章密码对话框-->
	<el-dialog title="请输入受保护文章密码" :width="dialogWidth"
		v-model="articlePasswordDialogVisible" :lock-scroll="false"
		:before-close="articlePasswordDialogClosed">
		<!--内容主体-->
		<el-form :model="articlePasswordForm" :rules="formRules" ref="formRef" label-width="80px" @submit.prevent>
			<el-form-item label="密码：" prop="password">
				<el-input v-model="articlePasswordForm.password" />
			</el-form-item>
		</el-form>
		<!--底部-->
		<template v-slot:footer>
			<span>
				<el-button @click="articlePasswordDialogClosed">取 消</el-button>
				<el-button type="primary" @click="submitArticlePassword">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { mapState } from "vuex"
import { SET_ARTICLE_PASSWORD_DIALOG_VISIBLE } from "../../store/mutations-types"
import { checkArticlePassword } from "@/api/article"
import { setArticleToken } from '@/util/localStorageToken'
import isMobile from '@/util/isMobile'

export default {
	name: "ArticlePasswordDialog",
	computed: {
		...mapState(['articlePasswordDialogVisible', 'articlePasswordForm'])
	},
	mounted() {
		this.dialogWidth = isMobile() ? '90%' : '30%'
	},
	data() {
		return {
			formRules: {
				password: [{ required: true, message: '请输入密码', trigger: 'change' }]
			},
			dialogWidth: '30%'
		}
	},
	methods: {
		articlePasswordDialogClosed() {
			this.$refs.formRef.resetFields()
			this.$store.commit(SET_ARTICLE_PASSWORD_DIALOG_VISIBLE, false)
		},
		submitArticlePassword() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					checkArticlePassword(this.articlePasswordForm).then(res => {
						if (res.code === 200) {
							this.msgSuccess(res.msg)
							// 设置 localStorage 过期时间，单位为秒
							setArticleToken(`article${this.articlePasswordForm.articleId}`, res.data, 60 * 60 * 24 * 7)
							this.$router.push(`/article/${this.articlePasswordForm.articleId}`)
							this.articlePasswordDialogClosed()
						} else {
							this.msgError(res.msg)
						}
					}).catch(() => {
						this.msgError("请求失败")
					})
				}
			})
		}
	}
}
</script>

<style scoped>
/* .el-dialog__wrapper .el-dialog__body {
	padding: 20px 20px 10px;
}

.el-dialog__wrapper .el-dialog__body .deleteForm .errorTip {
	color: red;
	font-size: 14px;
	line-height: 20px;
	margin: 5px auto;
}

.el-dialog__wrapper .el-dialog__body .deleteForm .el-form-item {
	margin: 0;
}

.el-dialog__wrapper .el-dialog__body .deleteForm .el-form-item .el-form-item__label {
	width: 90px;
}

.el-dialog__wrapper .el-dialog__body .deleteForm .el-form-item .el-select,
.el-dialog__wrapper .el-dialog__body .deleteForm .el-form-item .el-input {
	width: 250px;
}

.el-dialog__wrapper .el-dialog__footer {
	padding-bottom: 15px;
	padding-top: 5px;
} */
</style>