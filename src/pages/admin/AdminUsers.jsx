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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAdminUserApi } from "@/api/useAdminUserApi";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";
import MobilePagination from "@/common/MobilePagination";
import ConfirmDialog from "@/common/ConfirmDialog";
import { SUPER_ADMIN_ROLE } from "@/constants/Constants";

export default function AdminUsers() {
  const FACILITATOR = "facilitator";
  const ADMIN = "admin";

  const {
    getUsers,
    assignFacilitator,
    removeFacilitator,
    assignAdmin,
    removeAdmin,
  } = useAdminUserApi();
  const { userAuth: loggedInUser, hasRole } = useAuth();

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);

  /* Pagination + Sorting */
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tabActive, setTabActive] = useState(FACILITATOR);

  const activeLabel = () => {
    return tabActive === FACILITATOR ? "Facilitator" : "Admin";
  };
  const activeTabRole = (u) => {
    if (tabActive === FACILITATOR) {
      return u.facilitator ? "Yes" : "No";
    }
    return u.admin ? "Yes" : "No";
  };
  /* Pagination End */

  // 🔍 Search handling
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
    if (hasRole(SUPER_ADMIN_ROLE)) {
      setIsSuperAdmin(true);
    }
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
      if (tabActive === FACILITATOR) {
        await assignFacilitator(selected);
      } else if (tabActive === ADMIN && isSuperAdmin) {
        await assignAdmin(selected);
      }
      toast.success(`${tabActive} role assigned`);
      loadUsers();
    } catch (error) {
      console.log("Assign Role error", error);
      toast.error(error?.data?.errorMessage || "Failed to assign role");
    }
  };

  const handleRemove = async () => {
    try {
      if (tabActive === FACILITATOR) {
        await removeFacilitator(selected);
      } else if (tabActive === ADMIN && isSuperAdmin) {
        await removeAdmin(selected);
      }

      toast.success(`${tabActive} role removed`);
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

        <CardContent className="p-0.5">
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
          </div>

          {/* 📊 Table */}
          <Tabs defaultValue="facilitator" className="w-100 mt-5">
            <TabsList>
              <TabsTrigger
                value="facilitator"
                onClick={() => setTabActive(FACILITATOR)}
              >
                Facilitator
              </TabsTrigger>
              {isSuperAdmin && (
                <TabsTrigger value="admin" onClick={() => setTabActive(ADMIN)}>
                  Admin
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
          <div className="overflow-x-auto">
            <div className="m-4"></div>
            <div className="flex flex-col">
              <ConfirmDialog
                trigger={
                  <Button className="w-3xs mb-2" disabled={!selected.length}>
                    Assign {activeLabel()}
                  </Button>
                }
                title="Confirm assign role?"
                description={`This will assign ${tabActive} role `}
                confirmText="Assign"
                onConfirm={handleAssign}
              />

              <ConfirmDialog
                trigger={
                  <Button
                    className="w-3xs"
                    variant="destructive"
                    disabled={!selected.length}
                  >
                    Remove {activeLabel()}
                  </Button>
                }
                title="Confirm Remove Role?"
                description={`This will remove ${tabActive} role `}
                confirmText="Remove"
                onConfirm={handleRemove}
              />
            </div>
            <Table className="mt-4 mb-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center" />
                  <TableHead>Name</TableHead>
                  <TableHead className="">Email</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead className="text-center">{activeLabel()}</TableHead>
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
                        {activeTabRole(u)}
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
