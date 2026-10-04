import { createClient } from 'next-sanity'

import { dataset, projectId, useCdn } from '../env'

export const client = createClient({
  projectId,
  dataset,
  useCdn,
  apiVersion: '2023-05-03', // use a stable API version
})
