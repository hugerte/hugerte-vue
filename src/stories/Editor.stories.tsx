import { Story } from '@storybook/vue3';
import { onBeforeMount, ref } from 'vue';
import { ScriptLoader } from '../main/ts/ScriptLoader';

import { Editor } from '../main/ts/components/Editor';
import type { Editor as HugeRTEEditor, EditorEvent } from 'hugerte';

const content = `
<h2 style="text-align: center;">
  HugeRTE provides a <span style="text-decoration: underline;">feature-rich</span> rich text editing experience.
</h2>
<p style="text-align: center;">
  <strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">If you're building an application that needs Rich Text Editing, check out HugeRTE!</span></span></strong>
</p>`;

let lastVersion = '1';
const getConf = (stringConf: string) => {
  let conf  = {};
  console.log('parsing: ', stringConf);
  try {
    conf = Function('"use strict";return (' + stringConf + ')')();
  } catch (err) {
    console.error('failed to parse configuration: ', err);
  }
  return conf;
}

const removeHugeRTE = () => {
  delete (window as any).hugerte;
  delete (window as any).hugeRTE;
};

const loadHugeRTE = (currentArgs: any) => {
  const version = currentArgs.version || lastVersion; // Storybook is not handling the default for select well
  if (version !== lastVersion) {
    removeHugeRTE();
    ScriptLoader.reinitialize();
    ScriptLoader.load(document, `https://cdn.jsdelivr.net/npm/hugerte@${version}/hugerte.min.js`, () => {
      console.log('script ready');
    });
    lastVersion = version;
  }
};


export default {
  title: 'Editor',
  component: Editor,
  argTypes: {
    version: {
      table: {
        defaultValue: {summary: '5'} // TODO: what does that mean?
      },
      defaultValue: '1',
      options: ['1'],
      control: { type: 'select'}
    },
    conf: {
      defaultValue: '{height: 300}',
      control: { type: 'text' }
    }
  },
  parameters: {
    previewTabs: {
      docs: { hidden: true }
    },
    controls: {
      hideNoControlsWarning: true
    }
  }
};

export const Iframe: Story = (args) => ({
  components: {Editor},
  setup() {
    onBeforeMount(() => {
      loadHugeRTE(args);
    });
    const cv = args.version || lastVersion;
    const conf = getConf(args.conf);
    return {
      content,
      cdnVersion: cv,
      conf
    }
  },
  template: '<div ><p>Ready</p><editor :initialValue="content" :cdn-version="cdnVersion" :init="conf" /></div>'
});

export const Inline: Story = (args) => ({
  components: { Editor },
  setup() {
    onBeforeMount(() => {
      loadHugeRTE(args);
    });
    const cv = args.version || lastVersion;
    const conf = getConf(args.conf);
    return {
      content,
      cdnVersion: cv,
      conf
    }
  },
  template: `
    <div style="padding-top: 100px;">
      <editor
        v-model="content"
        inline
        :init="conf"
      />
    </div>`
});

export const Controlled: Story = (args) => ({
  components: { Editor },
  setup() {
    onBeforeMount(() => {
      loadHugeRTE(args);
    });
    const cv = args.version || lastVersion;
    const conf = getConf(args.conf);
    const log = (e: EditorEvent<any>, editor: HugeRTEEditor) => {console.log(e);};
    const controlledContent = ref(content);
    return {
      content: controlledContent,
      cdnVersion: cv,
      conf,
      log
    }
  },
  template: `
    <div>
      <editor
        v-model="content"
        @onBlur="log"
        :init="conf"
      />
      <textarea
        style="width: 100%;
        height:200px;"
        v-model="content"
      ></textarea>
      <div v-html="content"></div>
    </div>`
});

export const Disable: Story = (args) => ({
  components: { Editor },
  setup() {
    onBeforeMount(() => {
      loadHugeRTE(args);
    });
    const cc = args.version || lastVersion;
    const conf = getConf(args.conf);
    const disabled = ref(false);
    const toggleDisabled = (_) => {
      disabled.value = !disabled.value;
    }
    return {
      content,
      cdnVersion: cc,
      conf,
      disabled,
      toggleDisabled
    }
  },
  template: `
    <div>
      <button @click="toggleDisabled">{{ disabled ? 'enable' : 'disable' }}</button>
      <editor
        v-bind:disabled="disabled"
        :init="conf"
        v-model="content"
      />
    </div>`
});
