import { useAuth } from "@/auth/AuthContext";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminUserApi } from "@/api/useAdminUserApi";
import { PaginationControls } from "@/common/pagination/PaginationControls";
import dayjs from "dayjs";

export const AdminAuditUser = () => {
  /* Pagination + Sorting */
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt"); // backend field name
  const [direction, setDirection] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [auditData, setAuditData] = useState([]);
  /* Pagination End */
  const { getAdminAuditHistory } = useAdminUserApi();

  const loadAuditHistory = async () => {
    const params = {
      page: page - 1,
      size,
      sort: `${sort},${direction}`,
    };
    const auditResponse = await getAdminAuditHistory(params);
    setAuditData(auditResponse?.content);
    console.log("Audit History", auditResponse);
  };

  useEffect(() => {
    loadAuditHistory();
  }, []);
  return (
    <>
      <div className="p-4">
        <Table>
          <TableCaption>Audit History</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Actor</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Action</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditData &&
              auditData?.map((audit) => {
                return (
                  <TableRow key={audit?.id}>
                    <TableCell className="break-all whitespace-normal">
                      {audit?.actorUserEmail}
                    </TableCell>
                    <TableCell className="break-all whitespace-normal">
                      {audit?.targetUserEmail}
                    </TableCell>
                    <TableCell>{audit?.role}</TableCell>
                    <TableCell className="text-right">
                      {audit?.action}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayjs(audit?.createdAt).format("DD MMM YYYY")}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          pageSize={size}
          onPageChange={setPage}
          onPageSizeChange={setSize}
        />
      </div>
    </>
  );
};
