document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm')

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const loginIdentifier = document.getElementById('loginIdentifier').value
    const loginPassword = document.getElementById('loginPassword').value

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginIdentifier, password: loginPassword }),
      })

      const data = await response.json()

      if (data.status === 'success') {
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))

        // Redirect to homepage
        window.location.href = 'index.html'
      } else {
        alert(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login')
    }
  })
})
