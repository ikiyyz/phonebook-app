import axios from 'axios'

const BASE_URL = 'http://localhost:3001/api'

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000
})

async function testPhonebookAPI() {
    console.log('🚀 Testing Phonebook API...\n')

    try {
        // Test 1: GET phonebooks
        console.log('1. Testing GET /api/phonebooks')
        const getResponse = await api.get('/phonebooks?page=1&limit=5&keyword=&sort=asc')
        console.log('✅ GET Response:', getResponse.data)
        console.log('Status:', getResponse.status)
        console.log('')

        // Test 2: POST new phonebook
        console.log('2. Testing POST /api/phonebooks')
        const newPhonebook = {
            name: "Rubi Henjaya",
            phone: "08112237786"
        }
        const postResponse = await api.post('/phonebooks', newPhonebook)
        console.log('✅ POST Response:', postResponse.data)
        console.log('Status:', postResponse.status)
        console.log('')

        const phonebookId = postResponse.data.id

        // Test 3: PUT update phonebook
        console.log('3. Testing PUT /api/phonebooks/:id')
        const updatedPhonebook = {
            name: "Rubi Henjaya S.Kom",
            phone: "08112237786"
        }
        const putResponse = await api.put(`/phonebooks/${phonebookId}`, updatedPhonebook)
        console.log('✅ PUT Response:', putResponse.data)
        console.log('Status:', putResponse.status)
        console.log('')

        // Test 4: GET single phonebook
        console.log('4. Testing GET /api/phonebooks/:id')
        const getSingleResponse = await api.get(`/phonebooks/${phonebookId}`)
        console.log('✅ GET Single Response:', getSingleResponse.data)
        console.log('Status:', getSingleResponse.status)
        console.log('')

        console.log('🎉 All tests completed successfully!')

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message)
        console.log('Status:', error.response?.status)
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testPhonebookAPI()
}

export { testPhonebookAPI } 