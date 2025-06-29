<!-- FormGenerator.vue -->
<template>
  <a-form :model="localModel" :rules="rules" v-bind="componentAttrs" :class="className">
    <a-form-item v-for="field in fields" :key="field.name" :label="field.label" :name="field.name">
      <!-- v-on="field.events"  -->
      <component :is="getComponent(field.type)" v-model:value="localModel[field.name]" v-bind="field.attrs"
        v-if="!field.slot">
        <template #default>
          <template v-if="field.type === 'select'">
            <a-select-option v-for="opt in field.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </template>
        </template>
      </component>
      <slot v-else :name="`${field.name}-${field.type}`" :item="field" v-bind="field.attrs"></slot>
    </a-form-item>
    <!-- <a-form-item class="footer-button">
      <a-button type="primary" html-type="submit">提交</a-button>
    </a-form-item> -->
  </a-form>
  <div class="footer-button">
    <a-button type="primary" @click="handleFinish">{{ buttonContent }}</a-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Form, Input, Select, DatePicker, Button, Upload } from 'ant-design-vue';

const props = defineProps<{
  modelValue: Record<string, any>;
  fields: Array<{
    name: string;
    label: string;
    type: 'input' | 'select' | 'date';
    options?: Array<{ label: string; value: any }>;
    attrs?: Record<string, any>;
  }>;
  rules?: Array<Record<string, any>>;
  componentAttrs?: Record<string, any>;
  className?: string;
  buttonContent?: string;
}>();

const emit = defineEmits(['update:modelValue', 'on-finish']);

// 本地副本，响应父组件传入的数据
const localModel = reactive({ ...props.modelValue });

// 同步父组件变更到本地
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localModel, newVal);
  },
  { deep: true }
);

// 本地变更时通知父组件
watch(
  localModel,
  (newVal) => {
    emit('update:modelValue', { ...newVal });
  },
  { deep: true }
);

const getComponent = (type: string) => {
  switch (type) {
    case 'input':
      return Input;
    case 'select':
      return Select;
    case 'date':
      return DatePicker;
    // case 'img-upload':
    // case 'file-upload':
    //   return Upload;
    default:
      return Input;
  }
}

const  handleFinish = () =>{
  emit('on-finish', { ...localModel });
}
</script>

<style scoped>
.footer-button {
  text-align: right;
  width: 100%;
}
</style>
