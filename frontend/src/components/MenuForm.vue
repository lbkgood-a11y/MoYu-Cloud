<script setup lang="ts">
import { reactive, watch } from 'vue';
import { DataAnalysis, Document, Files, Key, Menu, Monitor, Setting, User, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
const props = defineProps<{ modelValue: boolean; menu?: any | null; menus?: any[] }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', value: { parentId: string; menuName: string; permission: string; menuType: string; icon: string }): void;
}>();
const iconOptions = [{ name: '用户', value: 'User' , component: User}, { name: '客户', value: 'UserFilled', component: UserFilled }, { name: '数据', value: 'DataAnalysis', component: DataAnalysis }, { name: '菜单', value: 'Menu', component: Menu }, { name: '权限', value: 'Key', component: Key }, { name: '设置', value: 'Setting', component: Setting }, { name: '文件', value: 'Document', component: Document }, { name: '组织', value: 'Files', component: Files }, { name: '监控', value: 'Monitor', component: Monitor }];
const form = reactive({ parentId: '0', menuName: '', permission: '', menuType: 'M', icon: 'Menu' });
watch(
  () => props.menu,
  (value) =>
    Object.assign(
      form,
      value
        ? {
            parentId: value.parentId,
            menuName: value.menuName,
            permission: value.permission || '',
            menuType: value.menuType,
            icon: value.icon || 'Menu',
          }
        : { parentId: '0', menuName: '', permission: '', menuType: 'M', icon: 'Menu' },
    ),
  { immediate: true },
);
function submit() {
  if (!form.menuName.trim()) {
    ElMessage.warning('菜单名称不能为空');
    return;
  }
  if (form.permission && !/^[a-z][a-z0-9:_-]{1,63}$/.test(form.permission)) {
    ElMessage.warning('权限标识格式不正确');
    return;
  }
  emit('save', { ...form });
}
</script>
<template>
  <el-dialog
    :model-value="modelValue"
    :title="props.menu ? '编辑菜单' : '新增菜单'"
    width="420px"
    @update:model-value="emit('update:modelValue', $event)"
    ><el-form label-width="90px"
      ><el-form-item label="父级菜单"><el-select v-model="form.parentId" style="width:100%"><el-option label="顶级菜单" value="0" /><el-option v-for="item in (props.menus || []).filter((m) => m.id !== props.menu?.id && m.menuType === 'M')" :key="item.id" :label="item.menuName" :value="item.id" /></el-select></el-form-item
      ><el-form-item label="菜单名称"><el-input v-model="form.menuName" /></el-form-item
      ><el-form-item label="权限标识"
        ><el-input v-model="form.permission" placeholder="例如 customer:read" /></el-form-item
      ><el-form-item label="菜单图标"><el-select v-model="form.icon" style="width:100%"><el-option v-for="item in iconOptions" :key="item.value" :label="item.name" :value="item.value"><span class="icon-option"><el-icon><component :is="item.component" /></el-icon>{{ item.name }}</span></el-option></el-select></el-form-item
      ><el-form-item label="菜单类型"
        ><el-select v-model="form.menuType" style="width: 100%"
          ><el-option label="菜单" value="M" /><el-option label="按钮" value="B" /></el-select></el-form-item></el-form
    ><template #footer
      ><el-button @click="emit('update:modelValue', false)">取消</el-button
      ><el-button type="primary" @click="submit">保存</el-button></template
    ></el-dialog
  >
</template>
<style scoped>.icon-option{display:flex;align-items:center;gap:8px}</style>
