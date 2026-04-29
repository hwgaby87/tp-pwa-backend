/**
 * @file workspace.model.js
 * @description Esquema de Mongoose para la colección de Espacios de Trabajo (Workspaces).
 * Define la estructura de los entornos donde los usuarios colaboran.
 */

import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    url_image: {
        type: String,
    },
});

const Workspace = mongoose.model("Workspace", workspaceSchema, "workspaces");

export default Workspace;