import { expect, it } from 'vitest'
import { v_int, v_carnum, v_port, v_email, v_phone, v_tel, v_ip, v_latlong, v_id_num, v_phoneOrTel, isIdNum, isObjectEmpty, isJson, isTelphone, isIdcardAll, isGangAo, isTaiwan } from '@core'

function ok(err?: Error | string): string {
  return err instanceof Error ? err.message : ''
}

// v_int
it('v_int 有效整数', () => {
  expect(v_int(null, 123, ok)).toBe('')
  expect(v_int(null, '456', ok)).toBe('')
  expect(v_int(null, 0, ok)).toBe('')
})
it('v_int 无效整数', () => {
  expect(v_int(null, 12.5, ok)).toBe('只能是整数')
  expect(v_int(null, 'abc', ok)).toBe('只能是整数')
})
it('v_int 空值跳过校验', () => {
  expect(v_int(null, '', ok)).toBe('')
  expect(v_int(null, null, ok)).toBe('')
  expect(v_int(null, undefined, ok)).toBe('')
})

// v_carnum
it('v_carnum 有效车牌', () => {
  expect(v_carnum(null, '粤B12345', ok)).toBe('')
  expect(v_carnum(null, '京A88888', ok)).toBe('')
  expect(v_carnum(null, '沪AF12345', ok)).toBe('')
})
it('v_carnum 无效车牌', () => {
  expect(v_carnum(null, 'abc', ok)).toBe('车牌格式错误')
  expect(v_carnum(null, '123456', ok)).toBe('车牌格式错误')
})

// v_port
it('v_port 有效端口', () => {
  expect(v_port(null, 80, ok)).toBe('')
  expect(v_port(null, '443', ok)).toBe('')
  expect(v_port(null, 65535, ok)).toBe('')
})
it('v_port 无效端口', () => {
  expect(v_port(null, 70000, ok)).toBe('端口号格式错误')
  expect(v_port(null, -1, ok)).toBe('端口号格式错误')
})

// v_email
it('v_email 有效邮箱', () => {
  expect(v_email(null, 'test@example.com', ok)).toBe('')
  expect(v_email(null, 'a@b.cn', ok)).toBe('')
})
it('v_email 无效邮箱', () => {
  expect(v_email(null, 'not-email', ok)).toBe('邮箱地址格式错误')
  expect(v_email(null, '@x.com', ok)).toBe('邮箱地址格式错误')
})

// v_phone
it('v_phone 有效手机号', () => {
  expect(v_phone(null, '13800138000', ok)).toBe('')
  expect(v_phone(null, '15912345678', ok)).toBe('')
})
it('v_phone 无效手机号', () => {
  expect(v_phone(null, '1234', ok)).toBe('手机号码格式错误')
})

// v_tel
it('v_tel 有效座机', () => {
  expect(v_tel(null, '123456', ok)).toBe('')
  expect(v_tel(null, '07551234567', ok)).toBe('')
})
it('v_tel 无效座机', () => {
  expect(v_tel(null, '123', ok)).toBe('电话号码格式错误')
})

// v_ip
it('v_ip 有效IP', () => {
  expect(v_ip(null, '192.168.1.1', ok)).toBe('')
  expect(v_ip(null, '8.8.8.8', ok)).toBe('')
})
it('v_ip 无效IP', () => {
  expect(v_ip(null, '999.999.999.999', ok)).toBe('IP格式错误')
  expect(v_ip(null, 'abc', ok)).toBe('IP格式错误')
})

// v_latlong
it('v_latlong 有效经纬度', () => {
  expect(v_latlong('22.5431', '114.0579', ok)).toBe('')
  expect(v_latlong(39.9042, 116.4074, ok)).toBe('')
})
it('v_latlong 无效经纬度', () => {
  expect(v_latlong('abc', 'def', ok)).toBe('经纬度格式错误')
})

// v_id_num
it('v_id_num 有效身份证', () => {
  expect(v_id_num(null, '11010519491231002X', ok)).toBe('')
})
it('v_id_num 无效身份证', () => {
  expect(v_id_num(null, '123', ok)).toBe('身份证格式错误')
})

// v_phoneOrTel
it('v_phoneOrTel 有效手机或座机', () => {
  expect(v_phoneOrTel(null, '13800138000', ok)).toBe('')
  expect(v_phoneOrTel(null, '1234567', ok)).toBe('')
})
it('v_phoneOrTel 无效手机或座机', () => {
  expect(v_phoneOrTel(null, 'abc', ok)).toBe('电话号码格式错误')
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
it('isIdNum 空字符串', () => {
  expect(isIdNum('')).toBe(false)
})

// isObjectEmpty
it('isObjectEmpty 对象字段为空', () => {
  expect(isObjectEmpty({ a: '', b: 'hello' }, ['a'])).toBe(true)
  expect(isObjectEmpty({ a: null, b: 'hello' }, ['a'])).toBe(true)
})
it('isObjectEmpty 对象字段全部有值', () => {
  expect(isObjectEmpty({ a: 'hello', b: 'world' }, ['a', 'b'])).toBe(false)
})

// isJson
it('isJson 有效JSON', () => {
  expect(isJson('{"a":1}')).toBe(true)
  expect(isJson('[]')).toBe(true)
  expect(isJson('"string"')).toBe(true)
})
it('isJson 无效JSON', () => {
  expect(isJson('not json')).toBe(false)
  expect(isJson('')).toBe(false)
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
