import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const Pagination = ({
  totalPages = 1,
  initialPage = 1,
  initialSize = 10,
  pageSizes = [5, 10, 20, 50],
  showPageSize = true,
  showPageInfo = true,
  showPrevNext = true,
  className = "",
  onChange,
}) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  /** Notify parent whenever pagination changes */
  useEffect(() => {
    onChange?.({ page, size });
  }, [page, size]);

  return (
    <div className={`space-y-3 pt-3 border-t sm:hidden ${className}`}>
      {/* Row selector + page info */}
      {(showPageSize || showPageInfo) && (
        <div className="flex items-center justify-between text-sm">
          {showPageSize && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows</span>
              <Select
                value={String(size)}
                onValueChange={(v) => {
                  setSize(Number(v));
                  setPage(1); // reset page on size change
                }}
              >
                <SelectTrigger className="h-9 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizes.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showPageInfo && (
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          )}
        </div>
      )}

      {/* Prev / Next */}
      {showPrevNext && (
        <div className="flex justify-center gap-[35%] mt-5">
          <Button
            size="sm"
            variant="outline"
            className="w-24 h-12"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="w-24 h-12"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
