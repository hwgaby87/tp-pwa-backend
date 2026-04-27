import memberWorkspaceService from "../services/member-workspace.service.js"

class WorkspaceMemberController {
    async inviteMember(req, res, next) {
        const { workspace_id } = req.params
        const { email, role } = req.body
        try {
            await memberWorkspaceService.inviteMember(workspace_id, email, role)
            res.status(201).json({
                ok: true,
                status: 201,
                message: 'Invitación enviada con éxito'
            })
        } catch (error) {
            next(error)
        }
    }

    async getMembers(req, res, next) {
        const { workspace_id } = req.params
        try {
            const members = await memberWorkspaceService.getMemberList(workspace_id)
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Miembros obtenidos con éxito',
                data: members
            })
        } catch (error) {
            next(error)
        }
    }

    async getMemberById(req, res, next) {
        const { memberId } = req.params
        try {
            const member = await memberWorkspaceService.getMemberById(memberId)
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Miembro obtenido con éxito',
                data: member
            })
        } catch (error) {
            next(error)
        }
    }


    async updateMember(req, res, next) {

        const { memberId } = req.params
        const { role } = req.body
        try {
            const member = await memberWorkspaceService.updateMember(memberId, role)
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Miembro actualizado con éxito',
                data: member
            })
        } catch (error) {
            next(error)
        }
    }

    //Editar la información del miembro, como el rol, la aceptación de la invitación, etc.
    /*
        async updateMember(req, res, next) {
            const { memberId } = req.params
            const { role, acceptInvitation } = req.body
            try {
                const member = await memberWorkspaceService.updateMember(memberId, role, acceptInvitation)
                res.status(200).json({
                    ok: true,
                    status: 200,
                    message: 'Miembro actualizado con éxito',
                    data: member
                })
            } catch (error) {
                next(error)
            }
        }*/

    async removeMember(req, res, next) {
        const { memberId } = req.params
        try {
            await memberWorkspaceService.removeMember(memberId)
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Miembro eliminado con éxito'
            })
        } catch (error) {
            next(error)
        }
    }
}

const workspaceMemberController = new WorkspaceMemberController()

export default workspaceMemberController
