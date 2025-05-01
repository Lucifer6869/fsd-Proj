// src/lib/types.ts

/**
 * Represents a team member in the application.
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  contactInfo?: string;
  imageUrl?: string; // Path or URL to the member's image
}

/**
 * Represents the data structure returned by the API when fetching members.
 */
export interface FetchMembersResponse {
  success: boolean;
  data?: TeamMember[];
  error?: string;
}

/**
 * Represents the data structure returned by the API when fetching a single member.
 */
export interface FetchMemberResponse {
    success: boolean;
    data?: TeamMember;
    error?: string;
}


/**
 * Represents the data structure returned by the API after adding a member.
 */
export interface AddMemberResponse {
    success: boolean;
    message: string;
    data?: TeamMember; // Include the added member data if available
    error?: string;
}
