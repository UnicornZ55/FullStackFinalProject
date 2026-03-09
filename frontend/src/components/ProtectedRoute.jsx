import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"

export default function ProtectedRoute({ children, role }) {

 const user = useAuthStore((s) => s.user)

 // ยังไม่ login
 if (!user) {
  return <Navigate to="/login" />
 }

 // login แล้วแต่ role ไม่ตรง
 if (role && user.role !== role) {
  return <Navigate to="/" />
 }

 return children
}