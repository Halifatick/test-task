<script setup>
import {onMounted, reactive, ref} from 'vue'
import FormBase from '@/components/FormBase.vue'
import dataJson from '@/data.json'

defineProps({
  msg: String,
})

const data = reactive({
  cities: [],
  teams: [],
  shifts: [],
})

const isDataLoaded = ref(false)

const loadData = async () => {
  Object.assign(data, dataJson)
  isDataLoaded.value = true
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <a href="https://vuejs.org/" target="_blank">
      <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <h1>{{ msg }}</h1>
  <FormBase v-if="isDataLoaded" :data="data"/>
  <p v-else>Загрузка данных...</p>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
