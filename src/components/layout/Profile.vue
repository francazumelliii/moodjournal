
<template>

  <section  class="w-full h-full bg-gray-900 flex flex-col items-center justify-start gap-5 rounded-lg">

    <div class="flex justify-start items-center w-full p-5 gap-x-5 bg-gray-800 rounded-lg ">
      <img src="https://api.dicebear.com/9.x/adventurer/svg" alt="profile avatar" class="w-50 h-50  rounded-full bg-gray-600">
      <div class="flex flex-col justify-center items-center gap-y-1">
        <h1 class="text-gray-200 text-2xl font-bold">{{user.name}} {{user.surname}}</h1>
        <p class="text-gray-400 text-sm text-center">@{{ user.username }}</p>
        <p class="text-gray-400 text-sm text-center">{{ user.email }}</p>

      </div>

    </div>

    <section class=" container w-full flex justify-between items-start gap-5">



      <div class="w-7/10 flex flex-col justify-start items-center gap-5 p-4 bg-gray-800 rounded-lg h-[60vh] overflow-y-scroll">
        <h1 class="text-indigo-500 text-center text-3xl font-bold" >My Goals</h1>

        <table class="border border-gray-600 w-full text-gray-300 p-5 rounded-lg relative">
          <thead class="pb-5 bg-gray-600 " >
            <tr class="pb-4">
              <th class="pb-4">Name</th>
              <th class="pb-4">Description</th>
              <th class="pb-4">Expiring Date</th>
              <th class="pb-4"></th>
            </tr>
          </thead>

          <tbody >
          <tr v-for = "goal of goals " >
            <td class="text-center p-2 border-b border-gray-700 ">
              <input
                  type="text"
                  :disabled="!goal.isEditing"
                  :class="[
                      'text-gray-200 w-full border rounded px-2 py-1 focus:outline-none',
                      goal.isEditing ? 'bg-gray-700 border-gray-500 focus:ring-2 focus:ring-gray-500' : 'bg-gray-800 border-transparent'
                    ]"
                  v-model="goal.name"
              >
            </td>
            <td class="text-center p-2  border-b border-gray-700">
              <input
                  type="text"
                  :disabled="!goal.isEditing"
                  :class="[
                      'text-gray-200 w-full border rounded px-2 py-1 focus:outline-none',
                      goal.isEditing ? 'bg-gray-700 border-gray-500 focus:ring-2 focus:ring-gray-500' : 'bg-gray-800 border-transparent'
                    ]"
                  v-model="goal.description"
              >
            </td>
            <td class="text-center p-2  border-b border-gray-700">
              <SimpleCard
                  type="DATE"
                  :disabled="!goal.isEditing"
                  :class="[
                        'text-gray-200 w-full border rounded px-2 py-1 focus:outline-none',
                        goal.isEditing ? 'bg-gray-700 border-gray-500 focus:ring-2 focus:ring-gray-500' : 'bg-gray-800 border-transparent'
                      ]"
                  v-model="goal.expiringDate"
              />
            </td>
            <td class="text-center px-3 border-b border-gray-700" @click="editGoal(goal)" v-if="!goal.isEditing">
              <svg class="w-5 h-5 text-gray-800 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
              </svg>

            </td>
            <td class="text-center p-3 py-7 border-b border-gray-700 flex items-center gap-2 "  v-if="goal.isEditing">
              <svg @click="putGoal(goal)" class="w-5 h-5 text-gray-800 dark:text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
              </svg>
              <svg  @click="deleteGoal(goal)" class="w-5 h-5 dark:text-red-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>


            </td>

          </tr>
          </tbody>
        </table>

      </div>

      <div class="container w-3/10 bg-gray-800 rounded-lg flex flex-col justify-center p-4">
        <h1 class="text-indigo-500 text-center text-3xl font-bold" >Create new Goal</h1>
        <SimpleCard v-model="goalName" type="INPUT_ONLY" label="Name" />
        <SimpleCard v-model="goalDescription" type="INPUT_ONLY" label="Description" />
        <SimpleCard v-model="goalExpiringDate" type="DATE" label="Expiring date" />

        <button
            @click="createGoal"
            type="button"
            :disabled="!goalName || !goalExpiringDate"
            class="text-white bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          CREATE
        </button>

      </div>

    </section>


  </section>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import router from "@/router/index.js";
import ApiService from "@/services/ApiService.js";
import SimpleCard from "@/components/layout/SimpleCard.vue";

onMounted(async () => {
  checkLogin();
  await fetchGoals()
})


const goalName = ref("");
const goalDescription = ref("");
const goalExpiringDate = ref("");

const isUpdate = ref(false);

const user = ref(JSON.parse(localStorage.getItem('user')));
const goals = ref([]);



async function fetchGoals() {
  try {
    const response = await ApiService.get("/goals/all?userId=" + user.value.id);
    if (response) {
      goals.value = response.map(goal => ({
        ...goal,
        isEditing: false, // nuova proprietà per ciascun goal
      }));
    }
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
}

function checkLogin() {
  if(!localStorage.getItem("user")){
    router.push("/")
  }
}

async function createGoal(){
  const body = {
    name: goalName.value,
    description: goalDescription.value,
    expiringDate: goalExpiringDate.value,
    user: {id: user.value.id}
  }
  console.log(body)

  try{
    const response = await ApiService.post("/goals", body);
    if(response){
      console.log("Goal created successfully");
      await fetchGoals();
      goalName.value = "";
      goalDescription.value = "";
      goalExpiringDate.value = "";
    }
  } catch (error) {
    console.error("Error creating goal:", error);
  }
}

function editGoal(goalToEdit) {
  goals.value.forEach(goal => {
    goal.isEditing = goal === goalToEdit;
  });
}

async function putGoal(goalToUpdate) {
  const body = {
    id: goalToUpdate.id,
    name: goalToUpdate.name,
    description: goalToUpdate.description,
    expiringDate: goalToUpdate.expiringDate,
    user: {id: user.value.id}
  }
  try {
    const response = await ApiService.put(`/goals/${goalToUpdate.id}`, body);
    if (response) {
      console.log("Goal updated successfully");
      await fetchGoals();
    }
  } catch (error) {
    console.error("Error updating goal:", error);
  } finally {
    goalToUpdate.isEditing = false;
  }
}
async function deleteGoal(goalToDelete) {
  try {
    const response = await ApiService.delete(`/goals/${goalToDelete.id}`);
    if (response) {
      console.log("Goal deleted successfully");
      await fetchGoals();
    }
  } catch (error) {
    console.error("Error deleting goal:", error);
  }
}

</script>

