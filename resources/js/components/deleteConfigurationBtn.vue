<template>
    <button
        @click="handleClick"
        class="ml-4 px-4 py-2 bg-red-500 text-white rounded"
    >
        Reset Configuration
    </button>
</template>

<script setup lang="ts">
import { EditorStateKey } from "@/injection/injectionKeys";
import type { IEditorState } from "@/interfaces/IEditorState";
import { inject } from "vue";

const editorState = inject<IEditorState>(EditorStateKey);
function handleClick() {
    console.log(editorState.loadedGlbModels);
    editorState.loadedGlbModels = [];
    console.log(editorState.loadedGlbModels);
    localStorage.removeItem("loadedGlbModels");
    localStorage.setItem("loadedGlbModels", JSON.stringify([]));
    let modelsFromStorage = JSON.parse(localStorage.getItem("loadedGlbModels"));
    console.log(modelsFromStorage);
}
</script>
