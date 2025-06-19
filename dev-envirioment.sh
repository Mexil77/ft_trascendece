#!/bin/bash

echo "🚀 Iniciando entorno de desarrollo para todos los servicios..."

# Guarda los PID de todos los tsc --watch
TSC_PIDS=()

# Recorre todas las carpetas dentro de /backend
for service_dir in ./backend/*; do
  if [ -d "$service_dir" ] && [ -f "$service_dir/tsconfig.json" ]; then
    service_name=$(basename "$service_dir")
    echo "👀 Iniciando tsc --watch para $service_name..."

    # Ejecuta tsc --watch en segundo plano desde host
    (cd "$service_dir" && npx tsc --watch &) 
    TSC_PIDS+=($!)
  fi
done

# Levanta todos los contenedores
echo "🐳 Levantando contenedores Docker..."
docker-compose up

# Al salir del contenedor, matar los procesos tsc --watch
echo "🛑 Terminando procesos tsc..."
for pid in "${TSC_PIDS[@]}"; do
  kill "$pid"
done
