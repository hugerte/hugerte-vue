<template>
  <div>
    <button @click="toggleDisabled">{{ disabled ? 'enable' : 'disable' }}</button>
    <editor
      v-bind:disabled="disabled"
      :init="{height: 300}"
      v-model="content"
    />
  </div>
</template>

<script>
import Editor from "/@/main/ts/index";

const content = `
<h2 style="text-align: center;">
  HugeRTE provides a <span style="text-decoration: underline;">feature-rich</span> rich text editing experience.
</h2>
<p style="text-align: center;">
  <strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">If you're building an application that needs Rich Text Editing, check out HugeRTE!</span></span></strong>
</p>`;

export default {
  name: "Disable",
  components: {
    editor: Editor
  },
  data() {
    return {
      content,
      disabled: true
    };
  },
  methods: {
    toggleDisabled(_e) {
      this.disabled = !this.disabled;
    }
  }
};
</script>
