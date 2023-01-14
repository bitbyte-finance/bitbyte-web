let hideDecimal=(value,count)=>{
  // console.log(value)
  value= value.toString()
  count = count || 8
  if(value&&value.indexOf('.')!==-1&&value.split('.')[1].length>count){
    let newValue = value.split('.')[0]+'.'+value.split('.')[1].slice(0,count)
    if(parseFloat(newValue)===0){
      return value
    }else{
      newValue = newValue.replace(/0+$/g,"")
      if(newValue[newValue.length-1] === '.'){
        return  newValue.split('.')[0]
      }else{
        return  newValue
      }
    }
    
  }else{
    return value
  }
  
}

export default {
  hideDecimal
}