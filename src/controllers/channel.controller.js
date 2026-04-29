/**
 * @file channel.controller.js
 * @description Controlador para la gestión de canales dentro de un espacio de trabajo.
 * Maneja la creación, obtención, actualización, archivado y restauración de canales.
 */

import channelService from "../services/channel.service.js"

class ChannelController {
    /**
     * Crea un nuevo canal en un workspace.
     * @param {Object} req - Petición con workspace_id en params y name/description en body.
     * @param {Object} res - Respuesta con el canal creado.
     * @param {Function} next - Middleware next.
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

    /**
     * Obtiene todos los canales activos de un workspace.
     * @param {Object} req - Petición con workspace_id en params.
     * @param {Object} res - Respuesta con la lista de canales.
     * @param {Function} next - Middleware next.
     */
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

    /**
     * Obtiene los canales archivados (inactivos) de un workspace.
     * @param {Object} req - Petición con workspace_id en params.
     * @param {Object} res - Respuesta con la lista de canales archivados.
     * @param {Function} next - Middleware next.
     */
    async getDeleted(req, res, next) {
        try {
            const { workspace_id } = req.params

            const channels = await channelService.getDeleted(workspace_id)

            return res.status(200).json({
                ok: true,
                status: 200,
                data: channels
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Archiva un canal (cambia su estado a inactivo).
     * @param {Object} req - Petición con workspace_id y channel_id en params.
     * @param {Object} res - Respuesta confirmando el archivado.
     * @param {Function} next - Middleware next.
     */
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

    /**
     * Restaura un canal archivado (vuelve a activo).
     * @param {Object} req - Petición con workspace_id y channel_id en params.
     * @param {Object} res - Respuesta confirmando la restauración.
     * @param {Function} next - Middleware next.
     */
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

    /**
     * Actualiza el nombre o descripción de un canal.
     * @param {Object} req - Petición con workspace_id, channel_id en params y name/description en body.
     * @param {Object} res - Respuesta con el canal actualizado.
     * @param {Function} next - Middleware next.
     */
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
