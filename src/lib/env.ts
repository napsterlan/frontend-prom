export function getEnvVariable(key: string): string {
    console.log(process.env)
    const value = process.env[key]
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`)
    }
    
    return value
  }
  
  export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

  export const NEXTAUTH_URL = process.env.NEXTAUTH_URL