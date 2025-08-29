import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function PerfectNumbers() {
  return (
    <div className='flex flex-col gap-4 p-6'>
      <Link href="/mersenne">
        <Button className='bg-blue-500 hover:underline text-white rounded'>Mersenne Perfect Numbers</Button>
      </Link>
      <Link href="/collatz">
        <Button className='bg-blue-500 hover:underline text-white rounded'>Collatz Conjecture</Button>
      </Link>
    </div>
  )
}

export default PerfectNumbers
