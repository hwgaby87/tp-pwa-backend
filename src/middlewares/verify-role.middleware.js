import { ROLES_HIERARCHY } from "../constants/member-roles.constant.js";

/**
 * Middleware para verificar si el usuario tiene el rol requerido o superior.
 * @param {string} required_role - El rol mínimo requerido (owner, admin, user).
 */
const verifyRole = (required_role) => {
    return (req, res, next) => {
        try {
            const member = req.member;

            if (!member) {
                return res.status(403).json({
                    success: false,
                    message: "No tenés permisos para realizar esta acción",
                    error: "Member not found in request"
                });
            }

            const userRole = member.role;
            
            // Si el rol del usuario es superior o igual al requerido en la jerarquía
            if (ROLES_HIERARCHY[userRole] >= ROLES_HIERARCHY[required_role]) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: "No tenés permisos para realizar esta acción",
                required_role: required_role
            });

        } catch (error) {
            console.error("Error en verifyRole middleware:", error);
            return res.status(500).json({
                success: false,
                message: "Error interno al verificar permisos"
            });
        }
    };
};

export default verifyRole;
