import express from 'express'
import User from '../../models/User.mjs'
import auth from '../../middleware/auth.mjs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'


const router = express.Router()


// @route:   GET api/auth
// @desc:    Test route
// @access:  Public
// router.get('/', (req, res) => res.send('Auth Route'));



// @route:   GET api/auth
// @desc:    Auth route
// @access:  Private

router.get('/', auth , async (req, res)=>{

    try {
        // Get user infor from database using user id (use Select('-password to skip password))
        const user = await User.findById(req.user.id).select('-password')

        // Send user info
        res.json(user)

    } catch (err) {
        console.error(err)
        res.status(500).json({errors : [{msg: 'Server Error'}] })
    }

})


// @route:   POST api/auth
// @desc:    Login route
// @access:  Private

router.post('/',  
    [
        // Validation array: parameter, error message, validation function
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password Required').not().isEmpty()
    ], async (req, res) => {
    
        //Check if any validation errors
        const errors = validationResult(req) // check the request agains the validation array

        // if errors, send them as a 400 error 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
    
        // Destructure req
        const {email, password} = req.body

        try {
            // Find user and check if they exist 
            let user = await User.findOne({ email })

            if(!user){
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
            }
            //Chek if password match
            const isMatch = await bcrypt.compare(password, user.password)

            // if password doesn't match return
            if(!isMatch){
                res.status(400).json({erros : [{ msg : 'Invalid Credentials'}] })
            }

        // Create a jwt payload
        const payload ={
            user : {
                id: user._id
            }
        }

        //Sign and send jwt in response
        jwt.sign(
            payload, 
            process.env.jwtSecret, 
            {expiresIn: 3600}, (err, token)=>{
                if (err) throw err
                // if there is not an error, send the token 
                res.json(token)
            } 
        )

        } catch (err) {
            console.error(err)
            res.status(500).json({errors : [{ msg : 'Server Error'}] })
            
        }
})


export default router;