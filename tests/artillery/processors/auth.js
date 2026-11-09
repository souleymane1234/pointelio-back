/**
 * Helpers Artillery partagés par les scénarios.
 * `withAuth` ajoute le JWT capturé au login (variable `accessToken`).
 */
function withAuth(requestParams, context, _ee, next) {
  const token = context.vars.accessToken;
  if (token) {
    requestParams.headers = {
      ...(requestParams.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return next();
}

module.exports = { withAuth };
