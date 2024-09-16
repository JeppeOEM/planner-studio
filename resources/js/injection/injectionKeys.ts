
import type { InjectionKey,Ref,Reactive} from 'vue'
import type { IEditorState } from '@/interfaces/IEditorState';


export const FilenameKey: InjectionKey<Ref<string>> = Symbol("filename");
export const EditorStateKey: InjectionKey<Reactive<IEditorState>> = Symbol('editorState');
