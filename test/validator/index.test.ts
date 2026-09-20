import { isEmail, isGangAo, isIdcardAll, isIdNum, isInt, isIP, isJson, isLatLong, isMobilePhone, isObjectEmpty, isPort, isTaiwan, isTelphone } from '@core'
import { expect, it } from 'vitest'

// isInt
it('isInt 有效整数', () => {
  expect(isInt('123')).toBe(true)
  expect(isInt('+123')).toBe(true)
  expect(isInt('-123')).toBe(true)
  expect(isInt('0123')).toBe(true)
  expect(isInt('0')).toBe(true)
})
it('isInt 无效整数', () => {
  expect(isInt('12.5')).toBe(false)
  expect(isInt('abc')).toBe(false)
  expect(isInt('')).toBe(false)
})

// isPort
it('isPort 有效端口', () => {
  expect(isPort('80')).toBe(true)
  expect(isPort('443')).toBe(true)
  expect(isPort('0')).toBe(true)
  expect(isPort('65535')).toBe(true)
})
it('isPort 无效端口', () => {
  expect(isPort('70000')).toBe(false)
  expect(isPort('-1')).toBe(false)
  expect(isPort('080')).toBe(false)
  expect(isPort('abc')).toBe(false)
})

// isEmail
it('isEmail 有效邮箱', () => {
  expect(isEmail('test@example.com')).toBe(true)
  expect(isEmail('a@b.cn')).toBe(true)
  expect(isEmail('"john..doe"@example.com')).toBe(true)
})
it('isEmail 无效邮箱', () => {
  expect(isEmail('not-email')).toBe(false)
  expect(isEmail('@x.com')).toBe(false)
  expect(isEmail('a@b')).toBe(false)
})
it('isEmail 超过 254 字符返回 false', () => {
  expect(isEmail(`${'a'.repeat(250)}@b.com`)).toBe(false)
})

// isIP
it('isIP 有效 IPv4', () => {
  expect(isIP('192.168.1.1')).toBe(true)
  expect(isIP('8.8.8.8')).toBe(true)
  expect(isIP('0.0.0.0')).toBe(true)
})
it('isIP 无效 IPv4', () => {
  expect(isIP('999.999.999.999')).toBe(false)
  expect(isIP('abc')).toBe(false)
  expect(isIP('')).toBe(false)
})
it('isIP 支持 IPv6', () => {
  expect(isIP('::1')).toBe(true)
  expect(isIP('2001:db8::1')).toBe(true)
  expect(isIP('2001:db8:0:0:0:0:0:1')).toBe(true)
  expect(isIP('fe80::1%eth0')).toBe(true)
})
it('isIP 支持 IPv4 结尾的 IPv6', () => {
  expect(isIP('::ffff:192.168.1.1')).toBe(true)
})
it('isIP 无效 IPv6', () => {
  expect(isIP('2001:db8:::1')).toBe(false)
  expect(isIP('2001:db8:0:0:0:0:0:0:1')).toBe(false)
})

// isLatLong
it('isLatLong 有效经纬度', () => {
  expect(isLatLong('22.5431,114.0579')).toBe(true)
  expect(isLatLong('39.9042,116.4074')).toBe(true)
  expect(isLatLong('90,180')).toBe(true)
})
it('isLatLong 无效经纬度', () => {
  expect(isLatLong('abc,def')).toBe(false)
  expect(isLatLong('91,0')).toBe(false)
  expect(isLatLong('39.9')).toBe(false)
})

// isMobilePhone
it('isMobilePhone 有效大陆手机号', () => {
  expect(isMobilePhone('13800138000')).toBe(true)
  expect(isMobilePhone('15912345678')).toBe(true)
  expect(isMobilePhone('+8613800138000')).toBe(true)
  expect(isMobilePhone('008613800138000')).toBe(true)
})
it('isMobilePhone 支持港澳台手机号', () => {
  expect(isMobilePhone('+85251234567')).toBe(true)
  expect(isMobilePhone('85361234567')).toBe(true)
  expect(isMobilePhone('0912345678')).toBe(true)
})
it('isMobilePhone 无效手机号', () => {
  expect(isMobilePhone('1234')).toBe(false)
  expect(isMobilePhone('abc')).toBe(false)
  expect(isMobilePhone('')).toBe(false)
})

// isTelphone
it('isTelphone 有效电话', () => {
  expect(isTelphone('12345')).toBe(true)
  expect(isTelphone('07551234567')).toBe(true)
})
it('isTelphone 无效电话', () => {
  expect(isTelphone('123')).toBe(false)
  expect(isTelphone('abc')).toBe(false)
})

// isIdNum
it('isIdNum 有效身份证号', () => {
  expect(isIdNum('11010519491231002X')).toBe(true)
})
it('isIdNum 无效身份证号（格式错误）', () => {
  expect(isIdNum('123')).toBe(false)
})
it('isIdNum 无效身份证号（校验位错误）', () => {
  // 故意改最后一位
  expect(isIdNum('110105194912310020')).toBe(false)
})
it('isIdNum 地区码不存在返回 false', () => {
  expect(isIdNum('99010519491231002X')).toBe(false)
})
it('isIdNum 空字符串', () => {
  expect(isIdNum('')).toBe(false)
})

// isObjectEmpty
it('isObjectEmpty 存在空值时返回 true', () => {
  expect(isObjectEmpty({ a: 1, b: '' }, ['a', 'b'])).toBe(true)
  expect(isObjectEmpty({ a: 1, b: 0 }, ['a', 'b'])).toBe(true)
  expect(isObjectEmpty({ a: 1, b: null }, ['a', 'b'])).toBe(true)
})
it('isObjectEmpty 都不为空时返回 false', () => {
  expect(isObjectEmpty({ a: 1, b: '2' }, ['a', 'b'])).toBe(false)
  expect(isObjectEmpty({ a: 1 }, [])).toBe(false)
})

// isJson
it('isJson 有效JSON', () => {
  expect(isJson('{"a":1}')).toBe(true)
  expect(isJson('[]')).toBe(true)
  expect(isJson('"string"')).toBe(true)
  expect(isJson('123')).toBe(true)
})
it('isJson 无效JSON', () => {
  expect(isJson('not json')).toBe(false)
  expect(isJson('')).toBe(false)
})

// isIdcardAll
it('isIdcardAll 大陆身份证', () => {
  expect(isIdcardAll('11010519491231002X')).toBe(true)
})
it('isIdcardAll 港澳身份证', () => {
  expect(isIdcardAll('A123456')).toBe(true)
})
it('isIdcardAll 台湾身份证', () => {
  expect(isIdcardAll('AB12345678')).toBe(true)
})
it('isIdcardAll 空字符串', () => {
  expect(isIdcardAll('')).toBe(true)
})
it('isIdcardAll 无效', () => {
  expect(isIdcardAll('abc')).toBe(false)
})

// isGangAo
it('isGangAo 有效港澳身份证', () => {
  expect(isGangAo('A123456')).toBe(true)
  expect(isGangAo('A1234567')).toBe(true)
  expect(isGangAo('A123456(8)')).toBe(true)
})
it('isGangAo 无效港澳身份证', () => {
  expect(isGangAo('123')).toBe(false)
})

// isTaiwan
it('isTaiwan 有效台湾身份证', () => {
  expect(isTaiwan('AB12345678')).toBe(true)
  expect(isTaiwan('A1234567890')).toBe(true)
})
it('isTaiwan 无效台湾身份证', () => {
  expect(isTaiwan('123')).toBe(false)
})
