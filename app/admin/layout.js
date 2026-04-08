import { AuthProvider } from '../../contexts/AuthContext'

export const metadata = {
  robots: 'noindex,nofollow',
}

export default function AdminLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
