import { Permission } from "./permission.model";

export interface Role {
    id: number;
    name: string;
    permssions: Permission[];
    isDefault: boolean
}