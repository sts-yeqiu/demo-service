
/**
 * token Payload模型
 */
export interface TokenPayloadModel {

  issuer?: string;//签发人
  expiresIn?: string | number;//到期时间
  subject?: string;//主题
  audience?: string | string[];//受众
  notBefore?: string | number;//生效时间
  issuedAt?: string | number;//签发时间
  jwtid?: string;//编号
  [propName: string]: any;
}