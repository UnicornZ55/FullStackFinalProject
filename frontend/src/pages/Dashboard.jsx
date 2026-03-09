import ProtectedRoute from "../components/ProtectedRoute";
import TaskRunner from "../components/TaskRunner";
import { useAuthStore } from "../store/useAuthStore"

export default function Dashboard() {
  return (
    //<ProtectedRoute>
      <div>Admin Dashboard
        <TaskRunner/>
      </div>
      
    //</ProtectedRoute>
    
  );
}