import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"

export default function ProtectedRoute({ children, role }) {

 const user = useAuthStore((s) => s.user)

 // ยังไม่ login
 if (!user) {
  return <Navigate to="/login" />
 }

 // role สามารถเป็น string หรือ array
 if (role) {
  const allowed = Array.isArray(role) ? role : [role]
  if (!allowed.includes(user.role)) {
    return <Navigate to="/" />
  }
 }

 return children
}