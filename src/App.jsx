import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import DefaultLayout from "./components/layout/DefaultLayout";
import { ProtectedRoute } from "./hooks/useAuthInitializer";
import useUserStore from "./store/userStore";
// Import pages


import AdminAddCourse from "./pages/AdminAddCourse";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CoursesPage from "./pages/CoursesPage";
import Dashboard from "./pages/Dashboard";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import Home from "./pages/Home";
function App() {
 
  const { isLoggedIn } = useUserStore();
console.log(isLoggedIn)
  // Show loading screen while initializing auth

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          }
        />
        <Route
          path="/courses"
          element={
            <DefaultLayout>
              <CoursesPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/courses/:courseSlug"
          element={
            <DefaultLayout>
              <CourseDetailPage />
            </DefaultLayout>
          }
        />
         <Route 
          path="/auth/:mode?" 
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <AuthPage />
          } 
        />
        <Route 
          path="/" 
          element={
            <Navigate to={isLoggedIn ? "/dashboard" : "/auth/login"} replace />
          } 
        />

        <Route
          path="/dashboard"
          element={
            <DefaultLayout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </DefaultLayout>
          }
        />
        <Route
          path="/email-confirmation"
          element={
              <EmailConfirmationPage />
          }
        />
         <Route
          path="/admin"
          element={
             <AdminDashboard />
          }
        /> 
         <Route
          path="/admin/courses"
          element={
             <AdminCoursesPage />
          }
        />
         <Route
          path="/admin/courses/add"
          element={
             <AdminAddCourse />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
