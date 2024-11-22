<script setup>
import {onMounted, reactive, watch} from 'vue'
import SelectBase from '@/components/SelectBase.vue'

const props = defineProps({
  data: Object,
})

const initialForm = () => {
  return {
    city: null,
    workshop: null,
    employee: null,
    team: null,
    shift: null,
  }
}

const form = reactive(initialForm())

const filteredOptions = reactive({
  cities: [],
  workshops: [],
  employees: [],
  teams: [],
  shifts: [],
})

const updateFilters = () => {
  filteredOptions.cities = props.data.cities
      .filter(city => {
        if (form.workshop)
          return city.workshops.some(workshop => workshop.name === form.workshop)
        if (form.employee)
          return city.workshops.some(workshop => workshop.employees.includes(form.employee))
        return true
      })
      .map(city => city.name)

  filteredOptions.workshops = props.data.cities
      .filter(city => !form.city || city.name === form.city)
      .flatMap(city => city.workshops)
      .filter(workshop => {
        if (form.employee)
          return workshop.employees.includes(form.employee)
        return true
      })
      .map(workshop => workshop.name)
      .filter((v, i, a) => a.indexOf(v) === i)

  filteredOptions.employees = props.data.cities
      .filter(city => !form.city || city.name === form.city)
      .flatMap(city => city.workshops)
      .filter(workshop => !form.workshop || workshop.name === form.workshop)
      .flatMap(workshop => workshop.employees)
      .filter((v, i, a) => a.indexOf(v) === i)

  filteredOptions.teams = props.data.teams
  filteredOptions.shifts = props.data.shifts
}

const saveForm = () => {
  document.cookie = `formData=${encodeURIComponent(JSON.stringify(form))};path=/;max-age=3600`
  alert('Данные сохранены в Cookie!')
}

const loadFromCookie = () => {
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=')
    acc[key] = decodeURIComponent(value)
    return acc
  }, {})

  if (cookies.formData) {
    Object.assign(form, JSON.parse(cookies.formData))
    updateFilters()
  }
}

watch(form, updateFilters, { deep: true })

onMounted(() => {
  updateFilters()
  loadFromCookie()
})
</script>

<template>
  <form>
    <SelectBase v-model="form.city" label="Город" name="city" :arr="filteredOptions.cities"/>
    <SelectBase v-model="form.workshop" label="Цех" name="workshop" :arr="filteredOptions.workshops"/>
    <SelectBase v-model="form.employee" label="Сотрудник" name="employee" :arr="filteredOptions.employees"/>
    <SelectBase v-model="form.team" label="Бригада" name="team" :arr="filteredOptions.teams"/>
    <SelectBase v-model="form.shift" label="Смена" name="shift" :arr="filteredOptions.shifts"/>

    <button type="button" @click="saveForm">Сохранить</button>
  </form>
</template>

<style scoped>
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #0056b3;
}
</style>