export default {

  input: './src/main.js', // 打包的入口文件
  output:{
    name: 'byteParseUtil',  // 输入的包名
    file: 'dist/main.js', // 打包输出地址, 这里的导出地址就是package内main的地址
    format: 'iife', // 包类型
    extend:true
  }
  
}