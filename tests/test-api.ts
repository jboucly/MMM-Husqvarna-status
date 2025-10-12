/**
 * Test script to validate Husqvarna API calls
 * Usage: pnpm test CLIENT_ID CLIENT_SECRET
 */

import { OAuth2Api, Oauth2TokenPostGrantTypeEnum } from 'husqvarna-authentication-sdk'
import { MowerApi, Configuration } from 'automower-connect-sdk'

async function testHusqvarnaAPI() {
    const args = process.argv.slice(2)

    if (args.length < 2) {
        console.error('❌ Usage: pnpm test CLIENT_ID CLIENT_SECRET')
        process.exit(1)
    }

    const [clientId, clientSecret] = args

    console.log('🚜 Husqvarna API Test')
    console.log('===================')
    console.log(`Client ID: ${clientId.substring(0, 8)}...`)
    console.log(`Client Secret: ${clientSecret.substring(0, 8)}...`)
    console.log('')

    try {
        // 1. Authentication test
        console.log('🔐 Authentication test...')
        const authApi = new OAuth2Api()

        const tokenResponse = await authApi.oauth2TokenPost({
            clientId: clientId,
            clientSecret: clientSecret,
            grantType: Oauth2TokenPostGrantTypeEnum.CLIENT_CREDENTIALS
        })

        const accessToken = tokenResponse.data.access_token
        console.log('✅ Authentication successful!')
        console.log(`   Token: ${accessToken?.substring(0, 20)}...`)
        console.log(`   Expires in: ${tokenResponse.data.expires_in} seconds`)
        console.log('')

        // 2. Mower API test
        console.log('🤖 Mower API test...')
        const mowerApi = new MowerApi(
            new Configuration({
                apiKey: clientId,
                baseOptions: {
                    headers: {
                        'Authorization-Provider': 'husqvarna',
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            })
        )

        const mowersResponse = await mowerApi.mowersGet()
        console.log('✅ Mower list retrieved!')
        console.log(`   Number of mowers: ${mowersResponse.data.data?.length || 0}`)

        if (mowersResponse.data.data && mowersResponse.data.data.length > 0) {
            const mower = mowersResponse.data.data[0]
            console.log(`   First mower: ${mower.id}`)
            console.log(`   Name: ${mower.attributes?.system?.name || 'Unknown'}`)
            console.log(`   Model: ${mower.attributes?.system?.model || 'Unknown'}`)
            console.log('')

            // 3. Mower details test
            console.log('📊 Mower details test...')
            const detailsResponse = await mowerApi.mowersIdGet({ id: mower.id as string })
            const details = detailsResponse.data.data

            console.log('✅ Mower details retrieved!')
            console.log(`   Activity: ${details?.attributes?.mower?.activity || 'Unknown'}`)
            console.log(`   State: ${details?.attributes?.mower?.state || 'Unknown'}`)
            console.log(`   Battery: ${details?.attributes?.battery?.batteryPercent || 'Unknown'}%`)
            console.log(`   Error code: ${details?.attributes?.mower?.errorCode || 0}`)

            if (details?.attributes?.planner?.nextStartTimestamp) {
                const nextStart = new Date(details.attributes.planner.nextStartTimestamp)
                console.log(`   Next mowing: ${nextStart.toLocaleString()}`)
            }
        } else {
            console.log('⚠️  No mowers found in your account')
        }

        console.log('')
        console.log('🎉 All tests passed!')
        console.log('')
        console.log('✅ Configuration for MagicMirror:')
        console.log(`{`)
        console.log(`    module: "MMM-Husqvarna-Status",`)
        console.log(`    position: "top_right",`)
        console.log(`    config: {`)
        console.log(`        clientId: "${clientId}",`)
        console.log(`        clientSecret: "${clientSecret}"`)
        console.log(`    }`)
        console.log(`}`)
    } catch (error: any) {
        console.error('❌ Test error:', error.message)

        if (error.response) {
            console.error('   Status:', error.response.status)
            console.error('   Data:', error.response.data)
        }

        console.log('')
        console.log('🔍 Checks:')
        console.log('   - Client ID and Client Secret correct?')
        console.log('   - Husqvarna application active?')
        console.log('   - Mower associated with developer account?')
        console.log('   - Internet connection OK?')

        process.exit(1)
    }
}

// Run the test
testHusqvarnaAPI().catch(console.error)
