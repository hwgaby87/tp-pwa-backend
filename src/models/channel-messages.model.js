import mongoose from "mongoose";
import MESSAGE_STATUS from "../constants/message-status.constants.js";

const channelMessagesSchema = new mongoose.Schema({
    fk_id_channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },
    fk_id_member: {
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
        enum: Object.values(MESSAGE_STATUS),
        default: MESSAGE_STATUS.ENVIADO
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

const ChannelMessages = mongoose.model("ChannelMessage", channelMessagesSchema, "channel_messages")

export default ChannelMessages