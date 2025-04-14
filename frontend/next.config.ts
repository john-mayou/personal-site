import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
    additionalData: `
      @use "app/globals" as *;
      @use "app/mixins" as *;
    `,
  },
}

export default nextConfig
