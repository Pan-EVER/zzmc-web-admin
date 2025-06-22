<template>
  <div class="home-manage-container">
    <a-spin :spinning="loading">
      <a-tabs v-model:activeKey="activeTabKey">
        <!-- 企业内容块 -->
        <a-tab-pane key="company" tab="企业内容块">
          <a-form :model="companyForm" layout="vertical">
            <a-row :gutter="20">
              <a-col :span="12" v-for="(item, index) in companyForm.paragraphs" :key="item.id">
                <a-form-item :label="`段落${index + 1}`">
                  <a-textarea v-model:value="item.content" :rows="4" placeholder="请输入文本内容" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type="primary" @click="saveCompanyContent">保存</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 为什么选择我们内容块 -->
        <a-tab-pane key="why_us" tab="为什么选择我们内容块">
          <a-form :model="whyUsForm" layout="vertical">
            <a-row>
              <a-col :span="12" v-for="(item, index) in whyUsForm.items" :key="item.id">
                <div class="why-us-item">
                  <a-divider>第{{ index + 1 }}部分</a-divider>
                  <a-form-item :label="`标题${index + 1}`">
                    <a-input v-model:value="item.title" placeholder="请输入标题" />
                  </a-form-item>
                  <a-form-item :label="`描述${index + 1}`">
                    <a-textarea
                      v-model:value="item.content"
                      :rows="3"
                      placeholder="请输入描述内容"
                    />
                  </a-form-item>
                </div>
              </a-col>
            </a-row>

            <a-form-item>
              <a-button type="primary" @click="saveWhyUsContent">保存</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 感谢内容块 -->
        <a-tab-pane key="thanks" tab="感谢内容块">
          <a-form :model="thanksForm" layout="vertical">
            <a-row :gutter="20">
              <a-col :span="12" v-for="(item, index) in thanksForm.paragraphs" :key="item.id">
                <a-form-item :label="`段落${index + 1}`">
                  <a-textarea v-model:value="item.content" :rows="4" placeholder="请输入文本内容" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type="primary" @click="saveThanksContent">保存</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { getAllHomepageContent, updateHomepageContent } from '@/api/home-manage'
import type { HomepageItem } from '@/api/home-manage'

// 加载状态
const loading = ref(false)

// 当前激活的标签页
const activeTabKey = ref('company')

// 企业内容表单数据
const companyForm = reactive({
  paragraphs: [] as HomepageItem[],
})

// 为什么选择我们表单数据
const whyUsForm = reactive({
  items: [] as HomepageItem[],
})

// 感谢内容表单数据
const thanksForm = reactive({
  paragraphs: [] as HomepageItem[],
})

// 获取所有首页内容
const fetchAllContent = async () => {
  loading.value = true
  try {
    const response = await getAllHomepageContent()

    // 处理企业内容块数据
    companyForm.paragraphs = response
      .filter((item) => item.type === 'company')
      .sort((a, b) => a.order - b.order)

    // 处理为什么选择我们内容块数据
    whyUsForm.items = response
      .filter((item) => item.type === 'why_us')
      .sort((a, b) => a.order - b.order)

    // 处理感谢内容块数据
    thanksForm.paragraphs = response
      .filter((item) => item.type === 'thanks')
      .sort((a, b) => a.order - b.order)
  } catch (error) {
    message.error('获取首页内容失败')
    console.error('获取首页内容失败:', error)
  } finally {
    loading.value = false
  }
}

// 保存企业内容
const saveCompanyContent = async () => {
  loading.value = true
  try {
    const updatePromises = companyForm.paragraphs.map((item) => {
      return updateHomepageContent(item.id, {
        content: item.content,
      })
    })

    await Promise.all(updatePromises)
    message.success('企业内容保存成功')
  } catch (error) {
    message.error('保存企业内容失败')
    console.error('保存企业内容失败:', error)
  } finally {
    loading.value = false
  }
}

// 保存为什么选择我们内容
const saveWhyUsContent = async () => {
  loading.value = true
  try {
    const updatePromises = whyUsForm.items.map((item) => {
      return updateHomepageContent(item.id, {
        title: item.title,
        content: item.content,
      })
    })

    await Promise.all(updatePromises)
    message.success('为什么选择我们内容保存成功')
  } catch (error) {
    message.error('保存为什么选择我们内容失败')
    console.error('保存为什么选择我们内容失败:', error)
  } finally {
    loading.value = false
  }
}

// 保存感谢内容
const saveThanksContent = async () => {
  loading.value = true
  try {
    const updatePromises = thanksForm.paragraphs.map((item) => {
      return updateHomepageContent(item.id, {
        content: item.content,
      })
    })

    await Promise.all(updatePromises)
    message.success('感谢内容保存成功')
  } catch (error) {
    message.error('保存感谢内容失败')
    console.error('保存感谢内容失败:', error)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchAllContent()
})
</script>

<style scoped>
.why-us-item {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
}
</style>
