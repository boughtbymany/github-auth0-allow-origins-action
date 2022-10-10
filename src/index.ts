//
// Converted from a Netlify build plugin at:
//   https://github.com/boughtbymany/netlify-build-plugin-auth0-allow-origins
//

import { info, setFailed, getInput} from "@actions/core"
import { ManagementClient } from 'auth0'

export async function run(): Promise<void> {
  try {
    // TODO: change all console logs to info?
    console.log('Starting action!')
    const auth0Domain = getInput('auth0-domain', { required: true })
    const auth0ClientId = getInput('auth0-client-id', { required: true })
    const auth0MgtClientId = getInput('auth0-management-client-id', { required: true })
    const auth0MgtClientSecret = getInput('auth0-management-client-secret', { required: true })
    const deployUrl = getInput('deploy-url', { required: true })
    

    console.log('Get Auth0 ManagementClient')
    const management = new ManagementClient({
      domain: auth0Domain,
      clientId: auth0MgtClientId,
      clientSecret: auth0MgtClientSecret,
      scope: 'read:clients',
      // TODO : restore when safe
      // scope: 'read:clients update:clients',
    })
      
    console.log('Get Client')
    const client = await management.getClient({
      client_id: auth0ClientId,
    })
      
    console.log('🗝 Retrieved Auth0 client:', client.name)
      
    const currentOrigins = client.web_origins || []
    const newOrigins = []

    if (currentOrigins.includes(deployUrl)) {
      console.log(
        '👍 Deploy Preview Prime URL has already been added to Auth0 client config'
      )
      } else {
        console.log(
        '👎 Deploy Preview Prime URL has not yet been added to Auth0 client config'
      )
      newOrigins.push(deployUrl)
    }

    // If we don't have any URls to add, we can finish up early.
    if (!newOrigins.length) {
      console.log('✅ Auth0 client config not in need of patch.')
      return
    }

    console.log(newOrigins)

  } catch (error) {
    console.error(error)
    setFailed(JSON.stringify(error))
  }
}

if (require.main === module) {
  run().then(() => {
    info('Step - DONE!')
  }).catch(err => {
    setFailed(`Unhandled exception: ${err.message}`)
  })
}
