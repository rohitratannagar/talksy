import jwt from 'jsonwebtoken'; 

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('jwt', token, {
        httpOnly: true, //prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV !== "development",
        sameSite: 'strict', // prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
}

