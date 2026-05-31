<template>
	<!--标签云-->
	<div class="ui segments m-box">
		<div class="ui secondary segment"><i class="folder open icon"></i>文章分类</div>
		<div class="ui yellow segment m-padding-small">
			<div class="ui middle aligned divided list">
				<div class="item" v-for="(category, index) in categoryList" :key="index">
					<!-- 显示分类下面有多少文章 -->
					<a class="ui circular label right floated tiny">{{ categoryNumList[index] }}</a>
					<router-link :to="`/category/${category.name}`" class="content">
						{{ category.name }}
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "articleCategories",
	props: {
		categoryList: {
			type: Array,
			required: true
		},
		categoryNumList: {
			type: Array,
			required: true
		},
	},
}
</script>

<style scoped>
.secondary.segment {
	padding: 10px;
}

.m-padding-small {
	padding: 7px;
}

.label {
	margin: 3px !important;
}
</style>