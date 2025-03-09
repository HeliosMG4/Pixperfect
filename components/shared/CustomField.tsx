import React from "react";
import { Control } from "react-hook-form";
import { z } from "zod";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";

import { formSchema } from "./TransformationForm";

type CustomFieldProps = {
  control?: Control<z.infer<typeof formSchema>>; // Made optional
  render: (props: { field: { value: any; onChange: (value: any) => void } }) => React.ReactNode; // Typed properly
  name: keyof z.infer<typeof formSchema>;
  formLabel?: string;
  className?: string;
};

export const CustomField = ({
  control,
  render,
  name,
  formLabel,
  className,
}: CustomFieldProps) => {
  if (!control) {
    console.error("CustomField: Missing control prop.");
    return null; // Prevents the app from crashing
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>{render({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
