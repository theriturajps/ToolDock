document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm')

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const name = document.getElementById('name').value
    const role = document.getElementById('role').value

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          name,
          role,
        }),
      })

      const data = await response.json()

      if (data.status === 'success') {
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))

        // Redirect to homepage
        window.location.href = 'index.html'
      } else {
        alert(data.message || 'Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('An error occurred during signup')
    }
  })
})
