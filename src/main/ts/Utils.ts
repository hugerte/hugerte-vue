/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Ref, watch, SetupContext } from 'vue';
import { IPropTypes } from './components/EditorPropTypes';
import type { Editor as HugeRTEEditor, EditorEvent } from 'hugerte';
import { validEvents } from '@hugerte/framework-integration-shared';

const isValidKey = (key: string) =>
  validEvents.map((event) => 'on' + event.toLowerCase()).indexOf(key.toLowerCase()) !== -1;

const bindHandlers = (initEvent: EditorEvent<any>, listeners: Record<string, any>, editor: HugeRTEEditor): void => {
  Object.keys(listeners)
    .filter(isValidKey)
    .forEach((key: string) => {
      const handler = listeners[key];
      if (typeof handler === 'function') {
        if (key === 'Init') {
          handler(initEvent, editor);
        } else {
          editor.on(key, (e: EditorEvent<any>) => handler(e, editor));
        }
      }
    });
};

const bindModelHandlers = (props: IPropTypes, ctx: SetupContext, editor: HugeRTEEditor, modelValue: Ref<any>) => {
  const modelEvents = props.modelEvents ? props.modelEvents : null;
  const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

  watch(modelValue, (val: string, prevVal: string) => {
    if (editor && typeof val === 'string' && val !== prevVal && val !== editor.getContent({ format: props.outputFormat })) {
      editor.setContent(val);
    }
  });

  editor.on(normalizedEvents ? normalizedEvents : 'change input undo redo', () => {
    ctx.emit('update:modelValue', editor.getContent({ format: props.outputFormat }));
  });
};

const initEditor = (
  initEvent: EditorEvent<any>,
  props: IPropTypes,
  ctx: SetupContext,
  editor: HugeRTEEditor,
  modelValue: Ref<any>,
  content: () => string) => {
  editor.setContent(content());
  if (ctx.attrs['onUpdate:modelValue']) {
    bindModelHandlers(props, ctx, editor, modelValue);
  }
  bindHandlers(initEvent, ctx.attrs, editor);
};

export {
  bindHandlers,
  initEditor,
  isValidKey, // TODO: Seems to only be used in a test, consider removing
};
