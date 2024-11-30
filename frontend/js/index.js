document.addEventListener('DOMContentLoaded', () => {
  // DOM Element Selections
  const toolsGrid = document.getElementById('toolsGrid')
  const pagination = document.getElementById('pagination')
  const searchInput = document.getElementById('searchInput')
  const searchButton = document.getElementById('searchButton')
  const navButtons = document.getElementById('navButtons')
  const mobileNavButtons = document.getElementById('mobileNavButtons')
  const mobileMenuToggle = document.getElementById('mobileMenuToggle')
  const mobileMenu = document.getElementById('mobileMenu')
  const toolActionModal = document.getElementById('toolActionModal')

  // Modal Action Buttons
  const editToolBtn = document.getElementById('editToolBtn')
  const deleteToolBtn = document.getElementById('deleteToolBtn')
  const publishToolBtn = document.getElementById('publishToolBtn')
  const closeActionModalBtn = document.getElementById('closeActionModal')

  // State Variables
  let currentPage = 1
  let currentSearch = ''
  let selectedToolId = null

  // Mobile Menu Toggle
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden')
  })

  // Close mobile menu when clicking outside
  document.addEventListener('click', (event) => {
    if (
      !mobileMenu.contains(event.target) &&
      !mobileMenuToggle.contains(event.target)
    ) {
      mobileMenu.classList.add('hidden')
    }
  })

  // Authentication Status Check
  function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')

    const desktopAuthButtons =
      user && token
        ? `<a href="add-tool.html" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-300">Add Tool</a>
           <button id="logoutBtn" class="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition duration-300">Logout</button>`
        : `<a href="login.html" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-300">Login</a>
           <a href="signup.html" class="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition duration-300">Sign Up</a>`

    const mobileAuthButtons =
      user && token
        ? `<a href="add-tool.html" class="text-gray-700 hover:text-blue-600">Add Tool</a>
           <button id="mobileLogoutBtn" class="text-red-500 hover:text-red-600">Logout</button>`
        : `<a href="login.html" class="text-gray-700 hover:text-blue-600">Login</a> 
           <a href="signup.html" class="text-blue-500 hover:text-blue-600">Sign Up</a>`

    // Update desktop and mobile nav buttons
    navButtons.innerHTML = desktopAuthButtons
    mobileNavButtons.innerHTML = mobileAuthButtons

    // Add logout functionality for both desktop and mobile
    document.getElementById('logoutBtn')?.addEventListener('click', logout)
    document.getElementById('mobileLogoutBtn')?.addEventListener('click', logout)
  }

  // Logout Function
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = 'login.html'
  }

  // Fetch Tools
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
      toolsGrid.innerHTML = `<p class="text-red-500">Failed to load tools. ${error.message}</p>`
    }
  }

  // Render Tools
  function renderTools(tools) {
    if (tools.length === 0) {
      toolsGrid.innerHTML ='<p class="text-center text-gray-500">No tools found.</p>'
      return
    }

    toolsGrid.innerHTML = tools
      .map(
        (tool) => `<div class="bg-white rounded-lg shadow-md p-3 relative mb-auto">
            <h3 class="text-base font-bold mb-2">${tool.title}</h3>
            <p class="text-gray-600 mb-2 text-sm">${tool.description || 'No description'}</p>
            <div class="mb-2 text-base"><strong>Platforms:</strong> ${tool.platforms}</div>
            <div class="text-sm text-gray-500 mb-2">Added by: ${tool.author.username}</div>
            <div class="flex space-x-2">
              ${ tool.website ? `<a href="${tool.website}" target="_blank" class="bg-blue-500 text-white px-2 py-1 rounded-md text-sm">Website</a>` : '' }
              ${ tool.sourceCode ? `<a href="${tool.sourceCode}" target="_blank" class="bg-green-500 text-white px-2 py-1 rounded-md text-sm">Source Code</a>` : '' }
            </div>
            ${ checkToolActionPermission(tool) ? `<button class="absolute top-2 right-2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center tool-actions-btn" data-tool-id="${tool._id}"><i class="fas fa-ellipsis-v"></i></button>` : ''}
          </div>`
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

  // Check Tool Action Permissions
  function checkToolActionPermission(tool) {
    const user = JSON.parse(localStorage.getItem('user'))
    return user && (user.id === tool.author._id || user.role === 'admin')
  }

  // Show Tool Action Modal
  function showToolActionModal(toolId) {
    selectedToolId = toolId
    toolActionModal.classList.remove('hidden')
    toolActionModal.classList.add('flex')
  }

  // Close Tool Action Modal
  function closeToolActionModal() {
    toolActionModal.classList.remove('flex')
    toolActionModal.classList.add('hidden')
    selectedToolId = null
  }

  // Edit Tool
  function editTool() {
    if (!selectedToolId) return
    window.location.href = `edit-tool.html?id=${selectedToolId}`
    closeToolActionModal()
  }

  // Delete Tool
  async function deleteTool() {
    if (!selectedToolId) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/tools/${selectedToolId}`, {
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

  // Publish Tool
  async function publishTool() {
    if (!selectedToolId) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/tools/${selectedToolId}`, {
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

  // Render Pagination
  function renderPagination(currentPage, totalPages) {
    pagination.innerHTML = ''
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button')
      pageBtn.textContent = i
      pageBtn.classList.add('px-4', 'py-2', 'rounded-md', currentPage === i ? ('bg-blue-500', 'text-black') : 'bg-gray-200')
      pageBtn.addEventListener('click', () => {
        currentPage = i
        fetchTools(i, currentSearch)
      })
      pagination.appendChild(pageBtn)
    }
  }

  // Search Functionality
  searchButton.addEventListener('click', () => {
    currentSearch = searchInput.value
    currentPage = 1
    fetchTools(currentPage, currentSearch)
  })

  // Modal Button Event Listeners
  editToolBtn.addEventListener('click', editTool)
  deleteToolBtn.addEventListener('click', deleteTool)
  publishToolBtn.addEventListener('click', publishTool)
  closeActionModalBtn.addEventListener('click', closeToolActionModal)

  // Initial Page Load
  checkAuthStatus()
  fetchTools()
})
