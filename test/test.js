/*
* test functions in byteParseUtil
* created by Hedy Ma 2021/01/27 QQ:306616770
* 
*/
const util = require('../dist/main.js');
let byteParseUtil = util.byteParseUtil;


/**字节处理相关**/
//从数字中获取指定位 输出 3   125对应 二进制 11111111  提取 1 【start】11【end】11111,==》11，十进制为3
console.log(byteParseUtil.getBit(125,1,2));  

//从数字中获取指定位字符串 输出 '11'  125对应 二进制 11111111字符串  提取 1 【start】11【end】11111,==》11
console.log(byteParseUtil.getBitString(125,1,2));  

//合并字节数组 [0x2c,0x01] ==> 0x2c01 对应十进制为 11265
console.log(byteParseUtil.joinArr2Byte([0x2c,0x01])); 

//将字节按指定大小端模式分解成指定长度数组 0x2c01 ==> [0x2c,0x01] 以大端模式分解
console.log(byteParseUtil.spliteByte(0x2c01,2,'BE')); 

//字节转换为编码字符串 仅支持浏览器端 
try{
    console.log(byteParseUtil.bytesToEncodedString(5)); 
}catch(e){
    console.log('bytesToEncodedString 仅支持浏览器端');
}


/**数据包相关**/
//获取校验值 数组（长度<=15）总和%256  输出254 (1+253)%253
console.log(byteParseUtil.getValidCode([1,253])); 
//自动补全 输出[1,253,5,5,5,5,5,5,5,5,5,5,5,5,5]
console.log(byteParseUtil.cover([1,253],5)); 
//转换成标准16个字节unit8数组，末位为校验位 输出[1, 253, 5,  5, 5, 5,5,5, 5,  5, 5, 5,5,5, 5, 63]
console.log(byteParseUtil.bytesToSendUnit8Array([1,253],5));
//转换成标准16个字节unit8字符串，末位为校验位 输出1,253,5,5,5,5,5,5,5,5,5,5,5,5,5,63
console.log(byteParseUtil.bytesToSendUint8String([1,253],5));

//获取CRC校验位 输出16349
let arr = byteParseUtil.cover([1,253],5);
console.log(byteParseUtil.getCRC(arr));

/**字符串处理相关**/
//将字符串以指定字符 输出 123,345,567,78
console.log(byteParseUtil.InsertString('12345678',',',3));
//给字符串添加指定长度的前缀或后缀
console.log(byteParseUtil.FillString('1235','*',15,true));
//16进制字符串转换成浮点数, 注意参数<=8位 
console.log(byteParseUtil.HexToSingleBatch('2c012c01'));
//解析REAL类型 输出同上
console.log(byteParseUtil.getFloat32ByArr([0x2c,0x1,0x2c,1]));

//浮点数转换成十六进制 输出 3F CC CC CC
console.log(byteParseUtil.SingleToHexBatch(1.6));
//浮点数转换成十六进制数组 输出 [ 63, 204, 204, 204 ] (==[0x3F,0xCC,0xCC,0xCC])
console.log(byteParseUtil.SingleToHexArray(1.6));
//获取字符串各字符的asc码 输出 [ 104, 101, 108, 108, 111 ]
console.log(byteParseUtil.getStrAsc2Array('hello'));
//将十进制数组转换为指定字符的十六进制字符串 输出 05,0b,0f,0b
console.log(byteParseUtil.parseToHexString([5,11,15,11],','));
//十六进制转换为int16类型数字 输出 -1
console.log(byteParseUtil.hexToInt16('ff1'));

/*其他*/
//格式化时间显示 y-m-d h:m:s 
console.log(byteParseUtil.parseTime(1611722358182));