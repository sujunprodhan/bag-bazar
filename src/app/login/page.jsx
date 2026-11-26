import { Suspense } from 'react';
import LoginFrom from '@/auth/LoginFrom';

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="min-h-[85vh] bg-gray-50" />}>
      <LoginFrom />
    </Suspense>
  );
};

export default LoginPage;
