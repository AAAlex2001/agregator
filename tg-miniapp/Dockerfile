FROM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
# npm install (не ci): lock сгенерирован на Windows и не содержит linux-нативных
# optional-бинарников rollup/esbuild — install доустанавливает их под платформу.
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
