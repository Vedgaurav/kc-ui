import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* -------------------- ZOD SCHEMA -------------------- */
const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email("Invalid email address"),
  countryCode: z.string().min(1, "Country code required"),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  facilitatorName: z.string().min(2, "Facilitator name is required"),
});

export default function Signup() {
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
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Registration Form</CardTitle>
        <CardDescription>Please fill in your personal details</CardDescription>
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>First Name</FieldLabel>
                  <Input {...field} placeholder="John" />
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input {...field} placeholder="Doe" />
                  {fieldState.error && (
                    <FieldDescription className="text-destructive">
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="john@example.com"
                  />
                  {fieldState.error && (
                    <FieldDescription className="text-destructive">
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
                <Field data-invalid={fieldState.invalid}>
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
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+91">+91 (IN)</SelectItem>
                            <SelectItem value="+1">+1 (US)</SelectItem>
                            <SelectItem value="+44">+44 (UK)</SelectItem>
                            <SelectItem value="+61">+61 (AU)</SelectItem>
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
                    <FieldDescription className="text-destructive">
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Facilitator Name</FieldLabel>
                  <Input {...field} placeholder="Facilitator Name" />
                  {fieldState.error && (
                    <FieldDescription className="text-destructive">
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
  );
}
