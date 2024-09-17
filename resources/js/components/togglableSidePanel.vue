<template>
    <div class="z-10">
        <transition name="slide">
            <div
                v-if="isOpen"
                class="overflow-y-auto fixed top-0 right-0 h-full w-[500px] bg-gray-100 shadow-lg"
            >
                <div class="p-4">
                    <h2 class="text-xl font-bold">Side Panel</h2>

                    <button
                        @click="$emit('toggle')"
                        class="mt-4 p-2 bg-red-500 text-white rounded"
                    >
                        Close Panel
                    </button>
                </div>
                <div class="grid grid-cols-2 gap-4 p-4 cursor-pointer">
                    <div
                        v-for="component in components"
                        :key="component.id"
                        class="bg-white p-4 rounded shadow"
                        @click="handleComponentClick(component)"
                    >
                        <h2 class="text-base font-bold">
                            {{ cleanFilename(component.filename) }}
                        </h2>
                        <p class="text-gray-600">{{ component.category }}</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import type { IComponent } from "@/interfaces/IComponent";
import { FilenameKey } from "@/injection/injectionKeys";
import type { ISelectedFurniture } from "@/interfaces/ISelectedFurniture";
import type { Ref } from "vue";

const props = defineProps<{ components: IComponent[]; isOpen: boolean }>();
const filename = inject<Ref<ISelectedFurniture>>(FilenameKey);

function setFilenameToload(selectedFurniture: ISelectedFurniture) {
    filename.value = selectedFurniture;  
}

function cleanFilename(filename: string) {
    const parts = filename.split("_");
    const lastPart = parts[parts.length - 1];
    const cleanedLastPart = lastPart.endsWith(".glb")
        ? lastPart.slice(0, -4)
        : lastPart;
    return [...parts.slice(-3, -1), cleanedLastPart].join("_");
}

function handleComponentClick(component: IComponent) {
    const selectedFurniture: ISelectedFurniture = {
        filename: component.filename,
        category: component.category,
    };
    console.log(selectedFurniture);
    setFilenameToload(selectedFurniture);
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}
</style>
