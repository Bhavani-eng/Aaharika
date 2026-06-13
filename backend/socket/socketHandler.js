const jwt = require('jsonwebtoken');
const User = require('../models/User');

const initializeSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) return next(new Error('User not found or inactive'));

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);
    if (socket.userRole === 'admin') socket.join('admin');
    if (socket.userRole === 'ngo') socket.join('ngos');
    if (socket.userRole === 'donor') socket.join('donors');
    if (socket.userRole === 'volunteer') socket.join('volunteers');

    socket.on('join:donation', (donationId) => {
      socket.join(`donation:${donationId}`);
    });

    socket.on('leave:donation', (donationId) => {
      socket.leave(`donation:${donationId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

module.exports = initializeSocket;
