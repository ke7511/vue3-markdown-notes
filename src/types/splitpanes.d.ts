// src/types/splitpanes.d.ts

// 这段代码告诉 TypeScript：
// 1. 存在一个名为 'splitpanes' 的模块。
// 2. 从这个模块中可以导入 Splitpanes 和 Pane。
// 3. 这两个导入的东西都是 Vue 组件。
declare module 'splitpanes' {
  import { defineComponent } from 'vue'
  const Splitpanes: ReturnType<typeof defineComponent>
  const Pane: ReturnType<typeof defineComponent>
  export { Splitpanes, Pane }
}
