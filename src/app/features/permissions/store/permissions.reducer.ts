import { createFeature, createReducer, on } from "@ngrx/store";
import { PermissionGroup } from "../../../core/models/permission.model";
import { PermissionsActions } from "./permissions.actions";

export interface PermissionsState {
    groups: PermissionGroup[];
    isLoading: boolean;
    error: string | null;
}

export const initialState : PermissionsState = {
    groups: [],
    isLoading: false,
    error: null
}

export const permissionsFeature = createFeature({
    name: "permissions",
    reducer: createReducer(
        initialState,
        on(PermissionsActions.loadPermsiions, state => ({...state, isLoading: true})),
        on(PermissionsActions.loadPermissionsSuccess, (state, { permissionGroups }) => ({
            ...state,
            isLoading: false,
            groups: permissionGroups
        })),
        on(PermissionsActions.loadPermissionsFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error: error
        }))
    )
})

export const {
    selectGroups: selectPermissionGroups,
    selectIsLoading: selectPermissionsLoading,
} = permissionsFeature