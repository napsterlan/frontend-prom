'use client'

import { useSession } from 'next-auth/react'

export default function AuthDebug() {
  const { data: session, status } = useSession()

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <pre>
        Status: {status}
        {'\n'}
        Session: {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  )
}