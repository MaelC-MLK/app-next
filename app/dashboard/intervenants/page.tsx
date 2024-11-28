import {fetchIntervenantsPages} from "@/app/lib/action";
import Table from "@/app/ui/dashboard/intervenants/table";
import Pagination from "@/app/ui/dashboard/intervenants/pagination";
import Search from "@/app/ui/dashboard/intervenants/search";
import {CreateIntervenant, RegenAllKeys} from "@/app/ui/dashboard/intervenants/buttonsIntervenants";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {

  
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchIntervenantsPages(query);


    return (
      <div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search intervenants..." />
        <div className="flex gap-2">
          <CreateIntervenant />
          <RegenAllKeys />
        </div>
      </div>
        <Table query={query} currentPage={currentPage} />
        <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
      </div>
    );
  }


