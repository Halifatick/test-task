let data = {}

// Загрузка данных из JSON
const loadData = async () => {
  try {
    const response = await fetch('data.json')
    data = await response.json()

    // Заполняем списки
    populateSelect(citySelect, data.cities.map(city => city.name), 'Выберите город')
    populateSelect(workshopSelect, getUniqueWorkshops(), 'Выберите цех')
    populateSelect(employeeSelect, getAllEmployees(), 'Выберите сотрудника')
    populateSelect(teamSelect, data.teams, 'Выберите бригаду')
    populateSelect(shiftSelect, data.shifts, 'Выберите смену')

    // Подгружаем сохраненные данные из Cookie
    loadFromCookie()
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

// Функция для заполнения списка
const populateSelect = (selectElement, options, defaultOption = 'Выберите') => {
  const currentValue = selectElement.value // Сохраняем текущее значение
  selectElement.innerHTML = `<option value="">${defaultOption}</option>`
  options.forEach(option => {
    const optionElement = document.createElement('option')
    optionElement.value = option
    optionElement.textContent = option
    selectElement.appendChild(optionElement)
  })
  if (options.includes(currentValue)) {
    selectElement.value = currentValue // Восстанавливаем значение, если оно есть в списке
  }
}

// Уникальные цехи
const getUniqueWorkshops = () => {
  const workshops = new Set()
  data.cities.forEach(city => {
    city.workshops.forEach(workshop => {
      workshops.add(workshop.name)
    })
  })
  return [...workshops]
}

// Уникальные сотрудники
const getAllEmployees = () => {
  const employees = new Set()
  data.cities.forEach(city => {
    city.workshops.forEach(workshop => {
      workshop.employees.forEach(employee => employees.add(employee))
    })
  })
  return [...employees]
}

// Переменные для селектов
const citySelect = document.getElementById('city')
const workshopSelect = document.getElementById('workshop')
const employeeSelect = document.getElementById('employee')
const teamSelect = document.getElementById('team')
const shiftSelect = document.getElementById('shift')
const saveButton = document.getElementById('save-btn')

// Функция для фильтрации городов
const filterCities = (selectedWorkshop, selectedEmployee) => {
  return data.cities
      .filter(city => {
        const workshopMatches = !selectedWorkshop || city.workshops.some(workshop => workshop.name === selectedWorkshop)
        const employeeMatches = !selectedEmployee || city.workshops.some(workshop => workshop.employees.includes(selectedEmployee))
        return workshopMatches && employeeMatches
      })
      .map(city => city.name)
}

// Функция для фильтрации цехов
const filterWorkshops = (selectedCity, selectedEmployee) => {
  const workshops = new Set()
  data.cities.forEach(city => {
    if (!selectedCity || city.name === selectedCity) {
      city.workshops.forEach(workshop => {
        if (!selectedEmployee || workshop.employees.includes(selectedEmployee)) {
          workshops.add(workshop.name)
        }
      })
    }
  })
  return [...workshops]
}

// Функция для фильтрации сотрудников
const filterEmployees = (selectedCity, selectedWorkshop) => {
  const employees = new Set()
  data.cities.forEach(city => {
    if (!selectedCity || city.name === selectedCity) {
      city.workshops.forEach(workshop => {
        if (!selectedWorkshop || workshop.name === selectedWorkshop) {
          workshop.employees.forEach(employee => employees.add(employee))
        }
      })
    }
  })
  return [...employees]
}

// Общая функция фильтрации
const updateFilters = () => {
  const selectedCity = citySelect.value
  const selectedWorkshop = workshopSelect.value
  const selectedEmployee = employeeSelect.value

  // Обновляем списки
  populateSelect(citySelect, filterCities(selectedWorkshop, selectedEmployee), 'Выберите город')
  populateSelect(workshopSelect, filterWorkshops(selectedCity, selectedEmployee), 'Выберите цех')
  populateSelect(employeeSelect, filterEmployees(selectedCity, selectedWorkshop), 'Выберите сотрудника')
}

// Обработчики изменений
citySelect.addEventListener('change', updateFilters)
workshopSelect.addEventListener('change', updateFilters)
employeeSelect.addEventListener('change', updateFilters)

// Кнопка сохранения
saveButton.addEventListener('click', () => {
  const selectedData = {
    city: citySelect.value,
    workshop: workshopSelect.value,
    employee: employeeSelect.value,
    team: teamSelect.value,
    shift: shiftSelect.value,
  }

  // Сохраняем данные в cookie
  document.cookie = `formData=${encodeURIComponent(JSON.stringify(selectedData))};path=/;max-age=3600`
  alert('Данные сохранены в Cookie!')
})

// Функция для загрузки данных из Cookie
const loadFromCookie = () => {
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=')
    acc[key] = decodeURIComponent(value)
    return acc
  }, {})

  if (cookies.formData) {
    const savedData = JSON.parse(cookies.formData)

    if (savedData.city) citySelect.value = savedData.city
    if (savedData.workshop) workshopSelect.value = savedData.workshop
    if (savedData.employee) employeeSelect.value = savedData.employee
    if (savedData.team) teamSelect.value = savedData.team
    if (savedData.shift) shiftSelect.value = savedData.shift

    updateFilters() // Обновляем фильтры на основе загруженных данных
  }
}

// Инициализация
loadData()
