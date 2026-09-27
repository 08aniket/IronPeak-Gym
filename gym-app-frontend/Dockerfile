# Base image olarak Node.js 18 alpine kullanılıyor
FROM node:18-alpine

# Yazar bilgisi
LABEL authors="Aniket Shaw <shawaniket46@gmail.com>"

# Çalışma dizinini ayarlama
WORKDIR /frontend

# package.json ve package-lock.yaml dosyalarını kopyalama
COPY package.json ./

# Bağımlılıkları yükleme
RUN npm install

# Uygulamanın geri kalan dosyalarını kopyalama
COPY . .

# Uygulamayı çalıştırma
CMD ["npm", "run", "dev"]