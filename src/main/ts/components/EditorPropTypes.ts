/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { HugeRTE } from 'hugerte';

type EditorOptions = Parameters<HugeRTE['init']>[0];

export type CopyProps<T> = { [P in keyof T]: any };

export interface IPropTypes {
  cdnVersion: string;
  id: string;
  init: EditorOptions & { selector?: undefined; target?: undefined };
  initialValue: string;
  outputFormat: 'html' | 'text';
  inline: boolean;
  modelEvents: string[] | string;
  plugins: string[] | string;
  tagName: string;
  toolbar: string[] | string;
  modelValue: string;
  disabled: boolean;
  hugerteScriptSrc: string;
}

export const editorProps: CopyProps<IPropTypes> = {
  cdnVersion: String,
  id: String,
  init: Object,
  initialValue: String,
  inline: Boolean,
  modelEvents: [ String, Array ],
  plugins: [ String, Array ],
  tagName: String,
  toolbar: [ String, Array ],
  modelValue: String,
  disabled: Boolean,
  hugerteScriptSrc: String,
  outputFormat: {
    type: String,
    validator: (prop: string) => prop === 'html' || prop === 'text'
  },
};
