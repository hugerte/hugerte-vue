import { storiesOf } from '@storybook/vue';

import { Editor } from '../src/main/ts/components/Editor';

const content = `
<h2 style="text-align: center;">
  HugeRTE provides a <span style="text-decoration: underline;">feature-rich</span> rich text editing experience.
</h2>
<p style="text-align: center;">
  <strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">If you're building an application that needs Rich Text Editing, check out HugeRTE!</span></span></strong>
</p>`;

storiesOf('hugerte-vue', module)
  .add(
    'Iframe editor',
    () => ({
      components: { Editor },
      data: () => ({ content }),
      template: `
        <editor
          :init="{height: 300}"
          v-model="content"
        />`
    }),
    { notes: 'Iframe editor.' }
  )
  .add(
    'Inline editor',
    () => ({
      components: { Editor },
      data: () => ({ content }),
      template: `
        <div style="padding-top: 100px;">
          <editor
            v-model="content"
            inline
          />
        </div>
      `
    }),
    { notes: 'Inline editor.' }
  )
  .add(
    'Controlled input',
    () => ({
      components: { Editor },
      data: () => ({ content }),
      methods: {
        log: (e, _editor) => console.log(e)
      },
      template: `
        <div>
          <editor
            :init="{height: 300}"
            v-model="content"
            @onBlur="log"
          />
          <textarea
            style="width: 100%;
            height:200px;"
            v-model="content"
          ></textarea>
          <div v-html="content"></div>
        </div>
      `
    }),
    { notes: 'Example of usage as as a controlled component.' }
  )
  .add(
    'Disable button', () => ({
      components: { Editor },
      data: () => ({ content, disabled: true }),
      methods: {
        toggleDisabled(_e) {
          this.disabled = !this.disabled;
        }
      },
      template: `
        <div>
          <button @click="toggleDisabled">{{ disabled ? 'enable' : 'disable' }}</button>
          <editor
            v-bind:disabled="disabled"
            :init="{height: 300}"
            v-model="content"
          />
        </div>
      `
    }),
    { notes: 'Example with setting the editor into readonly mode using the disabled prop.' }
  )
  .add(
    'cdnVersion set to 1',
    () => ({
      components: { Editor },
      data: () => ({ content }),
      methods: {
        log: (e, _editor) => console.log(e)
      },
      template: `
        <editor
          cdnVersion="1"
          :init="{height: 300}"
          v-model="content"
        />
      `
    }),
    { notes: 'Editor with cdnVersion set to 1, please make sure to reload page to load HugeRTE 1.' }
  );
