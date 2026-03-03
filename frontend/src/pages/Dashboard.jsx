import ProtectedRoute from "../components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Admin Dashboard</div>
    </ProtectedRoute>
  );
}