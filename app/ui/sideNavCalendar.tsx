import Link from 'next/link';
import Image from 'next/image';

export default function SideNavCalendar({ className }) {
  return (
    <div className={`flex h-full flex-col px-3 py-4 md:px-2 ${className}`}>
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
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </div>
    </div>
  );
}