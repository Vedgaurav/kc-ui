import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp, Pencil, RefreshCw, Trash2 } from "lucide-react";
import ConfirmDialog from "@/common/ConfirmDialog";

const PAGE_SIZES = [5, 10, 20, 50];
dayjs.extend(utc);
dayjs.extend(timezone);

export const ChantingHistory = ({
  entries = [],
  page,
  size,
  totalPages,
  sort,
  direction,
  isRefreshing,
  isEditMode,
  selectedDate,
  canDelete,
  onRefresh,
  onSort,
  onEdit,
  onDelete,
  onPageChange,
  onSizeChange,
}) => {
  const tz = dayjs.tz.guess();

  const SortIcon = ({ field }) =>
    direction === "asc" && sort === field ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );

  return (
    <Card>
      {/* HEADER */}
      <CardHeader>
        <div className="relative flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>

          <h3 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            Chanting History
          </h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* MOBILE */}
        <div className="sm:hidden space-y-3">
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No chanting records yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSort("chantingAt")}
                    >
                      Date <SortIcon field="chantingAt" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSort("chantingRounds")}
                    >
                      Rounds <SortIcon field="chantingRounds" />
                    </Button>
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {entries.map((e) => (
                  <TableRow key={e.chantingId}>
                    <TableCell>
                      {dayjs
                        .utc(e.chantingAt)
                        .tz(tz)
                        .format("DD MMM YYYY hh:mm A")}
                      {/* {dayjs(e.chantingDate).format("DD MMM YYYY HH:mm")} */}
                      {/* {dayjs(e.chantingDate).format("DD MMM YYYY hh:mm A")} */}
                    </TableCell>
                    <TableCell>{e.chantingRounds}</TableCell>
                    <TableCell>
                      {canDelete(e.chantingDate) && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isEditMode}
                            onClick={() => onEdit(e)}
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>

                          <ConfirmDialog
                            trigger={
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={isEditMode}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            }
                            title="Delete chanting entry?"
                            description={`This will delete entry for ${selectedDate} rounds ${e.chantingRounds}`}
                            onConfirm={() => onDelete(e)}
                            compactOnMobile
                          />
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* PAGINATION (MOBILE) */}
        <div className="sm:hidden border-t pt-3 space-y-3">
          <div className="flex justify-between text-sm">
            <div className="flex gap-2 items-center">
              <span>Rows</span>
              <Select
                value={String(size)}
                onValueChange={(v) => onSizeChange(Number(v))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span>
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden sm:block space-y-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort("chantingAt")}
                  >
                    Date <SortIcon field="chantingAt" />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort("chantingRounds")}
                  >
                    Rounds <SortIcon field="chantingRounds" />
                  </Button>
                </th>
                <th />
              </tr>
            </thead>

            <tbody>
              {entries.map((e) => (
                <tr key={e.chantingId} className="border-b">
                  <td className="text-center">
                    {dayjs
                      .utc(e.chantingAt)
                      .tz(tz)
                      .format("DD MMM YYYY hh:mm A")}
                  </td>
                  <td className="text-center">{e.chantingRounds}</td>
                  <td className="text-right">
                    {canDelete(e.chantingAt) && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit(e)}
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          }
                          title="Delete chanting entry?"
                          onConfirm={() => onDelete(e)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
