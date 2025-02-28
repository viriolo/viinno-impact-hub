
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
export async function getUserSkillsWithEndorsements(userId: string, currentUserId?: string): Promise<SkillWithEndorsements[]> {
  try {
    // First check if the user profile has skills
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('skills')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Error fetching profile skills:", profileError);
      return [];
    }
    
    if (!profileData?.skills || !profileData.skills.length) return [];
    
    // We'll create a simple representation using the skills array
    // in case the dedicated skills table doesn't exist yet
    return profileData.skills.map((skillName: string, index: number) => ({
      id: `skill-${index}`,
      name: skillName,
      endorsements: Math.floor(Math.random() * 10), // Mock endorsement count
      endorsedByCurrentUser: Math.random() > 0.7 // Random endorsement status
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
    // Mock this for now - in production this would interact with the skill_endorsements table
    console.log(`Endorsing skill ${skillId} for user ${endorsedUserId} by user ${endorserId}`);
    
    return { 
      success: true, 
      data: {
        id: crypto.randomUUID(),
        skill_id: skillId,
        endorsed_user_id: endorsedUserId,
        endorser_id: endorserId,
        created_at: new Date().toISOString()
      }
    };
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
    // Mock this for now - in production this would interact with the skill_endorsements table
    console.log(`Removing endorsement for skill ${skillId} for user ${endorsedUserId} by user ${endorserId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error removing endorsement:', error);
    return { success: false, message: 'Failed to remove endorsement' };
  }
}
