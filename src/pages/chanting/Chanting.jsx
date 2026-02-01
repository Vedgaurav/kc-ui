import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import { toast } from "sonner";

import api from "@/api/axios";
import { ChantingHistory } from "./ChantingHistory";

const lastFiveDays = Array.from({ length: 6 }, (_, i) =>
  dayjs().subtract(i, "day")
);

export default function Chanting() {
  const roundsInputRef = useRef(null);

  const [rounds, setRounds] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  /* Backend driven data */
  const [entries, setEntries] = useState([]);

  /* Pagination + Sorting */
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("chantingDate"); // backend field name
  const [direction, setDirection] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  /* Pagination End */

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

    const url = "/api/chanting";
    const response = await api.get(url, { params: params });

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

    const url = "/api/chanting";
    const payload = {
      chantingDate: selectedDate,
      chantingRounds: Number(rounds),
    };

    try {
      if (isEditMode) {
        const response = await api.put(url, payload);
        if (response?.data) {
          toast.success("Rounds Updated " + response?.data?.chantingRounds);
          setIsEditMode(false);
        }
      } else {
        const response = await api.post(url, payload);
        if (response?.data) {
          toast.success("Rounds Added " + response?.data?.chantingRounds);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.errorMessage);
    }

    setRounds("");
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
    setPage(1);
    fetchChanting();
  };

  const canDelete = (date) => dayjs(date).isAfter(dayjs().subtract(5, "day"));

  const handleDelete = async (e) => {
    const url = `/api/chanting/${e?.chantingId}`;
    await api
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
    setIsEditMode(true);
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
    <div className="max-w-3xl mx-auto py-6 space-y-6">
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
            type="tel"
            placeholder="Enter rounds"
            inputMode="numeric"
            pattern="[0-9]*"
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

          <div className="flex flex-col items-center">
            <Button
              className="w-1/2 md:w-1/3 h-12 text-lg mx-auto block m-2"
              onClick={handleAddUpdate}
            >
              {isEditMode ? <>Update</> : <>Save</>}
            </Button>

            {isEditMode && (
              <Button
                onClick={handleCancel}
                className="w-1/2 md:w-1/3 h-12 text-lg mx-auto block m-2"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chanting History */}
      <ChantingHistory
        entries={entries}
        page={page}
        size={size}
        totalPages={totalPages}
        sort={sort}
        direction={direction}
        isRefreshing={isRefreshing}
        isEditMode={isEditMode}
        selectedDate={selectedDate}
        canDelete={canDelete}
        onRefresh={handleRefresh}
        onSort={handleSorting}
        // onEdit={handleEdit}
        // onDelete={handleDelete}
        onPageChange={setPage}
        onSizeChange={(s) => {
          setSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}
