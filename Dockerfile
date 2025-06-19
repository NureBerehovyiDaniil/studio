# Dockerfile for Next.js Application

# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --frozen-lockfile

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
# This will use the `distDir: 'build'` and `output: 'standalone'` from next.config.ts
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1
# Set a default port, can be overridden by environment variable at runtime
ENV PORT 3000

# Copy the standalone output from the builder stage.
# The 'standalone' output mode (in 'build/standalone' due to distDir)
# creates a self-contained folder with the server.js, necessary node_modules,
# and copies of public and static assets.
COPY --from=builder /app/build/standalone ./

# Expose the port the app runs on
EXPOSE 3000

# The server.js file in the standalone output is the entry point
CMD ["node", "server.js"]
