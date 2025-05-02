const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const WasteLog = require('../../models/waste-management/WasteLog');


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

// Create a waste log (admin, manager, staff)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('waste.js: req.user:', req.user);
    if (!req.user || !req.user.userId) {
      console.log('waste.js: Authentication failed, req.user:', req.user);
      return res.status(401).json({ msg: 'User authentication failed: Missing user ID' });
    }
    console.log('waste.js: Authentication passed, userId:', req.user.userId);
    const { itemName, category, quantityDiscarded, unit, expirationDate, reason } = req.body;
    
    // Validate input
    if (!itemName || !category || !quantityDiscarded || !unit || !reason) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    const wasteLog = new WasteLog({
      item: itemName,
      category,
      quantity: quantityDiscarded,
      unit,
      date: expirationDate || Date.now(),
      reason,
      recordedBy: req.user.userId,
    });

    await wasteLog.save();
    res.status(201).json({ msg: 'Waste log created', wasteLog });
  } catch (err) {
    console.error('waste.js: Error creating waste log:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: 'Invalid input', errors });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get waste logs with filters (all users)
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('waste.js: req.user:', req.user);
    if (!req.user) {
      console.log('waste.js: Authentication failed, req.user:', req.user);
      return res.status(401).json({ msg: 'User authentication failed' });
    }
    console.log('waste.js: Authentication passed, userId:', req.user.userId);
    const { dateStart, dateEnd, search, category } = req.query;
    let query = {};

    if (dateStart || dateEnd) {
      query.date = {};
      if (dateStart) query.date.$gte = new Date(dateStart);
      if (dateEnd) query.date.$lte = new Date(dateEnd);
    }

    if (search) {
      query.item = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const wasteLogs = await WasteLog.find(query)
      .populate('recordedBy', 'name')
      .sort({ date: -1 });
    res.status(200).json(wasteLogs);
  } catch (err) {
    console.error('waste.js: Error fetching waste logs:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a waste log (admin, manager only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('waste.js: req.user:', req.user);
    if (!req.user || !['admin', 'manager'].includes(req.user.role)) {
      console.log('waste.js: Authentication failed, req.user:', req.user);
      return res.status(403).json({ msg: 'Access denied, admin or manager only' });
    }
    console.log('waste.js: Authentication passed, userId:', req.user.userId);
    const wasteLog = await WasteLog.findById(req.params.id);
    if (!wasteLog) {
      return res.status(404).json({ msg: 'Waste log not found' });
    }
    const { itemName, category, quantityDiscarded, unit, expirationDate, reason } = req.body;
    Object.assign(wasteLog, {
      item: itemName || wasteLog.item,
      category: category || wasteLog.category,
      quantity: quantityDiscarded || wasteLog.quantity,
      unit: unit || wasteLog.unit,
      date: expirationDate || wasteLog.date,
      reason: reason || wasteLog.reason,
    });
    await wasteLog.save();
    res.status(200).json({ msg: 'Waste log updated', wasteLog });
  } catch (err) {
    console.error('waste.js: Error updating waste log:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: 'Invalid input', errors });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a waste log (admin, manager only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('waste.js: req.user:', req.user);
    if (!req.user || !['admin', 'manager'].includes(req.user.role)) {
      console.log('waste.js: Authentication failed, req.user:', req.user);
      return res.status(403).json({ msg: 'Access denied, admin or manager only' });
    }
    console.log('waste.js: Authentication passed, userId:', req.user.userId);
    const wasteLog = await WasteLog.findById(req.params.id);
    if (!wasteLog) {
      return res.status(404).json({ msg: 'Waste log not found' });
    }
    await wasteLog.deleteOne();
    res.status(200).json({ msg: 'Waste log deleted' });
  } catch (err) {
    console.error('waste.js: Error deleting waste log:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



// Get analytics data (all users)
router.get('/aanalytics', authMiddleware, async (req, res) => {
  try {
    console.log('waste.js: req.user:', req.user);
    if (!req.user) {
      console.log('waste.js: Authentication failed, req.user:', req.user);
      return res.status(401).json({ msg: 'User authentication failed' });
    }
    console.log('waste.js: Authentication passed, userId:', req.user.userId);
    const { dateStart, dateEnd } = req.query;
    let matchQuery = {};

    if (dateStart || dateEnd) {
      matchQuery.date = {};
      if (dateStart) matchQuery.date.$gte = new Date(dateStart);
      if (dateEnd) matchQuery.date.$lte = new Date(dateEnd);
    }

    const analytics = await WasteLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            category: '$category',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          data: {
            $push: {
              date: '$_id.date',
              quantity: '$totalQuantity',
            },
          },
        },
      },
      {
        $project: {
          category: '$_id',
          data: 1,
          _id: 0,
        },
      },
    ]);

    // Calculate total waste and most discarded items
    const totalWaste = await WasteLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: '$quantity' },
        },
      },
    ]);

    const mostDiscardedItems = await WasteLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { item: '$item', category: '$category', unit: '$unit' },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          item: '$_id.item',
          category: '$_id.category',
          quantity: '$totalQuantity',
          unit: '$_id.unit',
          _id: 0,
        },
      },
    ]);

    // Waste by reason
    const wasteByReason = await WasteLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$reason',
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          reasons: { $push: { reason: '$_id', count: '$count' } },
        },
      },
      {
        $project: {
          reasons: {
            $map: {
              input: '$reasons',
              as: 'r',
              in: {
                reason: '$$r.reason',
                percentage: {
                  $multiply: [{ $divide: ['$$r.count', '$total'] }, 100],
                },
              },
            },
          },
          _id: 0,
        },
      },
    ]);

    // Waste by category
    const wasteByCategory = await WasteLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$quantity' },
          unit: { $first: '$unit' },
        },
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          unit: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      totalWaste: totalWaste[0]?.total || 0,
      mostDiscardedItems,
      wasteByReason: wasteByReason[0]?.reasons || [],
      wasteByCategory,
      analytics,
    });
  } catch (err) {
    console.error('waste.js: Error fetching analytics:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a waste log (admin, manager only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('waste.js: req.user:', req.user);
    if (!req.user || !['admin', 'manager'].includes(req.user.role)) {
      console.log('waste.js: Authentication failed, req.user:', req.user);
      return res.status(403).json({ msg: 'Access denied, admin or manager only' });
    }
    console.log('waste.js: Authentication passed, userId:', req.user.userId);
    const wasteLog = await WasteLog.findById(req.params.id);
    if (!wasteLog) {
      return res.status(404).json({ msg: 'Waste log not found' });
    }
    const { itemName, category, quantityDiscarded, unit, expirationDate, reason } = req.body;
    Object.assign(wasteLog, {
      item: itemName || wasteLog.item,
      category: category || wasteLog.category,
      quantity: quantityDiscarded || wasteLog.quantity,
      unit: unit || wasteLog.unit,
      date: expirationDate || wasteLog.date,
      reason: reason || wasteLog.reason,
    });
    await wasteLog.save();
    res.status(200).json({ msg: 'Waste log updated', wasteLog });
  } catch (err) {
    console.error('waste.js: Error updating waste log:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: 'Invalid input', errors });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a waste log (admin, manager only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('waste.js: req.user:', req.user);
    if (!req.user || !['admin', 'manager'].includes(req.user.role)) {
      console.log('waste.js: Authentication failed, req.user:', req.user);
      return res.status(403).json({ msg: 'Access denied, admin or manager only' });
    }
    console.log('waste.js: Authentication passed, userId:', req.user.userId);
    const wasteLog = await WasteLog.findById(req.params.id);
    if (!wasteLog) {
      return res.status(404).json({ msg: 'Waste log not found' });
    }
    await wasteLog.deleteOne();
    res.status(200).json({ msg: 'Waste log deleted' });
  } catch (err) {
    console.error('waste.js: Error deleting waste log:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/analytics', authMiddleware, async (req, res) => {
    try {
      const { dateStart, dateEnd } = req.query;
      const query = {};
      if (dateStart) query.date = { $gte: new Date(dateStart) };
      if (dateEnd) query.date = { ...query.date, $lte: new Date(dateEnd) };
      if (!dateStart && !dateEnd) {
        // Default to last 30 days
        query.date = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
      }
  
      const wasteLogs = await WasteLog.find(query).populate('recordedBy', 'name');
  
      // Calculate totals by unit
      const totals = wasteLogs.reduce(
        (acc, log) => {
          if (log.unit === 'kg') acc.totalKg += log.quantity;
          else if (log.unit === 'liters') acc.totalLiters += log.quantity;
          else if (log.unit === 'count') acc.totalCount += log.quantity;
          return acc;
        },
        { totalKg: 0, totalLiters: 0, totalCount: 0 }
      );
  
      // Most discarded items
      const itemMap = wasteLogs.reduce((acc, log) => {
        const key = `${log.item}-${log.unit}-${log.category}`;
        if (!acc[key]) {
          acc[key] = { item: log.item, quantity: 0, unit: log.unit, category: log.category };
        }
        acc[key].quantity += log.quantity;
        return acc;
      }, {});
      const mostDiscardedItems = Object.values(itemMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);
  
      // Waste by reason
      const totalQuantity = wasteLogs.reduce((sum, log) => sum + log.quantity, 0);
      const reasonMap = wasteLogs.reduce((acc, log) => {
        acc[log.reason] = (acc[log.reason] || 0) + log.quantity;
        return acc;
      }, {});
      const wasteByReason = Object.entries(reasonMap).map(([reason, quantity]) => ({
        reason,
        percentage: totalQuantity ? (quantity / totalQuantity) * 100 : 0,
      }));
  
      // Waste by category
      const categoryMap = wasteLogs.reduce((acc, log) => {
        if (!acc[log.category]) {
          acc[log.category] = { total: 0, unit: log.unit };
        }
        acc[log.category].total += log.quantity;
        return acc;
      }, {});
      const wasteByCategory = Object.entries(categoryMap).map(([category, data]) => ({
        category,
        total: data.total,
        unit: data.unit,
      }));
  
      res.json({
        totalKg: totals.totalKg,
        totalLiters: totals.totalLiters,
        totalCount: totals.totalCount,
        mostDiscardedItems,
        wasteByReason,
        wasteByCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });



module.exports = router;