import mongoose from "mongoose";
import available_invitation_responses from "../constants/invitation-responses.constants.js";
import available_member_roles from "../constants/member-roles.constants.js";

const workspaceMemberSchema = new mongoose.Schema({
    fk_id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fk_id_workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    role: {
        type: String,
        enum: Object.values(available_member_roles),
        default: available_member_roles.USER
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    acceptInvitation: {
        type: String,
        enum: Object.values(available_invitation_responses),
        default: available_invitation_responses.PENDING
    }
})

const WorkspaceMember = mongoose.model('WorkspaceMember', workspaceMemberSchema, 'workspace_members')

export default WorkspaceMember