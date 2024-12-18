import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import Image from 'next/image';
import { signOut } from '@/auth';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-blue-600 p-4 md:h-40"
        href="https://www.unilim.fr/"
      >
        <div className="w-32 bg-white p-4 rounded-lg text-white md:w-40">
          <Image
            src="/logo-ul.webp"
            width={600}
            height={600}
            alt="logo unilim"
          />
        </div>
      </Link>
      <div className="flex grow flex-col justify-between space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <div className="hidden md:block">Se déconnecter</div>
          </button>
        </form>
      </div>
    </div>
  );
}