<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Orders</h1>
  
      <!-- Tabs for order status -->
      <div class="mb-4 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <a href="#" 
             class="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm text-gray-600 border-transparent hover:border-gray-300"
             :class="{'border-indigo-500 text-indigo-600': activeTab === 'all'}"
             @click.prevent="activeTab = 'all'">All Orders</a>
          <a href="#" 
             class="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm text-gray-600 border-transparent hover:border-gray-300"
             :class="{'border-red-500 text-red-600': activeTab === 'pending'}"
             @click.prevent="activeTab = 'pending'">Pending</a>
          <a href="#" 
             class="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm text-gray-600 border-transparent hover:border-gray-300"
             :class="{'border-orange-500 text-orange-600': activeTab === 'processing'}"
             @click.prevent="activeTab = 'processing'">Processing</a>
          <a href="#" 
             class="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm text-gray-600 border-transparent hover:border-gray-300"
             :class="{'border-green-500 text-green-600': activeTab === 'completed'}"
             @click.prevent="activeTab = 'completed'">Completed</a>
        </nav>
      </div>
  
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.customer_id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.order_date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{{ order.total_price }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span 
                :class="[
                  'font-semibold',
                  order.order_status.toLowerCase() === 'pending' ? 'text-red-600' : '',
                  order.order_status.toLowerCase() === 'processing' ? 'text-orange-600' : '',
                  order.order_status.toLowerCase() === 'completed' ? 'text-green-600' : ''
                ]">
                {{ formattedStatus(order.order_status) }}
              </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="text-indigo-600 hover:text-indigo-900">View</button>
                <button class="ml-2 text-indigo-600 hover:text-indigo-900">Update</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination component -->
      <nav v-if="totalOrders > 0" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
          aria-label="Pagination">
        <div class="hidden sm:block">
          <p class="text-sm text-gray-700">
            Showing
            {{ ' ' }}
            <span class="font-medium">{{ startRecord }}</span>
            {{ ' ' }}
            to
            {{ ' ' }}
            <span class="font-medium">{{ endRecord }}</span>
            {{ ' ' }}
            of
            {{ ' ' }}
            <span class="font-medium">{{ totalOrders }}</span>
            {{ ' ' }}
            results
          </p>
        </div>
        <div class="flex flex-1 justify-between sm:justify-end">
          <button @click="previousPage" :disabled="currentPage === 1" 
              class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">
              Previous
          </button>
          <button @click="nextPage" :disabled="endRecord >= totalOrders"
              class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">
              Next
          </button>
        </div>
      </nav>

      <div v-else class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <p class="text-sm text-gray-700">
          Showing 0 of 0 results
        </p>
      </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const orders = ref([])
  const loading = ref(true)
  const activeTab = ref('all')

  const currentPage = ref(1)
const itemsPerPage = 10
  
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('_token')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      orders.value = data.data
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      loading.value = false
    }
  }
  
  const filteredOrders = computed(() => {
    if (activeTab.value === 'all') {
      return orders.value
    }
    return orders.value.filter(order => order.order_status.toLowerCase() === activeTab.value)
  })

  const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredOrders.value.slice(start, end)
})

const totalOrders = computed(() => filteredOrders.value.length)
const startRecord = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endRecord = computed(() => Math.min(currentPage.value * itemsPerPage, totalOrders.value))


  
  const formattedStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (endRecord.value < totalOrders.value) {
    currentPage.value++
  }
}

  onMounted(() => {
    fetchOrders()
  })
  </script>
  
  <style scoped>
  /* Additional custom styles if necessary */
  </style>
  