import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useChantingApi } from "@/api/useChantingApi";
import { Pagination } from "@/common/pagination/Pagination";
import { Separator } from "@/components/ui/separator";

export const Today = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [todayData, setTodayData] = useState([]);

  const { getFacilitatorGroupChantingToday } = useChantingApi();
  const loadToday = async () => {
    const pagination = {
      page,
      size,
    };

    const { data } = await getFacilitatorGroupChantingToday(pagination);

    setTodayData(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    loadToday();
  }, [page, size]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Rounds</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {todayData &&
            todayData.map((e, index) => (
              <TableRow key={index}>
                <TableCell>
                  {e.firstName} {e.lastName}
                </TableCell>
                <TableCell>{e.totalRounds}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Separator />

      <Pagination
        totalPages={totalPages}
        initialPage={page + 1}
        initialSize={size}
        onChange={({ page, size }) => {
          setPage(page - 1);
          setSize(size);
        }}
      />
    </div>
  );
};
