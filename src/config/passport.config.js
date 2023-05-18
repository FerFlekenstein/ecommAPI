import passport from "passport";
import local from 'passport-local';
import userService from "../dao/mongo/user.js";
import { validatePassword } from "../services/auth.js";
const LocalStrategy = local.Strategy;
const initializeStrategy = () => {
    passport.use('login', new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        if(email===config.app.ADMIN_USER&&password===config.app.ADMIN_PWD){
            return done(null,{_id:0,first_name:"Admin",role:"admin"})
        }
        console.log(email, password);
        if (!email || !password) return done(null, false, { message: "Hay campos incompletos!" })
        const user = await userService.getBy({ email })
        console.log(user);
        if (!user) return done(null, false, { message: "El usuario no es valido" })
        const isValidPassword = await validatePassword(password, user.password)
        console.log(isValidPassword);
        if (!isValidPassword) return done(null, false, { message: "Contraseña invalida" })
        console.log("esta todo bien");
        return done(null, user)
    }))
}
export default initializeStrategy;