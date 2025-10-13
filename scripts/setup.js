#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Configurando CryptoMentor AI...\n')

// Verificar si Node.js es compatible
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

if (majorVersion < 18) {
  console.error('❌ Error: Se requiere Node.js 18 o superior')
  console.error(`   Versión actual: ${nodeVersion}`)
  console.error('   Por favor actualiza Node.js desde https://nodejs.org/')
  process.exit(1)
}

console.log(`✅ Node.js ${nodeVersion} detectado`)

// Crear archivo .env si no existe
const envPath = path.join(process.cwd(), '.env')
const envExamplePath = path.join(process.cwd(), 'env.example')

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath)
    console.log('✅ Archivo .env creado desde env.example')
    console.log('   ⚠️  Recuerda agregar tu API key de AdEx AURA en el archivo .env')
  } catch (error) {
    console.error('❌ Error creando archivo .env:', error.message)
  }
}

// Verificar si MetaMask está instalado (solo información)
console.log('\n📱 Verificaciones de navegador:')
console.log('   • Asegúrate de tener MetaMask instalado')
console.log('   • Descarga desde: https://metamask.io/download/')

// Mostrar próximos pasos
console.log('\n🎯 Próximos pasos:')
console.log('   1. Ejecuta: npm install')
console.log('   2. Agrega tu API key de AdEx AURA en .env')
console.log('   3. Ejecuta: npm run dev')
console.log('   4. Abre http://localhost:3000')

console.log('\n✨ ¡CryptoMentor AI está listo para configurar!')
console.log('\n📚 Para más información, consulta el README.md')
