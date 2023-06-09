import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const executePolicies = (policies) => {
    return (req, res, next) => {
        if (policies === "PUBLIC") return next();
        const token = req.cookies[config.jwt.cookie];
        if (!token) return res.redirect('/');
        try {
            const user = jwt.verify(token, config.jwt.token);
            if (user.role === "AUTHENTICATED") {
                req.user = user;
                return next();
            }
            else res.redirect('/')
        } catch (error) {
            res.clearCookie(config.jwt.cookie).status(401).send({ status: "error", error: "Not authenticated" })
        }
    }
}