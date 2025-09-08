
<script setup lang="ts">
import { ref, computed, useTemplateRef, onMounted } from 'vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';


let S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let N = 8;
let ID = Array.from(crypto.getRandomValues(new Uint8Array(N))).map((n)=>S[n%S.length]).join('');
console.log(ID);

let editor_id = "q-editor-" + ID;
let editor_sid = "#" + editor_id;
let toolbar_id = "my-toolbar-" + ID;
let toolbar_sid = "#" + toolbar_id;


const qeditor  = useTemplateRef('qeditor')
//const qeditor  = ref();
let isFocus = ref(false);

const handleMouseEnter = () => {
  console.log('focus in', editor_id);
  isFocus.value = true;
  console.log(qeditor.value.getToolbar());
  let ele = qeditor.value.getToolbar();
  ele.style.display = "inline-block"
};
const handleMouseLeave = () => {
  console.log('focus out', editor_id);
  isFocus.value = false;
  let ele = qeditor.value.getToolbar();
  ele.style.display = "none"
};

//const classObject = computed(() => (  isFocus ? "toolbar-show" : "toolbar-hidden"));
const classObject = computed(() => {
   if (isFocus.value) {
      return "toolbar-show" ;
   } else {
      return "toolbar-hidden";
   }
});



</script>

<template>
  <QuillEditor theme="snow"   toolbar="full" />
</template>
<style >

</style>

