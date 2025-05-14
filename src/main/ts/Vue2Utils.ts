/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IEditor } from './components/Vue2Editor';
import type { Editor as HugeRTEEditor, EditorEvent } from 'hugerte';
import { bindHandlers } from './Utils';

const bindModelHandlers = (ctx: IEditor, editor: HugeRTEEditor) => {
  const modelEvents = ctx.$props.modelEvents ? ctx.$props.modelEvents : null;
  const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

  editor.on(normalizedEvents ? normalizedEvents : 'change input undo redo', () => {
    ctx.$emit('input', editor.getContent({ format: ctx.$props.outputFormat }));
  });
};

const initEditor = (initEvent: EditorEvent<any>, ctx: IEditor, editor: HugeRTEEditor) => {
  const value = ctx.$props.modelValue ? ctx.$props.modelValue : '';
  const initialValue = ctx.$props.initialValue ? ctx.$props.initialValue : '';

  editor.setContent(value || (ctx.initialized ? ctx.cache : initialValue));

  // Always bind the value listener in case users use :value instead of v-model
  ctx.$watch('value', (val: string, prevVal: string) => {
    if (editor && typeof val === 'string' && val !== prevVal && val !== editor.getContent({ format: ctx.$props.outputFormat })) {
      editor.setContent(val);
    }
  });

  // checks if the v-model shorthand is used (which sets an v-on:input listener) and then binds either
  // specified the events or defaults to "change keyup" event and emits the editor content on that event
  if (ctx.$listeners.input) {
    bindModelHandlers(ctx, editor);
  }

  bindHandlers(initEvent, ctx.$listeners, editor);
  ctx.initialized = true;
};

export {
  initEditor
};
