// Server-side bcrypt wrapper to avoid Edge Runtime issues
import { compare as bcryptCompare, hash as bcryptHash } from 'bcryptjs'

export const compare = bcryptCompare
export const hash = bcryptHash