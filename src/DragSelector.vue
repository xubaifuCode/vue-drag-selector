<template>
    <div class="drag-selector-wrapper" @mousedown="handleMouseDown">
        <div class="drag-area-box" :style="selectAreaStyle"></div>
        <slot></slot>
    </div>
</template>

<script>
import emitter from './mixins/emitter';
import { throttle } from './utils/utils';

/**
   * 需求：框选子项
   * 组件：框选区，框选子项
   * 实现方法：鼠标在框选区长按拖动时计算拖动坐标，如果框选进入范围，改变为选中状态，单击任意地方取消选中
   * 1. 开始拖动前计算各个子项的坐标
   * 2. 拖动过程中进行判断，如果进入被框选范围，触发该子项修改状态
   */
const POINT_MODEL = ['offsetX', 'offsetY', 'clientX', 'clientY'];

export default {
    name: 'drag-selector',

    mixins: [emitter],

    props: {
        value: {
            type: Array,
            default() {
                return [];
            }
        }
    },

    data() {
        return {
            dragging: false,
            handleMouseMoveThrottled: () => {
            },
            emitChangeThrottled: () => {
            },
            startPoint: {
                offsetX: 0,
                offsetY: 0
            },
            endPoint: {
                offsetX: 0,
                offsetY: 0
            },
            point: {
                offsetX: 0,
                offsetY: 0
            },
            childItems: [],
            childrenDOMPoints: [],
            browserPoint: {
            },
            selfPoint: {
                clientX: 0,
                clientY: 0
            }
        };
    },

    created() {
        this.registerEvents();
    },

    mounted() {
        this.handleMouseMoveThrottled = throttle(this.handleMouseMove);
        this.emitChangeThrottled = throttle(this.emitChange, 200);
    },

    methods: {
        registerEvents() {
            this.$on('on-drag-selector-item-add', item => {
                if (item) this.childItems.push(item);
            });
            this.$on('on-drag-selector-item-remove', item => {
                const index = this.childItems.indexOf(item);
                if (index >= 0) this.childItems.splice(index, 1);
            });
            this.$on('drag-selector-item-change', ({ selected, value }) => {
                const index = this.value.indexOf(value);
                if (selected) {
                    this.value.push(value);
                }
                else if (index !== -1) {
                    this.value.splice(index, 1);
                }
                this.emitChangeThrottled();
            });
        },

        emitChange() {
            this.$emit('change', this.value);
            this.$emit('input', this.value);
        },

        handleMouseDown(e) {
            this.cancelAllSelect();
            this.$nextTick(() => {
                this.resetPoint(e);
                this.updatePointData(this.point, e);
                window.addEventListener('mouseup', this.handleMouseUp);
                window.addEventListener('mousemove', this.handleMouseMoveThrottled);
            });
        },

        handleMouseMove(e) {
            if (!this.dragging) {
                this.dragging = true;
            }
            this.updatePointData(this.endPoint, e);
            this.updatePointData(this.point, e);
            this.$nextTick(() => {
                this.childrenDOMPoints.forEach(child => {
                    const isSelected = this.checkIfChildInSelectArea(child.point);
                    child.instance.handleSelectChange(isSelected);
                });
            });
        },

        cancelAllSelect() {
            this.childItems.forEach(child => {
                child.handleSelectChange(false);
            });
        },

        /**
       * 判断框选区和子元素是否相交
       *    框选区的左边距 小于 子元素的左边距加上其宽度
       *    框选区的左边距加上其宽度 大于 子元素的左边距
       *    框选区的上边距 小于 子元素的上边距加上其高度
       *    框选区的上边距加上其高度 大于 子元素的上边距
       */
        checkIfChildInSelectArea(childItem) {
            const startClientX = this.startPoint.clientX;
            const startClientY = this.startPoint.clientY;
            const endClientX = this.endPoint.clientX;
            const endClientY = this.endPoint.clientY;
            const selectPoint = {
                left: Math.min(startClientX, endClientX),
                top: Math.min(startClientY, endClientY),
                width: Math.abs(startClientX - endClientX),
                height: Math.abs(startClientY - endClientY)
            };
            return selectPoint.left <= childItem.left + childItem.width
            && selectPoint.left + selectPoint.width >= childItem.left
            && selectPoint.top <= childItem.top + childItem.height
            && selectPoint.top + selectPoint.height >= childItem.top;
        },

        handleMouseUp(e) {
            this.dragging = false;
            this.updatePointData(this.point, e);
            this.resetPoint(e);
            // this.emitChangeThrottled();
            window.removeEventListener('mouseup', this.handleMouseUp);
            window.removeEventListener('mousemove', this.handleMouseMoveThrottled);
        },

        /**
       * 更新坐标值
       * @param pointObj  通过pointData和POINT_MODEL指定的键，更新pointObj内的坐标值
       * @param pointData 鼠标移动时的事件对象
       */
        updatePointData(pointObj, pointData) {
            POINT_MODEL.forEach(key => {
                this.$set(pointObj, key, pointData[key]);
            });
        },

        // TODO 可视区域宽高，用于防止在没有滚动条的情况拖动范围超出区域，但是还没实现
        initBrowserPoint() {
            this.browserPoint = {
                clientWidth: document.body.clientWidth,
                clientHeight: document.body.clientHeight,
                scrollWidth: document.body.scrollWidth,
                scrollHeight: document.body.scrollHeight
            };
        },

        collectDOMPoints() {
            const DOMRect = this.$el.getBoundingClientRect();
            this.selfPoint = {
                clientX: DOMRect.left || DOMRect.x,
                clientY: DOMRect.top || DOMRect.y,
            };
            this.childrenDOMPoints = this.childItems.map(child => ({
                point: child.$el.getBoundingClientRect(),
                instance: child
            }));
        },

        resetPoint(e) {
            this.updatePointData(this.startPoint, e);
            this.updatePointData(this.endPoint, e);
        }
    },
    computed: {
        hasScrollX() {
            return !(this.browserPoint.clientWidth - this.browserPoint.scrollWidth);
        },

        hasScrollY() {
            return !(this.browserPoint.clientHeight - this.browserPoint.scrollHeight);
        },
        selectAreaStyle() {
            const startClientX = this.startPoint.clientX - this.selfPoint.clientX;
            const endClientX = this.endPoint.clientX - this.selfPoint.clientX;
            const startClientY = this.startPoint.clientY - this.selfPoint.clientY;
            const endClientY = this.endPoint.clientY - this.selfPoint.clientY;
            const { left, top, width, height } = {
                left: Math.min(startClientX, endClientX),
                top: Math.min(startClientY, endClientY),
                width: Math.abs(startClientX - endClientX),
                height: Math.abs(startClientY - endClientY)
            };
            // console.log(`width = ${width}px, height = ${height}px, left = ${left}px, top = ${top}px`);
            return {
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                zIndex: 444,
                backgroundColor: 'rgba(51, 51, 51, 0.5)',
                position: 'absolute'
            };
        }
    },
    watch: {
        // dragging: 'handleDraggingChange'
        dragging(val) {
            if (val) {
                this.$emit('drag-start');
                this.collectDOMPoints();
                this.initBrowserPoint();
            }
            else {
                this.$emit('drag-end');
            }
        }
    }
};
</script>

<style>
    .drag-selector-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: crosshair;
        user-select: none;
    }

    .drag-area-box {
        pointer-events: none;
    }
</style>
