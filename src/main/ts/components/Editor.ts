/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ScriptLoader } from '../ScriptLoader';
import { getHugeRTE } from '../HugeRTE';
import { isTextarea, mergePlugins, uuid, isNullOrUndefined, initEditor } from '../Utils';
import { editorProps, IPropTypes } from './EditorPropTypes';
import { h, defineComponent, onMounted, ref, Ref, toRefs, nextTick, watch, onBeforeUnmount, onActivated, onDeactivated } from 'vue';
import type { Editor as HugeRTEEditor, EditorEvent, HugeRTE } from 'hugerte';

type EditorOptions = Parameters<HugeRTE['init']>[0];

const renderInline = (ce: any, id: string, elementRef: Ref<Element | null>, tagName?: string) =>
  ce(tagName ? tagName : 'div', {
    id,
    ref: elementRef
  });

const renderIframe = (ce: any, id: string, elementRef: Ref<Element | null>) =>
  ce('textarea', {
    id,
    visibility: 'hidden',
    ref: elementRef
  });

const defaultInitValues = { selector: undefined, target: undefined };

export const Editor = defineComponent({
  props: editorProps,
  setup: (props: IPropTypes, ctx) => {
    let conf = props.init ? { ...props.init, ...defaultInitValues } : { ...defaultInitValues };
    const { disabled, modelValue, tagName } = toRefs(props);
    const element: Ref<Element | null> = ref(null);
    let vueEditor: any = null;
    const elementId: string = props.id || uuid('hugerte-vue');
    const inlineEditor: boolean = (props.init && props.init.inline) || props.inline;
    const modelBind = !!ctx.attrs['onUpdate:modelValue'];
    let mounting = true;
    const initialValue: string = props.initialValue ? props.initialValue : '';
    let cache = '';

    const getContent = (isMounting: boolean): () => string => modelBind ?
      () => (modelValue?.value ? modelValue.value : '') :
      () => isMounting ? initialValue : cache;

    const initWrapper = (): void => {
      const content = getContent(mounting);
      const finalInit = {
        ...conf,
        readonly: props.disabled,
        target: element.value,
        plugins: mergePlugins(conf.plugins, props.plugins),
        toolbar: props.toolbar || (conf.toolbar),
        inline: inlineEditor,
        setup: (editor: HugeRTEEditor) => {
          vueEditor = editor;
          editor.on('init', (e: EditorEvent<any>) => initEditor(e, props, ctx, editor, modelValue, content));
          if (typeof conf.setup === 'function') {
            conf.setup(editor);
          }
        }
      };
      if (isTextarea(element.value)) {
        element.value.style.visibility = '';
      }
      getHugeRTE().init(finalInit);
      mounting = false;
    };
    watch(disabled, (disable) => {
      if (vueEditor !== null) {
        if (typeof vueEditor.mode?.set === 'function') {
          vueEditor.mode.set(disable ? 'readonly' : 'design');
        } else {
          vueEditor.setMode(disable ? 'readonly' : 'design');
        }
      }
    });
    watch(tagName, (_) => {
      if (!modelBind) {
        cache = vueEditor.getContent();
      }
      getHugeRTE()?.remove(vueEditor);
      nextTick(() => initWrapper());
    });
    onMounted(() => {
      if (getHugeRTE() !== null) {
        initWrapper();
      } else if (element.value && element.value.ownerDocument) {
        const version = props.cdnVersion ?? '1';
        const scriptSrc: string = isNullOrUndefined(props.hugerteScriptSrc) ?
          `https://cdn.jsdelivr.net/npm/hugerte@${version}/hugerte.min.js` :
          props.hugerteScriptSrc;
        ScriptLoader.load(
          element.value.ownerDocument,
          scriptSrc,
          initWrapper
        );
      }
    });
    onBeforeUnmount(() => {
      if (getHugeRTE() !== null) {
        getHugeRTE().remove(vueEditor);
      }
    });
    if (!inlineEditor) {
      onActivated(() => {
        if (!mounting) {
          initWrapper();
        }
      });
      onDeactivated(() => {
        if (!modelBind) {
          cache = vueEditor.getContent();
        }
        getHugeRTE()?.remove(vueEditor);
      });
    }
    const rerender = (init: EditorOptions) => {
      cache = vueEditor.getContent();
      getHugeRTE()?.remove(vueEditor);
      conf = { ...conf, ...init, ...defaultInitValues };
      nextTick(() => initWrapper());
    };
    ctx.expose({
      rerender,
      getEditor: () => vueEditor
    });
    return () => inlineEditor ?
      renderInline(h, elementId, element, props.tagName) :
      renderIframe(h, elementId, element);
  }
});
