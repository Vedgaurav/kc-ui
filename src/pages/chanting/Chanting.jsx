import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowUpDown } from "lucide-react";
import dayjs from "dayjs";

const lastFiveDays = Array.from({ length: 6 }, (_, i) =>
  dayjs().subtract(i, "day")
);

const PAGE_SIZES = [10, 25, 50, 100];

export default function Chanting() {
  const [rounds, setRounds] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [entries, setEntries] = useState([]);

  /* Pagination + Sorting */
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc"); // desc = latest first

  const handleAdd = () => {
    if (!rounds) return;

    setEntries((prev) => [
      ...prev,
      { date: selectedDate, rounds: Number(rounds) },
    ]);

    setRounds("");
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
  };

  const canDelete = (date) => dayjs(date).isAfter(dayjs().subtract(5, "day"));

  const handleDelete = (date) => {
    setEntries((prev) => prev.filter((e) => e.date !== date));
  };

  /* Sorting */
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) =>
      sortOrder === "asc"
        ? dayjs(a.date).diff(dayjs(b.date))
        : dayjs(b.date).diff(dayjs(a.date))
    );
  }, [entries, sortOrder]);

  /* Pagination */
  const totalPages = Math.ceil(sortedEntries.length / pageSize);

  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedEntries.slice(start, start + pageSize);
  }, [sortedEntries, currentPage, pageSize]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Add Chanting */}
      <Card>
        <CardHeader>
          <CardTitle>Add Chanting Rounds</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Input
            type="number"
            placeholder="Enter rounds"
            value={rounds}
            onChange={(e) => setRounds(e.target.value.replace(/\D/g, ""))}
            className="text-3xl font-bold h-16 text-center"
          />

          <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:gap-2">
            {lastFiveDays.map((d) => {
              const formatted = d.format("YYYY-MM-DD");
              return (
                <Button
                  key={formatted}
                  variant={selectedDate === formatted ? "default" : "outline"}
                  onClick={() => setSelectedDate(formatted)}
                  className="h-12 text-base font-medium rounded-lg sm:h-9 sm:text-sm"
                >
                  {d.format("DD MMM")}
                </Button>
              );
            })}
          </div>

          <Button
            className="w-1/2 md:w-1/3 h-12 text-lg mx-auto block"
            onClick={handleAdd}
          >
            Save
          </Button>
        </CardContent>
      </Card>

      {/* Chanting History */}
      <Card>
        <CardHeader>
          <CardTitle>Chanting History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Mobile View */}
          <div className="sm:hidden space-y-2">
            {entries.map((e) => (
              <div
                key={e.date}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <p className="font-medium">
                  {dayjs(e.date).format("DD MMM YYYY")} – {e.rounds} rounds
                </p>

                {canDelete(e.date) && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(e.date)}
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          {/* Desktop Table */}
          <div className="hidden sm:block space-y-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-center">Date</th>
                  <th className="text-center">Rounds</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {paginatedEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No chanting records yet
                    </td>
                  </tr>
                ) : (
                  paginatedEntries.map((e) => (
                    <tr key={e.date} className="border-b last:border-none">
                      <td className="py-2 text-center font-medium">
                        {dayjs(e.date).format("DD MMM YYYY")}
                      </td>
                      <td className="text-center font-medium">{e.rounds}</td>
                      <td className="text-right">
                        {canDelete(e.date) && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(e.date)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Bottom controls */}
            <div className="flex items-center justify-between pt-2">
              {/* Rows selector - bottom left */}
              <div className="flex items-center gap-2 text-sm">
                <span>Rows:</span>
                <select
                  className="border rounded px-2 py-1 bg-background"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {PAGE_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pagination - bottom right */}
              <div className="flex items-center gap-2 text-sm">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </Button>

                <span>
                  Page {currentPage} of {totalPages || 1}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
