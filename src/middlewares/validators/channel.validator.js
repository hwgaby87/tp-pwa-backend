import { body, param } from 'express-validator';
import channelRepository from '../../repository/channel.repository.js';

export const validateChannelCreate = [
    param('workspace_id')
        .isMongoId().withMessage('ID de espacio de trabajo inválido'),
    body('name')
        .notEmpty().withMessage('El nombre del canal es requerido')
        .isString().withMessage('El nombre debe ser un string')
        .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres')
        .matches(/^[a-zA-Z0-9-]+$/).withMessage('El nombre solo puede contener letras, números y guiones (sin espacios)')
        .custom(async (name, { req }) => {
            const workspaceId = req.params.workspace_id;
            const duplicate = await channelRepository.findByNameAndWorkspace(name, workspaceId);
            if (duplicate) {
                throw new Error('Ya existe un canal con este nombre en este espacio de trabajo');
            }
            return true;
        }),
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser un string')
];

export const validateChannelUpdate = [
    param('workspace_id')
        .isMongoId().withMessage('ID de espacio de trabajo inválido'),
    param('channel_id')
        .isMongoId().withMessage('ID de canal inválido'),
    body('name')
        .optional()
        .isString().withMessage('El nombre debe ser un string')
        .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres')
        .matches(/^[a-zA-Z0-9-]+$/).withMessage('El nombre solo puede contener letras, números y guiones (sin espacios)')
        .custom(async (name, { req }) => {
            if (!name) return true;
            const workspaceId = req.params.workspace_id;
            const channelId = req.params.channel_id;
            const duplicate = await channelRepository.findByNameAndWorkspace(name, workspaceId);
            if (duplicate && duplicate.channel_id.toString() !== channelId) {
                throw new Error('Ya existe otro canal con este nombre en este espacio de trabajo');
            }
            return true;
        }),
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser un string')
];

export const validateChannelDelete = [
    param('workspace_id')
        .isMongoId().withMessage('ID de espacio de trabajo inválido'),
    param('channel_id')
        .isMongoId().withMessage('ID de canal inválido')
        .custom(async (channel_id, { req }) => {
            const channel = await channelRepository.getById(channel_id);
            if (!channel) {
                throw new Error('El canal no existe');
            }
            if (channel.channel_workspace_id.toString() !== req.params.workspace_id) {
                throw new Error('El canal no pertenece a este espacio de trabajo');
            }
            return true;
        })
];

export const validateChannelRestore = [
    param('workspace_id')
        .isMongoId().withMessage('ID de espacio de trabajo inválido'),
    param('channel_id')
        .isMongoId().withMessage('ID de canal inválido')
        .custom(async (channel_id, { req }) => {
            const channel = await channelRepository.getByIdIncludeInactive(channel_id);
            if (!channel) {
                throw new Error('El canal no existe');
            }
            if (channel.channel_workspace_id.toString() !== req.params.workspace_id) {
                throw new Error('El canal no pertenece a este espacio de trabajo');
            }
            if (channel.channel_is_active) {
                throw new Error('El canal ya está activo');
            }
            return true;
        })
];
