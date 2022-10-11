//
// Converted from a Netlify build plugin at:
//   https://github.com/boughtbymany/netlify-build-plugin-auth0-allow-origins
//

import { info, setFailed, getInput} from "@actions/core"
import { ManagementClient } from 'auth0'

export async function run(): Promise<void> {
  let auth0Domain
  let auth0ClientId
  let auth0MgtClientId
  let auth0MgtClientSecret
  let deployUrl
  try {
    auth0Domain = getInput('auth0-domain', { required: true })
    auth0ClientId = getInput('auth0-client-id', { required: true })
    auth0MgtClientId = getInput('auth0-management-client-id', { required: true })
    auth0MgtClientSecret = getInput('auth0-management-client-secret', { required: true })
    deployUrl = getInput('deploy-url', { required: true })

    const management = new ManagementClient({
      domain: auth0Domain,
      clientId: auth0MgtClientId,
      clientSecret: auth0MgtClientSecret,
      scope: 'read:clients',
      // TODO : restore when we are happy with enabling auth0 update
      // scope: 'read:clients update:clients',
    })
      
    const client = await management.getClient({
      client_id: auth0ClientId,
    })
      
    info('🗝 Retrieved Auth0 client: ' + client.name)
      
    const currentOrigins = client.web_origins || []
    const newOrigins = []

    info('❓Checking for existence of URL: ' + deployUrl)

    if (currentOrigins.includes(deployUrl)) {
      info(
        '👍 Deploy URL has already been added to Auth0 client config'
      )
    } else {
      info(
        '👎 Deploy URL has not yet been added to Auth0 client config'
      )
      newOrigins.push(deployUrl)
    }

    // If we don't have any URls to add, we can finish up early.
    if (!newOrigins.length) {
      info('✅ Auth0 client config not in need of patch.')
      return
    }

    // TODO : when we are happy with enabling auth0 update 
    // await management.updateClient(
    //   { client_id: auth0ClientId },
    //   { web_origins: [...currentOrigins, ...newOrigins] }
    // )

    // info('✅ Successfully patched Auth0 client config.')
    // info('ℹ️ Added URLs: ' + newOrigins)

  } catch (error) {
    info(`💀 Something went wrong. It is possible that the origin limit has been reached (100 is soft limit). ` +
          `An admin needs to go into the ${auth0Domain} tenant and delete some older ones.`)

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
