import { body, param } from 'express-validator';
import workspaceMemberRepository from '../../repositories/member.repository.js';
import workspaceRepository from '../../repositories/workspace.repository.js';
import mongoose from 'mongoose';

export const validateWorkspaceCreate = [
    body('title')
        .notEmpty().withMessage('El título es requerido')
        .isString().withMessage('El título debe ser un string')
        .isLength({ min: 3, max: 50 }).withMessage('El título debe tener entre 3 y 50 caracteres')
        .custom(async (title, { req }) => {
            const userId = req.user.id;
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(userId);
            const duplicate = workspaces.find(w => w.title === title);
            if (duplicate) {
                throw new Error('Ya tienes un espacio de trabajo con este título');
            }
            return true;
        }),
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser un string')
        .isLength({ max: 200 }).withMessage('La descripción no puede exceder los 200 caracteres')
];

export const validateWorkspaceUpdate = [
    param('workspace_id')
        .isMongoId().withMessage('ID de espacio de trabajo inválido'),
    body('title')
        .optional()
        .isString().withMessage('El título debe ser un string')
        .isLength({ min: 3, max: 50 }).withMessage('El título debe tener entre 3 y 50 caracteres')
        .custom(async (title, { req }) => {
            if (!title) return true;
            const userId = req.user.id;
            const workspaceId = req.params.workspace_id;
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(userId);
            const duplicate = workspaces.find(w => w.title === title && w._id.toString() !== workspaceId);
            if (duplicate) {
                throw new Error('Ya tienes otro espacio de trabajo con este título');
            }
            return true;
        }),
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser un string')
        .isLength({ max: 200 }).withMessage('La descripción no puede exceder los 200 caracteres')
];

export const validateWorkspaceDelete = [
    param('workspace_id')
        .isMongoId().withMessage('ID de espacio de trabajo inválido')
        .custom(async (workspace_id) => {
            const workspace = await workspaceRepository.getById(workspace_id);
            if (!workspace) {
                throw new Error('El espacio de trabajo no existe');
            }
            return true;
        })
];
