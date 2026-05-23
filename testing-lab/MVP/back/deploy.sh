#!/bin/bash

# Script para desplegar MVP Base Backend a AWS Lambda

echo "🚀 Desplegando MVP Base Backend a AWS Lambda..."

# Verificar que SAM CLI esté instalado
if ! command -v sam &> /dev/null; then
    echo "❌ SAM CLI no está instalado. Por favor instálalo primero:"
    echo "   pip install aws-sam-cli"
    exit 1
fi

# Verificar que AWS CLI esté configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI no está configurado. Por favor configúralo primero:"
    echo "   aws configure"
    exit 1
fi

# Verificar que pip-tools esté instalado
if ! command -v pip-compile &> /dev/null; then
    echo "📦 Instalando pip-tools..."
    pip3 install pip-tools

    if [ $? -ne 0 ]; then
        echo "❌ Error instalando pip-tools"
        exit 1
    fi
    echo "✅ pip-tools instalado exitosamente"
fi

# Limpiar requirements.txt existente y generar nuevo desde pyproject.toml
echo "📋 Limpiando requirements.txt existente..."
rm -f requirements.txt

echo "📋 Generando requirements.txt desde pyproject.toml..."
pip-compile pyproject.toml -o requirements.txt --strip-extras

if [ $? -ne 0 ]; then
    echo "❌ Error generando requirements.txt desde pyproject.toml"
    exit 1
fi

echo "✅ requirements.txt generado exitosamente"

# Build del proyecto
echo "📦 Construyendo el proyecto..."
sam build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build"
    exit 1
fi

# Deploy del proyecto
echo "🚀 Desplegando a AWS..."
sam deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment exitoso!"
    echo "🌐 Tu API está disponible en la URL mostrada arriba"
else
    echo "❌ Error en el deployment"
    exit 1
fi
