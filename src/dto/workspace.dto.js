class WorkspaceDTO {
    constructor (workspace){
        this.workspace_id = workspace._id
        this.workspace_title = workspace.title
        this.workspace_description = workspace.description
        this.workspace_url_image = workspace.url_image
        this.workspace_created_at = workspace.created_at
        this.workspace_active = workspace.active
    }
}

export default WorkspaceDTO