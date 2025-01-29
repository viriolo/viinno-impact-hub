import { supabase } from "@/integrations/supabase/client";

export const api = {
  auth: {
    signIn: async (email: string, password: string) => {
      return await supabase.auth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      return await supabase.auth.signOut();
    },
  },
  profiles: {
    get: async (userId: string) => {
      return await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    },
    update: async (userId: string, data: any) => {
      return await supabase
        .from("profiles")
        .update(data)
        .eq("id", userId);
    },
  },
  impactCards: {
    create: async (data: any) => {
      return await supabase.from("impact_cards").insert(data);
    },
    update: async (id: string, data: any) => {
      return await supabase.from("impact_cards").update(data).eq("id", id);
    },
    delete: async (id: string) => {
      return await supabase.from("impact_cards").delete().eq("id", id);
    },
    getAll: async () => {
      return await supabase.from("impact_cards").select("*");
    },
    getById: async (id: string) => {
      return await supabase.from("impact_cards").select("*").eq("id", id).single();
    },
  },
};
