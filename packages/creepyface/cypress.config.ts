import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    video: false,
    supportFile: false,
    fixturesFolder: false,
  },
})
