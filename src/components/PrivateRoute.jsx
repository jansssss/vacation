import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PrivateRoute;
