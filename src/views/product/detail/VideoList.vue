<template>
  <div class="video-list-container">
    <!-- 操作栏 -->
    <div v-if="isNotEmpty" class="action-bar">
      <a-button type="primary" @click="showUploadModal">上传视频</a-button>
    </div>

    <!-- 视频列表 -->
    <div v-if="isNotEmpty" class="video-grid">
      <a-card
        v-for="video in props.videos"
        :key="video.id"
        class="video-card"
        :bodyStyle="{ padding: '12px' }"
      >
        <!-- 视频播放区域 -->
        <div class="video-player">
          <video :src="video.url" controls muted preload="metadata" class="video-element">
            您的浏览器不支持视频播放
          </video>
        </div>

        <!-- 视频标题 -->
        <div class="video-title" :title="video.title">
          <a-typography-text strong class="title-text">{{ video.title }}</a-typography-text>
        </div>

        <!-- 操作栏 -->
        <div class="video-actions">
          <a-space>
            <a-button size="small" @click="editTitle(video)">
              <template #icon> <EditOutlined /> </template>
              修改标题
            </a-button>
            <a-popconfirm
              title="确定要删除这个视频吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteVideo(video.id)"
            >
              <a-button size="small" danger>
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </div>
      </a-card>
    </div>

    <!-- 空状态 -->
    <a-empty v-else description="暂无视频" class="empty-state">
      <template #image>
        <VideoCameraAddOutlined style="font-size: 80px" />
      </template>
      <a-button type="primary" @click="showUploadModal">上传第一个视频</a-button>
    </a-empty>

    <!-- 上传视频弹窗 -->
    <a-modal
      v-model:open="uploadModalVisible"
      title="上传视频"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="uploading"
      @ok="handleUpload"
      @cancel="resetUploadForm"
    >
      <a-form :model="uploadForm" layout="vertical">
        <a-form-item
          label="视频标题"
          name="title"
          :rules="[{ required: true, message: '请输入视频标题' }]"
        >
          <a-input v-model:value="uploadForm.title" placeholder="请输入视频标题" />
        </a-form-item>
        <a-form-item
          label="选择视频文件"
          name="file"
          :rules="[{ required: true, message: '请选择视频文件' }]"
        >
          <a-upload
            v-model:file-list="uploadForm.fileList"
            :before-upload="beforeUpload"
            :max-count="1"
            accept="video/*"
            @remove="handleRemove"
          >
            <a-button>
              <template #icon>
                <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                  <path
                    d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163c-2.2-2.8-6.1-2.8-8.4 0L397.7 304.8c-4.1 5.2-.4 12.9 6.3 12.9z"
                  />
                  <path
                    d="M878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                  />
                </svg>
              </template>
              选择视频文件
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 修改标题弹窗 -->
    <a-modal
      v-model:open="editModalVisible"
      title="修改视频标题"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="updating"
      @ok="handleUpdateTitle"
      @cancel="resetEditForm"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item
          label="视频标题"
          name="title"
          :rules="[{ required: true, message: '请输入视频标题' }]"
        >
          <a-input v-model:value="editForm.title" placeholder="请输入视频标题" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { DeleteOutlined, EditOutlined, VideoCameraAddOutlined } from '@ant-design/icons-vue'
import type { UploadFile } from 'ant-design-vue'
import { uploadFile } from '@/api/upload'
import {
  type VideoInfo,
  addVideosToModelApi,
  deleteVideoFromModelApi,
  updateVideoTitleApi,
} from '@/api/product/models'

const props = defineProps<{
  videos: VideoInfo[]
}>()

const emit = defineEmits(['refresh'])

const route = useRoute()
const modelId = Number(route.params.id)

const isNotEmpty = computed(() => props.videos && props.videos.length > 0)
// 上传视频相关状态
const uploadModalVisible = ref(false)
const uploading = ref(false)
const uploadForm = reactive({
  title: '',
  fileList: [] as UploadFile[],
  file: null as File | null,
})

// 修改标题相关状态
const editModalVisible = ref(false)
const updating = ref(false)
const editForm = reactive({
  title: '',
  videoId: 0,
})

// 显示上传弹窗
const showUploadModal = () => {
  uploadModalVisible.value = true
}

// 重置上传表单
const resetUploadForm = () => {
  uploadForm.title = ''
  uploadForm.fileList = []
  uploadForm.file = null
  uploadModalVisible.value = false
}

// 文件上传前的处理
const beforeUpload = (file: File) => {
  const isVideo = file.type.startsWith('video/')
  if (!isVideo) {
    message.error('只能上传视频文件！')
    return false
  }

  const isLt100M = file.size / 1024 / 1024 < 100
  if (!isLt100M) {
    message.error('视频文件大小不能超过 100MB！')
    return false
  }

  uploadForm.file = file
  return false // 阻止自动上传
}

// 移除文件
const handleRemove = () => {
  uploadForm.file = null
}

// 处理视频上传
const handleUpload = async () => {
  if (!uploadForm.title.trim()) {
    message.error('请输入视频标题')
    return
  }

  if (!uploadForm.file) {
    message.error('请选择视频文件')
    return
  }

  try {
    uploading.value = true

    // 上传文件
    const uploadResult = await uploadFile(uploadForm.file)

    // 绑定视频到型号
    await addVideosToModelApi(modelId, [
      {
        id: uploadResult.id,
        title: uploadForm.title.trim(),
      },
    ])

    message.success('视频上传成功！')
    resetUploadForm()
    emit('refresh')
  } catch (error) {
    console.error('上传失败:', error)
    message.error('上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

// 编辑标题
const editTitle = (video: VideoInfo) => {
  editForm.title = video.title
  editForm.videoId = video.id
  editModalVisible.value = true
}

// 重置编辑表单
const resetEditForm = () => {
  editForm.title = ''
  editForm.videoId = 0
  editModalVisible.value = false
}

// 处理标题更新
const handleUpdateTitle = async () => {
  if (!editForm.title.trim()) {
    message.error('请输入视频标题')
    return
  }

  try {
    updating.value = true

    await updateVideoTitleApi(modelId, editForm.videoId, {
      title: editForm.title.trim(),
    })

    message.success('标题修改成功！')
    resetEditForm()
    emit('refresh')
  } catch (error) {
    console.error('修改失败:', error)
    message.error('修改失败，请重试')
  } finally {
    updating.value = false
  }
}

// 删除视频
const deleteVideo = async (videoId: number) => {
  try {
    await deleteVideoFromModelApi(modelId, videoId)
    message.success('视频删除成功！')
    emit('refresh')
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败，请重试')
  }
}
</script>

<style scoped lang="scss">
.video-list-container {
  .action-bar {
    margin-bottom: 24px;
    display: flex;
    justify-content: flex-start;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;

    .video-card {
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .video-player {
        width: 100%;
        height: 180px;
        background: #f5f5f5;
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 12px;

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
        }
      }

      .video-title {
        margin-bottom: 12px;
        min-height: 22px;
        display: flex;
        align-items: center;

        .title-text {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
      }

      .video-actions {
        display: flex;
        justify-content: center;
      }
    }
  }

  .empty-state {
    margin: 60px 0;
  }
}
</style>
