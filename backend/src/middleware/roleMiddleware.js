// inclusive-aid\backend\src\middleware\roleMiddleware.js

const hasRole = (user, requiredRoles) => {
  if (!user || !user.role) return false;
  return requiredRoles.includes(user.role.name);
};

const isAdmin = (req, res, next) => {
  if (req.user && hasRole(req.user, ['admin'])) {
    next();
  } else {
    console.log(`Access denied: User ${req.user ? req.user.id : 'unknown'} attempted to access admin-only route`);
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

const isClient = (req, res, next) => {
  if (req.user && hasRole(req.user, ['client'])) {
    next();
  } else {
    console.log(`Access denied: User ${req.user ? req.user.id : 'unknown'} attempted to access client-only route`);
    res.status(403).json({ message: 'Access denied. Client role required.' });
  }
};

const isServiceWorker = (req, res, next) => {
  if (req.user && hasRole(req.user, ['service_worker'])) {
    next();
  } else {
    console.log(`Access denied: User ${req.user ? req.user.id : 'unknown'} attempted to access service worker-only route`);
    res.status(403).json({ message: 'Access denied. Service worker role required.' });
  }
};

const isAdminOrClient = (req, res, next) => {
  if (req.user && hasRole(req.user, ['admin', 'client'])) {
    next();
  } else {
    console.log(`Access denied: User ${req.user ? req.user.id : 'unknown'} attempted to access admin/client route`);
    res.status(403).json({ message: 'Access denied. Admin or Client role required.' });
  }
};

const isAdminOrServiceWorker = (req, res, next) => {
  if (req.user && hasRole(req.user, ['admin', 'service_worker'])) {
    next();
  } else {
    console.log(`Access denied: User ${req.user ? req.user.id : 'unknown'} attempted to access admin/service worker route`);
    res.status(403).json({ message: 'Access denied. Admin or Service Worker role required.' });
  }
};

const isAdminOrSelf = (req, res, next) => {
  if (req.user && (hasRole(req.user, ['admin']) || req.user.id === parseInt(req.params.id))) {
    next();
  } else {
    console.log(`Access denied: User ${req.user ? req.user.id : 'unknown'} attempted to access another user's data`);
    res.status(403).json({ message: 'Access denied. You can only access your own data unless you are an admin.' });
  }
};

module.exports = { 
  isAdmin, 
  isClient, 
  isServiceWorker, 
  isAdminOrClient, 
  isAdminOrServiceWorker,
  isAdminOrSelf
};