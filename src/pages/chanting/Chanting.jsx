import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import dayjs from "dayjs";
import { BASE_URL } from "@/constants/Constants";
import useSecureAxios from "@/common_components/hooks/useSecureAxios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const lastFiveDays = Array.from({ length: 6 }, (_, i) =>
  dayjs().subtract(i, "day")
);

const PAGE_SIZES = [10, 25, 50, 100];

export default function Chanting() {
  const secureAxios = useSecureAxios();
  const [rounds, setRounds] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  /* Backend driven data */
  const [entries, setEntries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  /* Pagination + Sorting */
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sort] = useState("chantingDate"); // backend field name
  const [direction, setDirection] = useState("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [roundError, setRoundError] = useState("");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchChanting();
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsRefreshing(false);
    }
  };

  /* Fetch chanting data */
  const fetchChanting = async () => {
    const params = new URLSearchParams({
      page: page - 1,
      size,
      sort: `${sort},${direction}`,
    });

    console.log("Fetch Chanting params", params);
    const url = BASE_URL + "/api/chanting";
    const response = await secureAxios.get(url, { params: params });

    const data = response?.data;
    setEntries(data?.content || []);
    setTotalPages(data?.totalPages || 1);
  };

  useEffect(() => {
    fetchChanting();
  }, [page, size, direction]);

  /* Save chanting */
  const handleAdd = async () => {
    if (!rounds) {
      setRoundError("Please enter rounds");
      return;
    }

    const url = BASE_URL + "/api/chanting";
    const params = {
      chantingDate: selectedDate,
      chantingRounds: Number(rounds),
    };
    await secureAxios.post(url, params).then((response) => {
      if (response?.length) {
        toast.success("Record Added");
      }
    });

    setRounds("");
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
    setPage(1);
    fetchChanting();
  };

  const canDelete = (date) => dayjs(date).isAfter(dayjs().subtract(5, "day"));

  const handleDelete = async (date) => {
    await fetch(`/api/chanting/${date}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchChanting();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Add Chanting */}
      <Card>
        <CardHeader>
          <CardTitle>Add Chanting Rounds</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Enter rounds"
            value={rounds}
            onFocus={() => setRoundError("")}
            onChange={(e) => setRounds(e.target.value.replace(/\D/g, ""))}
            className="text-3xl font-bold h-16 text-center"
          />
          {roundError && (
            <p className="text-destructive text-sm text-left">{roundError}</p>
          )}

          <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:gap-2">
            {lastFiveDays.map((d) => {
              const formatted = d.format("YYYY-MM-DD");
              return (
                <Button
                  key={formatted}
                  variant={selectedDate === formatted ? "default" : "outline"}
                  onClick={() => setSelectedDate(formatted)}
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
          <div className="relative flex items-center">
            {/* Left refresh button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh"
            >
              <RefreshCw
                key={isRefreshing ? "spinning" : "idle"}
                className={`h-4 w-4 transition-transform ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </Button>

            {/* Centered title */}
            <h3 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
              Chanting History
            </h3>

            {/* Right-aligned sort button */}
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() =>
                  setDirection((o) => (o === "asc" ? "desc" : "asc"))
                }
              >
                Date
                {direction === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mobile View */}
          <div className="sm:hidden space-y-3">
            {entries.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No chanting records yet
              </p>
            ) : (
              entries.map((e) => (
                <div
                  key={e.date}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <p className="font-medium">
                    {dayjs(e.chantingDate).format("DD MMM YYYY")} –{" "}
                    {e.chantingRounds} rounds
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
              ))
            )}

            {/* Mobile Rows + Pagination */}
            <div className="flex items-center justify-between text-sm pt-2">
              <div className="flex items-center gap-2">
                <span>Rows:</span>
                <Select
                  defaultValue={10}
                  onValueChange={(e) => {
                    setSize(Number(e));
                    setPage(page);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map((s) => (
                      <SelectItem value={s} key={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <span>
                {page}/{totalPages}
              </span>
            </div>

            <div className="flex justify-between">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>

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
                {entries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No chanting records yet
                    </td>
                  </tr>
                ) : (
                  entries.map((e) => (
                    <tr key={e.date} className="border-b">
                      <td className="py-2 text-center">
                        {dayjs(e.chantingDate).format("DD MMM YYYY")}
                      </td>
                      <td className="text-center">{e.chantingRounds}</td>
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

            {/* Desktop Pagination */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm">
                <span>Rows:</span>
                <Select
                  defaultValue={10}
                  onValueChange={(e) => {
                    setSize(Number(e));
                    setPage(page);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue value={10} placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map((s) => (
                      <SelectItem value={s} key={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
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
