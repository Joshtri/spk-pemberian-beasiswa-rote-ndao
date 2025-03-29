'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function UserProfileCard({ user }) {
  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {user.username}
          <Badge variant="outline">{user.role}</Badge>
        </CardTitle>
        <CardDescription>ID: {user.id}</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Email</span>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div>
          <span className="font-medium">Role</span>
          <p>{user.role}</p>
        </div>

        {user.createdAt && (
          <div>
            <span className="font-medium">Tanggal Dibuat</span>
            <p>{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        )}

        {user.updatedAt && (
          <div>
            <span className="font-medium">Terakhir Diperbarui</span>
            <p>{new Date(user.updatedAt).toLocaleString()}</p>
          </div>
        )}

        {/* Jika ADMIN: tampilkan statistik */}
        {user.role === 'ADMIN' && (
          <div>
            <span className="font-medium">Total Calon Penerima</span>
            <p>{user.stats?.totalCalonPenerima ?? 0}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
