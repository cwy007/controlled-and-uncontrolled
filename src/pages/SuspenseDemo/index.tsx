import { atom, useAtom } from 'jotai'
import React from 'react'

const userAtom = atom(async () => {
  const userId = 1;
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}?_delay=2000`);
  return response.json();
})

const UserName = () => {
  const [user] = useAtom(userAtom);
  return <div>User name: {user.name}</div>
}

const SuspenseDemo = () => {
  // test ErrorBoundary
  // throw new Error('test ErrorBoundary')
  // console.log('SuspenseDemo render', window.a.b)
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UserName />
    </React.Suspense>
  )
}

export default SuspenseDemo