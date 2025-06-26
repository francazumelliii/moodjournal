<script setup>
import { ref, computed } from "vue"
import apiService from "@/services/ApiService.js"
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const surname = ref('')
const email = ref('')
const username = ref('')
const password = ref('')

// Validazione email semplice
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

const isFormValid = computed(() => {
  return (
      name.value.trim() !== '' &&
      surname.value.trim() !== '' &&
      validateEmail(email.value) &&
      username.value.trim() !== '' &&
      password.value.trim() !== ''
  )
})

async function submitForm() {
  const body = {
    name: name.value,
    surname: surname.value,
    email: email.value,
    username: username.value,
    password: password.value
  }

  try {
    const response = await apiService.post("/signup", body)
    if (response) {
      localStorage.setItem("user", JSON.stringify(response))
      router.push("/home")
    }
  } catch (error) {
    console.error("Signup failed:", error)
  }
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
        Flowbite
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create your account
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="submitForm">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
              <input
                  v-model="name"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Mario"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label for="surname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
              <input
                  v-model="surname"
                  type="text"
                  name="surname"
                  id="surname"
                  placeholder="Rossi"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                  v-model="email"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@company.com"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input
                  v-model="username"
                  type="text"
                  name="username"
                  id="username"
                  placeholder="mariorossi"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input
                  v-model="password"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <button
                type="submit"
                :disabled="!isFormValid"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign up
            </button>

            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?
              <router-link to="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
