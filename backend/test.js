const express = require('express');
const cors = require('cors');
const cookie = require('cookie');

const app = express();
const port = 3002;

// Allow requests from your React app
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Set a cookie when hitting /set-cookie
app.get('/set-cookie', (req, res) => {
    res.setHeader("Set-Cookie", cookie.serialize("auth", "true", {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 60 * 24
    }));
    res.send("Cookie has been set");
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
