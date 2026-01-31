import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAdminUserApi } from "@/api/useAdminUserApi";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";
import MobilePagination from "@/common_components/MobilePagination";

export default function AdminUsers() {
  const { getUsers, assignFacilitator, removeFacilitator } = useAdminUserApi();
  const { user: loggedInUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);

  /* Pagination + Sorting */
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  /* Pagination End */

  // 🔍 Search handling
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  async function loadUsers() {
    try {
      const data = await getUsers({
        search,
        page: page - 1,
        size: size,
      });

      setUsers(data.content);
      setTotalPages(data.totalPages);
      setSelected([]);
    } catch {
      toast.error("Failed to load users");
    }
  }

  const toggleSelect = (userId) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSearch = () => {
    setPage(0);
    setSearch(searchInput.trim());
  };

  const handleAssign = async () => {
    try {
      await assignFacilitator(selected);
      toast.success("Facilitator role assigned");
      loadUsers();
    } catch (error) {
      console.log("Assign Role error", error);
      toast.error(error?.data?.errorMessage || "Failed to assign role");
    }
  };

  const handleRemove = async () => {
    try {
      await removeFacilitator(selected);
      toast.success("Facilitator role removed");
      loadUsers();
    } catch {
      toast.error("Failed to remove role");
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Admin – User Management</CardTitle>
        </CardHeader>

        <CardContent className="px-0.5">
          {/* 🔍 Search & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder="Search by first name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button className="mt-4 w-2/4" onClick={handleSearch}>
                Search
              </Button>
            </div>

            <div className="mt-4">
              <Button
                className="w-full"
                disabled={!selected.length}
                onClick={handleAssign}
              >
                Assign Facilitator
              </Button>

              <Button
                className="mt-4 w-full"
                variant="destructive"
                disabled={!selected.length}
                onClick={handleRemove}
              >
                Remove Facilitator
              </Button>
            </div>
          </div>

          {/* 📊 Table */}
          <div className="overflow-x-auto">
            <Table className="mt-4 mb-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center" />
                  <TableHead>Name</TableHead>
                  <TableHead className="">Email</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead className="text-center">Facilitator</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((u) => {
                  const isSelf = u.userId === loggedInUser?.userId;

                  return (
                    <TableRow key={u.userId}>
                      <TableCell className="text-center">
                        <Checkbox
                          disabled={isSelf}
                          checked={selected.includes(u.userId)}
                          onCheckedChange={() => toggleSelect(u.userId)}
                        />
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {u.firstName} {u.lastName}
                      </TableCell>

                      <TableCell className="">{u.email}</TableCell>

                      {/* <TableCell>{u.status}</TableCell> */}

                      <TableCell className="text-center">
                        {u.facilitator ? "Yes" : "No"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* ⏮ Pagination */}
          {/* <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div> */}

          <MobilePagination
            page={page}
            totalPages={totalPages}
            size={size}
            onPageChange={setPage}
            onSizeChange={setSize}
          />
        </CardContent>
      </Card>
    </div>
  );
}
