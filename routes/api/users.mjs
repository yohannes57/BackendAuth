import express from 'express';
const router = express.Router();
import User from '../../models/User.mjs';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// @route:   GET api/users
// @desc:    Test route
// @access:  Public
router.post(
    '/',
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check(
        'password',
        'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 }),
    ],
    async (req, res) => {
      //Check if any validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      //Destructure our req
      const { name, email, password } = req.body;
  
      try {
        //Check is user already exists
        let user = await User.findOne({ email });
        //If they exist respond with error
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User Already Exist' }] });
        }
  
        //Create a user
        user = new User({
          name,
          email,
          password,
        })
  
        //Excrypt password
        const salt = await bcrypt.genSalt(10)
  
        user.password = await bcrypt.hash(password, salt)

        await user.save();

        //create payload (data for the rfront end)
        const payload={
            user:{
                id:user.id,
                name:user.name
            }
        }
//signature
jwt.sign(
    payload,
    process.env.jwtSecret,
    {expiresIn:3600},
    (err,token)=>{
        if(err) throw err;

        res.json({token})
    }
)

      } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
      }
    }
  );
router.get('/', (req, res) => res.send('User Route'));

export default router;
