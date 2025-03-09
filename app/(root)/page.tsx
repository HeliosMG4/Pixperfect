
import { navLinks } from '@/constants'
import { link } from 'fs'
import Link from 'next/link'

import React from 'react'

const Home = () => {
  return (
    <>
     <section className='home'>
      <h1 className='home-heading'>
        Unleash Your Creative Vision With Pixperfect
      </h1> 
        <ul className='flex-centre w-full gap-20'>
       {navLinks.slice(1, 5).map((link) => (
        <Link 
        
        
        >
        </Link>
       )}
        </ul>
     </section>
       
      </>
  )
}

export default Home