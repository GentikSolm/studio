import { connect } from "@planetscale/database"
import {env} from '~/env.mjs'

const config = {
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD
}
export const db = connect(config)
