/**
 * Script de diagnostic pour analyser les exports des SDK
 */

async function debugImports() {
    console.log('🔍 Analyzing SDK exports...')
    console.log('=========================')

    try {
        console.log('📦 Testing husqvarna-authentication-sdk...')
        const husqvarnaAuth = await import('husqvarna-authentication-sdk')
        console.log('✅ husqvarna-authentication-sdk imported successfully')
        console.log('   Available exports:', Object.keys(husqvarnaAuth))
        console.log('   OAuth2Api type:', typeof husqvarnaAuth.OAuth2Api)
        console.log('   Oauth2TokenPostGrantTypeEnum type:', typeof husqvarnaAuth.Oauth2TokenPostGrantTypeEnum)

        if (husqvarnaAuth.Oauth2TokenPostGrantTypeEnum) {
            console.log('   Grant types:', husqvarnaAuth.Oauth2TokenPostGrantTypeEnum)
        }

        console.log('')
    } catch (error) {
        console.error('❌ Failed to import husqvarna-authentication-sdk:', error.message)
        console.log('')
    }

    try {
        console.log('📦 Testing automower-connect-sdk...')
        const automowerConnect = await import('automower-connect-sdk')
        console.log('✅ automower-connect-sdk imported successfully')
        console.log('   Available exports:', Object.keys(automowerConnect))
        console.log('   MowerApi type:', typeof automowerConnect.MowerApi)
        console.log('   Configuration type:', typeof automowerConnect.Configuration)
        console.log('')
    } catch (error) {
        console.error('❌ Failed to import automower-connect-sdk:', error.message)
        console.log('')
    }

    // Test creating instances
    try {
        console.log('🧪 Testing instance creation...')
        const husqvarnaAuth = await import('husqvarna-authentication-sdk')
        const automowerConnect = await import('automower-connect-sdk')

        if (husqvarnaAuth.OAuth2Api) {
            const authApi = new husqvarnaAuth.OAuth2Api()
            console.log('✅ OAuth2Api instance created successfully')
        }

        if (automowerConnect.Configuration) {
            const config = new automowerConnect.Configuration({ apiKey: 'test' })
            console.log('✅ Configuration instance created successfully')
        }

        if (automowerConnect.MowerApi && automowerConnect.Configuration) {
            const mowerApi = new automowerConnect.MowerApi(new automowerConnect.Configuration({ apiKey: 'test' }))
            console.log('✅ MowerApi instance created successfully')
        }
    } catch (error) {
        console.error('❌ Failed to create instances:', error.message)
    }

    console.log('')
    console.log('🏁 Diagnosis complete')
}

debugImports().catch(console.error)
