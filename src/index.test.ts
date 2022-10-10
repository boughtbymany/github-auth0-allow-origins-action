jest.mock('@actions/core')
const auth0Mock = jest.mock('auth0')

//import { ManagementClient } from 'auth0'

import { getInput, info, setFailed, setOutput } from '@actions/core'
import { run } from '.'
import { FakeInput, getFakeInput } from './test-helpers/fake-input'

// TODO: fix work in progress

describe('github auth0 allow origins action', () => {

  const getInputMock = jest.mocked(getInput)
  const setFailedMock = jest.mocked(setFailed)
  const setOutputMock = jest.mocked(setOutput)
  const infoMock = jest.mocked(info)
  //const managementClientMock = jest.mocked(ManagementClient)

  //const auth0ManagementClient = jest.mock('ManagementClient')

  beforeEach(() => {
    //auth0Mock.mockClear()
    //managementClientMock.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('basic sanity', async () => {

    const inputConfig: FakeInput = {
      'auth0-domain': 'dummy.domain',
      'auth0-client-id': 'client12345678',
      'auth0-management-client-id': 'managementclient12345678',
      'auth0-management-client-secret': 'managementclient12345678',
      'deploy-url': 'https://test.dummy.deploy.url',
    }

    getInputMock.mockImplementation((name) => {
      return getFakeInput(inputConfig, name)
    })
    
    const getClientMock = jest.fn().mockImplementation(async () => {
      return { 
        web_origins: ['foo', 'bar'], 
        name: 'mockClientName'
      }
    })
    
    // managementClientMock.mockImplementation(() => {
    //   return { getClient: getClientMock }
    // })
        
    // const auth0Mock = jest.mock('auth0', () => {
    //   return jest.fn().mockImplementation(() => {
    //     return { ManagementClient: managementClientMock }
    //   })
    // })
    
    await run()
    //auth0Mock.enableAutomock()
    //auth0Mock.mock('ManagementClient').mock('getClient').mock('name') = 
    console.log(auth0Mock)
    // expect((managementClientMock as any).ManagementClient).toBeTruthy()

    //expect((auth0 as any).ManagementClient).

    // if (auth0Mock instanceof Error) {
    //   expect((auth0Mock as jest.MockInstance).ManagementClient).toBeTruthy() // Constructor ran with no errors
    // }

    // expect(getClientMock).toBeTruthy() // Constructor ran with no errors

    // expect(setFailedMock).not.toHaveBeenCalled()

    // expect(managementClientMock).toBeCalledWith({
    //   domain: '',
    //   clientId: '',
    //   clientSecret: '',
    //   scope: 'read:clients'
    // })

    // expect(getClientMock).toBeCalledWith({      
    //   client_id: ''
    // })

  })

})
