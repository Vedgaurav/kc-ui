import { useLocation, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useFacilitatorApi } from "@/api/useFacilitatorApi";
import { useEffect, useState } from "react";
import { Pagination } from "@/common/pagination/Pagination";
import { ArrowDown, ArrowUp } from "lucide-react";
import dayjs from "dayjs";
import Dashboard from "../chanting/Dashboard";

export const FacilityDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const facility = state?.facility;
  const { getFacilitatorUserChantingDetails } = useFacilitatorApi();
  const [userChantingHistory, setUserChantingHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState("chantingAt");
  const [direction, setDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const apiConfig = {
    url: `/api/facilitator/user/${facility?.userId}/dashboard`,
  };

  const SortIcon = ({ field }) =>
    direction === "asc" && sort === field ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );

  const handleSorting = (fieldName) => {
    setDirection((o) => (o === "asc" ? "desc" : "asc"));
    setSort(fieldName);
  };

  const loadUserChantingHistory = async () => {
    const pagination = {
      page: page,
      size,
      sort: `${sort},${direction}`,
    };
    const response = await getFacilitatorUserChantingDetails(
      facility?.userId,
      pagination
    );
    setUserChantingHistory(response?.content);
    setTotalPages(response?.totalPages);
  };

  useEffect(() => {
    loadUserChantingHistory();
  }, [sort, direction, page, size]);

  const handleBack = () => {
    navigate("/facilitator");
  };
  return (
    <div>
      <Button variant="outline" className="m-2" onClick={handleBack}>
        <ChevronLeft />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Facility Details</CardTitle>
        </CardHeader>
        <CardContent className="">
          <p>Name: {facility?.name}</p>
          <p>Email: {facility?.email}</p>
          <p>Phone: {facility?.phone}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="chanting" className="mt-2">
        <TabsList>
          <TabsTrigger value="chanting">Chanting</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="chanting">
          <Card className="">
            <CardHeader>
              <CardTitle>Chanting History</CardTitle>
            </CardHeader>
            <CardContent className="">
              {/*Chanting History */}
              <div className="sm:hidden space-y-3">
                {userChantingHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    No chanting records yet
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSorting("chantingAt")}
                          >
                            Date <SortIcon field="chantingAt" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSorting("chantingRounds")}
                          >
                            Rounds <SortIcon field="chantingRounds" />
                          </Button>
                        </TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {userChantingHistory.map((e) => (
                        <TableRow key={e.chantingId}>
                          <TableCell>
                            {dayjs(e.chantingDate).format(
                              "DD MMM YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell>{e.chantingRounds}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              <Pagination
                totalPages={totalPages}
                initialPage={1}
                initialSize={10}
                onChange={({ page, size }) => {
                  setPage(page - 1);
                  setSize(size);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Dashboard apiConfig={apiConfig} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
