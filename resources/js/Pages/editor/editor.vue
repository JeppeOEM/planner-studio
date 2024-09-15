<template>
    <Head title="Editor" />

    <configurator />
    <togglableSidePanel :isOpen="isOpen" @toggle="togglePanel" />
    <sidePanelToggleBtn @toggle="togglePanel" />

    <!-- <test /> -->
</template>

<script setup lang="ts">
import { Head } from "@inertiajs/vue3";
import loadGlbBtn from "./loadGlbBtn.vue";
import configurator from "@/components/configurator/configurator.vue";
import togglableSidePanel from "@/components/togglableSidePanel.vue";
import sidePanelToggleBtn from "@/components/sidePanelToggleBtn.vue";
import {ref, reactive, provide} from 'vue' 
import * as THREE from "three";
import type { IEditorState } from "@/interfaces/IEditorState";
const isOpen = ref(false);
const togglePanel = () => {
  isOpen.value = !isOpen.value;
};






const state = reactive<IEditorState>({
  loadedGlbModels: [],
  configuration: {
    models: [],
    componentIds: []
  } 
});




provide('editorState', state);

</script>
