class UserDTO {
    constructor (user){
        this._id = user._id
        this.name = user.name
        this.email = user.email
        this.password = user.password
        this.created_at = user.created_at
        this.email_verified = user.email_verified
        this.image = user.image
    }
}

export default UserDTO