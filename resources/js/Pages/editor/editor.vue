  <template>
    <Head title="Editor" />

    <configurator />
    <togglableSidePanel
        :isOpen="isOpen"
        @toggle="togglePanel"
        :components="props.components"
    />
    <div class="z-50 absolute top-0 right-0 p-4" v-if="!isOpen">
        <sidePanelToggleBtn @toggle="togglePanel" />
    </div>
    <!-- <test /> -->
</template>

<script setup lang="ts">
import { Head } from "@inertiajs/vue3";
import loadGlbBtn from "./loadGlbBtn.vue";
import configurator from "@/components/configurator/configurator.vue";
import togglableSidePanel from "@/components/togglableSidePanel.vue";
import sidePanelToggleBtn from "@/components/sidePanelToggleBtn.vue";
import { ref, reactive, provide } from "vue";
import * as THREE from "three";
import type { IEditorState } from "@/interfaces/IEditorState";
import type { IComponent } from "@/interfaces/IComponent";
import { FilenameKey, EditorStateKey } from "@/injection/injectionKeys";
import type { ISelectedFurniture } from "@/interfaces/ISelectedFurniture";


const isOpen = ref(true);


const togglePanel = () => {
    isOpen.value = !isOpen.value;
};
const props = defineProps<{ components: IComponent[] }>();

const selectedFurniture = ref<ISelectedFurniture>({filename:'', category: ''})

provide(FilenameKey, selectedFurniture);


let modelsFromStorage = JSON.parse(localStorage.getItem('loadedGlbModels'))

modelsFromStorage ?? [] 

const state = reactive<IEditorState>({
    loadedGlbModels: [],
    configuration: {
        models: [],
        componentIds: [],
    },
});

console.log(props.components);

provide(EditorStateKey, state);
</script>
