<template>
  <div>
    <h2>Sample refreshing the editor</h2>
    <editor ref="editorRef" :initialValue="value" :init="conf" />
    <div v-html="value"></div>
    <button @click="log">Log</button>
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
    return {
      value: content,
      conf: {
        toolbar: 'undo redo | change'
      }
    };
  },
  methods: {
    log() {
      console.log('editor instance: ', this.$refs.editorRef.getEditor());
    }
  },
});
</script>
