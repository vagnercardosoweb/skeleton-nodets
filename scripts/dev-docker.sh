#!/usr/bin/env bash

complement=""

if [[ "$*" =~ .*"--build".* ]]; then
  complement+="--build "
fi

if [[ "$*" =~ .*"-d".* ]]; then
  complement+="-d "
fi

if [[ "$*" =~ .*"--force".* || "$*" =~ .*"--build".* ]]; then
  echo -e "Desligando servidor e removendo volumes..."
  docker-compose down -v --remove-orphans
  echo -e "Desligamento realizado com sucesso."
fi

echo -e "Ligando servidor de desenvolvimento com docker..."
docker-compose -f ./docker-compose.dev.yml up $complement
