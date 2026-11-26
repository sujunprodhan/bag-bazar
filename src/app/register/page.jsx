import { Suspense } from 'react';
import RegisterFrom from '@/auth/RegisterFrom';

const RegisterPage = () => {
  return (
    <Suspense fallback={<div className="min-h-[85vh] bg-gray-50" />}>
      <RegisterFrom />
    </Suspense>
  );
};

export default RegisterPage;
