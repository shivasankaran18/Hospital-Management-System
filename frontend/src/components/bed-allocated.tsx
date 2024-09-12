/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/k7mayAPJhzA
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function BedAllocated() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-sm p-6 grid gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="border w-12 h-12">
            <AvatarImage src="/placeholder-user.jpg" alt="Patient" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-muted-foreground text-sm">ABHA ID: 12345678</p>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Doctor:</span>
            <span>Dr. Jane Smith</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ward:</span>
            <span>General Ward</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Bed:</span>
            <span>B12</span>
          </div>
        </div>
      </Card>
    </div>
  )
}