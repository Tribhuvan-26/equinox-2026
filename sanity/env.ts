export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'equinox';
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ekb34j9w';

// See the Sanity documentation for more information on configuring the client
// https://www.sanity.io/docs/configuring-the-client
export const useCdn = false; // set to false for fresh assets during dev
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';
