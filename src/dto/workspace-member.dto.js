class WorkspaceMemberDTO {
    constructor(workspaceMember) {
        this.workspace_member_id = workspaceMember._id
        this.workspace_member_user_id = workspaceMember.fk_id_user
        this.workspace_member_workspace_id = workspaceMember.fk_id_workspace
        this.workspace_member_role = workspaceMember.role
        this.workspace_member_created_at = workspaceMember.created_at
        this.workspace_member_accept_invitation = workspaceMember.acceptInvitation
    }
}

export default WorkspaceMemberDTO