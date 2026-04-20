class UserDTO {
    constructor (user){
        this.user_id = user._id
        this.user_name = user.name
        this.user_email = user.email
        this.user_password = user.password
        this.user_created_at = user.created_at
        this.user_email_verified = user.email_verified

    }
}

export default UserDTO