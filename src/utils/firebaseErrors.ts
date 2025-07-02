export const translateFirebaseError = (errorMessage: string): string => {
  const errorMap: Record<string, string> = {
    // Auth errors
    'auth/user-not-found': 'No existe una cuenta con este email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-email': 'Email inválido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    'auth/operation-not-allowed': 'Esta operación no está permitida',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/email-already-in-use': 'Ya existe una cuenta con este email',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/account-exists-with-different-credential': 'Ya existe una cuenta con credenciales diferentes',
    'auth/requires-recent-login': 'Necesitas iniciar sesión recientemente para realizar esta acción',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    
    // Generic errors
    'Firebase: Error (auth/user-not-found).': 'No existe una cuenta con este email',
    'Firebase: Error (auth/wrong-password).': 'Contraseña incorrecta',
    'Firebase: Error (auth/invalid-email).': 'Email inválido',
    'Firebase: Error (auth/user-disabled).': 'Esta cuenta ha sido deshabilitada',
    'Firebase: Error (auth/too-many-requests).': 'Demasiados intentos fallidos. Intenta más tarde',
    'Firebase: Error (auth/operation-not-allowed).': 'Esta operación no está permitida',
    'Firebase: Error (auth/weak-password).': 'La contraseña es muy débil',
    'Firebase: Error (auth/email-already-in-use).': 'Ya existe una cuenta con este email',
    'Firebase: Error (auth/invalid-credential).': 'Credenciales inválidas',
    'Firebase: Error (auth/account-exists-with-different-credential).': 'Ya existe una cuenta con credenciales diferentes',
    'Firebase: Error (auth/requires-recent-login).': 'Necesitas iniciar sesión recientemente para realizar esta acción',
    'Firebase: Error (auth/network-request-failed).': 'Error de conexión. Verifica tu internet',
  }

  // Buscar el error exacto
  if (errorMap[errorMessage]) {
    return errorMap[errorMessage]
  }

  // Buscar por código de error en el mensaje
  for (const [code, message] of Object.entries(errorMap)) {
    if (errorMessage.includes(code)) {
      return message
    }
  }

  // Si no encontramos traducción, devolver un mensaje genérico
  return 'Error de autenticación. Verifica tus credenciales'
} 