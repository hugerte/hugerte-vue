<template>
  <div>
    <h2>Sample refreshing the editor</h2>
    <editor ref="editorRef" :initialValue="value" :init="conf" />
    <div v-html="value"></div>
    <button @click="refresh">Refresh</button>
    <button @click="update">Update</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Editor from "/@/main/ts/index";
const content = `
<h2 style="text-align: center;">
  HugeRTE provides a <span style="text-decoration: underline;">feature-rich</span> rich text editing experience.
</h2>
<p style="text-align: center;">
  <strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">If you're building an application that needs Rich Text Editing, check out HugeRTE!</span></span></strong>
</p>`;
export default defineComponent({
  components: {
    Editor,
  },
  data() {
    const self = this;
    return {
      value: content,
      conf: {
        toolbar: 'undo redo | change',
        lang: 'ru',
        setup: (editor:any) => {
          editor.ui.registry.addMenuButton('change', {
            text: 'change',
            fetch: (c: any) => {
              const items: any[] = [];
              ['en','es'].forEach((i) => {
                items.push({
                  type: 'menuitem',
                  text: i.toUpperCase(),
                  onAction: () => {
                    // console.log(self);
                    self.$refs.editorRef.rerender({language: i});
                  }
                });
              });
              c(items);
            },
          });
        }
      }
    };
  },
  methods: {
    update() {
      this.$refs.editorRef.rerender({height: 600});
    }
  },
});
</script>