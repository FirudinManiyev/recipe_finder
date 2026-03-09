import { Navigate } from "react-router-dom"

export default function AdminRoute({ children }: any) {

    const token = sessionStorage.getItem("token")

    if (!token) {
        return <Navigate to="/login" />
    }

    return children
}