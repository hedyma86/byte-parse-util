this.byteParseUtil = (function () {
   'use strict';

   /* byte-parse-util  v0.0.1 | (c) 2020 by Hedy Ma */
   //module.exports = {
       var main = {
      /**
   	 *从数字中获取指定位 get Specified bit to number from Formal parameter number
   	 *
   	 * @param {number} number  要提取的数字
        * @param {start} number  要获取的起始位index，注意从左往右从0开始，
        * @param {len} number    要获取的位长度
        * 
   	 * @return {number}  新十进制数字
   	 */ 
       getBit(number,start,len){
           //console.log(number);
           //转为8位
           let strNumber = ('0000000' + parseInt(number).toString(2)).slice(-8);
           //提取开始到结尾的位数
           let _len = parseInt(len);
           return parseInt(strNumber.substr(start,_len),2);
       },

       /**
   	 *从数字中获取指定位字符串 get Specified bit string from Formal parameter number
   	 *
   	 * @param {number} number  要提取的数字
        * @param {start} number  要获取的起始位index，注意从左往右从0开始，
        * @param {len} number    要获取的位长度
        * 
   	 * @return {string}  返回指定位长度的二进制字符串
   	 */ 
       getBitString(number,start,len){
           //转为8位
           let strNumber = ('0000000' + parseInt(number).toString(2)).slice(-8);
           //提取开始到结尾的位数
           let _len = Math.abs(len);
           return strNumber.substr(start,_len);
       },
       /**
   	 *合并字节数组 join Array to Byte
   	 *如 [0x2c,0x01]  合并为0x2c01
   	 * @param {arr} array  要合并的数组
   	 * @return {number}  合并后的十进制数
   	 */ 
       joinArr2Byte(arr){
           let str = '';
           //console.log(arr);
           for (let i = 0; i < arr.length; i++){
               str += ('0000000' + parseInt(arr[i]).toString(2)).slice(-8);
           }
           return parseInt(str,2);
       },
       /**
        *将字节按指定大小端模式分解成指定长度数组 
        *如 0x2c01  分解为[0x01,0x2c]
   	 *
   	 * @param {number} number  要分解的数字
        * @param {size} number <=4 分解的字节长度
        * @param {endianness} string 'LE' 大小端模式，默认为小端
   	 * @return {array}  分解后的数组（长度<=4）
   	 */ 
       spliteByte(number,size,endianness){

           let _endianness = endianness || 'LE';
           if(size>4){
               console.warn('size超范围了'+size);
           }

           let strNumber = ('00000000000000000000000000000000' + parseInt(number).toString(2)).slice(-8*size);
           //console.log(strNumber);
           let arr=[];
           for(let i=0;i<size;i++){
               arr[i] = parseInt(strNumber.substr(i*8,8),2);
           }
           //console.log(arr);
           return _endianness=='LE' ? arr.reverse() : arr;

       },
         /**
        *字节转换为编码字符串 仅支持浏览器端
   	 *
   	 * @param {bytes} string/number  要分解的数字
   	 * @return {array}  分解后的数组（长度<=4）
   	 */ 
       bytesToEncodedString(bytes){
           return btoa(String.fromCharCode.apply(null, bytes));
       },
       /**
        *从base-64编码字符串解析成字节数据 
        *如 0x2c01  分解为[0x01,0x2c]
   	 *
   	 * @param {string} string  字符串
   	 * @return {bytes}  字节
   	 */ 
       encodedStringToBytes(string){
           let data = atob(string);
           let bytes = new Uint8Array(data.length);
           for (let i = 0; i < bytes.length; i++)
           {
               bytes[i] = data.charCodeAt(i);
           }
           return bytes;
       },
       /**
       *获取校验值 
        * 校验规则为每个包15个字节，校验值为前15个字节之和与256取余 
   	 *
   	 * @param {arr} byte array 
   	 * @return {number}  校验值
   	 */ 
       getValidCode(arr){
           let _total = arr.reduce(function(total,num){
               return total+num;
           });
           return _total%256;
       },
       //
       /**
       * 自动补全包总数 小于15位补默认字节，大于15位则返回15位
   	*
       * @param {arr} byte Array 待补全数组 
       * @param {defaultByteValue} number default 0 填充字节 
   	* @return {nArr} new Array,length 15
   	*/
       cover(arr,defaultByteValue){
           if(arr.length==15) return arr;
           let _byte =Number(defaultByteValue) || 0;   
           let nArr=arr.concat([]);
           for (let i = arr.length; i <15; i++){
               nArr.push(_byte);
           }
           return nArr;
       },
       /**
       * 字节数组 转换成 标准16个字节unit8数组,末位为校验位
   	*
       * @param {arr} byte Array 待补全数组 
       * @param {defaultByteValue} number default 0 填充字节 
   	* @return {nArr} Uint8Array,length 16 
   	*/
       bytesToSendUnit8Array(arr,defaultByteValue){
           //小于15位末位补0xFF 或者 0
           let nArr = this.cover(arr,defaultByteValue);
           nArr[15] = this.getValidCode(nArr);
           return new Uint8Array(nArr);
       },
      /**
       * 字节数组 转换成 标准16个字节组成的字符串,末位为校验位
   	*
       * @param {arr} byte Array 原始数组 
       * @param {defaultByteValue} number default 0 填充字节 
   	* @return {string} 16个字节拼合成的字符串 
   	*/
       bytesToSendUint8String(arr,defaultByteValue){
           //小于15位末位补0xFF 或者 0
          let nArr = this.bytesToSendUnit8Array(arr,defaultByteValue);
           let arrInt8 = new Uint8Array(nArr);
           return arrInt8.join(',');
       },
       /**
       * 获取CRC校验位
   	*
       * @param {arr} byte Array 原始数组
   	* @return {number} CRC校验值
   	*/
       getCRC(arr){
           let m;
           let j;
           let check = 0;    //定义CRC变量，2字节长度；CRC校验初始值清零

           for(j=0; j<arr.length; j++)   //需要校验的字节数
           {
               check = check ^ (arr[j]<< 8);     //将当前字节内容左移8位，之后与CRC校验值进行异或
               for(m=0; m<8; m++)    //下面的操作循环8次
               {
                   if(check & 0x8000)
                       check = (check << 1) ^ 0x1021;   //判断check的最高位，如果为1，先左移1位，然后与0x1021异或
                   else
                       check = check << 1;     //如果最高位为0，左移1位
               }
           }

           check = check & 0xFFFF;

           return check;   //返回校验值
       },
       /**
       * 将字符串以指定长度添加分隔符
       * @param {_str} string 原始字符串
       * @param {separator} string 分隔符
       * @param {len} number 步长
   	* @return {string}} 带有分隔符的新字符串
   	*/
       InsertString(_str,separator, len){
           let arr = [],str = _str.toString();
           for (let i = 0; i * 2 < str.length; i++){
               arr.push(str.substr(i * 2,len));
           }
           return arr.join(separator);
       },
       /**
       * 给字符串添加指定长度的前缀或后缀 
       * @param {_str} string 原始字符串
       * @param {separator} string 分隔符，注意只有一个
       * @param {len} number 最终长度
       * @param {isPrefix} Boolean 默认false 后缀，true为前缀
   	* @return {_str} new string 
   	*/
       FillString(_str, separator, len, isPrefix){
           if ((_str == "") || (separator.length != 1) || (len <= _str.length)){
               return _str;
           }
           let l = _str.length;
           for (let i = 0; i < len - l; i++){
               if (isPrefix){
                   _str = separator + _str;
               }else {
                   _str += separator;
               }
           }
           return _str;
       },
       /**
       * 16进制转换成浮点数, 注意参数必须为 8位  
       * @param {t} string 原始十六进制字符串
   	* @return {number} new string 
   	*/
       HexToSingleBatch(t){
           t = t.replace(/\s+/g, "");

           if (t == "00000000"){
               return "0";
           }
           if ((t.length > 8) || (isNaN(parseInt(t, 16)))){
               return "Error";
           }
           if (t.length < 8){
               t = this.FillString(t, "0", 8, true);
           }
           t = parseInt(t, 16).toString(2);
           t = this.FillString(t, "0", 32, true);
           let s = t.substring(0, 1);
           let e = t.substring(1, 9);
           let m = t.substring(9);
           e = parseInt(e, 2) - 127;
           m = "1" + m;
           if (e >= 0){
               m = m.substr(0, e + 1) + "." + m.substring(e + 1);
           }
           else {
               m = "0." + this.FillString(m, "0", m.length - e - 1, true);
           }
           if (m.indexOf(".") == -1){
               m = m + ".0";
           }
           let a = m.split(".");
           let mi = parseInt(a[0], 2);
           let mf = 0;
           for (let i = 0; i < a[1].length; i++){
               mf += parseFloat(a[1].charAt(i)) * Math.pow(2, -(i + 1));
           }
           m = parseInt(mi) + parseFloat(mf);
           if (s == 1){
               m = 0 - m;
           }
           return m;
       },
       /**
       * 浮点数转换成十六进制 
       * @param {t} float number 浮点数
   	* @return {string} 每2位空格分隔16进制字符串 
   	*/
       SingleToHexBatch(t,backType){
           if (t.toString() == ""){
               console.error('SingleToHexBatch不能为空');
               return "";
           }
           t = parseFloat(t);
           if (isNaN(t) == true){
               return "Error";
           }
           if (t == 0){
               return backType == 'array' ? [0,0,0,0] : "00000000";
           }
           let s,
               e,
               m;
           if (t > 0){
               s = 0;
           }else {
               s = 1;
               t = 0 - t;
           }

           m = t.toString(2);
           if (m >= 1){
               if (m.indexOf(".") == -1){
                   m = m + ".0";
               }
               e = m.indexOf(".") - 1;
           } else {
               e = 1 - m.indexOf("1");
           }

           if (e >= 0){
               m = m.replace(".", "");
           }else {
               m = m.substring(m.indexOf("1"));
           }

           if (m.length > 24){
               m = m.substr(0, 24);
           }else {
               m = this.FillString(m, "0", 24, false);
           }
           m = m.substring(1);
           e = (e + 127).toString(2);
           e = this.FillString(e, "0", 8, true);
           let r = parseInt(s + e + m, 2).toString(16);
           r = this.FillString(r, "0", 8, true);
           //console.log(r);
           return this.InsertString(r, " ", 2).toUpperCase();
       },
       /**
       * 浮点数转换成十六进制数组 
       * @param {t} float number 浮点数
   	* @return {array}} 十进制长度4位数组
   	*/
       SingleToHexArray(t){
           if (t.toString() == ""){
               console.error('SingleToHexBatch不能为空');
               return "";
           }
           t = parseFloat(t);
           if (isNaN(t) == true){
               return "Error";
           }
           if (t == 0){
               return backType == 'array' ? [0,0,0,0] : "00000000";
           }
           let s,
               e,
               m;
           if (t > 0){
               s = 0;
           }else {
               s = 1;
               t = 0 - t;
           }

           m = t.toString(2);
           if (m >= 1){
               if (m.indexOf(".") == -1){
                   m = m + ".0";
               }
               e = m.indexOf(".") - 1;
           } else {
               e = 1 - m.indexOf("1");
           }

           if (e >= 0){
               m = m.replace(".", "");
           }else {
               m = m.substring(m.indexOf("1"));
           }

           if (m.length > 24){
               m = m.substr(0, 24);
           }else {
               m = this.FillString(m, "0", 24, false);
           }
           m = m.substring(1);
           e = (e + 127).toString(2);
           e = this.FillString(e, "0", 8, true);
           let r = parseInt(s + e + m, 2).toString(16);
           r = this.FillString(r, "0", 8, true);
           //console.log(r);

           let str = this.InsertString(r, " ", 2).toUpperCase();

           let backArr = [];
               let arr =str.split(' ');
               arr.forEach(function (str) {
                   backArr.push(parseInt(str,16));
               });
               return backArr;
       },
       /**
       * /解析REAL类型 
       * @param {arr} Array 四位数组
   	* @return {number} 浮点数
   	*/
       getFloat32ByArr(arr){
           if(arr.length!=4){
               console.log('报错了！！REAL类型需要4位数组');
               return 'Error';
           }
           let str = [];
           arr.forEach(function (n) {
               let m = n.toString(16);
               if(m.length==1){
                   m ='0'+m;
               }
               str.push(m);
           });
           return this.HexToSingleBatch(str.join(''));
       },
       /**
       * 获取字符串的asc码并输出数组 
       * @param {string} string 
   	* @return {array} Array ASC数组
   	*/
       getStrAsc2Array(v){
           let arr=[];
           for(let i=0;i<v.length;i++){
               arr.push(v.charCodeAt(i));
           }
           return arr;
       },
       /**
       * 将十进制数组转换为指定字符的十六进制字符串
       * @param {arr} Array 
       * @param {strSepliter} string 分隔符 默认为空格
   	* @return {string} string 十六进制字符串
   	*/
       parseToHexString(arr,strSepliter){
           let strSe =strSepliter || ' ';
           let arrNew = [];
           arr.forEach(function (v) {
               let str = ('0'+v.toString(16)).slice(-2);
               arrNew.push(str);
           });
           return arrNew.join(strSe);

       },
       /** 
       * 从Array Buffer中获取指定字节 
       * @param {arrBuffer} Buffer  Buffer
       * @param {index} number start Index 起始位
       * @param {size} number 截取长度
       * @param {isReverse} Boolen 是否翻转
   	* @return {number} number 十六进制字符串 
   	*/
       getBytefromArr(arrBuffer,index,size,isReverse){
           console.log(arrBuffer.buffer);
           let dataArr = arrBuffer.buffer.slice(index,index+size);
           if(isReverse){
               dataArr = dataArr.reverse();
           }
           return parseInt(dataArr.toString('hex'),16);
       },
       /** 
       * 十六进制转换为int16类型数字
       * @param {i} number  原始字节数组
   	* @return {number} number 
   	*/
       hexToInt16(i){
           let two = parseInt(i, 16).toString(2);
           let bitNum = i.length * 4;
           //头部补0
           two.padStart(bitNum,'0');

           if (two.substring(0, 1) == "0") {
               two = parseInt(two, 2);
           } else {
               let two_unsign = "";
               two = parseInt(two, 2) - 1;
               two = two.toString(2);
               two_unsign = two.substring(1, bitNum);
               two_unsign = two_unsign.replace(/0/g, "z");
               two_unsign = two_unsign.replace(/1/g, "0");
               two_unsign = two_unsign.replace(/z/g, "1");
               two = parseInt(-two_unsign, 2);
           }
           return two;
       },
       /**
       * 格式化时间显示 
       * @param {argDate} time 毫秒或时间格式
       * @param {type} number  类型，目前仅支持 1 y-m-d 0  y-m-d h:m:s
   	* @return {string} new string 
   	*/
       parseTime(argDate,type){
           let date = new Date(argDate);
           let d =  [date.getFullYear() , (date.getMonth()+1),date.getDate()];
           if(type==1){
               return d.join('-');
           }else {
               let time = [date.getHours(),date.getMinutes(),date.getSeconds()];
               return d.join('-') +' '+time.join(':');
           }
       }

   };

   return main;

}());
