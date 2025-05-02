const express = require('express');
   const router = express.Router();
   const bcrypt = require('bcryptjs');
   const jwt = require('jsonwebtoken');
   const User = require('../../models/user-managemnt/User');
    

   // Middleware to verify JWT token
   const authMiddleware = (req, res, next) => {
    console.log('authMiddleware: Processing request for', req.method, req.url);
    
     const authHeader = req.header('Authorization');
     console.log('authMiddleware: Authorization header:', authHeader || 'none');
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
      
       console.log('Missing or invalid Authorization header:', authHeader);
       return res.status(401).json({ msg: 'No token, authorization denied' });
     }

     const token = authHeader.replace('Bearer ', '');
     console.log('Received token:', token);
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       console.log('authMiddleware: Decoded JWT:', decoded);
       console.log('Decoded JWT:', decoded);
       req.user = decoded;
       console.log('authMiddleware: User ID:', decoded);
       next();
     } catch (err) {
       console.error('Token verification error:', err.message);
       res.status(401).json({ msg: 'Token is not valid' });
     }
   };

   // Register User (admin, manager, staff)
   router.post('/register', async (req, res) => {
     const { name, email, password, role } = req.body;

     try {
       let user = await User.findOne({ email });
       if (user) return res.status(400).json({ msg: 'User already exists' });

       user = new User({
         name,
         email,
         password: await bcrypt.hash(password, 10),
         role: role || 'staff',
         status: 'active',
       });

       await user.save();

       const payload = { userId: user.id, role: user.role };
       const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

       res.status(201).json({ token });
     } catch (err) {
       console.error(err);
       res.status(500).json({ msg: 'Server error' });
     }
   });

   // Login User
   router.post('/login', async (req, res) => {
     const { email, password } = req.body;

     try {
       const user = await User.findOne({ email });
       if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

       const payload = { userId: user.id, role: user.role };
       const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

       res.json({
         token,
         user: {
           id: user.id,
           name: user.name,
           email: user.email,
           role: user.role,
           status: user.status,
         },
       });
     } catch (err) {
       console.error(err);
       res.status(500).json({ msg: 'Server error' });
     }
   });

   // Get all users (admin/manager only)
   router.get('/users', authMiddleware, async (req, res) => {
     if (req.user.role !== 'admin' && req.user.role !== 'manager') {
       return res.status(403).json({ msg: 'Access denied' });
     }

     try {
       const users = await User.find().select('-password');
       res.json(users);
     } catch (err) {
       console.error(err);
       res.status(500).json({ msg: 'Server error' });
     }
   });

   // Update user (admin/manager only)
   router.put('/users/:id', authMiddleware, async (req, res) => {
     if (req.user.role !== 'admin' && req.user.role !== 'manager') {
       return res.status(403).json({ msg: 'Access denied' });
     }

     const { name, email, role, status } = req.body;

     try {
       const user = await User.findById(req.params.id);
       if (!user) return res.status(404).json({ msg: 'User not found' });

       user.name = name || user.name;
       user.email = email || user.email;
       user.role = role || user.role;
       user.status = status || user.status;

       await user.save();
       res.json(user);
     } catch (err) {
       console.error(err);
       res.status(500).json({ msg: 'Server error' });
     }
   });

   // Delete user (admin/manager only)
   router.delete('/users/:id', authMiddleware, async (req, res) => {
     if (req.user.role !== 'admin' && req.user.role !== 'manager') {
       return res.status(403).json({ msg: 'Access denied' });
     }

     try {
       const user = await User.findById(req.params.id);
       if (!user) return res.status(404).json({ msg: 'User not found' });

       await user.deleteOne();
       res.json({ msg: 'User deleted' });
     } catch (err) {
       console.error(err);
       res.status(500).json({ msg: 'Server error' });
     }
   });

   module.exports = router;