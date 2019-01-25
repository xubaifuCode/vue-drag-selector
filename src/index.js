import DragSelector from './DragSelector';
import DragSelectorItem from './DragSelectorItem';

export default {
    install(Vue) {
        Vue.component(DragSelector.name, DragSelector);
        Vue.component(DragSelectorItem.name, DragSelectorItem);
    }
};