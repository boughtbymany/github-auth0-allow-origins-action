
export interface FakeInput {
  'auth0-domain': string
  'auth0-client-id': string
  'auth0-management-client-id': string
  'auth0-management-client-secret': string
  'deploy-url': string
}

export function getFakeInput(config: FakeInput, name: string): string {
  if (Object.keys(config).includes(name)) {
    return (config as unknown as { [key: string]: string })[name]
  } else {
    return ''
  }
}
