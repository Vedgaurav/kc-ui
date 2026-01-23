import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import dayjs from "dayjs";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserApi } from "@/api/useUserApi";
import { COUNTRY_CODES_BY_CONTINENT } from "@/constants/country-codes";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

function normalizeCountryCode(value) {
  // "US|+1" → "+1"
  console.log("Normalize", value);
  return value.split("-")[1];
}

const profileSchema = z.object({
  firstName: z.string().min(2, "Minimum 2 characters"),
  lastName: z.string().min(2, "Minimum 2 characters"),
  countryCode: z.string().min(1, "Country code required"),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  committedRounds: z
    .number()
    .min(0, "Minimum 0 round")
    .max(500, "Maximum 500 rounds"),
});

export const COUNTRY_DISPLAY_MAP = Object.values(COUNTRY_CODES_BY_CONTINENT)
  .flat()
  .reduce((acc, c) => {
    acc[c.dialCode] ??= `${c.dialCode} (${c.iso})`;

    return acc;
  }, {});

export default function Profile() {
  const { updateUser, getUser } = useUserApi();
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const { refreshAuth } = useAuth();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      committedRounds: 16,
      countryCode: "",
    },
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        console.log("Fetching data on profile");
        const responseData = await getUser();

        setUser(responseData);

        setEditMode(responseData?.status === "INACTIVE" || false);

        form.reset({
          firstName: responseData.firstName,
          lastName: responseData.lastName,
          phoneNumber: responseData.phoneNumber,
          committedRounds: responseData.committedRounds,
          status: responseData.status,
          countryCode: responseData.countryCode || "+91",
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, []);

  async function onSubmit(data) {
    try {
      console.log("Submit", normalizeCountryCode(data.countryCode));
      const updatedUser = await updateUser({
        ...user,
        ...data,
        // countryCode: normalizeCountryCode(data.countryCode),
      });

      setUser(updatedUser);
      form.reset(updatedUser);
      setEditMode(false);
      refreshAuth();
    } catch (err) {
      console.error(err);
    }
  }

  function onCancel() {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        committedRounds: user.committedRounds,
        status: user.status,
        countryCode: user.countryCode,
      });
    }
    setEditMode(false);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Signed up on {dayjs(user.createdAt).format("DD MMM YYYY")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="profile-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              {/* First Name */}
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>First Name</FieldLabel>
                    <Input {...field} disabled={!editMode} />
                    {fieldState.error && (
                      <FieldDescription className="text-destructive">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              {/* Last Name */}
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Last Name</FieldLabel>
                    <Input {...field} disabled={!editMode} />
                    {fieldState.error && (
                      <FieldDescription className="text-destructive">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              {/* Email (read-only) */}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input value={user.email} disabled />
              </Field>

              {/* Phone Number */}
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>

                    <div className="flex gap-2">
                      {/* Country Code */}
                      <Controller
                        name="countryCode"
                        control={form.control}
                        render={({ field }) => (
                          <div className="relative ">
                            <select
                              {...field}
                              disabled={!editMode}
                              className="
                              h-10 w-full appearance-none rounded-md border border-input
                              bg-background px-3 pr-8 py-2 text-sm leading-none text-foreground
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                              focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                            "
                            >
                              <option value="">Select</option>

                              {Object.entries(COUNTRY_CODES_BY_CONTINENT).map(
                                ([continent, countries]) => (
                                  <optgroup
                                    key={continent}
                                    label={continent.replace(/([A-Z])/g, " $1")}
                                  >
                                    {countries.map((country) => (
                                      <option
                                        key={`${country.iso}-${country.dialCode}`}
                                        value={country.dialCode}
                                      >
                                        {country.dialCode} {country.name}
                                      </option>
                                    ))}
                                  </optgroup>
                                )
                              )}
                            </select>

                            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
                              {/* ▼ */}
                              <ChevronDown className="h-4 w-4" />
                            </span>
                          </div>
                        )}
                      />

                      {/* Phone Number */}
                      <Input
                        {...field}
                        placeholder="10 digit number"
                        maxLength={10}
                        inputMode="numeric"
                        disabled={!editMode}
                      />
                    </div>
                    {fieldState.error && (
                      <FieldDescription className="text-destructive text-left">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="committedRounds"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Committed Rounds</FieldLabel>

                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={!editMode}
                      value={field.value < 0 ? "" : field.value}
                      onChange={(e) => {
                        const raw = e.target.value;

                        // allow empty while typing
                        if (raw === "") {
                          field.onChange(0);
                          return;
                        }

                        // remove leading zeros
                        const normalized = raw.replace(/^0+/, "");

                        const num = Number(normalized);

                        if (!Number.isNaN(num) && num >= 0) {
                          field.onChange(num);
                        }
                      }}
                    />

                    {fieldState.error && (
                      <FieldDescription className="text-destructive">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              {/* Status */}
              <Field>
                <FieldLabel>
                  Status:{" "}
                  <p className="border rounded-lg p-2 m-2">{user.status}</p>
                </FieldLabel>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex gap-2">
          {!editMode && (
            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
          )}

          {editMode && (
            <>
              <Button type="submit" form="profile-form">
                Save
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
