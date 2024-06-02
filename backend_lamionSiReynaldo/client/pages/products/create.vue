<template>
  <div class="flex items-center justify-center my-10 scrollbar-hide">
    <div class="flex items-center max-w-lg p-6 mx-auto space-x-4 bg-gray-800 shadow-md ring-1 shadow-gray-700 ring-gray-700 rounded-xl">
      <div class="flex flex-col">
        <label class="self-center pb-6 text-lg font-medium text-gray-100">Add Product</label>
        <input v-model="product.name" type="text" placeholder="Name" class="p-2 mb-4 border-2 border-gray-200 rounded-lg textb input hover:border-gray-700" />
        <textarea v-model="product.description" placeholder="Description" class="p-2 mb-4 border-2 border-gray-200 rounded-lg input hover:border-gray-700"></textarea>

        <div class="flex items-center justify-center h-48 p-5 mb-4 overflow-hidden text-gray-100 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-gray-100" @click="triggerFileInput" @dragover.prevent @dragenter.prevent @drop.prevent="handleDrop">
          <template v-if="product.photo">
            <img :src="product.photo" alt="Product Image" class="object-cover max-w-full max-h-full">
          </template>
          <template v-else>Drag and drop photo here or click to select</template>
          <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput">
        </div>

        <input v-model.number="product.quantity" type="number" placeholder="Quantity" class="p-2 mb-4 border-2 border-gray-200 rounded-lg input hover:border-gray-700" />
        <input v-model.number="product.price" type="number" placeholder="Price" class="p-2 mb-4 border-2 border-gray-200 rounded-lg input hover:border-gray-700" />
        <button @click="submitProduct" class="btn bg-[#0072BC] hover:bg-[#1B5D88] text-white p-2 rounded-lg">Submit Product</button>
        <nuxt-link to="../products" class="bg-[#0072BC] hover:bg-[#1B5D88] text-white p-2 mt-3 rounded-lg flex justify-center">Go back</nuxt-link>
      </div>
    </div>
  </div>

  <!-- Notification layout -->
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 md:inset-10 lg:inset-10 flex items-end px-4 py-6 sm:items-start sm:p-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition"
                  enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                  enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
                  leave-active-class="transition ease-in duration-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div v-if="success"  class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div v-else  class="flex-shrink-0">
                <ExclamationCircleIcon  class="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p v-if="success" class="text-sm font-medium text-gray-900">Product successfully saved!</p>
                <p v-else class="text-sm font-medium text-gray-900">Failed to save product!</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="show = false" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/20/solid';

const product = ref({
  name: '',
  description: '',
  photo: '',
  quantity: '',
  price: '',
});

const fileInput = ref(null);
const show = ref(false);
const success = ref(false);

const triggerFileInput = () => {
  fileInput.value.click();
};
const handleDrop = (event) => {
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    readFile(files[0]);
  }
};
const handleFileUpload = () => {
  const file = fileInput.value.files[0];
  if (file) {
    readFile(file);
  }
};
const readFile = (file) => {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file.');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    product.value.photo = e.target.result;
  };
  reader.readAsDataURL(file);
};

const submitProduct = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('_token')}`
      },
      body: JSON.stringify({
        name: product.value.name,
        description: product.value.description,
        quantity: product.value.quantity,
        price: product.value.price,
        photo: product.value.photo
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    const result = await response.json();
    console.log("Product added:", result);
    success.value = true; // Set success to true
    show.value = true; // Show the notification
    resetForm();
  } catch (error) {
    console.error('Error:', error);
    success.value = false; // Set success to false
    show.value = true; // Show the notification
  }
};

const resetForm = () => {
  product.value = { name: '', description: '', photo: '', quantity: '', price: '' };
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
