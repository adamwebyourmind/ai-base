"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReadingItem from "./reading-item";
import Loading from "components/loading";
import { useReadingsContext } from "lib/contexts/readings-context";
import PaginationComponent from "./pagination-component";
import LoadingSkeleton from "./loading-skeleton";
import EmptyReadings from "./empty-readings";

function paginate(currentPage, pageCount, delta = 2) {
  const range = [];
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    range.unshift("...");
  }
  if (currentPage + delta < pageCount - 1) {
    range.push("...");
  }

  range.unshift(1);
  if (pageCount > 1) {
    range.push(pageCount);
  }

  return range;
}

function Readings() {
  const { data: session } = useSession() as any;
  const { readings, loading, error, fetchReadings, totalPages } = useReadingsContext();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReadings(session.user.id, page, 12);
    }
  }, [session?.user?.id, page]);

  if (loading && readings?.length === 0) return <LoadingSkeleton />;
  if (error) return <div>Error: {error.message}</div>;
  console.log(readings?.length, loading);
  if ((!readings || readings?.length === 0) && !loading) {
    return <EmptyReadings />;
  }

  const handlePageChange = (newPage) => {
    if (newPage !== "...") {
      setPage(newPage);
    }
  };

  const pages = paginate(page, totalPages);

  return (
    <>
      <div className="my-16 grid max-w-4xl grid-cols-1 gap-16 font-mono md:my-32 md:grid-cols-3 lg:grid-cols-3">
        {readings && readings.map((reading) => <ReadingItem key={reading.id} reading={reading} />)}
      </div>
      <div className="my-16">
        {totalPages > 1 && (
          <PaginationComponent pages={pages} page={page} totalPages={totalPages} onPaginate={handlePageChange} />
        )}
      </div>
    </>
  );
}
export default Readings;
