/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { ThisTypedComponentOptionsWithRecordProps } from 'vue2/types/options';
import { CreateElement, Vue } from 'vue2/types/vue';
import { ScriptLoader, mergePlugins, isTextarea, uuid } from '@hugerte/framework-integration-shared';
import { getHugeRTE } from '../HugeRTE';
import { initEditor } from '../Vue2Utils';
import { editorProps, IPropTypes } from './EditorPropTypes';
import type { Editor as HugeRTEEditor, EditorEvent } from 'hugerte';

declare module 'vue2/types/vue' {
  interface Vue {
    elementId: string;
    element: Element | null;
    editor: any;
    inlineEditor: boolean;
    initialized: boolean;
    cache: string;
  }
}

export interface IEditor extends Vue {
  $props: Partial<IPropTypes>;
}

const renderInline = (h: CreateElement, id: string, tagName?: string) => h(tagName ? tagName : 'div', {
  attrs: { id }
});

const renderIframe = (h: CreateElement, id: string) => h('textarea', {
  attrs: { id },
  style: { visibility: 'hidden' }
});

const initialise = (ctx: IEditor) => () => {
  const finalInit = {
    ...ctx.$props.init,
    readonly: ctx.$props.disabled,
    selector: `#${ctx.elementId}`,
    plugins: mergePlugins(ctx.$props.init && ctx.$props.init.plugins, ctx.$props.plugins),
    toolbar: ctx.$props.toolbar || (ctx.$props.init && ctx.$props.init.toolbar),
    inline: ctx.inlineEditor,
    setup: (editor: HugeRTEEditor) => {
      ctx.editor = editor;
      editor.on('init', (e: EditorEvent<any>) => initEditor(e, ctx, editor));

      if (ctx.$props.init && typeof ctx.$props.init.setup === 'function') {
        ctx.$props.init.setup(editor);
      }
    }
  };

  if (isTextarea(ctx.element)) {
    ctx.element.style.visibility = '';
    ctx.element.style.display = ''; // TODO: why is this only in the Vue 2 version?
  }

  getHugeRTE().init(finalInit);
};

export const Editor: ThisTypedComponentOptionsWithRecordProps<Vue, {}, {}, {}, IPropTypes, {}, {}, {}> = {
  props: editorProps,
  created() {
    this.elementId = this.$props.id || uuid('hugerte-vue');
    this.inlineEditor = (this.$props.init && this.$props.init.inline) || this.$props.inline;
    this.initialized = false;
  },
  watch: {
    disabled() {
      (this as any).editor.setMode(this.disabled ? 'readonly' : 'design');
    }
  },
  mounted() {
    this.element = this.$el;

    if (getHugeRTE() !== null) {
      initialise(this)();
    } else if (this.element && this.element.ownerDocument) {
      const version = this.$props.cdnVersion ?? '1';
      const scriptSrc = this.$props.hugerteScriptSrc ??
        `https://cdn.jsdelivr.net/npm/hugerte@${version}/hugerte.min.js`;

      ScriptLoader.load(
        this.element.ownerDocument,
        scriptSrc,
        initialise(this)
      );
    }
  },
  beforeDestroy() {
    if (getHugeRTE() !== null) {
      getHugeRTE().remove(this.editor);
    }
  },
  deactivated() {
    if (!this.inlineEditor) {
      this.cache = this.editor.getContent();
      getHugeRTE()?.remove(this.editor);
    }
  },
  activated() {
    if (!this.inlineEditor && this.initialized) {
      initialise(this)();
    }
  },
  render(h: any) {
    return this.inlineEditor ? renderInline(h, this.elementId, this.$props.tagName) : renderIframe(h, this.elementId);
  }
};

export default Editor;
