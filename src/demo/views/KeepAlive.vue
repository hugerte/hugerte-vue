<template>
  <div>
    <h1>Keep-alive tag</h1>
    <div class="tabs">
      <span :class="['tab', {active:computedTab==='ContentTab'}]" @click="toggleTab('ContentTab')">Content</span>
      <span :class="['tab', {active:computedTab==='EditorTab'}]" @click="toggleTab('EditorTab')">Editor</span>
    </div>
    <div>
      <keep-alive>
        <component :is="computedTab"/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import Editor from "/@/main/ts/index";
import ContentTab from "/views/ContentTab.vue";
import EditorTab from "/views/EditorTab.vue";

const content = `
<h2 style="text-align: center;">
  HugeRTE provides a <span style="text-decoration: underline;">feature-rich</span> rich text editing experience.
</h2>
<p style="text-align: center;">
  <strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">If you're building an application that needs Rich Text Editing, check out HugeRTE!</span></span></strong>
</p>`;

export default defineComponent({
  name: "Keepalive",
  components: {
    Editor,
    EditorTab,
    ContentTab
  },
  data() {
    return {
      html: ""
    };
  },
  setup() {
    const tab = ref('ContentTab');
    const computedTab = computed(() => tab.value);
    const toggleTab = (activeTab) => {
      tab.value = activeTab;
    };
    return {
      content,
      toggleTab,
      computedTab
    }
  }
});
</script>