
import type { InjectionKey,Ref,Reactive} from 'vue'
import type { IEditorState } from '@/interfaces/IEditorState';
import type { ISelectedFurniture } from '@/interfaces/ISelectedFurniture';


export const FilenameKey: InjectionKey<Ref<ISelectedFurniture>> = Symbol("filename");
export const EditorStateKey: InjectionKey<Reactive<IEditorState>> = Symbol('editorState');
