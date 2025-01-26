import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { PasswordFields } from "./form/PasswordFields";
import { RoleField } from "./form/RoleField";
import { sanitizeInput } from "@/utils/security";

const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .transform(val => sanitizeInput(val)),
  email: z.string()
    .email("Please enter a valid email address")
    .transform(val => sanitizeInput(val.toLowerCase())),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
  role: z.enum(["scholar", "mentor", "csr_funder", "ngo"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.name,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      toast({
        title: "Registration Successful",
        description: "Welcome! Let's complete your profile.",
      });
      
      // Navigate to profile page with edit section open
      navigate("/profile?section=edit");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Registration failed. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PersonalInfoFields form={form} />
        <RoleField form={form} />
        <PasswordFields form={form} />
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    </Form>
  );
}