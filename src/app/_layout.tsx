import { Slot } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export default function AppLayout() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
}