document.addEventListener('DOMContentLoaded', () => {
  const addToolForm = document.getElementById('addToolForm')

  // Check if user is authenticated
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = 'login.html'
  }

  addToolForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const title = document.getElementById('toolTitle').value
    const description = document.getElementById('toolDescription').value
    const website = document.getElementById('toolWebsite').value
    const sourceCode = document.getElementById('toolSourceCode').value
    const platforms = document.getElementById('toolPlatforms').value

    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          website,
          sourceCode,
          platforms,
        }),
      })

      const data = await response.json()

      if (data.status === 'success') {
        alert('Tool added successfully!')
        window.location.href = 'index.html'
      } else {
        alert(data.message || 'Failed to add tool')
      }
    } catch (error) {
      console.error('Add tool error:', error)
      alert('An error occurred while adding the tool')
    }
  })
})
