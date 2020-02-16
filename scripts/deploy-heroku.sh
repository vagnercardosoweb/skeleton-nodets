#!/usr/bin/env bash

if ! [ "$(command -v heroku)" ]; then
  echo -e 'Para continuar você deve instalar a CLI da HEROKU...' >&2
  exit 1
fi

echo -e "Realize login na heroku..."
heroku login

echo -e "Realizando login no container..."
heroku container:login

#VERSION=$(node -e "console.log(require('./package.json').version)")
VERSION='latest'

echo -e "Digite o nome do projeto..."
read -r PROJECT_NAME

echo -e "Qual o tipo do projeto? ex: web."
read -r PROJECT_TYPE

echo -e "Realizando build e push da imagem na aplicação: $PROJECT_NAME..."
# heroku container:push --app=$PROJECT_NAME $PROJECT_TYPE
docker build -t registry.heroku.com/"$PROJECT_NAME"/"$PROJECT_TYPE":"$VERSION" .
docker push registry.heroku.com/"$PROJECT_NAME"/"$PROJECT_TYPE":"$VERSION"

echo -e "Realizando a publicação da imagem na aplicação: $PROJECT_NAME..."
heroku container:release --app="$PROJECT_NAME" "$PROJECT_TYPE"

echo -e "Removendo a pasta dist..."
rm -rf ./dist

echo -e "Build realizada com sucesso."
exit 0
