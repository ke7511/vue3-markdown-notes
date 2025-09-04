<script setup lang="ts">
import { useNoteStore } from '@/stores/note'
import { Close, Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type ElInput } from 'element-plus'
import { nextTick, ref, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const noteStore = useNoteStore()

// 笔记列表宽度
defineProps({
  sidebarSize: {
    type: Number,
    default: 0
  }
})

// 编辑笔记
const editingNoteId = ref<string | null>()
const editingTitle = ref('')
const editingRef = ref<InstanceType<typeof ElInput> | null>(null)

// 开始编辑
const startEditing = async (noteId: string, currentTitle: string) => {
  editingNoteId.value = noteId
  editingTitle.value = currentTitle
  nextTick(() => {
    editingRef.value?.focus()
  })
}
// 结束编辑
const endEditing = () => {
  if (editingNoteId.value && editingTitle.value.trim() !== '') {
    noteStore.updateNoteTitle(editingNoteId.value, editingTitle.value.trim())
  }
  editingNoteId.value = null
}

// 删除笔记
const route = useRoute()
const router = useRouter()
const deleteNote = (id: string) => {
  ElMessageBox.confirm('您确定要删除这篇笔记吗？此操作不可撤销。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await noteStore.deleteNote(id)
    if (route.params.noteId === id) {
      if (noteStore.noteList.length > 0) {
        router.push(`/${noteStore.noteList[0].id}`)
      } else {
        router.push('/')
      }
    }
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  })
}

// 关闭笔记列表
const emit = defineEmits(['close-sidebar'])

const closeSidebar = () => {
  emit('close-sidebar')
}
// 新增笔记
const handleCreateNote = async () => {
  const newNoteId = await noteStore.createNote()
  router.push(`/${newNoteId}`)
}
</script>

<template>
  <!-- 侧边栏头部 -->
  <div class="sidebar-header">
    <div class="note-create">
      <h3>笔记列表</h3>
      <!-- 2. 添加我们的新建按钮 -->
      <el-button
        v-if="sidebarSize > 140"
        :icon="Plus"
        text
        circle
        title="新建笔记"
        @click="handleCreateNote"
      />
    </div>
    <el-button
      v-if="sidebarSize > 120"
      :icon="Close"
      text
      circle
      title="关闭笔迹列表"
      @click="closeSidebar"
    >
    </el-button>
  </div>
  <!-- 笔记列表内容 -->
  <div class="note-content">
    <div
      v-for="note in noteStore.noteList"
      :key="note.id"
      class="note-item"
      :class="{
        'is-active': note.id === $route.params.noteId
      }"
      @click="() => $router.push(`/${note.id}`)"
    >
      <!-- 标题部分：根据是否在编辑状态，显示输入框或文本 -->
      <div class="note-up">
        <el-input
          v-if="editingNoteId === note.id"
          :ref="
            (el: any) => {
              if (el) editingRef = el
            }
          "
          v-model="editingTitle"
          size="small"
          @blur="endEditing"
          @keyup.enter="endEditing"
        ></el-input>
        <div
          v-else
          class="note-title"
          @dblclick.prevent="startEditing(note.id, note.title)"
        >
          {{ note.title }}
        </div>
        <el-button
          class="delete-button"
          :icon="Edit"
          text
          circle
          size="small"
          title="编辑笔记标题"
          @click="startEditing(note.id, note.title)"
        ></el-button>
      </div>
      <!-- 日期及删除 -->
      <div class="note-under">
        <div class="note-date">
          {{ new Date(note.createdTime).toLocaleDateString() }}
        </div>
        <!-- 删除功能 -->
        <el-button
          class="delete-button"
          :icon="Delete"
          text
          circle
          size="small"
          title="删除笔记"
          @click.stop="deleteNote(note.id)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-header {
  height: 32px;
  padding: 10px 10px;
  background-color: #f5f7f6;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .note-create {
    display: flex;
    align-items: center;
  }
}
.note-content {
  // 滚动条样式
  scrollbar-width: thin;
  scrollbar-color: #a8a8a8 #f5f7f6;
  flex: 1;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 10px 10px 0;
  .note-item {
    background-color: #fafafa;
    display: block;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    margin-bottom: 5px;
    transition: background-color 0.2s; // 添加一个过渡效果

    &:hover {
      background-color: #e8f2ff; // 柔和的浅蓝
      color: #1677ff; // 比较自然的蓝色作为点缀

      :deep(.delete-button) {
        opacity: 1;
      }
    }

    // & 代表父选择器 .note-item
    // .is-active 是 vue-router 自动添加的类
    &.is-active {
      background-color: #dceeff;
      color: #1677ff;
      font-weight: 600;
    }

    .note-up {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .note-title {
        line-height: 20px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .note-under {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: -8px;

      .note-date {
        font-size: 12px;
        color: #a0a0a0; // 比之前 #909399 更柔和
      }
    }
    .delete-button {
      flex-shrink: 0;
      margin-top: 4px;
      opacity: 0; // 默认隐藏
      transition: opacity 0.2s;
      color: #909399; // 默认按钮更低调
    }
  }
}
</style>
