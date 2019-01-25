## Vue-Drag-Selector
基于Vue.js的框选组件

## 示例（Demo）
[View Demo](https://xubaifucode.github.io/vue-drag-selector/example/demo.html)

## 安装（install）
```
npm i vue-drag-selector
```

## 引入（import）
```vue
// main.js
import VueDragSelector from "vue-drag-selector";
Vue.use(VueDragSelector);
```

## 用法（Usage）
```jsx
<template>
    <div>
        <drag-selector v-model="checkedList"
                       @change="handleDragSelectorChange" class="drag-selector">
            <drag-selector-item v-for="(item, index) in myDragList"
                                :value="item"
                                :key="index" class="drag-selector__item">
                {{ item }}
            </drag-selector-item>
        </drag-selector>
        {{ checkedList }}
    </div>
</template>

<script>
  export default {
    name: "app",
    data() {
      return {
        checkedList: [],
        myDragList: [
          { a: 1, b: 5 },
          { a: 2, b: 6 },
          { a: 3, b: 7 }
        ]
      };
    },
    methods: {
      handleDragSelectorChange(checkedList) {
        console.log(checkedList);
      }
    }
  };
</script>
```

## 待做（TODO）

1. 拖拽交换位置