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

      if (signUpError?.message === "Email not confirmed") {
        toast({
          title: "Please verify your email",
          description: "Check your inbox and click the verification link to complete registration.",
        });
        navigate("/login");
        return;
      }
      
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account. Once verified, you can complete your profile.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific error cases
      if (error.message?.includes("email_not_confirmed")) {
        toast({
          variant: "default",
          title: "Email Verification Required",
          description: "Please check your inbox and verify your email address to continue.",
        });
        navigate("/login");
        return;
      }

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