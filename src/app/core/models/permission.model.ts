export interface Permission {
    id?: number;
    name: string;
    description?: string;
}

export interface PermissionGroup {
    groupName: string;
    permissions: Permission[];
}