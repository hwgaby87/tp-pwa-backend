class WorkspaceDTO {
    constructor (workspace){
        this._id = workspace._id
        this.title = workspace.title
        this.description = workspace.description
        this.url_image = workspace.url_image
        this.created_at = workspace.created_at
        this.active = workspace.active
    }
}

export default WorkspaceDTO