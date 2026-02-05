import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SimulatorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}
