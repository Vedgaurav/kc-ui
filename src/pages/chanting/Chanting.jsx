import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowUp, ArrowDown, RefreshCw, Pencil } from "lucide-react";
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
import { useChantingApi } from "@/api/useChantingApi";
import DeleteConfirmDialog from "@/common_components/DeleteConfirmDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const lastFiveDays = Array.from({ length: 6 }, (_, i) =>
  dayjs().subtract(i, "day")
);

const PAGE_SIZES = [10, 25, 50, 100];

export default function Chanting() {
  const roundsInputRef = useRef(null);

  const { updateChanting } = useChantingApi();
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
  const [sort, setSort] = useState("chantingDate"); // backend field name
  const [direction, setDirection] = useState("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [roundError, setRoundError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchChanting();
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsRefreshing(false);
    }
  };

  const handleRoundsChange = (e) => {
    const maxLength = 3;
    // Strictly only digits 0-9
    const cleanedValue = e.target.value.replace(/[^0-9]/g, "");

    if (cleanedValue.length <= maxLength) {
      setRounds(cleanedValue);
    }
  };

  /* Fetch chanting data */
  const fetchChanting = async () => {
    const params = new URLSearchParams({
      page: page - 1,
      size,
      sort: `${sort},${direction}`,
    });

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
  const handleAddUpdate = async () => {
    if (!rounds) {
      setRoundError("Please enter rounds");
      return;
    }
    console.log("Adding");
    const url = BASE_URL + "/api/chanting";
    const payload = {
      chantingDate: selectedDate,
      chantingRounds: Number(rounds),
    };

    if (isEditMode) {
      await secureAxios.put(url, payload).then((response) => {
        if (response?.data) {
          toast.success("Rounds Updated " + response?.data?.chantingRounds);
        }
      });
    } else {
      await secureAxios.post(url, payload).then((response) => {
        if (response?.data) {
          toast.success("Rounds Added " + response?.data?.chantingRounds);
        }
      });
    }

    setRounds("");
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
    setPage(1);
    fetchChanting();
  };

  const canDelete = (date) => dayjs(date).isAfter(dayjs().subtract(5, "day"));

  const handleDelete = async (e) => {
    console.log("HandleDelete", e?.chantingId);

    const url = BASE_URL + `/api/chanting/${e?.chantingId}`;
    await secureAxios
      .delete(url)
      .then(() => {
        toast.success("Record deleted");
      })
      .catch(() => {
        console.log("Delete error");
        toast.error("Record delete error");
      });

    fetchChanting();
  };

  const handleEdit = async (entry) => {
    console.log("Edit", entry);
    setIsEditMode(true);
    // set(dayjs(entry.chantingDate));
    setRounds(entry.chantingRounds.toString());
    setSelectedDate(entry.chantingDate);
  };

  useEffect(() => {
    if (!isEditMode || !roundsInputRef.current) return;

    const input = roundsInputRef.current;

    input.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const timer = setTimeout(() => {
      input.focus();
      // input.select();
    }, 400);

    return () => clearTimeout(timer);
  }, [isEditMode]);

  const handleCancel = () => {
    console.log("Cancelling Edit");
    setIsEditMode(false);
    setRounds("");
  };

  const handleSorting = (fieldName) => {
    setDirection((o) => (o === "asc" ? "desc" : "asc"));
    setSort(fieldName);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Add Chanting */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Chanting Rounds" : "Add Chanting Rounds"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            ref={roundsInputRef}
            id="chanting-form"
            type="text"
            placeholder="Enter rounds"
            value={rounds}
            onFocus={() => setRoundError("")}
            onChange={handleRoundsChange}
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
                  // disabled={isEditMode}
                  onClick={() => setSelectedDate(formatted)}
                >
                  {d.format("DD MMM")}
                </Button>
              );
            })}
          </div>

          <Button
            className="w-1/2 md:w-1/3 h-12 text-lg mx-auto block"
            onClick={handleAddUpdate}
          >
            {isEditMode ? <>Update</> : <>Save</>}
          </Button>

          {isEditMode && <Button onClick={handleCancel}>Cancel</Button>}
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
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mobile View */}
          <div className="sm:hidden space-y-3">
            {/*  Mobile Start */}
            {entries.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No chanting records yet
              </p>
            ) : (
              <Table className="table-fixed w-full">
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleSorting("chantingDate")}
                        >
                          Date
                          {direction === "asc" && sort === "chantingDate" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleSorting("chantingRounds")}
                        >
                          Rounds
                          {direction === "asc" && sort === "chantingRounds" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((e) => {
                    return (
                      <TableRow>
                        <TableCell className="font-medium">
                          {dayjs(e.chantingDate).format("DD MMM YYYY")}
                        </TableCell>

                        <TableCell className="">{e.chantingRounds}</TableCell>

                        <TableCell>
                          <div>
                            {canDelete(e.chantingDate) ? (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="m-2"
                                  disabled={isEditMode}
                                  onClick={() => handleEdit(e)}
                                >
                                  <Pencil className="h-4 w-4 text-blue-600" />
                                </Button>

                                <DeleteConfirmDialog
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
                                  onConfirm={() => handleDelete(e)}
                                  compactOnMobile={true}
                                />
                              </>
                            ) : (
                              <>
                                {/* Invisible placeholders keep height */}
                                <div className="h-5 w-8 opacity-0" />
                                <div className="h-5 w-8 opacity-0" />
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
          {/* Mobile Rows + Pagination */}
          {/* <div className="flex items-center justify-between text-sm pt-2">
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
          </div> */}
          {/* Mobile Rows + Pagination */}
          <div className="space-y-3 pt-3 border-t">
            {/* Row selector + page info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Rows</span>
                <Select
                  defaultValue={10}
                  onValueChange={(e) => {
                    setSize(Number(e));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-1 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map((s) => (
                      <SelectItem key={s} value={s}>
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
          </div>

          {/* Ved Mobile End */}

          {/* Desktop Table */}
          <div className="hidden sm:block space-y-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2">
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleSorting("chantingDate")}
                      >
                        Date
                        {direction === "asc" && sort === "chantingDate" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </th>

                  <th className="py-2">
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleSorting("chantingRounds")}
                      >
                        Rounds
                        {direction === "asc" && sort === "chantingRounds" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </th>

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
                    <tr key={e.chantingId} className="border-b">
                      <td className="py-2 text-center">
                        {dayjs(e.chantingDate).format("DD MMM YYYY")}
                      </td>
                      <td className="text-center">{e.chantingRounds}</td>
                      <td className="text-right">
                        {canDelete(e.date) && (
                          <div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="m-2"
                              disabled={isEditMode}
                              onClick={() => handleEdit(e)}
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>
                            <DeleteConfirmDialog
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
                              onConfirm={() => handleDelete(e)}
                            />
                          </div>
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
