import passport from "passport";
import local from 'passport-local';
import config from "./config.js";
import userService from "../dao/mongo/user.js";
import { validatePassword } from "../services/auth.js";
const LocalStrategy = local.Strategy;
const initializeStrategy = () => {
    passport.use("login", new LocalStrategy({ usernameField: "email", passwordField: "password"}, async (email, password, done) => {
        if(email === config.app.ADMIN_USER && password === config.app.ADMIN_PWD){
            return done(null,{_id:0, nombre:"user", apellido: "master", role: "AUTHENTICATED"})
        }
        if (!email || !password) return done(null, false, { message: "Hay campos incompletos!" })
        const user = await userService.getBy({ email })
        if (!user) return done(null, false, { message: "El usuario no es valido" })
        const isValidPassword = await validatePassword(password, user.password)
        if (!isValidPassword) return done(null, false, { message: "Contraseña invalida" })
        return done(null, user)
    }))
}
export default initializeStrategy;