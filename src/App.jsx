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
import AdminEditCourse from "./pages/AdminEditCourse";
import AuthPage from "./pages/AuthPage";
import ContactUs from "./pages/ContactUs";
import CourseDetailPage from "./pages/CourseDetailPage";
import CoursesPage from "./pages/CoursesPage";
import Dashboard from "./pages/Dashboard";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
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
          path="/privacy"
          element={
            <DefaultLayout>
             <PrivacyPolicy />
            </DefaultLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <DefaultLayout>
             <TermsAndConditions />
            </DefaultLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <DefaultLayout>
             <ContactUs />
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
            <ProtectedRoute>
             <AdminDashboard />
             </ProtectedRoute>
          }
        /> 
         <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
             <AdminCoursesPage />
             </ProtectedRoute>
          }
        />
         <Route
          path="/admin/courses/add"
          element={
            <ProtectedRoute>
             <AdminAddCourse />
             </ProtectedRoute>
          }
        />
         <Route
          path="/admin/courses/edit/:slug"
          element={
            <ProtectedRoute>
            <AdminEditCourse />
             </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
