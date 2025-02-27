
import { supabase } from "@/integrations/supabase/client";

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface SkillWithEndorsements extends Skill {
  endorsements: number;
  endorsedByCurrentUser?: boolean;
}

/**
 * Get all skills with endorsement counts for a user
 */
export async function getUserSkillsWithEndorsements(userId: string, currentUserId?: string) {
  try {
    // First check if the user profile has skills
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('skills')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    if (!profileData?.skills || !profileData.skills.length) return [];
    
    // Now get endorsement counts for each skill
    const { data, error } = await supabase.rpc(
      'get_user_skill_endorsements',
      { user_id: userId }
    );

    if (error) throw error;

    // If we have a current user, check which skills they've endorsed
    let endorsedSkills: string[] = [];
    if (currentUserId) {
      const { data: endorsementData, error: endorsementError } = await supabase
        .from('skill_endorsements')
        .select('skill_id')
        .eq('endorsed_user_id', userId)
        .eq('endorser_id', currentUserId);
      
      if (endorsementError) throw endorsementError;
      
      if (endorsementData) {
        endorsedSkills = endorsementData.map(item => item.skill_id);
      }
    }

    // Map the results
    return data.map((item: any) => ({
      id: item.skill_id,
      name: item.skill_name,
      endorsements: Number(item.endorsement_count),
      endorsedByCurrentUser: endorsedSkills.includes(item.skill_id)
    }));
  } catch (error) {
    console.error('Error fetching user skills with endorsements:', error);
    return [];
  }
}

/**
 * Endorse a skill for a user
 */
export async function endorseSkill(skillId: string, endorsedUserId: string, endorserId: string) {
  try {
    // Check if the skill exists, create it if it doesn't
    const { data: skillData, error: skillError } = await supabase
      .from('skills')
      .select('id')
      .eq('id', skillId)
      .single();
    
    if (skillError && skillError.code === 'PGRST116') {
      // Skill doesn't exist, get the name from profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('skills')
        .eq('id', endorsedUserId)
        .single();
      
      if (profileData?.skills) {
        const skillName = profileData.skills.find((s: string) => s === skillId) || skillId;
        
        // Create the skill
        const { data: newSkill, error: createError } = await supabase
          .from('skills')
          .insert({ id: skillId, name: skillName })
          .select('id')
          .single();
        
        if (createError) throw createError;
      }
    }

    // Create the endorsement
    const { data, error } = await supabase
      .from('skill_endorsements')
      .insert({
        skill_id: skillId,
        endorsed_user_id: endorsedUserId,
        endorser_id: endorserId
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - already endorsed
        return { success: false, message: 'You have already endorsed this skill' };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error endorsing skill:', error);
    return { success: false, message: 'Failed to endorse skill' };
  }
}

/**
 * Remove an endorsement
 */
export async function removeEndorsement(skillId: string, endorsedUserId: string, endorserId: string) {
  try {
    const { error } = await supabase
      .from('skill_endorsements')
      .delete()
      .eq('skill_id', skillId)
      .eq('endorsed_user_id', endorsedUserId)
      .eq('endorser_id', endorserId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error removing endorsement:', error);
    return { success: false, message: 'Failed to remove endorsement' };
  }
}
