import Header from '@/components/shared/Header';
import React from 'react';
import { transformationTypes } from '@/constants';
import TransformationForm from '@/components/shared/TransformationForm';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

interface SearchParamProps {
  params: {
    type: string;
  };
}

const AddTransformationTypePage = async ({ params }: SearchParamProps) => {
  // Wait for params to resolve
  const { type } = await params; 
  
  // Ensure auth() returns an object with userId
  const session = await auth(); 
  const userId = session?.userId; 

  if (!userId) {
    redirect('/sign-in');
    return null; // Prevent further execution
  }
  // Get transformation data safely
  const transformation = transformationTypes[type as keyof typeof transformationTypes] ?? { 
    title: "Unknown", 
    subTitle: "No description available", 
    type: "" 
  }; 

  // Fetch user details
  const user = await getUserById(userId);

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <section className='mt-10'>
      <TransformationForm
        action="Add"
        userId={String(user?._id ?? "")} 
        type={transformation.type as TransformationTypeKey}
        creditBalance={user?.creditBalance ?? 0} 
      />
      </section>

    </>
  );
};

export default AddTransformationTypePage;