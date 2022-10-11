jest.mock('@actions/core')
import { getInput, info, setFailed, setOutput } from '@actions/core'
//import 'auth0'
import { ManagementClient } from 'auth0'
import { run } from '.'
import { FakeInput, getFakeInput } from './test-helpers/fake-input'


const managementClientMock = jest.mocked(ManagementClient)


//const auth0Mock = jest.mock('auth0')

// const managementClientMock = jest.fn()


//const getClientMock = jest.fn()


// const auth0Mock = jest.mock('auth0', () => {
//   return {
//     ManagementClient: (opts: any) => {
//       managementClientMock(opts)
//       return {
//         getClient: (params: any) => {
//           return getClientMock(params)
//         },
//       }
//     },
//   }
// })




// TODO: fix work in progress

describe('github auth0 allow origins action', () => {

  const getInputMock = jest.mocked(getInput)
  const setFailedMock = jest.mocked(setFailed)
  const setOutputMock = jest.mocked(setOutput)
  const infoMock = jest.mocked(info)

  beforeEach( () => {
    const inputConfig: FakeInput = {
      'auth0-domain': 'test.dummy.domain',
      'auth0-client-id': 'testclient12345678',
      'auth0-management-client-id': 'testmanagementclient12345678',
      'auth0-management-client-secret': 'testmanagementclient12345678',
      'deploy-url': 'https://test.deploy.url',
    }

    getInputMock.mockImplementation((name) => {
      return getFakeInput(inputConfig, name)
    })

    // const auth0Mock = jest.mock('auth0', () => {
    //   return {
    //     ManagementClient: (opts: any) => {
    //       managementClientMock(opts)
    //       return {
    //         getClient: (params: any) => {
    //           return getClientMock(params)
    //         },
    //       }
    //     },
    //   }
    // })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('action run does not fail', async () => {
    await run()
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  test('action does not generate any outputs', async () => {
    await run()    
    expect(setOutputMock).not.toHaveBeenCalled()
  })

  test('action creates expected auth0 management client', async () => {
    await run()   
    expect(managementClientMock).toBeCalledWith({
      domain: 'test.dummy.domain',
      clientId: 'testclient12345678',
      clientSecret: 'testmanagementclient12345678',
      scope: 'read:clients'
    }) 
  })

  // test('action gets expected auth0 client', async () => {
  //   await run()   
  //   expect(getClientMock).toBeCalledWith({
  //     client_id: 'testclient12345678',
  //   }) 
  // })

  //auth0Mock.mock('ManagementClient').mock('getClient').mock('name') = 
  // expect((managementClientMock as any).ManagementClient).toBeTruthy()

  //expect((auth0 as any).ManagementClient).

  // if (auth0Mock instanceof Error) {
  //   expect((auth0Mock as jest.MockInstance).ManagementClient).toBeTruthy() // Constructor ran with no errors
  // }

  // expect(getClientMock).toBeTruthy() // Constructor ran with no errors


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
