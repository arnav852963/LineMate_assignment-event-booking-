import { Audit } from '../models/audit.model.js';

export const auditLogMiddleware = (req, res, next) => {
  if (req.method !== 'GET') {
    res.on('finish', async () => {
      try {
        // We clone the body so we can redact sensitive info
        let safePayload = { ...req.body };
        if (safePayload.password) {
          safePayload.password = '***REDACTED***'; // Never store plaintext passwords in audit logs!
        }

        await Audit.create({
          user: req.user ? req.user._id : null,
          method: req.method,
          endpoint: req.originalUrl || req.url,
          payload: safePayload,
          ipAddress: req.ip || req.connection?.remoteAddress,
        });
      } catch (error) {
        console.error('Failed to create audit log:', error);
      }
    });
  }

  next();
};
