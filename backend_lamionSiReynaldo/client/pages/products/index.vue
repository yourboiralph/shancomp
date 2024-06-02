<script setup>
import { ref, onMounted } from 'vue'
import { productsService } from '@/components/api/admin/ProductsService'
import { FaceFrownIcon } from '@heroicons/vue/24/outline'

const state = ref({
  products: [],
  error: null
})

async function fetchProducts() {
  try {
    const params = {}
    const response = await productsService.getProducts(params)
    console.log('Products Response:', response)
    
    // Extract the actual product data from the response
    state.products = response.data // Assuming `data` contains the product array

    console.log('Products:', state.products);


  } catch (error) {
    console.error('Error fetching products:', error)
    state.error = error
  }
}

onMounted(() => {
  fetchProducts()
})
</script>


<template>
  <div class="grid-cols-2 scrollbar-hide">
    <div class="flex items-center justify-center bg-gray-900">
      <div class="container px-4 mx-auto">
        <div class="flex items-center py-10">
          <h1 class="text-3xl font-bold text-gray-100">Product List</h1>
          <div v-if="state.products.length > 0">
            <h1>{{ state.products[0].name }}</h1>
          </div>
          <div class="flex justify-end grow">
            <nuxt-link to="/products/create" class="px-4 py-2 font-bold text-white transition-colors duration-300 ease-in-out bg-indigo-600 rounded hover:bg-indigo-500">Add Product</nuxt-link>
          </div>
        </div>
        <div v-if="state.products.length" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div v-for="product in state.products" :key="product.id">
            <h2>{{ product.name }}</h2>
            <!-- You can add more product details here -->
          </div>
        </div>
        <div v-else>
          <div class="flex items-center justify-center min-h-full text-center text-gray-100">
            <div class="space-y-4">
              <div class="flex justify-center">
                <FaceFrownIcon class="text-red-600 h-60 w-60" aria-hidden="true"/>
              </div>
              <h3 class="text-xl font-semibold">No products found</h3>
              <p class="text-gray-400">We couldn't find any products at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

