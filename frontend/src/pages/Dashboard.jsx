import ProtectedRoute from "../components/ProtectedRoute";
import TaskRunner from "../components/TaskRunner";

export default function Dashboard() {
  return (
    //<ProtectedRoute>
      <div>Admin Dashboard
        <TaskRunner/>
      </div>
      
    //</ProtectedRoute>
    
  );
}