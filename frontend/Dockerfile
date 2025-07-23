# Stage 1: Build React app
FROM node:18 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx tailwindcss -i ./styles/input.css -o ./public/output.css --minify
# Build React app (this will pick up the output.css)
RUN npm run build

# Stage 2: Serve with Apache
FROM httpd:2.4

# Enable .htaccess and mod_rewrite
RUN sed -i '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /usr/local/apache2/conf/httpd.conf \
 && echo "LoadModule rewrite_module modules/mod_rewrite.so" >> /usr/local/apache2/conf/httpd.conf

# Copy build output and .htaccess
COPY --from=builder /app/build/ /usr/local/apache2/htdocs/
COPY .htaccess /usr/local/apache2/htdocs/
