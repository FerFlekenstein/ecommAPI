export default class UserDto {

    getUserToken(user){
        return {
            id: user._id,
            email: user.email,
            nombre: user.nombre,
            avatar: user.avatar
        }
    }
}