#!/bin/bash

echo "🛑 Deteniendo todos los contenedores..."
docker stop $(docker ps -aq) 2>/dev/null

echo "🧹 Eliminando todos los contenedores..."
docker rm -f $(docker ps -aq) 2>/dev/null

echo "🧱 Eliminando todas las imágenes..."
docker rmi -f $(docker images -aq) 2>/dev/null

echo "📦 Eliminando todos los volúmenes..."
docker volume rm -f $(docker volume ls -q) 2>/dev/null

echo "🌐 Eliminando todas las redes personalizadas..."
docker network rm $(docker network ls -q | grep -v "bridge\|host\|none") 2>/dev/null

echo "🗑 Limpiando caché del sistema..."
docker system prune -af --volumes

echo "✅ Todo ha sido eliminado de Docker."
