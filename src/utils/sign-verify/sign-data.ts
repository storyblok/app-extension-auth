import jwt from "jsonwebtoken";

export const signData = (jwtSecret: string) => <Data>(data: Data) => (
  jwt.sign({data}, jwtSecret)
)