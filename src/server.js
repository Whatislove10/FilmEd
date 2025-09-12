const express = require('express')
const path = require('path')

const app = express()
const PORT = 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public')) // if you have CSS/JS assets

app.get('/home', (req, res) => {
  const user = {
    id: 1,
    name: 'John Doe',
    level: 5,
    avatar: '/avatar.png', // make sure this file exists or use a URL
  }
  res.render('home', { user })
});

app.get('/community', (req, res) => {
	const user = {
		id: 1,
		name: 'John Doe',
		level: 5,
		avatar: '/images/avatar.png',
	}
	res.render('community', { user })
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
