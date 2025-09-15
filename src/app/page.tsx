import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

const MainApp = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
       <Image
        src="/assets/images/loading.svg"
        alt="loading"
        width={80}
        height={80}
      />
      <Button className='mt-4'>Click Me</Button>
    </div>
  );
};

export default MainApp;