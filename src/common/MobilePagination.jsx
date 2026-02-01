import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const DEFAULT_PAGE_SIZES = [10, 20, 50];

export default function MobilePagination({
  page,
  totalPages,
  size,
  onPageChange,
  onSizeChange,
  pageSizes = DEFAULT_PAGE_SIZES,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="sm:hidden space-y-3 pt-3 border-t">
      {/* Rows selector + page info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows</span>

          <Select
            value={String(size)}
            onValueChange={(value) => {
              onSizeChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-20">
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

        <span className="text-muted-foreground">
          Page {page} of {totalPages}
        </span>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between px-6 mt-5">
        <Button
          size="sm"
          variant="outline"
          className="w-24 h-12"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="w-24 h-12"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
