import { Navigate } from "react-router-dom"

export default function AdminRoute({ children }: any) {

    const token = sessionStorage.getItem("token")
    const role = sessionStorage.getItem("role")

    if (!token) {
        return <Navigate to="/login" />
    }

    if (role !== "Admin") {
        return <Navigate to="/unauthorized" />
    }

    return children
}