#!/bin/bash

set -e

echo "======================================"
echo "🚀 Desplegando Frontend BINGO AMIGO ADMIN..."
echo "======================================"

echo ""
echo "📥 Actualizando repositorio..."
git fetch --all
git pull

echo ""
echo "📦 Instalando dependencias..."
npm install

echo ""
echo "🏗️ Compilando Bingo Amigo Admin..."

# ng build
npm run build
ng build --base-href /bingo-admin/
# ng build --configuration production --base-href /controlelectoral/

echo ""
echo "📂 Publicando archivos..."

sudo rsync -av --delete build/ /var/www/bingo/

echo ""
echo "✅ BINGO AMIGO desplegado correctamente."
echo "======================================"