<template>
    <div @mousedown.stop
         @click.stop="handleClick"
         :class="['drag-selector-item-wrapper', selected ? 'selected':'']">
        <slot></slot>
    </div>
</template>

<script>
import emitter from './mixins/emitter';

export default {
    name: 'drag-selector-item',

    mixins: [emitter],

    props: {
        value: {
            default: true
        }
    },

    data() {
        return {
            selected: false
        };
    },

    mounted() {
        this.dispatch('drag-selector', 'on-drag-selector-item-add', this);
    },

    destroyed() {
        this.dispatch('drag-selector', 'on-drag-selector-item-remove', this);
    },

    methods: {
        handleClick() {
            this.handleSelectChange(true);
        },

        handleSelectChange(val) {
            if (this.selected === val) return;
            this.selected = val;
            this.dispatch('drag-selector', 'drag-selector-item-change', {
                selected: this.selected,
                value: this.value
            });
        }
    }
};
</script>

<style scoped>
    .drag-selector-item-wrapper {
        cursor: move;
    }
</style>