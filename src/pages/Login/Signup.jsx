import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAddUser } from "./AddUser";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_CODES_BY_CONTINENT } from "@/constants/country-codes";

export const COUNTRY_DISPLAY_MAP = Object.values(COUNTRY_CODES_BY_CONTINENT)
  .flat()
  .reduce((acc, c) => {
    acc[c.dialCode] = `${c.dialCode} (${c.iso})`;
    return acc;
  }, {});

/* -------------------- ZOD SCHEMA -------------------- */

const formSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First Name is required")
    .min(2, "Minimum 2 characters required")
    .max(10, "Maximum 10 characters allowed"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last Name is required")
    .min(2, "Minimum 2 characters required"),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  countryCode: z.string().min(1, "Country code required"),

  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  facilitatorName: z
    .string()
    .trim()
    .min(1, "Facilitator name is required")
    .min(2, "Minimum 2 characters required"),
});

export default function Signup() {
  const { addUser } = useAddUser();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+91",
      phoneNumber: "",
      facilitatorName: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    addUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center sm:pt-0">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>
            Please fill in your personal details
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="registration-form"
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
                    <Input {...field} placeholder="John" maxLength="10" />
                    {fieldState.error && (
                      <FieldDescription className="text-destructive text-left">
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
                    <Input {...field} placeholder="Doe" maxLength="10" />
                    {fieldState.error && (
                      <FieldDescription className="text-destructive text-left">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="john@example.com"
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-destructive text-left">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

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
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="+91 (IN)">
                                {COUNTRY_DISPLAY_MAP[field.value]}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(COUNTRY_CODES_BY_CONTINENT).map(
                                ([continent, countries]) => (
                                  <div key={continent}>
                                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                      {continent
                                        .replace(/([A-Z])/g, " $1")
                                        .trim()}
                                    </div>

                                    {countries.map((country) => (
                                      <SelectItem
                                        key={country.iso}
                                        value={country.iso + country.dialCode}
                                      >
                                        {country.dialCode} ({country.iso}){" "}
                                        {country.name}
                                      </SelectItem>
                                    ))}
                                  </div>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {/* Phone Number */}
                      <Input
                        {...field}
                        placeholder="10 digit number"
                        maxLength={10}
                        inputMode="numeric"
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

              {/* Facilitator Name */}
              <Controller
                name="facilitatorName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Facilitator Name</FieldLabel>
                    <Input {...field} placeholder="Facilitator Name" />
                    {fieldState.error && (
                      <FieldDescription className="text-destructive text-left">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="registration-form">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
