import { useState, useMemo, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import dayjs from "dayjs";
import { Spinner } from "@/components/ui/spinner";
import api from "@/api/axios";

const RANGE_OPTIONS = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  //   { label: "90 Days", value: 90 },
  { label: "6 Months", value: 180 },
  { label: "1 Year", value: 360 },
  { label: "All", value: null },
];

export default function Dashboard() {
  const [range, setRange] = useState(30);
  const [records, setRecords] = useState([]);
  const [committedRounds, setCommittedRounds] = useState(0);
  const [idealRounds, setIdealRounds] = useState(16);
  const [average, setAverage] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const toDate = dayjs().format("YYYY-MM-DD");

    const params = {
      toDate,
    };

    if (range !== null) {
      params.fromDate = dayjs()
        .subtract(range - 1, "day")
        .format("YYYY-MM-DD");
    }

    setLoading(true);

    api
      .get("/api/chanting/dashboard", { params })
      .then((response) => {
        const data = response.data;

        setCommittedRounds(data.committedRounds);
        setIdealRounds(data.idealRounds);
        setAverage(data.averageRounds || 0);
        setStreak(data.currentStreak || 0);

        setRecords(
          data.chantingDtoList.map((r) => ({
            date: r.chantingDate,
            chantingRounds: r.chantingRounds,
            committedRounds: data.committedRounds,
            idealRounds: data.idealRounds,
          }))
        );
      })
      .catch((error) => {
        console.error("Dashboard fetching error", error);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  }, [range]);

  const data = records;

  const metCommitmentDays = useMemo(
    () => records.filter((d) => d.chantingRounds >= committedRounds).length,
    [records, committedRounds]
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Range Selector */}
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r.label}
              disabled={range === r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1 rounded-md border text-sm ${
                range === r.value ? "bg-blue-600 text-white" : "bg-background"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <StatCard title="Ideal" value={`${idealRounds}`} />
        <StatCard title="Committed" value={committedRounds} />
        <StatCard
          title="Days Met Commitment"
          value={`${metCommitmentDays}/${data?.length}`}
        />
        <StatCard title="Average" value={average} />

        <StatCard
          title="Streak"
          value={
            <span className="flex items-center justify-center gap-1 text-orange-500 font-semibold text-2xl">
              {streak} 🔥
            </span>
          }
        />
      </div>

      {/* Chart */}
      {data && (
        <div className="h-[420px] min-h-[300px]">
          {/* <ResponsiveContainer width="100%" height="100%"> */}
          <AreaChart data={data} width="100%" height="100%">
            {/* <CartesianGrid strokeDasharray="3 3" /> */}

            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.6} />
                <stop offset="50%" stopColor="#1D4ED8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              tickFormatter={(d) => dayjs(d).format("DD MMM")}
            />

            <YAxis allowDecimals={false} />

            <Tooltip labelFormatter={(d) => dayjs(d).format("DD MMM YYYY")} />

            <Legend />

            <Area
              type="monotone"
              dataKey="chantingRounds"
              name="Actual Rounds"
              stroke="#2563eb"
              //   fill="#1E90FF" ///okay
              fillOpacity={1}
              fill="url(#colorBlue)"
              strokeWidth={2}
              isAnimationActive={false}
            />

            <Area
              type="monotone"
              dataKey="committedRounds"
              name="Committed Rounds"
              stroke="#16a34a"
              fillOpacity={0}
              strokeWidth={2}
              isAnimationActive={false}
            />

            <Area
              type="monotone"
              dataKey="idealRounds"
              name="Ideal Rounds"
              stroke="#f97316"
              fillOpacity={0}
              strokeWidth={2}
              isAnimationActive={false}
            />

            <ReferenceLine
              y={idealRounds}
              stroke="#f97316"
              strokeWidth={2}
              // strokeDasharray="4 4"
              // label={`Ideal (${idealRounds})`}
            />
            {/* 
              <ReferenceLine
                y={average}
                stroke="#7c3aed"
                // strokeDasharray="2 2"
                label={`Avg (${average})`}
              /> */}
          </AreaChart>
          {/* </ResponsiveContainer> */}
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <div className="h-[420px] min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>...</AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* -------------------- STAT CARD -------------------- */

function StatCard({
  title,
  value,
  className = "", // For the outer div
  titleClassName = "", // For the title text
  valueClassName = "", // For the value text
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${className}`}>
      <p className={`text-sm text-muted-foreground ${titleClassName}`}>
        {title}
      </p>
      <p className={`text-2xl font-semibold mt-1 ${valueClassName}`}>{value}</p>
    </div>
  );
}
