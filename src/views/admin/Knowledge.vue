<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'

const queryForm = reactive({
  title: '',
  category: '',
  status: ''
})

const categories = ['心理科普', '情绪管理', '压力应对', '人际关系']
const statusOptions = ['已发布', '已下线']

const categoryTypeMap = {
  心理科普: 'primary',
  情绪管理: 'success',
  压力应对: 'warning',
  人际关系: 'danger'
}

const allData = [
  { id: 1, title: '如何应对日常生活中的焦虑情绪', category: '情绪管理', author: '李医生', views: 3280, time: '2026-09-12 10:24', status: '已发布' },
  { id: 2, title: '认识抑郁症：早期信号与求助指南', category: '心理科普', author: '王老师', views: 5120, time: '2026-09-11 15:02', status: '已发布' },
  { id: 3, title: '职场压力管理的五个实用技巧', category: '压力应对', author: '张顾问', views: 2890, time: '2026-09-10 09:45', status: '已发布' },
  { id: 4, title: '如何与家人建立良好的沟通关系', category: '人际关系', author: '陈咨询师', views: 1760, time: '2026-09-09 14:30', status: '已发布' },
  { id: 5, title: '正念冥想入门：每天十分钟', category: '情绪管理', author: '李医生', views: 4450, time: '2026-09-08 11:18', status: '已发布' },
  { id: 6, title: '青少年心理健康：家长需要知道的事', category: '心理科普', author: '王老师', views: 3980, time: '2026-09-07 16:40', status: '已下线' },
  { id: 7, title: '考试焦虑的应对策略', category: '压力应对', author: '张顾问', views: 2340, time: '2026-09-06 10:05', status: '已发布' },
  { id: 8, title: '亲密关系中的边界感', category: '人际关系', author: '陈咨询师', views: 1890, time: '2026-09-05 13:52', status: '已发布' },
  { id: 9, title: '睡眠与心理健康的关系', category: '心理科普', author: '李医生', views: 3560, time: '2026-09-04 09:20', status: '已发布' },
  { id: 10, title: '情绪日记：记录你的内心世界', category: '情绪管理', author: '王老师', views: 2980, time: '2026-09-03 15:36', status: '已发布' },
  { id: 11, title: '面对挫折，如何重建自信', category: '压力应对', author: '张顾问', views: 1670, time: '2026-09-02 11:08', status: '已发布' },
  { id: 12, title: '孤独感：认识并接纳它', category: '人际关系', author: '陈咨询师', views: 1450, time: '2026-09-01 14:12', status: '已下线' }
]

const tableData = ref([...allData])
const currentPage = ref(1)
const pageSize = ref(10)

function categoryType(cat) {
  return categoryTypeMap[cat] || 'info'
}

function handleSearch() {
  tableData.value = allData.filter((row) => {
    const matchTitle = !queryForm.title || row.title.includes(queryForm.title)
    const matchCat = !queryForm.category || row.category === queryForm.category
    const matchStatus = !queryForm.status || row.status === queryForm.status
    return matchTitle && matchCat && matchStatus
  })
  currentPage.value = 1
}

function handleReset() {
  queryForm.title = ''
  queryForm.category = ''
  queryForm.status = ''
  tableData.value = [...allData]
  currentPage.value = 1
}

function handleAdd() {
  ElMessage.info('新增文章功能开发中')
}

function handleEdit(row) {
  ElMessage.info(`编辑文章：${row.title}`)
}

function handleOffline(row) {
  ElMessageBox.confirm(`确定将「${row.title}」下线吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      row.status = '已下线'
      ElMessage.success('已下线')
    })
    .catch(() => {})
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定删除「${row.title}」吗？此操作不可恢复。`, '警告', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
    .then(() => {
      tableData.value = tableData.value.filter((item) => item.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="knowledge">
    <div class="search-card">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="文章标题">
          <el-input
            v-model="queryForm.title"
            placeholder="请输入文章标题"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="queryForm.category"
            placeholder="请选择分类"
            clearable
            style="width: 160px"
          >
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 140px"
          >
            <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" :icon="Plus" class="add-btn" @click="handleAdd">
        新增
      </el-button>
    </div>

    <div class="table-card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="title" label="文章标题" min-width="240" show-overflow-tooltip />
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="categoryType(row.category)" effect="light">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="views" label="阅读量" width="100" />
        <el-table-column prop="time" label="发布时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link @click="handleOffline(row)">下线</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="tableData.length"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.search-form {
  flex: 1;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

.add-btn {
  flex-shrink: 0;
}

.table-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
