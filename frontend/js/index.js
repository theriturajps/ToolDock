document.addEventListener('DOMContentLoaded', () => {
  const toolsGrid = document.getElementById('toolsGrid')
  const pagination = document.getElementById('pagination')
  const searchInput = document.getElementById('searchInput')
  const searchButton = document.getElementById('searchButton')
  const navButtons = document.getElementById('navButtons')
  const toolActionModal = document.getElementById('toolActionModal')

  let currentPage = 1
  let currentSearch = ''

  // Check authentication status
  function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')

    // Update nav buttons based on auth status
    if (user && token) {
      navButtons.innerHTML = `
        <a href="add-tool.html" class="bg-green-500 text-white px-4 py-2 rounded-md">Add Tool</a>
        <button id="logoutBtn" class="bg-red-500 text-white px-4 py-2 rounded-md">Logout</button>
      `

      // Add logout functionality
      document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = 'login.html'
      })
    } else {
      navButtons.innerHTML = `
        <a href="login.html" class="bg-blue-500 text-white px-4 py-2 rounded-md">Login</a>
        <a href="signup.html" class="bg-green-500 text-white px-4 py-2 rounded-md">Sign Up</a>
      `
    }
  }

  // Fetch tools
  async function fetchTools(page = 1, search = '') {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/tools?page=${page}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.status === 'success') {
        renderTools(data.data.tools)
        renderPagination(data.currentPage, data.totalPages)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
      toolsGrid.innerHTML = `<p class="text-red-500">Failed to load tools</p>`
    }
  }

  // Render tools
  function renderTools(tools) {
    toolsGrid.innerHTML = tools
      .map(
        (tool) => `
      <div class="bg-white rounded-lg shadow-md p-6 relative">
        <h3 class="text-xl font-bold mb-2">${tool.title}</h3>
        <p class="text-gray-600 mb-4">${
          tool.description || 'No description'
        }</p>
        <div class="mb-2">
          <strong>Platforms:</strong> ${tool.platforms}
        </div>
        <div class="text-sm text-gray-500 mb-4">
          Added by: ${tool.author.username}
        </div>
        <div class="flex space-x-2">
          ${
            tool.website
              ? `<a href="${tool.website}" target="_blank" class="bg-blue-500 text-white px-2 py-1 rounded-md text-sm">Website</a>`
              : ''
          }
          ${
            tool.sourceCode
              ? `<a href="${tool.sourceCode}" target="_blank" class="bg-green-500 text-white px-2 py-1 rounded-md text-sm">Source Code</a>`
              : ''
          }
        </div>
        ${
          checkToolActionPermission(tool)
            ? `
          <button class="absolute top-2 right-2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center tool-actions-btn" data-tool-id="${tool._id}">
            <i class="fas fa-ellipsis-v"></i>
          </button>
        `
            : ''
        }
      </div>
    `
      )
      .join('')

    // Add event listeners for tool action buttons
    document.querySelectorAll('.tool-actions-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const toolId = e.currentTarget.dataset.toolId
        showToolActionModal(toolId)
      })
    })
  }

  // Check if current user can perform actions on tool
  function checkToolActionPermission(tool) {
    const user = JSON.parse(localStorage.getItem('user'))
    return user && (user.id === tool.author._id || user.role === 'admin')
  }

  // Show tool action modal
  function showToolActionModal(toolId) {
    toolActionModal.classList.remove('hidden')
    toolActionModal.classList.add('flex')

    // Action button event listeners
    document.getElementById('editToolBtn').onclick = () => editTool(toolId)
    document.getElementById('deleteToolBtn').onclick = () => deleteTool(toolId)
    document.getElementById('publishToolBtn').onclick = () =>
      publishTool(toolId)
    document.getElementById('closeActionModal').onclick = closeToolActionModal
  }

  // Close tool action modal
  function closeToolActionModal() {
    toolActionModal.classList.remove('flex')
    toolActionModal.classList.add('hidden')
  }

  // Edit tool
  function editTool(toolId) {
    // Implement tool edit logic
    closeToolActionModal()
  }

  // Delete tool
  async function deleteTool(toolId) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/tools/${toolId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 204) {
        fetchTools(currentPage, currentSearch)
        closeToolActionModal()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete tool')
      }
    } catch (error) {
      console.error('Delete tool error:', error)
      alert('An error occurred while deleting the tool')
    }
  }

  // Publish tool
  async function publishTool(toolId) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/tools/${toolId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: true }),
      })

      const data = await response.json()

      if (data.status === 'success') {
        fetchTools(currentPage, currentSearch)
        closeToolActionModal()
      } else {
        alert(data.message || 'Failed to publish tool')
      }
    } catch (error) {
      console.error('Publish tool error:', error)
      alert('An error occurred while publishing the tool')
    }
  }

  // Render pagination
  function renderPagination(currentPage, totalPages) {
    pagination.innerHTML = ''
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button')
      pageBtn.textContent = i
      pageBtn.classList.add('px-4','py-2','rounded-md',currentPage === i ? ('bg-blue-500', 'text-white') : 'bg-gray-200')
      pageBtn.addEventListener('click', () => {
        currentPage = i
        fetchTools(i, currentSearch)
      })
      pagination.appendChild(pageBtn)
    }
  }

  // Search functionality
  searchButton.addEventListener('click', () => {
    currentSearch = searchInput.value
    currentPage = 1
    fetchTools(currentPage, currentSearch)
  })

  // Initial load
  checkAuthStatus()
  fetchTools()
})
