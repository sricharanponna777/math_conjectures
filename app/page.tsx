import Link from 'next/link'
import React from 'react'

function PerfectNumbers() {
  return (
    <div>
      <Link href="/mersenne">Mersenne Perfect Numbers</Link>
      <Link href="/collatz">Collatz Conjecture</Link>
    </div>
  )
}

export default PerfectNumbers
