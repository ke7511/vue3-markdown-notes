<script setup lang="ts">
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { ref, nextTick } from 'vue'
import dayjs from 'dayjs'
import { useNoteStore } from '@/stores/note'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'

const noteStore = useNoteStore()
const sidebarStore = useSidebarStore()

// Props
defineProps<{
  note: {
    id: string
    title: string
    createdTime: number
  }
  active: boolean
}>()

// 编辑状态
const editingNoteId = ref<string | null>(null)
const editingTitle = ref('')
const editingRef = ref<InstanceType<typeof ElInput> | null>(null)

// 开始编辑
function startEditing(noteId: string, currentTitle: string) {
  editingNoteId.value = noteId
  editingTitle.value = currentTitle
  nextTick(() => editingRef.value?.focus())
}

// 结束编辑
function endEditing() {
  if (editingNoteId.value && editingTitle.value.trim() !== '') {
    noteStore.updateNoteTitle(editingNoteId.value, editingTitle.value.trim())
  }
  editingNoteId.value = null
}

// 删除笔记
const route = useRoute()
const router = useRouter()
function deleteNote(noteId: string) {
  ElMessageBox.confirm('您确定要删除这篇笔记吗？此操作不可撤销。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await noteStore.deleteNote(noteId)
    if (route.params.noteId === noteId) {
      if (noteStore.noteList.length > 0) {
        router.push(`/${noteStore.noteList[0].id}`)
      } else {
        router.push('/')
      }
    }
    ElMessage.success('删除成功')
  })
}

// 跳转到笔记
function navigateToNote(noteId: string) {
  router.push(`/${noteId}`)
  // 移动模式切换笔记后关闭抽屉
  if (sidebarStore.isMobile) {
    sidebarStore.closeSidebar()
  }
}
</script>

<template>
  <div
    class="note-item"
    :class="{ 'is-active': active }"
    @click="navigateToNote(note.id)"
  >
    <!-- 标题部分 -->
    <div class="note-up">
      <el-input
        v-if="editingNoteId === note.id"
        ref="editingRef"
        v-model="editingTitle"
        size="small"
        @blur="endEditing"
        @keyup.enter="endEditing"
      />
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
        @click.stop="startEditing(note.id, note.title)"
      />
    </div>

    <!-- 日期及删除 -->
    <div class="note-under">
      <div class="note-date">
        {{ dayjs(note.createdTime).format('YYYY-MM-DD') }}
      </div>
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
</template>

<style lang="scss" scoped>
.note-item {
  background-color: var(--bg-color-light);
  display: block;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 5px;
  border-left: 3px solid transparent;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.15s ease;

  &:hover {
    background-color: var(--primary-color-light);
    color: var(--primary-color);

    :deep(.delete-button) {
      opacity: 1;
    }
  }

  &.is-active {
    background-color: var(--primary-color-lighter);
    color: var(--primary-color);
    font-weight: 600;
    border-left-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.15);
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
      color: #a0a0a0;
    }
  }

  .delete-button {
    flex-shrink: 0;
    margin-top: 4px;
    opacity: 0;
    transition: opacity 0.2s;
    color: #909399;
  }
}
</style>
