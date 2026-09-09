import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import UserTable from './UserTable.vue';

/** 用户列表组件契约测试。 */
describe('UserTable', () => {
  it('在有写权限时触发角色分配事件', async () => {
    const wrapper = mount(UserTable, {
      props: {
        users: [{ id: '01TESTUSER0000000000000000', username: 'alice', roleCode: 'admin', enabled: true }],
        roles: [{ roleCode: 'admin', roleName: '管理员', enabled: true }],
        canWrite: true,
      },
      global: {
        stubs: {
          'el-table': { template: '<div><slot /></div>' },
          'el-table-column': {
            template: "<div><slot :row=\"{ id: 1, username: 'alice', roleCode: 'admin', enabled: true }\" /></div>",
          },
          'el-select': {
            template: '<button class="role-select" @click="$emit(\'change\', \'admin\')"><slot /></button>',
          },
          'el-option': true,
          'el-tag': true,
          'el-button': true,
          'el-empty': true,
        },
      },
    });
    await wrapper.find('.role-select').trigger('click');
    expect(wrapper.emitted('assign-role')).toBeTruthy();
  });
});
