<script setup>
defineProps({
  label: String,
  name: String,
  arr: Array
})

const selected = defineModel()
</script>

<template>
  <label :for="name">{{ `${label}:` }}:</label>
  <select :id="name" :name="name" v-model="selected">
    <option :value="null">{{ `Выберите ${label.toLowerCase()}` }}</option>
    <option v-for="item in arr" v-bind:value="item">
      {{ item }}
    </option>
  </select>
</template>

<style scoped>
label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
}

select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

select:focus {
  border-color: #007bff;
  outline: none;
}
</style>