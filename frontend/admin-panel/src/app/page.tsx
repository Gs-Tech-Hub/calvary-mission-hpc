'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Home() {
  const router = useRouter();
  const data = {
    name: "ade",
    age: 18,
    school: "lasu"
  }

  useEffect(() => {
    router.push("/admin")
  })


}