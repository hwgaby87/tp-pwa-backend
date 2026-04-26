import channelService from "../services/channel.services.js"

class ChannelController {
    async create(req, res, next) {
        try {
            const { workspace_id } = req.params
            const { name, description } = req.body

            const channel = await channelService.create(workspace_id, name, description)

            return res.status(201).json({
                ok: true,
                status: 201,
                message: "El canal se ha creado exitosamente",
                data: channel
            })
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const { workspace_id } = req.params

            const channels = await channelService.getAll(workspace_id)

            return res.status(200).json({
                ok: true,
                status: 200,
                data: channels
            })
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const { workspace_id, channel_id } = req.params

            const channel = await channelService.delete(workspace_id, channel_id)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "El canal se ha eliminado exitosamente",
                data: channel
            })
        } catch (error) {
            next(error)
        }
    }

    async restore(req, res, next) {
        try {
            const { workspace_id, channel_id } = req.params
            const channel = await channelService.restore(workspace_id, channel_id)
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "El canal se ha restaurado exitosamente",
                data: channel
            })
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
    try {
        const { workspace_id, channel_id } = req.params
        const { name, description } = req.body

        const channel = await channelService.update(workspace_id, channel_id, name, description)

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "El canal se ha actualizado exitosamente",
            data: channel
        })
    } catch (error) {
        next(error)
    }
}
}

const channelController = new ChannelController()

export default channelController
