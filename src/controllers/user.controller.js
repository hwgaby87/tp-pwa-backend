import userService from "../services/user.service.js";

class UserController {
    async listUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json({
                ok: true,
                status: 200,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    async getUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            return res.status(200).json({
                ok: true,
                status: 200,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await userService.deleteUserById(id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const id = req.params.id || req.body.id || req.user?.id;
            const new_user_props = req.body;
            const updated_user = await userService.updateUserById(id, new_user_props);
            return res.status(200).json({
                ok: true,
                status: 200,
                data: updated_user
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();