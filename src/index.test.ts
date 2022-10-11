jest.mock('@actions/core')
jest.mock('auth0')
import { getInput, info, setFailed, setOutput } from '@actions/core'

import { ManagementClient } from 'auth0'
import { run } from '.'
import { FakeInput, getFakeInput } from './test-helpers/fake-input'


const TEST_AUTH0_DOMAIN = 'test.dummy.domain'
const TEST_AUTH0_CLIENT_ID = 'testclient12345678'
const TEST_AUTH0_MANAGEMENT_CLIENT_ID = 'testmanagementclient12345678'
const TEST_AUTH0_MANAGEMENT_CLIENT_SECRET = 'testmanagementclientsecret12345678'
const TEST_DEPLOY_URL = 'https://test.deploy.url'

describe('github auth0 allow origins action', () => {

  const getInputMock = jest.mocked(getInput)
  const setFailedMock = jest.mocked(setFailed)
  const setOutputMock = jest.mocked(setOutput)
  const infoMock = jest.mocked(info) 

  beforeEach( () => {
    (ManagementClient as jest.Mock).mockClear()

    const inputConfig: FakeInput = {
      'auth0-domain': TEST_AUTH0_DOMAIN,
      'auth0-client-id': TEST_AUTH0_CLIENT_ID,
      'auth0-management-client-id': TEST_AUTH0_MANAGEMENT_CLIENT_ID,
      'auth0-management-client-secret': TEST_AUTH0_MANAGEMENT_CLIENT_SECRET,
      'deploy-url': TEST_DEPLOY_URL,
    }

    getInputMock.mockImplementation((name) => {
      return getFakeInput(inputConfig, name)
    })

    // TODO: need to mock client.name and client.web_origin
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('action run does not fail', async () => {
    await run()
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  test('action outputs to info', async () => {
    await run()
    expect(infoMock).toHaveBeenCalled()
  })

  test('action does not generate any outputs', async () => {
    await run()    
    expect(setOutputMock).not.toHaveBeenCalled()
  })

  test('action creates expected auth0 management client', async () => {
    await run()   
    expect(ManagementClient).toBeCalledWith({
      domain: TEST_AUTH0_DOMAIN,
      clientId: TEST_AUTH0_MANAGEMENT_CLIENT_ID,
      clientSecret: TEST_AUTH0_MANAGEMENT_CLIENT_SECRET,
      scope: 'read:clients update:clients'
    }) 
  })

  test('action get expected auth0 client', async () => {
    await run()
    const mgtClient = (ManagementClient as jest.Mock).mock.instances[0]   
    expect(mgtClient.getClient).toBeCalledWith({
      client_id: TEST_AUTH0_CLIENT_ID,
    }) 
  })

  test('action update client with existing and current origins', async () => {
    await run()
    const mgtClient = (ManagementClient as jest.Mock).mock.instances[0]   

    // console.log(infoMock.mock.calls)
    // console.log(setFailedMock.mock.calls)

    // TODO : we need to mock web origins and exercise both adding and not needing to add a URL
    expect(mgtClient.updateClient).toBeCalledWith(
      { client_id: TEST_AUTH0_CLIENT_ID },
      { web_origins: [ TEST_DEPLOY_URL ]}
    )
  })

})
