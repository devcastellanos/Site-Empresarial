'use client'
import { Suspense } from 'react';
import { ResetPasswordForm } from '../ResetPasswordForm';

export default function RestablecerPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Suspense fallback={<div>Cargando formulario...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
