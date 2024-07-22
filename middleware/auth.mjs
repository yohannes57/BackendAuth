import jwt from 'jsonwebtoken'


// middleware to get the password token
export default(req, res, next) => {

// Pull token out of header
const token = req.header('x-auth-token')

if(!token){
    return res.status(401).json({errors : [{msg : 'No Token, Auth Denied'}] })
}

try {
    const decoded = jwt.verify(token, process.env.jwtSecret)
    req.user = decoded.user

    next()

} catch (err) {
    console.error(err)
    res.status(401).json({errois : [{msg : 'Token is not Valid'}] })
    
}

}