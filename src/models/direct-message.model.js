import mongoose from "mongoose";

const directMessageSchema = new mongoose.Schema({
    fk_id_workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    fk_id_sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkspaceMember",
        required: true
    },
    fk_id_receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkspaceMember",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['enviado', 'recibido', 'leído'],
        default: 'enviado'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    }
})

const DirectMessage = mongoose.model("DirectMessage", directMessageSchema, "direct_messages")

export default DirectMessage
