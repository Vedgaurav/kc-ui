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
import { useFacilitatorApi } from "@/api/useFacilitatorApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const Facilitator = () => {
  /* Pagination + Sorting */
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("firstName"); // backend field name
  const [direction, setDirection] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [facilityListData, setFacilityListData] = useState([]);

  const { getFacilitatorUsers } = useFacilitatorApi();
  const navigate = useNavigate();

  const handleFacilityNavigation = (facility) => {
    navigate("/facility", {
      state: { facility },
    });
  };

  const loadFacilityList = async () => {
    console.log("Loading Facility List");
    const params = {
      page: page - 1,
      size,
      sort: `${sort},${direction}`,
    };
    const facilityListResponse = await getFacilitatorUsers(params);
    setFacilityListData(facilityListResponse?.content);
  };

  useEffect(() => {
    loadFacilityList();
  }, []);
  return (
    <>
      <div className="p-4">
        <Table>
          <TableCaption>Facility List</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilityListData &&
              facilityListData?.map((facility) => {
                return (
                  <TableRow
                    key={facility?.userId}
                    onClick={() => handleFacilityNavigation(facility)}
                  >
                    <TableCell className="break-all whitespace-normal">
                      {facility?.name}
                    </TableCell>
                    <TableCell className="break-all whitespace-normal">
                      {facility?.email}
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
