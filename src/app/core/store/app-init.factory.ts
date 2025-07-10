import { Store } from "@ngrx/store";
import { getInitialAuthState } from "./local-storage-sync.reducer";
import { AuthActions } from "../../features/auth/store/auth.actions";

export function appInitializerFactory(store: Store): () => void {
    return () => {
        const savedState = getInitialAuthState();
        if(savedState){
            store.dispatch(AuthActions.hydrateAuthState(savedState));
        }
    }
}