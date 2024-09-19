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
    localStorage.removeItem("savedGlbModels");
    localStorage.setItem("saveGlbModels", JSON.stringify([]));
    let modelsFromStorage = JSON.parse(localStorage.getItem("savedGlbModels"));
    console.log(modelsFromStorage);
}
</script>
