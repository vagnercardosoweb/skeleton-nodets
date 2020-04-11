#!/usr/bin/env bash

echo "Removendo pasta dist/..."
rm -rf dist

echo "Criando pastas necessárias para o build..."
mkdir -p dist/src
mkdir -p dist/tmp/redis
mkdir -p dist/tmp/uploads
mkdir -p dist/tmp/mysql

echo "Copiando arquivos necessários para o build..."
cp -r database views dist/
cp package.json yarn.lock ecosystem.config.js dist/
cp .env.example .sequelizerc dist/
