#!/usr/bin/env bash

BUILD=""

if [ "$1" == 'build' ]; then
  BUILD="--build"
fi

if [ "$1" == 'force' ]; then
  echo -e "Desligando servidor e removendo volumes..."
  docker-compose down -v --remove-orphans
  echo -e "Desligamento realizado com sucesso."
fi

echo -e "Ligando servidor de desenvolvimento com docker..."
docker-compose -f ./docker-compose.dev.yml up -d $BUILD
echo -e "Servidor iniciado com sucesso."
