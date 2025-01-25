import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../RegisterForm";

interface RoleFieldProps {
  form: UseFormReturn<RegisterFormValues>;
}

const roleDescriptions = {
  scholar: "Students and researchers seeking mentorship and opportunities",
  mentor: "Experienced professionals offering guidance and support",
  csr_funder: "Corporate Social Responsibility representatives and funders",
  ngo: "Non-Governmental Organization representatives",
};

export const RoleField = ({ form }: RoleFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Role</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(roleDescriptions).map(([role, description]) => (
                <SelectItem key={role} value={role}>
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">{role.replace('_', ' ')}</span>
                    <span className="text-xs text-muted-foreground">{description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Choose the role that best describes your participation in the platform
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};