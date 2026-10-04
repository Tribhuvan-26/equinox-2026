export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'equinox';

// Enforce that a typo'd environment variable (like the 7-character 'kb34j9w') 
// does not override the correct 8-character Sanity project ID.
const envProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const projectId = (envProjectId && envProjectId.trim().length === 8) 
  ? envProjectId.trim() 
  : 'ekb34j9w';

// See the Sanity documentation for more information on configuring the client
// https://www.sanity.io/docs/configuring-the-client
export const useCdn = false; // set to false for fresh assets during dev
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';
