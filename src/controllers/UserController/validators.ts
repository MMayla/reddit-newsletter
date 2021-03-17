import * as t from 'typed-validators'
import validator from 'validator'

export const EmailType = t
  .alias('EmailType', t.string())
  .addConstraint((value) => (validator.isEmail(value) ? undefined : 'Not valid email address'))

export const NameType = t
  .alias('NameType', t.string())
  .addConstraint((value) => (value.length > 0 ? undefined : 'should have at least 1 character'))
