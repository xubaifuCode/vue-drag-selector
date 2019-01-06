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
  import DragSelector from "../src/DragSelector";
  import DragSelectorItem from "../src/DragSelectorItem";

  export default {
    name: "app",
    components: {
      DragSelector,
      DragSelectorItem
    },
    data() {
      return {
        checkedList: [],
        myDragList: [
          { a: 1, b: 2 },
          { a: 2, b: 3 },
          { a: 3, b: 4 },
          { a: 4, b: 5 },
          { a: 5, b: 2 },
          { a: 6, b: 3 },
          { a: 7, b: 4 },
          { a: 8, b: 5 },
          { a: 9, b: 2 },
          { a: 10, b: 3 },
          { a: 11, b: 4 },
          { a: 12, b: 5 }
        ]
      };
    },
    methods: {
      handleDragSelectorChange(val) {
        console.log(val);
      }
    }
  };
</script>

<style>
    body {
        padding: 0;
        margin: 0;
    }
</style>

<style scoped>
    .drag-selector {
        width: 800px;
        height: 300px;
        margin-left: auto;
        margin-right: auto;
        background-color: #f2f2f2;
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
        padding: 10px;
        margin-top: 20px;
    }

    .drag-selector__item {
        width: 80px;
        height: 80px;
        margin: 10px;
        background-color: sandybrown;
    }

    .drag-selector__item.selected {
        background-color: salmon;
    }
</style>