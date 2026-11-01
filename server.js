const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


const CORRECT_PASSWORD = "05.05.2026"; 

app.use(express.json());


let authorizedUsers = new Set();


app.post('/api/login', (req, res) => {
    const { password } = req.body;
    

    const cleanInput = password ? password.replace(/[^0-9]/g, '') : '';
    const isCorrect = (password === CORRECT_PASSWORD) || (cleanInput === "05052026");

    if (isCorrect) {
        
        const token = Math.random().toString(36).substring(7);
        authorizedUsers.add(token);
        
  
        res.cookie('auth_token', token, { httpOnly: true, maxAge: 600000 });
        return res.sendStatus(200);
    }
    
    res.sendStatus(401);
});


app.get('/success.html', (req, res, next) => {
    const token = req.headers.cookie?.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
    
    if (token && authorizedUsers.has(token)) {
       
        return next();
    }
    
    res.redirect('/');
});


app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});