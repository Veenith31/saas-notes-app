import { getServerSession } from "next-auth/next";
import { SignOutButton } from "./components/SignOutButton";
import { PrismaClient } from "@prisma/client";

import { NotesList } from "./components/NotesList";
import { DowngradeButton } from "./components/Downgradebutton";
import { authOptions } from "./api/auth/[...nextauth]/route";


const prisma = new PrismaClient();


export default async function DashboardPage() {
const session = await getServerSession(authOptions);

   const tenant = await prisma.tenant.findUnique({
    where: {
      id: session?.user?.tenantId,
    },
  });

 return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <nav className="container flex items-center justify-between p-4 mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Notely</h1>
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
              tenant?.subscription === 'PRO' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200'
            }`}>
              {tenant?.subscription}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">{session?.user?.email}</span>
            {session?.user?.role === 'ADMIN' && tenant?.subscription === 'PRO' && (
              <DowngradeButton tenantSlug={session.user.tenantSlug} />
            )}
            <SignOutButton />
          </div>
        </nav>
      </header>
      <main className="container p-4 mx-auto mt-8 md:p-8">
        <NotesList />
      </main>
    </div>
  );
}
